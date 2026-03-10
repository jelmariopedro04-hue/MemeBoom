'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Download, Share2, Type, 
  Image as ImageIcon, Sparkles, Move, 
  RotateCw, Maximize2, Trash2, Plus, X,
  CheckCircle, Camera, Search, RefreshCw, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useDropzone } from 'react-dropzone';

const FONTS = [
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { name: 'Inter', value: 'var(--font-sans)' },
];

const EMOJIS = ['😂', '🔥', '💀', '🤡', '😭', '😍', '🤔', '💯', '👀', '✨', '🚀', '🌈', '🍕', '🍺', '👑', '💎', '😎', '💩', '🤮', '🤯', '🤫'];

interface MemeElement {
  id: string;
  type: 'text' | 'emoji' | 'image';
  content: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
}

function MemeEditorContent() {
  const searchParams = useSearchParams();
  const initialTop = searchParams.get('top') || 'TEXTO DE CIMA';
  const initialBottom = searchParams.get('bottom') || 'TEXTO DE BAIXO';

  const [elements, setElements] = useState<MemeElement[]>([
    {
      id: 'top-text',
      type: 'text',
      content: initialTop,
      x: 0,
      y: 40,
      size: 40,
      rotation: 0,
      color: '#ffffff',
      fontFamily: FONTS[0].value
    },
    {
      id: 'bottom-text',
      type: 'text',
      content: initialBottom,
      x: 0,
      y: 320,
      size: 40,
      rotation: 0,
      color: '#ffffff',
      fontFamily: FONTS[0].value
    }
  ]);

  const [image, setImage] = useState('https://picsum.photos/seed/meme-base/800/800');
  const [showImage, setShowImage] = useState(true);
  const [profileImage, setProfileImage] = useState('https://picsum.photos/seed/user/100/100');
  const [profileName, setProfileName] = useState('Meme Creator');
  const [isVerified, setIsVerified] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const memeRef = useRef<HTMLDivElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onProfileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });
  const { getRootProps: getProfileProps, getInputProps: getProfileInputProps } = useDropzone({ onDrop: onProfileDrop, accept: { 'image/*': [] } });

  useEffect(() => {
    if (!showImage) {
      setElements(prev => prev.map(el => el.type === 'text' ? { ...el, color: '#000000' } : el));
    } else {
      setElements(prev => prev.map(el => el.type === 'text' ? { ...el, color: '#ffffff' } : el));
    }
  }, [showImage]);

  const addText = () => {
    const newElement: MemeElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: 'Novo Texto',
      x: 100,
      y: 100,
      size: 40,
      rotation: 0,
      color: showImage ? '#ffffff' : '#000000',
      fontFamily: FONTS[0].value
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addEmoji = (emoji: string) => {
    const newElement: MemeElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'emoji',
      content: emoji,
      x: 150,
      y: 150,
      size: 80,
      rotation: 0,
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const updateElement = (id: string, updates: Partial<MemeElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const handleDownload = async () => {
    if (memeRef.current === null) return;
    setSelectedElementId(null);
    setIsGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await toPng(memeRef.current, { 
        cacheBust: true,
        pixelRatio: 2,
      });
      
      // Save to gallery
      await fetch('/api/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topText: elements.find(e => e.id === 'top-text')?.content || '',
          bottomText: elements.find(e => e.id === 'bottom-text')?.content || '',
          image,
          profileName,
          elements,
          showImage,
          showHeader
        })
      });

      const link = document.createElement('a');
      link.download = `memeboom-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIRemake = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      let imagePart;
      if (image.startsWith('data:')) {
        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];
        imagePart = { inlineData: { data: base64Data, mimeType } };
      }

      const topText = elements.find(e => e.id === 'top-text')?.content || '';
      const bottomText = elements.find(e => e.id === 'bottom-text')?.content || '';

      const prompt = `Analise este meme (Texto Superior: "${topText}", Texto Inferior: "${bottomText}") e sugira uma versão 'refilmada' ou 'remake' dele. Mantenha o espírito mas mude o texto para algo novo e engraçado. Retorne APENAS um JSON com os campos 'topText' e 'bottomText'.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: imagePart ? { parts: [imagePart, { text: prompt }] } : prompt,
        config: { responseMimeType: "application/json" }
      });

      if (!response.text) return;
      const result = JSON.parse(response.text);
      
      setElements(prev => prev.map(el => {
        if (el.id === 'top-text' && result.topText) return { ...el, content: result.topText };
        if (el.id === 'bottom-text' && result.bottomText) return { ...el, content: result.bottomText };
        return el;
      }));
    } catch (err) {
      console.error('Erro na IA:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAISearch = async () => {
    if (!aiSearchQuery) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const prompt = `Procure na internet e sugira uma ideia de meme viral sobre o tema: "${aiSearchQuery}". Retorne um JSON com 'topText' e 'bottomText'. Seja criativo e use humor atual.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json" 
        }
      });

      if (!response.text) return;
      const result = JSON.parse(response.text);
      
      setElements(prev => prev.map(el => {
        if (el.id === 'top-text' && result.topText) return { ...el, content: result.topText };
        if (el.id === 'bottom-text' && result.bottomText) return { ...el, content: result.bottomText };
        return el;
      }));
    } catch (err) {
      console.error('Erro na busca IA:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg">Meme Editor Pro</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload} 
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 disabled:opacity-50 transition"
          >
            {isGenerating ? 'Gerando...' : <><Download size={20} /> Salvar & Publicar</>}
          </button>
        </div>
      </header>

      <div className="flex-1 p-4 lg:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Meme Preview Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div 
            className={`relative w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-white group ${!showImage ? 'flex items-center justify-center' : ''}`} 
            ref={memeRef}
            id="meme-canvas"
            onClick={() => setSelectedElementId(null)}
          >
            {showImage && (
              <Image 
                src={image} 
                alt="Meme base" 
                fill
                className="object-contain pointer-events-none" 
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Profile Header */}
            {showHeader && (
              <div className={`absolute top-0 left-0 w-full p-4 flex items-center gap-3 z-20 pointer-events-none ${showImage ? 'bg-gradient-to-b from-black/40 to-transparent' : 'border-b border-gray-100'}`}>
                <div className={`w-12 h-12 rounded-full border-2 overflow-hidden shadow-sm bg-gray-100 flex-shrink-0 ${showImage ? 'border-white' : 'border-gray-200'}`}>
                  <Image 
                    src={profileImage} 
                    alt="Profile" 
                    width={48} 
                    height={48} 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-black text-lg ${showImage ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>
                    {profileName}
                  </span>
                  {isVerified && (
                    <CheckCircle size={18} className="text-blue-500 fill-blue-500 text-white" />
                  )}
                </div>
              </div>
            )}
            
            {/* Elements Area */}
            {elements.map((el) => (
              <motion.div
                key={el.id}
                drag
                dragMomentum={false}
                dragConstraints={memeRef}
                onDragStart={() => setSelectedElementId(el.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementId(el.id);
                }}
                className={`absolute cursor-move z-20 flex items-center justify-center ${selectedElementId === el.id ? 'ring-2 ring-purple-500 ring-offset-2 rounded-lg' : ''}`}
                style={{ 
                  left: el.x, 
                  top: el.y, 
                  width: el.type === 'text' ? 'auto' : el.size, 
                  height: el.type === 'text' ? 'auto' : el.size,
                  rotate: el.rotation,
                  minWidth: el.type === 'text' ? '200px' : 'auto'
                }}
              >
                {el.type === 'text' ? (
                  <div 
                    className="uppercase break-words leading-tight select-none text-center w-full px-4"
                    style={{ 
                      fontSize: `${el.size}px`,
                      color: el.color,
                      fontFamily: el.fontFamily,
                      textShadow: showImage 
                        ? '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 5px 5px 10px rgba(0,0,0,0.8)'
                        : 'none'
                    }}
                  >
                    {el.content}
                  </div>
                ) : (
                  <div className="select-none" style={{ fontSize: `${el.size * 0.8}px` }}>
                    {el.content}
                  </div>
                )}

                {selectedElementId === el.id && (
                  <>
                    {/* Rotate Handle */}
                    <div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border border-purple-500 flex items-center justify-center cursor-alias"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startRotation = el.rotation;
                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = moveEvent.clientX - startX;
                          updateElement(el.id, { rotation: startRotation + deltaX });
                        };
                        const onMouseUp = () => {
                          window.removeEventListener('mousemove', onMouseMove);
                          window.removeEventListener('mouseup', onMouseUp);
                        };
                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      <RotateCw size={12} className="text-purple-600" />
                    </div>

                    {/* Resize Handle */}
                    <div 
                      className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg border border-purple-500 flex items-center justify-center cursor-nwse-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startSize = el.size;
                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = moveEvent.clientX - startX;
                          updateElement(el.id, { size: Math.max(10, startSize + deltaX) });
                        };
                        const onMouseUp = () => {
                          window.removeEventListener('mousemove', onMouseMove);
                          window.removeEventListener('mouseup', onMouseUp);
                        };
                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      <Maximize2 size={12} className="text-purple-600" />
                    </div>

                    {/* Delete Handle */}
                    <button 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeElement(el.id);
                      }}
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </>
                )}
              </motion.div>
            ))}

            {/* Watermark */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-white font-black tracking-widest opacity-60 pointer-events-none">
              MEMEBOOM.APP
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm font-medium">
            Dica: Adicione textos e emojis e arraste como no Canva!
          </p>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6 overflow-y-auto max-h-[80vh] no-scrollbar">
            
            {/* Quick Add */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={addText}
                className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-50 transition-colors group"
              >
                <Type size={20} className="text-gray-400 group-hover:text-purple-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Add Texto</span>
              </button>
              <div {...getRootProps()} className="cursor-pointer p-4 bg-gray-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-50 transition-colors group">
                <input {...getInputProps()} />
                <ImageIcon size={20} className="text-gray-400 group-hover:text-purple-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Trocar Fundo</span>
              </div>
            </div>

            {/* Selected Element Controls */}
            {selectedElement ? (
              <div className="p-6 bg-purple-50 rounded-3xl space-y-4 border border-purple-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Editando {selectedElement.type}</label>
                  <button onClick={() => setSelectedElementId(null)} className="text-purple-400 hover:text-purple-600"><X size={14} /></button>
                </div>

                {selectedElement.type === 'text' && (
                  <>
                    <textarea 
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full p-3 bg-white rounded-xl border-none text-sm font-bold focus:ring-2 focus:ring-purple-500"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        value={selectedElement.fontFamily}
                        onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                        className="w-full p-2 bg-white rounded-xl border-none text-[10px] font-bold"
                      >
                        {FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                      </select>
                      <input 
                        type="color" 
                        value={selectedElement.color}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-full h-8 rounded-xl border-none cursor-pointer bg-white"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-purple-600">Tamanho</span>
                    <span className="text-[10px] font-bold text-purple-600">{selectedElement.size}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    value={selectedElement.size}
                    onChange={(e) => updateElement(selectedElement.id, { size: parseInt(e.target.value) })}
                    className="w-full h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-3xl text-center">
                <p className="text-xs font-bold text-gray-400">Selecione um elemento para editar</p>
              </div>
            )}

            {/* AI Magic Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="text-purple-600" />
                Mágica da IA
              </label>
              
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                    className="w-full p-3 pr-10 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Busque um tema (ex: segunda-feira)"
                  />
                  <button 
                    onClick={handleAISearch}
                    disabled={isAnalyzing || !aiSearchQuery}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  </button>
                </div>

                <button 
                  onClick={handleAIRemake}
                  disabled={isAnalyzing}
                  className="w-full p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Refazer Meme com IA
                </button>
              </div>
            </div>

            {/* Profile & Image Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Perfil & Layout</label>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-bold text-gray-700">Mostrar Cabeçalho</span>
                <button 
                  onClick={() => setShowHeader(!showHeader)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${showHeader ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showHeader ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-bold text-gray-700">Mostrar Imagem de Fundo</span>
                <button 
                  onClick={() => setShowImage(!showImage)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${showImage ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showImage ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {showHeader && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div {...getProfileProps()} className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-white transition-all overflow-hidden relative group">
                      <input {...getProfileInputProps()} />
                      <Image src={profileImage} alt="Avatar" fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                      <Camera size={20} className="text-gray-400 relative z-10 group-hover:text-purple-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full p-2 bg-white rounded-xl border border-gray-200 text-sm font-bold"
                        placeholder="Nome do Perfil"
                      />
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={isVerified}
                          onChange={(e) => setIsVerified(e.target.checked)}
                          id="verified-toggle"
                          className="w-4 h-4 accent-purple-600"
                        />
                        <label htmlFor="verified-toggle" className="text-xs font-bold text-gray-500">Verificado</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stickers & Emojis */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Emojis & Stickers</label>
              <div className="grid grid-cols-6 gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="aspect-square flex items-center justify-center bg-gray-50 hover:bg-purple-50 rounded-xl text-xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemeEditor() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <MemeEditorContent />
    </Suspense>
  );
}
