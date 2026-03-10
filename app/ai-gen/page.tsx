'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wand2, RefreshCw, Download, Share2, ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateMemeIdea } from '@/lib/ai';

export default function AIGenPage() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ topText: string; bottomText: string; description: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const idea = await generateMemeIdea(topic);
      setResult(idea);
    } catch (err) {
      console.error(err);
      setError('Falha ao gerar ideia. Verifique sua conexão ou tente outro tema.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-6 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/create" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Meme Magic AI</h1>
      </header>

      <div className="p-4 lg:p-8 flex-1 flex flex-col gap-8 max-w-4xl mx-auto w-full">
        <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <Sparkles size={24} className="text-yellow-300" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">Inteligência Artificial</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">O que vamos viralizar hoje?</h2>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ex: Segunda-feira, Gatos, Programação..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  className="w-full p-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl placeholder:text-white/40 text-white focus:outline-none focus:border-white/50 transition-all text-lg font-bold"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Lightbulb size={20} />
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="w-full py-5 bg-white text-purple-700 font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition transform"
              >
                {isLoading ? <RefreshCw className="animate-spin" /> : <Wand2 size={24} />}
                {isLoading ? 'Analisando Trends...' : 'Gerar Meme Viral'}
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-400 text-xs uppercase tracking-[0.2em]">Sugestão da IA</h3>
                <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Alta Probabilidade de Viral
                </div>
              </div>

              <div className="bg-gray-900 aspect-square rounded-[2rem] p-8 flex flex-col justify-between text-center relative overflow-hidden shadow-2xl border-8 border-gray-50">
                <Image 
                  src={`https://picsum.photos/seed/${result.description.split(' ').join('-')}/800/800`} 
                  alt="Meme preview" 
                  fill
                  className="object-cover opacity-50"
                  referrerPolicy="no-referrer"
                />
                <h4 className="relative z-10 text-white font-black uppercase text-3xl md:text-4xl leading-tight" style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
                  {result.topText}
                </h4>
                <h4 className="relative z-10 text-white font-black uppercase text-3xl md:text-4xl leading-tight" style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
                  {result.bottomText}
                </h4>
              </div>

              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-sm text-purple-800 font-bold leading-relaxed">
                  <span className="text-purple-400 mr-2">💡</span>
                  <span className="opacity-60 uppercase text-[10px] tracking-widest block mb-1">Contexto Ideal:</span>
                  {result.description}
                </p>
              </div>

              <Link href={`/create/meme?top=${encodeURIComponent(result.topText)}&bottom=${encodeURIComponent(result.bottomText)}`}>
                <button className="w-full py-5 bg-purple-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-purple-100 hover:bg-purple-700 transition transform hover:scale-[1.02]">
                  Editar e Publicar
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-red-50 text-red-600 rounded-3xl text-sm font-bold text-center border border-red-100"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}
