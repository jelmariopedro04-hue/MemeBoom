'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Image as ImageIcon, MessageSquare, Twitter, 
  Facebook, ArrowLeft, Sparkles, ChevronRight
} from 'lucide-react';

const options = [
  {
    title: 'Meme Clássico',
    description: 'Texto em cima e embaixo da imagem.',
    icon: ImageIcon,
    color: 'bg-blue-600',
    href: '/create/meme',
  },
  {
    title: 'Fake Tweet',
    description: 'Crie um post estilo Twitter/X.',
    icon: Twitter,
    color: 'bg-sky-500',
    href: '/create/fake-post?type=twitter',
  },
  {
    title: 'Zap Fake',
    description: 'Simule uma conversa de WhatsApp.',
    icon: MessageSquare,
    color: 'bg-green-600',
    href: '/create/fake-post?type=whatsapp',
  },
  {
    title: 'Post Facebook',
    description: 'Crie um post viral do Facebook.',
    icon: Facebook,
    color: 'bg-blue-800',
    href: '/create/fake-post?type=facebook',
  },
  {
    title: 'AI Viral Gen',
    description: 'Deixe a IA criar o meme perfeito.',
    icon: Sparkles,
    color: 'bg-indigo-600',
    href: '/ai-gen',
    featured: true,
  },
];

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="px-6 py-8 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Escolha uma ferramenta</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 lg:p-12">
        <div className="grid gap-6 md:grid-cols-2">
          {options.map((opt, i) => (
            <Link key={opt.title} href={opt.href} className={opt.featured ? 'md:col-span-2' : ''}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`p-8 rounded-[2rem] flex items-center gap-6 border transition-all ${
                  opt.featured 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xl shadow-indigo-100' 
                    : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                  opt.featured ? 'bg-white/20 text-white' : `${opt.color} text-white`
                }`}>
                  <opt.icon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl">{opt.title}</h3>
                  <p className={`text-sm font-medium ${opt.featured ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {opt.description}
                  </p>
                </div>
                <ChevronRight className={opt.featured ? 'text-white/40' : 'text-slate-300'} />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
