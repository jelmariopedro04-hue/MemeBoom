'use client';

import React, { useState, useRef, Suspense } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Check, Camera, MoreHorizontal, Heart, MessageCircle, Share2, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useDropzone } from 'react-dropzone';

function FakePostContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'twitter';
  
  const [name, setName] = useState('Elon Musk');
  const [handle, setHandle] = useState('@elonmusk');
  const [content, setContent] = useState('MemeBoom is the future of viral content. 🚀');
  const [avatar, setAvatar] = useState('https://picsum.photos/seed/elon/100/100');
  const [isVerified, setIsVerified] = useState(true);
  const [likes, setLikes] = useState('1.2M');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const postRef = useRef<HTMLDivElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const handleDownload = async () => {
    if (postRef.current === null) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(postRef.current, { 
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: type === 'whatsapp' ? '#e5ddd5' : '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `fake-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTwitter = () => (
    <div ref={postRef} className="bg-white p-6 w-full max-w-md mx-auto border border-gray-100 shadow-xl rounded-2xl">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
          <Image src={avatar} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-gray-900">{name}</span>
              {isVerified && <div className="bg-sky-500 rounded-full p-0.5"><Check size={8} className="text-white" /></div>}
              <span className="text-gray-500 text-sm ml-1">{handle}</span>
            </div>
            <MoreHorizontal size={16} className="text-gray-400" />
          </div>
          <div className="mt-2 text-[15px] text-gray-900 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
          <div className="mt-4 text-xs text-gray-500 flex gap-2">
            <span>10:24 AM</span>
            <span>·</span>
            <span>Mar 10, 2026</span>
            <span>·</span>
            <span className="font-bold text-gray-900">{likes}</span> Views
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-gray-500">
            <div className="flex items-center gap-1.5"><MessageCircle size={18} /> <span className="text-xs">42</span></div>
            <div className="flex items-center gap-1.5"><Share2 size={18} /> <span className="text-xs">12</span></div>
            <div className="flex items-center gap-1.5"><Heart size={18} /> <span className="text-xs">1.2K</span></div>
            <Share2 size={18} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderWhatsApp = () => (
    <div ref={postRef} className="bg-[#e5ddd5] w-full max-w-md mx-auto min-h-[400px] p-4 flex flex-col gap-3 shadow-xl rounded-2xl relative overflow-hidden">
      {/* WhatsApp Header Mock */}
      <div className="absolute top-0 left-0 w-full bg-[#075e54] p-3 flex items-center gap-3 text-white z-10">
        <ArrowLeft size={20} />
        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-300">
          <Image src={avatar} alt="Avatar" fill className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">{name}</div>
          <div className="text-[10px] opacity-80">online</div>
        </div>
        <MoreHorizontal size={20} />
      </div>

      <div className="mt-14 self-start bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[85%] relative">
        <div className="text-sm text-gray-800 leading-relaxed">{content}</div>
        <div className="text-[10px] text-gray-400 text-right mt-1">15:25</div>
      </div>
      
      <div className="self-end bg-[#dcf8c6] p-3 rounded-xl rounded-tr-none shadow-sm max-w-[85%] relative">
        <div className="text-sm text-gray-800 leading-relaxed">Kkkkkk MemeBoom é brabo! 🔥</div>
        <div className="text-[10px] text-gray-400 text-right mt-1 flex items-center justify-end gap-1">
          15:26 <Check size={12} className="text-blue-500" />
        </div>
      </div>

      {/* WhatsApp Input Mock */}
      <div className="absolute bottom-0 left-0 w-full p-2 flex gap-2 items-center">
        <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400 shadow-sm flex items-center justify-between">
          <span>Mensagem</span>
          <Camera size={18} />
        </div>
        <div className="w-10 h-10 bg-[#128c7e] rounded-full flex items-center justify-center text-white shadow-md">
          <Send size={18} />
        </div>
      </div>
    </div>
  );

  const renderFacebook = () => (
    <div ref={postRef} className="bg-white w-full max-w-md mx-auto border border-gray-100 shadow-xl rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <Image src={avatar} alt="Avatar" fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-gray-900">{name}</span>
              {isVerified && <CheckCircle size={14} className="text-blue-600 fill-blue-600 text-white" />}
            </div>
            <div className="text-xs text-gray-500">10 de março às 15:24 · 🌎</div>
          </div>
        </div>
        <MoreHorizontal size={20} className="text-gray-400" />
      </div>
      <div className="px-4 pb-4 text-[15px] text-gray-900 leading-relaxed">
        {content}
      </div>
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white border border-white">👍</div>
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white border border-white">❤️</div>
          </div>
          <span>{likes}</span>
        </div>
        <div className="flex gap-2">
          <span>42 comentários</span>
          <span>12 compartilhamentos</span>
        </div>
      </div>
      <div className="mx-4 py-1 border-t border-gray-100 flex justify-around text-gray-500 font-bold text-sm">
        <div className="flex items-center gap-2 py-2"><Heart size={18} /> Amei</div>
        <div className="flex items-center gap-2 py-2"><MessageCircle size={18} /> Comentar</div>
        <div className="flex items-center gap-2 py-2"><Share2 size={18} /> Compartilhar</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <h1 className="font-bold text-lg capitalize">Gerador {type}</h1>
        </div>
        <button 
          onClick={handleDownload} 
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 disabled:opacity-50 transition"
        >
          {isGenerating ? 'Gerando...' : <><Download size={20} /> Salvar</>}
        </button>
      </header>

      <div className="flex-1 p-4 lg:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">
            {type === 'twitter' && renderTwitter()}
            {type === 'whatsapp' && renderWhatsApp()}
            {type === 'facebook' && renderFacebook()}
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Handle/User</label>
                <input 
                  type="text" 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Conteúdo do Post</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Visualizações/Likes</label>
              <input 
                type="text" 
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-black text-gray-600 uppercase tracking-widest">Selo Verificado</span>
              <button 
                onClick={() => setIsVerified(!isVerified)}
                className={`w-12 h-6 rounded-full transition-all relative ${isVerified ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVerified ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div {...getRootProps()} className="cursor-pointer p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 transition-all group">
              <input {...getInputProps()} />
              <Camera size={24} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Trocar Foto de Perfil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FakePostGenerator() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <FakePostContent />
    </Suspense>
  );
}
