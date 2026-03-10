'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Zap, ChevronRight, MessageSquare, 
  Twitter, Facebook, CheckCircle, 
  Sparkles, ArrowRight, Smartphone,
  Image as ImageIcon
} from 'lucide-react';

const TOOLS = [
  { 
    title: 'Meme Clássico', 
    desc: 'Legendas em cima e embaixo.', 
    icon: ImageIcon, 
    href: '/create/meme',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  { 
    title: 'Fake Tweet', 
    desc: 'Simule posts do Twitter/X.', 
    icon: Twitter, 
    href: '/create/fake-post?type=twitter',
    color: 'text-sky-500',
    bg: 'bg-sky-50'
  },
  { 
    title: 'WhatsApp Fake', 
    desc: 'Conversas de Zap realistas.', 
    icon: MessageSquare, 
    href: '/create/fake-post?type=whatsapp',
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  { 
    title: 'Post Facebook', 
    desc: 'Posts virais do Face.', 
    icon: Facebook, 
    href: '/create/fake-post?type=facebook',
    color: 'text-blue-800',
    bg: 'bg-blue-100'
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Minimal Nav */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter text-slate-900">
            MEMEBOOM<span className="text-indigo-600">.</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/create" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              Ferramentas
            </Link>
            <Link href="/create" className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all">
              Criar Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Focused & Clean */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 text-slate-900">
              Crie memes <br /> 
              <span className="text-indigo-600">sem complicação.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              A ferramenta mais rápida para criar memes, tweets falsos e conversas de WhatsApp. 
              Escolha uma ferramenta abaixo e comece em segundos.
            </p>
          </motion.div>

          {/* Core Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
            {TOOLS.map((tool, i) => (
              <Link key={i} href={tool.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all text-left group"
                >
                  <div className={`w-12 h-12 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <tool.icon size={24} />
                  </div>
                  <h3 className="text-lg font-black mb-2 text-slate-900">{tool.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{tool.desc}</p>
                  <div className="flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest gap-1 group-hover:gap-2 transition-all">
                    Começar <ArrowRight size={14} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature - Minimalist Callout */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-white shadow-2xl shadow-indigo-200">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Sparkles size={20} className="text-indigo-200" />
                <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Inteligência Artificial</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black mb-4">Sem ideias? Deixa com a IA.</h2>
              <p className="text-indigo-100 max-w-md">
                Nossa IA analisa o que está bombando e sugere o meme perfeito para você viralizar.
              </p>
            </div>
            <Link href="/ai-gen" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl text-lg font-black shadow-xl hover:scale-105 transition transform">
              Gerar com IA
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-bold text-slate-400">
            © 2026 MEMEBOOM.
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link href="/create" className="hover:text-indigo-600 transition-colors">Ferramentas</Link>
            <Link href="/create" className="hover:text-indigo-600 transition-colors">Privacidade</Link>
            <Link href="/create" className="hover:text-indigo-600 transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
