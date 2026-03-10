'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Flame, TrendingUp, Clock, Star, ChevronRight, MessageSquare, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TRENDS = [
  { id: 1, tag: 'Segunda-feira', count: '12.5k', color: 'bg-orange-500' },
  { id: 2, tag: 'Gatos', count: '8.2k', color: 'bg-blue-500' },
  { id: 3, tag: 'Programação', count: '5.1k', color: 'bg-purple-500' },
  { id: 4, tag: 'Escola', count: '4.9k', color: 'bg-yellow-500' },
  { id: 5, tag: 'Brasil', count: '3.2k', color: 'bg-green-500' },
];

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      <header className="bg-white px-4 py-8 border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
              <Flame size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Trending</h1>
          </div>
          <p className="text-gray-500 font-medium">O que o mundo está criando agora</p>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl p-4 lg:p-8 space-y-12">
        {/* Trending Tags */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" /> Bombando Agora
            </h2>
          </div>
          <div className="grid gap-3">
            {TRENDS.map((trend, i) => (
              <motion.div 
                key={trend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${trend.color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg`}>
                    #{i + 1}
                  </div>
                  <div>
                    <div className="font-black text-gray-900">{trend.tag}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{trend.count} memes criados</div>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-purple-600 transition-colors" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Weekly Ranking CTA */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-widest opacity-80">Ranking Semanal</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-6 leading-tight">Chegue ao topo e ganhe o selo de Meme Lord!</h3>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition transform">
              Ver Ranking Completo
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </section>

        {/* Trending Feed Preview */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Clock size={20} className="text-purple-600" /> Recentes
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group">
                <div className="aspect-square relative">
                  <Image 
                    src={`https://picsum.photos/seed/trend-meme-${i}/400/400`} 
                    alt="Trending" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                      <Image src={`https://picsum.photos/seed/u${i}/50/50`} alt="User" fill />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">@user_{i}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Heart size={12} />
                    <span className="text-[10px] font-black">1.2K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
