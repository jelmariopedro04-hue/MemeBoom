'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Settings, Grid, Bookmark, Heart, User as UserIcon, Crown, ArrowLeft, MapPin, Calendar, Edit3, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header/Cover Area */}
      <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-500 relative">
        <div className="absolute -bottom-16 left-4 md:left-8">
          <div className="w-32 h-32 rounded-[2.5rem] border-8 border-gray-50 overflow-hidden shadow-xl relative bg-white">
            <Image 
              src="https://picsum.photos/seed/profile/200/200" 
              alt="Profile" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition">
            <Share2 size={20} />
          </button>
          <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="pt-20 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900">Meme Master</h1>
            <p className="text-gray-500 font-medium">@mememaster_oficial</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-bold uppercase tracking-widest pt-2">
              <span className="flex items-center gap-1"><MapPin size={14} /> Brasil</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Março 2026</span>
            </div>
          </div>
          <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-purple-700 transition transform hover:scale-105">
            Editar Perfil
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 py-10">
          {[
            { label: 'Memes', value: '128' },
            { label: 'Seguidores', value: '12.5K' },
            { label: 'Curtidas', value: '850K' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button className="px-8 py-4 border-b-4 border-purple-600 text-purple-600 font-black text-sm uppercase tracking-widest">Meus Memes</button>
          <button className="px-8 py-4 text-gray-400 font-black text-sm uppercase tracking-widest hover:text-gray-600 transition">Favoritos</button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-24">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="aspect-square bg-white rounded-[2rem] overflow-hidden relative shadow-sm border-4 border-white group"
            >
              <Image 
                src={`https://picsum.photos/seed/user-meme-${i}/400/400`} 
                alt="Meme" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white font-bold"><Heart size={18} fill="white" /> 1.2K</div>
                <div className="flex items-center gap-1 text-white font-bold"><Edit3 size={18} /></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
