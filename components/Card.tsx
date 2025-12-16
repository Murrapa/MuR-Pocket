
import React, { useRef } from 'react';
import { CardData, Rarity, ElementType } from '../types';
import { ELEMENT_COLORS, ELEMENT_ICONS, ELEMENT_TINTS } from '../constants';
import { Sparkles, Swords, Heart, Zap } from 'lucide-react';

interface CardProps {
  card: CardData;
  onClick?: () => void;
  onInspect?: (card: CardData) => void;
  small?: boolean;
  disabled?: boolean;
  isEnemy?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, onInspect, small = false, disabled = false, isEnemy = false }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handleStart = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (onInspect) onInspect(card);
    }, 400); 
  };

  const handleEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.stopPropagation(); 
      return;
    }
    if (!disabled && onClick) onClick();
  };

  // Back of card (Enemy)
  if (isEnemy) {
    return (
      <div 
        className={`rounded-xl border-4 border-slate-800 bg-slate-900 shadow-xl overflow-hidden relative flex items-center justify-center ${small ? 'w-20 h-28' : 'w-48 h-72'}`}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#0f172a,#0f172a_10px,#1e293b_10px,#1e293b_20px)]"></div>
        <div className="w-12 h-12 bg-slate-800 rounded-full border-4 border-yellow-500 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            <span className="text-yellow-500 font-black text-xl">M</span>
        </div>
      </div>
    );
  }

  const baseStyle = small ? 'w-20 h-28' : 'w-48 h-72';
  // Use the refined colors with border classes included
  const elementClass = ELEMENT_COLORS[card.element] || ELEMENT_COLORS[ElementType.NORMAL];
  const tintClass = ELEMENT_TINTS[card.element] || 'from-slate-500/20 to-slate-900/80';
  const isHolo = card.rarity === Rarity.LEGENDARY || card.rarity === Rarity.DIVINE || card.rarity === Rarity.EPIC;

  return (
    <div 
      className={`relative rounded-2xl select-none transition-all duration-300 ease-out shadow-2xl border-4
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${baseStyle} ${elementClass} p-1
      `}
      onMouseDown={handleStart} 
      onMouseUp={(e) => { handleEnd(); handleClick(e as any); }} 
      onMouseLeave={handleEnd}
      onTouchStart={handleStart} 
      onTouchEnd={(e) => { handleEnd(); if(!isLongPress.current && !disabled && onClick) onClick(); }}
    >
      {/* Inner Container */}
      <div className="w-full h-full bg-black rounded-lg overflow-hidden relative flex flex-col">
        
        {/* Holographic Shine Layer */}
        {isHolo && (
          <div className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge opacity-40 bg-[linear-gradient(115deg,transparent_20%,#fff_25%,transparent_30%)] bg-[length:200%_100%] animate-shimmer" />
        )}

        {/* Top Info Bar - Integrated into Frame */}
        <div className="absolute top-0 left-0 w-full p-2 z-20 flex justify-between items-start">
             {/* Cost Bubble */}
             <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg text-black font-black text-sm border-2 border-slate-300">
                {card.stats.cost}
             </div>
             
             {/* Element Icon */}
             <div className="bg-black/50 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/30 text-sm">
                 {ELEMENT_ICONS[card.element]}
             </div>
        </div>

        {/* Card Image Area with Tint */}
        <div className="relative h-[65%] w-full bg-slate-800">
           {/* The Image */}
           <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
           
           {/* Color Tone Tint Overlay */}
           <div className={`absolute inset-0 bg-gradient-to-t ${tintClass} mix-blend-hard-light opacity-60`}></div>
           
           {/* Gradient fade to body */}
           <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Card Body */}
        <div className="flex-1 bg-black relative p-2 flex flex-col justify-between">
             {/* Name & Rarity */}
             <div className="mb-1 relative z-10">
                 <div className={`font-black text-white leading-tight drop-shadow-md truncate uppercase tracking-tight ${small ? 'text-[9px]' : 'text-sm'}`}>
                    {card.name}
                 </div>
                 {!small && (
                    <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: card.rarity === Rarity.LEGENDARY ? 5 : card.rarity === Rarity.EPIC ? 4 : card.rarity === Rarity.RARE ? 3 : 1 }).map((_,i) => (
                            <StarIcon key={i} filled={true} className={card.rarity === Rarity.LEGENDARY ? 'text-yellow-400' : 'text-slate-500'} size={8} />
                        ))}
                    </div>
                 )}
             </div>

             {/* Description / Ability (Hidden on small) */}
             {!small && (
                 <div className="text-[9px] text-slate-300 leading-tight line-clamp-2 my-1 border-t border-white/10 pt-1">
                     <span className={`font-bold block mb-0.5 ${card.element === ElementType.FIRE ? 'text-red-400' : card.element === ElementType.WATER ? 'text-cyan-400' : 'text-slate-300'}`}>
                        {card.abilityName}
                     </span>
                 </div>
             )}

             {/* Stats Footer */}
             <div className="flex justify-between items-center mt-auto pt-1 border-t border-white/10">
                 <div className="flex items-center gap-1">
                      <Swords size={small ? 10 : 14} className="text-red-500" />
                      <span className={`font-black text-white ${small ? 'text-xs' : 'text-lg'}`}>{card.stats.attack * 10}</span>
                 </div>
                 
                 <div className="flex items-center gap-1">
                      <Heart size={small ? 10 : 14} className="text-green-500" />
                      <span className={`font-black text-white ${small ? 'text-xs' : 'text-lg'}`}>{card.stats.health * 10}</span>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon
const StarIcon = ({ filled, className, size }: { filled: boolean, className: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
