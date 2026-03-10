'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

interface MemePostProps {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
}

export function MemePost({ user, image, caption, likes: initialLikes, comments }: MemePostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-100 py-4"
    >
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden relative">
            <Image src={user.avatar} alt={user.name} fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="font-bold text-sm">{user.name}</span>
        </div>
        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="relative aspect-square w-full bg-gray-100">
        <Image 
          src={image} 
          alt={caption} 
          fill 
          className="object-contain" 
          referrerPolicy="no-referrer"
          onDoubleClick={handleLike}
        />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={handleLike} className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-700'}`}>
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button className="text-gray-700">
            <MessageCircle size={24} />
          </button>
          <button className="text-gray-700">
            <Share2 size={24} />
          </button>
        </div>
        
        <div className="text-sm font-bold mb-1">
          {mounted ? likes.toLocaleString() : likes} likes
        </div>
        <div className="text-sm">
          <span className="font-bold mr-2">{user.name}</span>
          {caption}
        </div>
        <button className="text-gray-400 text-xs mt-1">Ver todos os {comments} comentários</button>
      </div>
    </motion.div>
  );
}
