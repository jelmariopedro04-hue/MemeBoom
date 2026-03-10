'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, TrendingUp, User, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: TrendingUp, label: 'Trends', href: '/trends' },
  { icon: PlusSquare, label: 'Criar', href: '/create', primary: true },
  { icon: Zap, label: 'AI Magic', href: '/ai-gen' },
  { icon: User, label: 'Perfil', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around items-center z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 relative">
            <div className={`p-2 rounded-2xl transition-all ${
              item.primary 
                ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white -mt-8 shadow-lg shadow-orange-200' 
                : isActive ? 'text-pink-500' : 'text-gray-400'
            }`}>
              <Icon size={item.primary ? 28 : 24} />
            </div>
            {!item.primary && (
              <span className={`text-[10px] font-medium ${isActive ? 'text-pink-500' : 'text-gray-400'}`}>
                {item.label}
              </span>
            )}
            {isActive && !item.primary && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1 h-1 bg-pink-500 rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
