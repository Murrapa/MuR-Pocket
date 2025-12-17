
import React from 'react';
import { CardData, ElementType } from '../types';
import { Swords, Heart, Zap, Shield, Sparkles } from 'lucide-react';
import { ELEMENT_COLORS, ELEMENT_ICONS, ELEMENT_TINTS } from '../constants';

interface CardProps {
  card: CardData;
  onClick?: () => void;
  small?: boolean;
  disabled?: boolean;
  onInspect?: (card: CardData) => void;
}

export const Card: React.FC<CardProps> = ({ card, onClick, small, disabled, onInspect }) => {
  const elementColor = ELEMENT_COLORS[card.element] || ELEMENT_COLORS[ElementType.NORMAL];
  const elementIcon = ELEMENT_ICONS[card.element] || '⚪';
  const tint = ELEMENT_TINTS[card.element] || 'from-slate-500/20 to-slate-900/80';

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (onInspect) {
        e.stopPropagation();
        onInspect(card);
    } else if (onClick) {
        onClick();
    }
  };

  if (small) {
    return (
      <div 
        onClick={handleClick}
        className={`relative w-24 h-36 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105 border-2 border-slate-600 overflow-hidden ${elementColor}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"></div>
        <img src={card.imageUrl} alt={card.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className={`absolute inset-0 bg-gradient-to-t ${tint} mix-blend-overlay`}></div>
        
        {/* Cost */}
        <div className="absolute top-1 left-1 z-20 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center border border-cyan-400 shadow-lg">
           <span className="text-white font-black text-xs">{card.stats.cost}</span>
        </div>

        {/* Stats */}
        <div className="absolute bottom-1 w-full flex justify-between px-1 z-20">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border border-red-400 text-[10px] font-black text-white">{card.stats.attack}</div>
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center border border-green-400 text-[10px] font-black text-white">{card.stats.health}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className={`relative w-64 h-96 rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] border-4 border-slate-700 bg-slate-800 group overflow-hidden ${disabled ? '' : 'hover:border-yellow-500/50'}`}
    >
      {/* Background & Image */}
      <div className="absolute inset-1 rounded-xl overflow-hidden bg-slate-900">
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className={`absolute inset-0 bg-gradient-to-b ${tint} mix-blend-hard-light opacity-60`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      </div>

      {/* Header (Cost & Name) */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] border-2 border-cyan-200 font-black text-xl text-white">
              {card.stats.cost}
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
              <span className="text-lg">{elementIcon}</span>
          </div>
      </div>

      {/* Content Body */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent p-4 flex flex-col justify-end z-20">
          <h3 className="text-white font-black text-xl uppercase tracking-wide drop-shadow-md mb-1">{card.name}</h3>
          <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  card.rarity === 'COMMON' ? 'bg-slate-500 text-white' :
                  card.rarity === 'RARE' ? 'bg-blue-600 text-white' :
                  card.rarity === 'EPIC' ? 'bg-purple-600 text-white shadow-[0_0_10px_purple]' :
                  'bg-yellow-500 text-black shadow-[0_0_10px_gold]'
              }`}>{card.rarity}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">{card.element}</span>
          </div>
          
          <div className="bg-slate-900/50 p-2 rounded-lg border border-white/10 mb-3 backdrop-blur-sm">
              <div className="text-xs text-cyan-300 font-bold mb-0.5 flex items-center gap-1"><Sparkles size={10}/> {card.abilityName}</div>
              <p className="text-[10px] text-slate-300 leading-tight italic">"{card.description}"</p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex-1 bg-red-900/40 border border-red-500/50 p-1.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                  <Swords size={16} className="text-red-400" />
                  <span className="text-xl font-black text-white">{card.stats.attack}</span>
              </div>
              <div className="flex-1 bg-green-900/40 border border-green-500/50 p-1.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                  <Heart size={16} className="text-green-400" />
                  <span className="text-xl font-black text-white">{card.stats.health}</span>
              </div>
          </div>
      </div>
    </div>
  );
};
