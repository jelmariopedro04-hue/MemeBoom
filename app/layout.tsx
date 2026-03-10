import type {Metadata} from 'next';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'MemeBoom - Viralize em segundos',
  description: 'O criador de memes mais rápido e viral da internet.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-gray-50 text-gray-900 antialiased min-h-screen pb-24">
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-x-hidden">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
