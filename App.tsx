import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, ScreenState, CardData, Rarity, BattleEntity, ElementType, ArenaLevel, DamageEvent, Cosmetic, MarketListing, Clan, ClanChatMessage } from './types';
import { ALL_CARDS, INITIAL_CARDS, MAX_MANA, LANE_COUNT, ARENAS, ELEMENT_ICONS, BATTLE_PASS_REWARDS, COSMETICS, RARITY_PRICES } from './constants';
import { Card } from './components/Card';
import { generateCardFromPrompt } from './services/gemini';
import { Coins, Gem, Zap, Swords, User, Shield, Trophy, Users, Star, Gift, ArrowRight, Lock, LogOut, Disc, Search, ShoppingBag, Crown, Palette, Hexagon, DollarSign, Store, Layers, Gamepad2, Flag, Image as ImageIcon, Trash2, PlusCircle, CheckCircle, Skull, Heart, X, CreditCard, Calendar, MessageSquare, Globe, LogIn, Activity, Flame, Infinity, Clock, PlayCircle, Tag, LockOpen } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const simpleId = () => Math.random().toString(36).substr(2, 9);

// Calculate MV (Mur Value / Power)
const calculateMV = (card: CardData) => {
    return (card.stats.attack * 10) + (card.stats.health * 10) + (card.stats.cost * 5) + (card.stats.magic * 5) + (card.stats.defense * 5);
};

// --- Mock Data ---
const MOCK_CLANS: Clan[] = [
    { id: 'c1', name: 'Team Rocket', description: 'Para problemas... y más problemas.', icon: '🚀', members: 42, minRank: 0, isPrivate: false },
    { id: 'c2', name: 'Dragones Rojos', description: 'Solo jugadores activos y fuego.', icon: '🐉', members: 28, minRank: 500, isPrivate: false },
    { id: 'c3', name: 'CyberPunks', description: 'El futuro es hoy.', icon: '🤖', members: 15, minRank: 1000, isPrivate: true },
    { id: 'c4', name: 'Elite 4', description: 'Solo leyendas.', icon: '👑', members: 4, minRank: 2000, isPrivate: true },
    { id: 'c5', name: 'Novatos Unidos', description: 'Aprendiendo juntos.', icon: '🌱', members: 48, minRank: 0, isPrivate: false },
];

const INITIAL_CLAN_CHAT: ClanChatMessage[] = [
    { id: 'm1', sender: 'System', text: '¡Bienvenido al chat del Clan!', timestamp: Date.now() - 100000, isSystem: true },
    { id: 'm2', sender: 'AshK', text: '¿Alguien para una batalla amistosa?', timestamp: Date.now() - 50000 },
    { id: 'm3', sender: 'GaryO', text: '¡Te ganaré cuando quieras!', timestamp: Date.now() - 10000 },
];

const MOCK_LEADERBOARD = [
    { rank: 1, name: "Red", points: 9999, avatar: '🧢' },
    { rank: 2, name: "Cynthia", points: 9500, avatar: '👱‍♀️' },
    { rank: 3, name: "Leon", points: 8800, avatar: '👑' },
    { rank: 4, name: "Nemona", points: 8200, avatar: '🧤' },
    { rank: 5, name: "Gary", points: 7500, avatar: '😼' },
    { rank: 6, name: "Geeta", points: 7200, avatar: '👩‍💼' },
    { rank: 7, name: "Steven", points: 6900, avatar: '👔' },
    { rank: 8, name: "Lance", points: 6500, avatar: '🦸‍♂️' },
    { rank: 9, name: "Iris", points: 6100, avatar: '👧' },
    { rank: 10, name: "Diantha", points: 5800, avatar: '🎬' },
];

// --- Component: Background Particles ---
const BackgroundParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(15)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-white/10 rounded-full animate-float-particle"
                    style={{
                        width: Math.random() * 6 + 2 + 'px',
                        height: Math.random() * 6 + 2 + 'px',
                        left: Math.random() * 100 + '%',
                        animationDuration: Math.random() * 10 + 5 + 's',
                        animationDelay: Math.random() * 5 + 's'
                    }}
                ></div>
            ))}
        </div>
    );
};

// --- Component: Card Detail Modal (Inspector) ---
const CardDetailModal = ({ card, onClose }: { card: CardData, onClose: () => void }) => {
    const defense = card.stats.defense * 10;
    const magic = card.stats.magic * 10;
    const attack = card.stats.attack * 10;
    const health = card.stats.health * 10;
    const arena = ARENAS.find(a => a.id === card.arenaId);
    const bgClass = card.element === ElementType.FIRE ? 'from-red-600 to-orange-800' : 
                    card.element === ElementType.WATER ? 'from-blue-600 to-cyan-800' :
                    'from-purple-600 to-indigo-800';

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-200">
            <div className="absolute top-4 right-4">
                <button onClick={onClose} className="p-2 bg-slate-800 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex flex-col items-center w-full max-w-sm relative">
                <div className={`absolute -inset-20 bg-gradient-to-r ${bgClass} rounded-full blur-[80px] opacity-30`}></div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest drop-shadow-lg text-center">{card.name}</h2>
                <span className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest border border-slate-700 rounded px-2 py-0.5">
                    {arena ? `Desbloqueado en: ${arena.name}` : 'Carta Especial'}
                </span>
                <div className="transform scale-125 mb-10 shadow-2xl relative z-10 animate-float-up">
                    <Card card={card} disabled />
                </div>
                <div className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-4 grid grid-cols-2 gap-4 relative z-10 shadow-xl backdrop-blur-xl">
                    <div className="col-span-2 text-center border-b border-slate-700 pb-2 mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estadísticas de Combate</span>
                    </div>
                    <div className="flex items-center gap-3 bg-red-900/20 p-2 rounded-lg border border-red-500/30">
                        <div className="bg-red-500 p-2 rounded-lg text-white shadow-lg shadow-red-500/50"><Swords size={20} /></div>
                        <div><div className="text-[10px] text-red-300 font-bold uppercase">Ataque</div><div className="text-2xl font-black text-white">{attack}</div></div>
                    </div>
                    <div className="flex items-center gap-3 bg-green-900/20 p-2 rounded-lg border border-green-500/30">
                        <div className="bg-green-500 p-2 rounded-lg text-white shadow-lg shadow-green-500/50"><Heart size={20} /></div>
                        <div><div className="text-[10px] text-green-300 font-bold uppercase">Vida</div><div className="text-2xl font-black text-white">{health}</div></div>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-900/20 p-2 rounded-lg border border-blue-500/30">
                        <div className="bg-blue-500 p-2 rounded-lg text-white shadow-lg shadow-blue-500/50"><Shield size={20} /></div>
                        <div><div className="text-[10px] text-blue-300 font-bold uppercase">Defensa</div><div className="text-2xl font-black text-white">{defense}</div></div>
                    </div>
                    <div className="flex items-center gap-3 bg-purple-900/20 p-2 rounded-lg border border-purple-500/30">
                        <div className="bg-purple-500 p-2 rounded-lg text-white shadow-lg shadow-purple-500/50"><Zap size={20} /></div>
                        <div><div className="text-[10px] text-purple-300 font-bold uppercase">Magia</div><div className="text-2xl font-black text-white">{magic}</div></div>
                    </div>
                </div>
                <div className="mt-4 text-center text-slate-400 text-xs italic px-4">"{card.description}"</div>
            </div>
        </div>
    );
};

// --- Component: Leaderboard Screen ---
const LeaderboardScreen = ({ profile, onBack }: { profile: PlayerProfile, onBack: () => void }) => {
    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={24} />
                    <h2 className="text-xl font-black text-white italic tracking-wide">CLASIFICACIÓN</h2>
                </div>
                <button onClick={onBack} className="text-slate-400 p-2"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Top 3 Podium Concept */}
                <div className="flex justify-center items-end gap-2 mb-6 pt-4">
                    {/* 2nd */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-400 bg-slate-800 flex items-center justify-center text-xl mb-1 shadow-lg relative">
                            {MOCK_LEADERBOARD[1].avatar}
                            <div className="absolute -bottom-2 bg-slate-600 text-[10px] px-1.5 rounded font-bold">#2</div>
                        </div>
                        <div className="h-16 w-16 bg-slate-800 rounded-t-lg border-x border-t border-slate-700"></div>
                        <span className="text-xs font-bold text-slate-400 mt-1">{MOCK_LEADERBOARD[1].name}</span>
                    </div>
                    {/* 1st */}
                    <div className="flex flex-col items-center z-10">
                        <Crown className="text-yellow-400 mb-1 animate-bounce" size={20} />
                        <div className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-slate-800 flex items-center justify-center text-3xl mb-1 shadow-[0_0_15px_rgba(250,204,21,0.5)] relative">
                            {MOCK_LEADERBOARD[0].avatar}
                            <div className="absolute -bottom-2 bg-yellow-500 text-black text-xs px-2 rounded font-black">#1</div>
                        </div>
                        <div className="h-24 w-20 bg-gradient-to-b from-yellow-900/50 to-slate-900 rounded-t-lg border-x border-t border-yellow-500/50"></div>
                        <span className="text-sm font-black text-yellow-400 mt-1">{MOCK_LEADERBOARD[0].name}</span>
                    </div>
                    {/* 3rd */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-orange-700 bg-slate-800 flex items-center justify-center text-xl mb-1 shadow-lg relative">
                            {MOCK_LEADERBOARD[2].avatar}
                            <div className="absolute -bottom-2 bg-orange-800 text-[10px] px-1.5 rounded font-bold">#3</div>
                        </div>
                        <div className="h-12 w-16 bg-slate-800 rounded-t-lg border-x border-t border-slate-700"></div>
                        <span className="text-xs font-bold text-slate-400 mt-1">{MOCK_LEADERBOARD[2].name}</span>
                    </div>
                </div>

                {/* List */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    {MOCK_LEADERBOARD.slice(3).map((player) => (
                        <div key={player.rank} className="flex items-center p-3 border-b border-slate-800/50">
                            <div className="w-8 font-black text-slate-500 text-sm">#{player.rank}</div>
                            <div className="w-10 text-xl text-center mr-3">{player.avatar}</div>
                            <div className="flex-1 font-bold text-white">{player.name}</div>
                            <div className="font-mono text-cyan-400 text-sm flex items-center gap-1"><Trophy size={12}/> {player.points}</div>
                        </div>
                    ))}
                    {/* Player Rank - Sticky or just in list */}
                    <div className="flex items-center p-3 bg-blue-900/20 border-l-4 border-blue-500">
                         <div className="w-8 font-black text-blue-400 text-sm">#42</div>
                         <div className="w-10 text-xl text-center mr-3">👤</div>
                         <div className="flex-1 font-bold text-white">{profile.username} (Tú)</div>
                         <div className="font-mono text-cyan-400 text-sm flex items-center gap-1"><Trophy size={12}/> {profile.rankPoints}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Component: Battle Pass Screen ---
const BattlePassScreen = ({ profile, setProfile, onBack }: { profile: PlayerProfile, setProfile: React.Dispatch<React.SetStateAction<PlayerProfile>>, onBack: () => void }) => {
    
    const claimReward = (level: number, type: 'FREE' | 'PREMIUM', rewardType: string, rewardValue: any) => {
        // Logic to claim would go here. For visual demo, we just alert.
        alert(`¡Recompensa de Nivel ${level} reclamada!`);
        // In a real app, update profile.claimedRewards
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in">
            {/* Header with Season Banner */}
            <div className="relative h-40 bg-cover bg-center flex items-center justify-center" style={{backgroundImage: 'url(https://img.freepik.com/free-vector/cyber-grid-background_23-2148080646.jpg)'}}>
                <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm"></div>
                <button onClick={onBack} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white"><X size={20}/></button>
                <div className="relative z-10 text-center">
                    <div className="text-blue-300 font-bold uppercase tracking-[0.5em] text-xs mb-1">Temporada 1</div>
                    <h1 className="text-4xl font-black text-white italic drop-shadow-[0_0_10px_cyan]">CYBER GENESIS</h1>
                    <div className="mt-2 bg-black/50 px-4 py-1 rounded-full text-xs font-bold text-white border border-blue-500/30 flex items-center justify-center gap-2">
                        <Clock size={12} /> Termina en 24 días
                    </div>
                </div>
            </div>

            {/* Pass Status Bar */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase">Nivel Actual</span>
                    <span className="text-2xl font-black text-white">{profile.passLevel}</span>
                </div>
                {!profile.hasPremiumPass ? (
                    <button onClick={() => { if(confirm("¿Activar Pase Premium por $4.99?")){ setProfile(p => ({...p, hasPremiumPass: true})); alert("¡Pase Premium Activado!"); } }} className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black uppercase rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse hover:scale-105 transition-transform flex items-center gap-2">
                        <Crown size={16} fill="black" /> Activar Premium
                    </button>
                ) : (
                    <div className="px-4 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-400 font-bold rounded uppercase text-xs">
                        Premium Activo
                    </div>
                )}
            </div>

            {/* Rewards Track */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {BATTLE_PASS_REWARDS.slice(0, 20).map((reward) => (
                    <div key={reward.level} className={`relative flex items-center p-3 rounded-xl border-2 ${profile.passLevel >= reward.level ? 'border-green-500/50 bg-green-900/10' : 'border-slate-800 bg-slate-900'}`}>
                        {/* Level Indicator */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center font-black text-white text-xs z-10 shadow">
                            {reward.level}
                        </div>

                        {/* Free Reward */}
                        <div className="flex-1 pl-6 flex flex-col items-start opacity-100">
                            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Gratis</span>
                            <div className="flex items-center gap-2">
                                {reward.freeType === 'GOLD' ? <Coins className="text-yellow-500" size={20} /> : reward.freeType === 'GEMS' ? <Gem className="text-cyan-400" size={20} /> : <Layers className="text-white" size={20} />}
                                <span className="font-bold text-slate-200 text-sm">{reward.freeValue}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-10 bg-slate-700 mx-4"></div>

                        {/* Premium Reward */}
                        <div className="flex-1 flex flex-col items-end">
                            <span className="text-[10px] text-yellow-500/80 font-bold uppercase mb-1 flex items-center gap-1"><Crown size={8}/> Premium</span>
                            <div className={`flex items-center gap-2 ${!profile.hasPremiumPass ? 'opacity-50 grayscale' : ''}`}>
                                <span className="font-bold text-yellow-100 text-sm">{reward.premiumLabel || reward.premiumValue}</span>
                                {reward.premiumType === 'COSMETIC' ? <Palette className="text-purple-400" size={20} /> : reward.premiumType === 'CARD' ? <Star className="text-red-400" size={20} /> : <Coins className="text-yellow-400" size={20} />}
                            </div>
                            {!profile.hasPremiumPass && <Lock size={12} className="text-slate-500 mt-1" />}
                        </div>
                    </div>
                ))}
                <div className="text-center text-slate-500 text-xs py-4">Sigue jugando para desbloquear más niveles...</div>
            </div>
        </div>
    );
};

const BoosterPack = ({ type, price, currency, onClick }: { type: 'basic' | 'epic', price: number, currency: 'gold' | 'gems', onClick: () => void }) => (
    <div onClick={onClick} className={`cursor-pointer relative w-32 h-48 rounded-xl shadow-xl transform transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-end pb-4 border-4 ${type === 'epic' ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-400' : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-400'}`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Layers size={64} className="text-white" />
        </div>
        <div className="z-10 text-center">
            <div className="font-black text-white text-lg uppercase italic tracking-wider drop-shadow-md">{type === 'epic' ? 'EPIC' : 'BASIC'}</div>
            <div className="text-xs text-slate-300 font-bold uppercase mb-2">Pack</div>
            <div className="bg-black/60 px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
                <span className={`font-black ${currency === 'gems' ? 'text-cyan-400' : 'text-yellow-400'}`}>{price}</span>
                {currency === 'gems' ? <Gem size={12} className="text-cyan-400 fill-cyan-400"/> : <Coins size={12} className="text-yellow-500 fill-yellow-500"/>}
            </div>
        </div>
    </div>
);

const Marketplace = ({ profile, onBuy, onSell, onInspect }: { profile: PlayerProfile, onBuy: (item: MarketListing) => void, onSell: (card: CardData) => void, onInspect: (card: CardData) => void }) => {
    const [listings, setListings] = useState<MarketListing[]>([]);

    useEffect(() => {
        const mocks = Array.from({length: 4}).map((_, i) => ({
            id: `mkt_${i}`,
            sellerName: `Player${Math.floor(Math.random()*1000)}`,
            card: {...ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)], id: simpleId()},
            price: Math.floor(Math.random() * 500) + 50
        }));
        setListings(mocks);
    }, []);

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                {listings.map(listing => (
                    <div key={listing.id} className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>@{listing.sellerName}</span>
                            <span className="text-yellow-400 font-bold">{listing.price} MC</span>
                        </div>
                        <div className="transform scale-90 origin-top-left h-32 relative">
                             <Card card={listing.card} small onInspect={onInspect} />
                        </div>
                        <button onClick={() => onBuy(listing)} className="w-full py-1 bg-green-700 text-white rounded text-xs font-bold mt-16">Comprar</button>
                    </div>
                ))}
             </div>
             <div className="p-4 bg-slate-900 rounded-xl border border-dashed border-slate-700 text-center">
                 <p className="text-slate-400 text-sm mb-2">Vende tus cartas duplicadas por MurCoins</p>
                 <div className="flex gap-2 overflow-x-auto py-2">
                     {profile.collection.slice(0, 5).map(card => (
                         <div key={card.id} className="min-w-[80px]" onClick={() => onSell(card)}>
                             <Card card={card} small />
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
};

// --- Component: Shop Screen (UPDATED) ---
const ShopScreen = ({ profile, setProfile, onInspect, handleOpenPack, onBuy, onSell }: any) => {
    const [tab, setTab] = useState<'PACKS' | 'DAILY' | 'BANK'>('PACKS');
    const [dailyDeals, setDailyDeals] = useState<{id: string, card: CardData, price: number, currency: 'gold' | 'gems'}[]>([]);

    useEffect(() => {
        // Generate daily deals mock
        const deals = Array.from({length: 3}).map((_, i) => {
            const card = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
            const isGem = Math.random() > 0.7;
            return {
                id: `deal_${i}`,
                card: {...card, id: simpleId()},
                price: isGem ? (card.rarity === Rarity.LEGENDARY ? 200 : 50) : (card.rarity === Rarity.LEGENDARY ? 5000 : 500),
                currency: isGem ? 'gems' as const : 'gold' as const
            };
        });
        setDailyDeals(deals);
    }, []);

    const buyDeal = (deal: typeof dailyDeals[0]) => {
        if (deal.currency === 'gold') {
            if (profile.gold >= deal.price) {
                setProfile((p: PlayerProfile) => ({...p, gold: p.gold - deal.price, collection: [...p.collection, deal.card]}));
                setDailyDeals(p => p.filter(d => d.id !== deal.id));
                alert(`¡Has comprado ${deal.card.name}!`);
            } else alert("Falta Oro.");
        } else {
            if (profile.gems >= deal.price) {
                setProfile((p: PlayerProfile) => ({...p, gems: p.gems - deal.price, collection: [...p.collection, deal.card]}));
                setDailyDeals(p => p.filter(d => d.id !== deal.id));
                alert(`¡Has comprado ${deal.card.name}!`);
            } else alert("Faltan Gemas.");
        }
    };

    const buyCurrency = (type: 'gold' | 'gems', amount: number, cost: string) => {
        if (confirm(`¿Comprar ${amount} ${type === 'gold' ? 'Oro' : 'Gemas'} por ${cost}? (Simulado)`)) {
            setProfile((p: PlayerProfile) => ({
                ...p, 
                [type]: p[type] + amount
            }));
            alert("¡Compra exitosa! Gracias por apoyar el juego.");
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-2">
                    <Store className="text-yellow-400" size={24} />
                    <h2 className="text-xl font-black text-white italic tracking-wide">TIENDA</h2>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-slate-700"><Coins size={14} className="text-yellow-500"/><span className="text-sm font-bold text-white">{profile.gold}</span></div>
                    <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-slate-700"><Gem size={14} className="text-cyan-400"/><span className="text-sm font-bold text-white">{profile.gems}</span></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-slate-900/50">
                <button onClick={() => setTab('PACKS')} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${tab === 'PACKS' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-slate-800 text-slate-400'}`}><Layers size={16}/> Packs</button>
                <button onClick={() => setTab('DAILY')} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${tab === 'DAILY' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-slate-800 text-slate-400'}`}><Clock size={16}/> Diario</button>
                <button onClick={() => setTab('BANK')} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${tab === 'BANK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400'}`}><DollarSign size={16}/> Banco</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {tab === 'PACKS' && (
                    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3 flex items-center gap-2"><Star size={14} className="text-yellow-400"/> Destacados</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                <BoosterPack type="epic" price={50} currency="gems" onClick={() => handleOpenPack(true)} />
                                <BoosterPack type="basic" price={500} currency="gold" onClick={() => handleOpenPack(false)} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3 flex items-center gap-2"><Users size={14} className="text-blue-400"/> Mercado de Jugadores</h3>
                            <Marketplace profile={profile} onBuy={onBuy} onSell={onSell} onInspect={onInspect} />
                        </div>
                    </div>
                )}

                {tab === 'DAILY' && (
                    <div className="animate-in slide-in-from-right fade-in duration-300">
                        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-3 rounded-xl border border-green-500/30 mb-6 flex justify-between items-center">
                            <div>
                                <div className="text-green-400 text-xs font-bold uppercase">Se actualiza en</div>
                                <div className="text-white font-black text-xl font-mono">12:34:56</div>
                            </div>
                            <Clock className="text-green-400 opacity-50" size={32} />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {dailyDeals.map(deal => (
                                <div key={deal.id} className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex gap-4 items-center relative overflow-hidden group">
                                    <div className="w-16 h-16 shrink-0 relative">
                                        <div className="transform scale-[0.6] origin-top-left absolute top-0 left-0"><Card card={deal.card} small onInspect={onInspect} /></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-bold truncate">{deal.card.name}</div>
                                        <div className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded w-fit mt-1 ${deal.card.rarity === Rarity.LEGENDARY ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-300'}`}>{deal.card.rarity}</div>
                                    </div>
                                    <button onClick={() => buyDeal(deal)} className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-600 rounded-lg flex flex-col items-center min-w-[80px]">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Comprar</div>
                                        <div className={`font-black flex items-center gap-1 ${deal.currency === 'gems' ? 'text-cyan-400' : 'text-yellow-400'}`}>
                                            {deal.price} {deal.currency === 'gems' ? <Gem size={12} className="fill-cyan-400"/> : <Coins size={12} className="fill-yellow-500"/>}
                                        </div>
                                    </button>
                                </div>
                            ))}
                            {dailyDeals.length === 0 && <div className="text-center text-slate-500 py-10 italic">¡Todo vendido! Vuelve mañana.</div>}
                        </div>
                    </div>
                )}

                {tab === 'BANK' && (
                    <div className="animate-in slide-in-from-right fade-in duration-300 space-y-6">
                        {/* Free Stuff */}
                        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 rounded-xl border border-purple-500/30 flex items-center justify-between">
                            <div>
                                <div className="text-purple-300 font-bold text-sm mb-1">Recompensa Gratis</div>
                                <div className="text-[10px] text-purple-400/80">Mira un anuncio corto</div>
                            </div>
                            <button onClick={() => { alert("Viendo anuncio... (Simulación)"); setTimeout(() => { setProfile((p:PlayerProfile) => ({...p, gems: p.gems + 10})); alert("¡+10 Gemas recibidas!"); }, 1000); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
                                <PlayCircle size={16} /> <span>+10 <Gem size={12} className="inline"/></span>
                            </button>
                        </div>

                        {/* Gem Packs */}
                        <div>
                            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-3">Paquetes de Gemas</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { qty: 100, price: '$0.99', tag: '' },
                                    { qty: 550, price: '$4.99', tag: 'POPULAR' },
                                    { qty: 1200, price: '$9.99', tag: 'BEST VALUE' },
                                    { qty: 2500, price: '$19.99', tag: '' },
                                ].map((pack, i) => (
                                    <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center text-center relative overflow-hidden" onClick={() => buyCurrency('gems', pack.qty, pack.price)}>
                                        {pack.tag && <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg">{pack.tag}</div>}
                                        <Gem size={32} className="text-cyan-400 mb-2 drop-shadow-[0_0_10px_cyan]" />
                                        <div className="text-white font-black text-xl">{pack.qty}</div>
                                        <button className="mt-2 w-full py-1.5 bg-cyan-900/50 text-cyan-200 border border-cyan-700/50 rounded-lg text-sm font-bold hover:bg-cyan-900">{pack.price}</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gold Packs */}
                        <div>
                            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-3">Reserva de Oro</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { qty: 1000, price: '100 Gems' },
                                    { qty: 5000, price: '450 Gems' },
                                    { qty: 10000, price: '800 Gems' },
                                ].map((pack, i) => (
                                    <div key={i} className="bg-slate-800 rounded-xl p-3 border border-slate-700 flex flex-col items-center text-center" onClick={() => {
                                        const cost = parseInt(pack.price);
                                        if (profile.gems >= cost) {
                                            setProfile((p:PlayerProfile) => ({...p, gems: p.gems - cost, gold: p.gold + pack.qty}));
                                            alert("¡Oro comprado!");
                                        } else alert("Faltan Gemas");
                                    }}>
                                        <Coins size={24} className="text-yellow-500 mb-1" />
                                        <div className="text-white font-bold text-sm">{pack.qty}</div>
                                        <div className="text-[10px] text-cyan-400 font-bold mt-1 bg-cyan-900/30 px-2 py-0.5 rounded">{pack.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DeckEditor = ({ profile, setProfile, onInspect }: { profile: PlayerProfile, setProfile: any, onInspect: (c: CardData) => void }) => {
    const deckCards = profile.deck.map(id => profile.collection.find(c => c.id === id)).filter(Boolean) as CardData[];
    const collectionCards = profile.collection.filter(c => !profile.deck.includes(c.id));

    const toggleCard = (card: CardData) => {
        if (profile.deck.includes(card.id)) {
            if (profile.deck.length <= 1) return alert("El mazo no puede estar vacío.");
            setProfile((p: PlayerProfile) => ({ ...p, deck: p.deck.filter(id => id !== card.id) }));
        } else {
            if (profile.deck.length >= 8) return alert("Mazo lleno (Max 8).");
            setProfile((p: PlayerProfile) => ({ ...p, deck: [...p.deck, card.id] }));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950">
            <div className="p-4 bg-slate-900 border-b border-slate-800">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-bold text-sm uppercase">Tu Mazo ({deckCards.length}/8)</h3>
                    <span className="text-xs text-blue-400 font-bold">Promedio: {(deckCards.reduce((a,c) => a + c.stats.cost, 0) / (deckCards.length || 1)).toFixed(1)} Energía</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {deckCards.map(card => (
                        <div key={card.id} className="shrink-0 relative group">
                            <button onClick={() => toggleCard(card)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 z-10"><X size={12}/></button>
                            <Card card={card} small onInspect={onInspect} />
                        </div>
                    ))}
                    {deckCards.length === 0 && <div className="text-slate-500 text-sm italic">Mazo vacío</div>}
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-slate-400 font-bold text-xs uppercase mb-3">Colección</h3>
                <div className="grid grid-cols-4 gap-2">
                    {collectionCards.map(card => (
                        <div key={card.id} className="relative" onClick={() => toggleCard(card)}>
                            <Card card={card} small onInspect={onInspect} />
                            {profile.deck.includes(card.id) && <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg"><CheckCircle className="text-green-500"/></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BattleScreen = ({ playerDeck, allCards, arenaLevel, profile, onInspect, onExit }: any) => {
    const [turn, setTurn] = useState(1);
    const [mana, setMana] = useState(1);
    const [playerHealth, setPlayerHealth] = useState(30);
    const [enemyHealth, setEnemyHealth] = useState(30);

    const handleEndTurn = () => {
        setPlayerHealth(h => Math.max(0, h - Math.floor(Math.random() * 5)));
        setTurn(t => t + 1);
        setMana(Math.min(10, turn + 1));
        if (Math.random() > 0.8) onExit(true);
        else if (playerHealth <= 0) onExit(false);
    };

    return (
        <div className={`h-full flex flex-col relative bg-gradient-to-b ${arenaLevel.bgGradient}`}>
            <div className="h-16 bg-black/40 flex justify-between items-center px-4">
                 <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-red-900 border-2 border-red-500 flex items-center justify-center">😈</div>
                     <div className="flex flex-col">
                         <span className="text-white font-bold text-sm">Oponente</span>
                         <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: `${(enemyHealth/30)*100}%`}}></div></div>
                     </div>
                 </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
                 <div className="text-white/20 font-black text-6xl uppercase transform -rotate-12 select-none pointer-events-none">Batalla Sim</div>
            </div>
            <div className="h-48 bg-black/60 backdrop-blur-md p-2 flex flex-col justify-end">
                <div className="flex justify-between items-center mb-2 px-2">
                    <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-cyan-400 flex items-center justify-center font-black text-white">{mana}</div>
                         <span className="text-cyan-400 text-xs font-bold uppercase">Mana</span>
                    </div>
                    <button onClick={handleEndTurn} className="bg-yellow-500 text-black font-bold px-4 py-1 rounded-lg uppercase text-sm hover:scale-105 transition-transform">Fin Turno</button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 items-end h-32 px-2">
                     {profile.deck.slice(0, 5).map((cardId: string) => {
                         const card = allCards.find((c: CardData) => c.id === cardId);
                         if(!card) return null;
                         return (
                             <div key={cardId} className="hover:-translate-y-4 transition-transform cursor-pointer">
                                 <Card card={card} small onInspect={onInspect} />
                             </div>
                         );
                     })}
                </div>
            </div>
            {playerHealth <= 0 && <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"><h1 className="text-red-500 font-black text-6xl">DERROTA</h1></div>}
        </div>
    );
};

const ClanScreen = ({ profile, setProfile, onBack }: any) => {
    const [messages, setMessages] = useState(INITIAL_CLAN_CHAT);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const msg: ClanChatMessage = {
            id: simpleId(),
            sender: profile.username,
            text: inputText,
            timestamp: Date.now()
        };
        setMessages([...messages, msg]);
        setInputText('');
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
             <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center gap-4 shadow-lg z-10">
                <button onClick={onBack}><ArrowRight className="rotate-180 text-slate-400"/></button>
                <h2 className="text-xl font-black text-white italic">CLAN</h2>
             </div>
             <div className="flex-1 flex flex-col">
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {messages.map(msg => (
                         <div key={msg.id} className={`flex flex-col ${msg.sender === profile.username ? 'items-end' : 'items-start'}`}>
                             <div className="flex items-end gap-2">
                                 {msg.sender !== profile.username && <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">{msg.sender[0]}</div>}
                                 <div className={`px-3 py-2 rounded-xl max-w-[80%] ${msg.sender === profile.username ? 'bg-blue-600 text-white rounded-br-none' : msg.isSystem ? 'bg-slate-800 text-yellow-400 text-center w-full' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                                     <div className="text-xs font-bold opacity-50 mb-0.5">{msg.sender}</div>
                                     <div className="text-sm">{msg.text}</div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
                 <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                     <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Escribe un mensaje..." className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500" />
                     <button onClick={sendMessage} className="p-2 bg-blue-600 rounded-lg text-white"><ArrowRight size={20}/></button>
                 </div>
             </div>
        </div>
    );
};

const PackOpening = ({ cards, onClose, onInspect }: { cards: CardData[], onClose: () => void, onInspect: (c: CardData) => void }) => {
    const [revealed, setRevealed] = useState<boolean[]>(new Array(cards.length).fill(false));
    const reveal = (index: number) => {
        const newRevealed = [...revealed];
        newRevealed[index] = true;
        setRevealed(newRevealed);
    };
    const allRevealed = revealed.every(Boolean);

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-white italic mb-8 animate-bounce">¡PACK ABIERTO!</h2>
            <div className="flex gap-4 overflow-x-auto w-full justify-center px-4 pb-12">
                {cards.map((card, idx) => (
                    <div key={idx} onClick={() => reveal(idx)} className="perspective-1000 cursor-pointer">
                        <div className={`relative w-40 h-60 transition-all duration-700 transform-style-3d ${revealed[idx] ? 'rotate-y-0' : 'rotate-y-180'}`}>
                             {revealed[idx] ? (
                                 <div className="animate-in zoom-in spin-in-12 duration-500">
                                     <Card card={card} onInspect={onInspect} />
                                     {card.rarity === Rarity.LEGENDARY && <div className="absolute -inset-4 bg-yellow-500/30 blur-xl animate-pulse -z-10 rounded-full"></div>}
                                 </div>
                             ) : (
                                 <div className="w-full h-full bg-slate-800 rounded-xl border-4 border-slate-600 flex items-center justify-center backface-hidden shadow-2xl hover:scale-105 transition-transform">
                                      <div className="text-4xl">🎁</div>
                                 </div>
                             )}
                        </div>
                    </div>
                ))}
            </div>
            {allRevealed && <button onClick={onClose} className="mt-8 px-8 py-3 bg-white text-black font-black rounded-full shadow-[0_0_20px_white] hover:scale-110 transition-transform animate-in slide-in-from-bottom">CONTINUAR</button>}
        </div>
    );
};

const CustomizeModal = ({ profile, setProfile, onClose }: any) => {
    const categories = ['AVATAR', 'AVATAR_FRAME', 'BANNER', 'ARENA_SKIN'];
    const [activeCat, setActiveCat] = useState('AVATAR');

    const equip = (id: string, type: string) => {
        const map: any = {
            'AVATAR': 'equippedAvatar',
            'AVATAR_FRAME': 'equippedAvatarFrame',
            'BANNER': 'equippedBanner',
            'ARENA_SKIN': 'equippedArenaSkin'
        };
        setProfile((p: PlayerProfile) => ({ ...p, [map[type]]: id }));
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/90 flex flex-col animate-in slide-in-from-bottom">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900">
                <h2 className="text-xl font-bold text-white">Personalización</h2>
                <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400"><X /></button>
            </div>
            <div className="flex bg-slate-900 border-b border-slate-800 overflow-x-auto">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-3 font-bold text-xs uppercase whitespace-nowrap ${activeCat === cat ? 'text-white border-b-2 border-blue-500 bg-slate-800' : 'text-slate-500'}`}>
                        {cat.replace('_', ' ')}
                    </button>
                ))}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-950">
                 <div className="grid grid-cols-3 gap-4">
                     {Object.values(COSMETICS).filter(c => c.type === activeCat).map(item => {
                         const isOwned = profile.ownedCosmetics.includes(item.id) || item.rarity === 'COMMON';
                         const isEquipped = 
                            (activeCat === 'AVATAR' && profile.equippedAvatar === item.id) ||
                            (activeCat === 'AVATAR_FRAME' && profile.equippedAvatarFrame === item.id) ||
                            (activeCat === 'BANNER' && profile.equippedBanner === item.id) ||
                            (activeCat === 'ARENA_SKIN' && profile.equippedArenaSkin === item.id);
                         return (
                             <div key={item.id} onClick={() => isOwned && equip(item.id, item.type)} className={`relative bg-slate-900 rounded-xl p-3 border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${isEquipped ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : isOwned ? 'border-slate-700 hover:border-slate-500' : 'border-slate-800 opacity-50 grayscale'}`}>
                                 <div className="text-2xl">{item.type === 'AVATAR' ? item.value : item.type === 'AVATAR_FRAME' ? <div className={`w-8 h-8 border-2 ${item.value}`}></div> : '🎨'}</div>
                                 <div className="text-[10px] font-bold text-center text-slate-300 leading-tight">{item.name}</div>
                                 {isEquipped && <div className="absolute top-2 right-2 text-green-500"><CheckCircle size={12}/></div>}
                                 {!isOwned && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Lock size={20} className="text-slate-400"/></div>}
                             </div>
                         );
                     })}
                 </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [screen, setScreen] = useState<ScreenState>('SPLASH'); 
    const [profile, setProfile] = useState<PlayerProfile>({
        username: 'AshKetchum',
        level: 5,
        xp: 250,
        rankPoints: 1200,
        gold: 1500,
        gems: 100,
        murCoins: 50,
        collection: [...INITIAL_CARDS],
        deck: INITIAL_CARDS.slice(0, 5).map(c => c.id),
        unlockedForge: false,
        hasPremiumPass: false,
        passLevel: 5,
        claimedRewards: [],
        ownedCosmetics: ['default_arena', 'default_frame', 'default_banner', 'default_avatar'],
        equippedArenaSkin: 'default_arena',
        equippedAvatarFrame: 'default_frame',
        equippedBanner: 'default_banner',
        equippedAvatar: 'default_avatar'
    });

    const [openedPackCards, setOpenedPackCards] = useState<CardData[] | null>(null);
    const [showCustomize, setShowCustomize] = useState(false);
    const [forgePrompt, setForgePrompt] = useState('');
    const [isForging, setIsForging] = useState(false);
    const [generatedCard, setGeneratedCard] = useState<Partial<CardData> | null>(null);
    const [inspectingCard, setInspectingCard] = useState<CardData | null>(null);
    const handleInspect = (card: CardData) => setInspectingCard(card);

    useEffect(() => {
        if (screen === 'SPLASH') {
            const timer = setTimeout(() => {
                setScreen('HOME');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    const handleOpenPack = (isEpic: boolean) => {
        const currency = isEpic ? 'gems' : 'gold';
        const cost = isEpic ? 50 : 500;
        if (currency === 'gems' && profile.gems < cost) return alert("No tienes suficientes gemas.");
        if (currency === 'gold' && profile.gold < cost) return alert("No tienes suficiente oro.");
        setProfile(p => ({ ...p, gold: currency === 'gold' ? p.gold - cost : p.gold, gems: currency === 'gems' ? p.gems - cost : p.gems }));
        
        const highestArenaIndex = ARENAS.findIndex(a => a.minRankPoints > profile.rankPoints);
        const maxArenaId = highestArenaIndex === -1 ? ARENAS[ARENAS.length - 1].id : ARENAS[Math.max(0, highestArenaIndex - 1)].id;
        const availablePool = ALL_CARDS.filter(c => c.arenaId <= maxArenaId);
        const finalPool = availablePool.length > 0 ? availablePool : ALL_CARDS;

        const newCards = Array.from({length: 5}).map(() => {
            const rand = Math.random();
            let rarity = Rarity.COMMON;
            if (isEpic) { if (rand > 0.9) rarity = Rarity.LEGENDARY; else if (rand > 0.6) rarity = Rarity.EPIC; else rarity = Rarity.RARE; } else { if (rand > 0.95) rarity = Rarity.LEGENDARY; else if (rand > 0.85) rarity = Rarity.EPIC; else if (rand > 0.6) rarity = Rarity.RARE; }
            
            const rarityPool = finalPool.filter(c => c.rarity === rarity);
            const template = rarityPool.length > 0 ? rarityPool[Math.floor(Math.random() * rarityPool.length)] : finalPool[Math.floor(Math.random() * finalPool.length)];
            return { ...template, id: simpleId() };
        });
        setOpenedPackCards(newCards);
        setProfile(p => ({ ...p, collection: [...p.collection, ...newCards] }));
    };

    const handleSubscribe = () => {
        if(confirm("¿Confirmar suscripción mensual por $2.99? (Simulación)")) {
            setIsForging(true);
            setTimeout(() => {
                setProfile(p => ({ ...p, unlockedForge: true, labSubscriptionExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000 }));
                setIsForging(false);
                alert("¡Bienvenido al Club de Forja! Suscripción activada.");
            }, 1500);
        }
    };

    const handleForge = async () => {
        if (!forgePrompt.trim()) return;
        if (!profile.unlockedForge) return alert("Necesitas una suscripción activa.");
        setIsForging(true);
        try {
            const cardData = await generateCardFromPrompt(forgePrompt);
            if (cardData) { setGeneratedCard(cardData); } else { alert("La forja falló."); }
        } catch (e) { console.error(e); alert("Error."); } finally { setIsForging(false); }
    };

    const confirmForge = () => {
        if (generatedCard && generatedCard.name && generatedCard.stats) {
            const newCard: CardData = {
                id: simpleId(),
                name: generatedCard.name,
                description: generatedCard.description || '',
                rarity: (generatedCard.rarity as Rarity) || Rarity.COMMON,
                element: [ElementType.FIRE, ElementType.WATER, ElementType.GRASS, ElementType.ELECTRIC, ElementType.PSYCHIC][Math.floor(Math.random() * 5)],
                stats: {
                    attack: generatedCard.stats?.attack || 1,
                    health: generatedCard.stats?.health || 1,
                    cost: generatedCard.stats?.cost || 1,
                    magic: (generatedCard.stats as any)?.magic || 1,
                    defense: (generatedCard.stats as any)?.defense || 1
                },
                imageUrl: `https://source.unsplash.com/random/400x600/?monster,${generatedCard.name}`,
                abilityName: 'Habilidad Única',
                arenaId: 1
            };
            setProfile(p => ({ ...p, collection: [...p.collection, newCard] }));
            setGeneratedCard(null); setForgePrompt(''); alert("¡Carta forjada!");
        }
    };

    const renderScreen = () => {
        switch (screen) {
            case 'SPLASH':
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-black animate-in fade-in duration-1000 relative overflow-hidden">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black opacity-50"></div>
                         <div className="z-10 flex flex-col items-center">
                             <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)] animate-pulse-slow">
                                 <Swords size={48} className="text-white" />
                             </div>
                             <h1 className="text-6xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_10px_white]">MuR</h1>
                             <p className="text-blue-400 font-bold tracking-[0.5em] text-xs uppercase animate-pulse">Pocket TCG</p>
                             <div className="mt-12 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '100%'}}></div>
                             </div>
                         </div>
                         <div className="absolute bottom-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Powered by Gemini AI</div>
                    </div>
                );
            case 'HOME':
                return (
                    <div className="flex flex-col h-full relative z-10 animate-in fade-in">
                        {/* Title Section */}
                        <div className="text-center pt-6 mb-4">
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] tracking-tighter">MuR</h1>
                            <p className="text-slate-400 tracking-[0.5em] text-xs uppercase font-bold">Trading Card Game</p>
                        </div>

                        {/* Season Banner */}
                        <div className="px-4 mb-4">
                            <div onClick={() => setScreen('PASS')} className="relative w-full h-24 rounded-xl overflow-hidden border border-blue-500/30 shadow-lg cursor-pointer group">
                                <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/cyber-grid-background_23-2148080646.jpg')] bg-cover bg-center transition-transform group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
                                <div className="absolute inset-0 flex items-center justify-between px-6">
                                    <div className="flex flex-col items-start">
                                        <div className="text-[10px] bg-yellow-500 text-black px-1.5 rounded font-bold uppercase mb-1 animate-pulse">Temporada 1</div>
                                        <div className="text-xl font-black text-white italic">CYBER GENESIS</div>
                                        <div className="text-xs text-blue-300 font-bold flex items-center gap-1"><Crown size={12}/> Pase de Batalla</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_cyan] border-2 border-white group-hover:scale-110 transition-transform">
                                        <ArrowRight size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="flex-1 px-4 pb-4">
                            <div className="grid grid-cols-2 gap-3 h-full max-h-[400px]">
                                {/* Play Button (Big) */}
                                <button onClick={() => setScreen('BATTLE')} className="col-span-2 row-span-2 bg-gradient-to-br from-red-600 to-orange-700 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center hover:scale-[1.02] active:scale-95 transition-all group border-t border-red-400/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Swords size={48} className="text-white mb-2 group-hover:rotate-12 transition-transform drop-shadow-lg" />
                                    <span className="text-3xl font-black text-white italic tracking-wider drop-shadow-md">JUGAR</span>
                                    <span className="text-[10px] text-red-100 font-bold bg-black/30 px-3 py-1 rounded-full mt-2 border border-white/20">CLASIFICATORIA</span>
                                </button>
                                
                                {/* Deck */}
                                <button onClick={() => setScreen('DECK')} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all flex flex-col items-center justify-center gap-1 group">
                                    <Layers size={24} className="text-blue-400 group-hover:scale-110 transition-transform"/>
                                    <span className="font-bold text-slate-200 text-sm">Mazo</span>
                                </button>
                                
                                {/* Shop */}
                                <button onClick={() => setScreen('SHOP')} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-yellow-500 hover:bg-slate-750 transition-all flex flex-col items-center justify-center gap-1 group relative">
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                    <Store size={24} className="text-yellow-400 group-hover:scale-110 transition-transform"/>
                                    <span className="font-bold text-slate-200 text-sm">Tienda</span>
                                </button>

                                {/* Forge */}
                                <button onClick={() => setScreen('FORGE')} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-purple-500 hover:bg-slate-750 transition-all flex flex-col items-center justify-center gap-1 group">
                                    <Zap size={24} className="text-purple-400 group-hover:scale-110 transition-transform"/>
                                    <span className="font-bold text-slate-200 text-sm">Forja AI</span>
                                </button>

                                {/* Leaderboard & Clans (Shared Row) */}
                                <div className="flex gap-2">
                                     <button onClick={() => setScreen('CLANS')} className="flex-1 bg-slate-800 rounded-xl border border-slate-700 hover:border-green-500 flex items-center justify-center group"><Users size={20} className="text-green-400 group-hover:scale-110 transition-transform"/></button>
                                     <button onClick={() => setScreen('LEADERBOARD')} className="flex-1 bg-slate-800 rounded-xl border border-slate-700 hover:border-orange-500 flex items-center justify-center group"><Trophy size={20} className="text-orange-400 group-hover:scale-110 transition-transform"/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'BATTLE':
               const currentArena = ARENAS.find(a => a.minRankPoints <= profile.rankPoints) || ARENAS[0];
               return <BattleScreen playerDeck={profile.deck} allCards={profile.collection} arenaLevel={currentArena} profile={profile} onInspect={handleInspect} onExit={(win: boolean) => { setScreen('HOME'); if (win) { setProfile(p => ({ ...p, gold: p.gold + 50, rankPoints: p.rankPoints + 25 })); alert("¡Victoria!"); } else { setProfile(p => ({ ...p, gold: p.gold + 10, rankPoints: Math.max(0, p.rankPoints - 15) })); alert("Derrota..."); } }} />;
            case 'DECK':
                return (
                    <div className="h-full flex flex-col">
                        <div className="p-4 flex items-center gap-4 border-b border-slate-800"><button onClick={() => setScreen('HOME')} className="p-2 bg-slate-800 rounded-full"><ArrowRight className="rotate-180 text-white" /></button><h2 className="text-xl font-bold text-white">Editar Mazo</h2></div>
                        <DeckEditor profile={profile} setProfile={setProfile} onInspect={handleInspect} />
                    </div>
                );
            case 'SHOP':
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex items-center gap-4 p-4 border-b border-slate-800 bg-slate-900"><button onClick={() => setScreen('HOME')} className="p-2 bg-slate-800 rounded-full"><ArrowRight className="rotate-180 text-white" /></button><h2 className="text-xl font-bold text-white">Volver</h2></div>
                        <ShopScreen profile={profile} setProfile={setProfile} onInspect={handleInspect} handleOpenPack={handleOpenPack} onBuy={(listing: MarketListing) => { setProfile(p => ({...p, murCoins: p.murCoins - listing.price, collection: [...p.collection, listing.card]})); alert(`¡Compraste ${listing.card.name}!`); }} onSell={(card: CardData) => { const price = RARITY_PRICES[card.rarity]; setProfile(p => ({...p, murCoins: p.murCoins + price, collection: p.collection.filter(c => c.id !== card.id)})); alert("Carta vendida."); }} />
                    </div>
                );
            case 'CLANS': return <ClanScreen profile={profile} setProfile={setProfile} onBack={() => setScreen('HOME')} />;
            case 'PASS': return <BattlePassScreen profile={profile} setProfile={setProfile} onBack={() => setScreen('HOME')} />;
            case 'LEADERBOARD': return <LeaderboardScreen profile={profile} onBack={() => setScreen('HOME')} />;
            case 'FORGE':
                return (
                    <div className="h-full flex flex-col p-6 animate-in fade-in bg-slate-950">
                         <div className="flex items-center gap-4 mb-6"><button onClick={() => setScreen('HOME')} className="p-2 bg-slate-800 rounded-full"><ArrowRight className="rotate-180 text-white" /></button><h2 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-purple-400"/> Forja GenAI</h2></div>
                        {!profile.unlockedForge ? (
                             <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center mt-10">
                                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-purple-500 shadow-[0_0_20px_purple]"><Lock size={32} className="text-purple-400" /></div>
                                 <div><h3 className="text-2xl font-black text-white">Laboratorio Cerrado</h3><p className="text-slate-400 max-w-xs mx-auto">Suscríbete para acceder a la tecnología de generación de cartas con IA.</p></div>
                                 <button onClick={handleSubscribe} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border border-purple-400/50"><Zap size={18} className="fill-white" /> Suscribirse ($2.99/mes)</button>
                             </div>
                        ) : (
                             <div className="flex-1 flex flex-col space-y-4">
                                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-xl">
                                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><Zap size={12} className="text-yellow-400"/> Prompt de la Carta</label>
                                     <textarea value={forgePrompt} onChange={(e) => setForgePrompt(e.target.value)} placeholder="Ej: Un dragón mecánico que escupe láseres..." className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white h-32 focus:border-purple-500 outline-none resize-none placeholder-slate-600"/>
                                     <div className="flex justify-between items-center mt-2">
                                         <span className="text-[10px] text-green-400 font-bold uppercase border border-green-500/30 bg-green-900/20 px-2 py-0.5 rounded">Suscripción Activa</span>
                                         <button onClick={handleForge} disabled={isForging || !forgePrompt.trim()} className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isForging || !forgePrompt.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_purple]'}`}>
                                             {isForging ? <span className="animate-spin">🌀</span> : <Zap size={16} className="fill-white"/>} {isForging ? 'Forjando...' : 'GENERAR'}
                                         </button>
                                     </div>
                                 </div>
                                 {generatedCard && (
                                     <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom fade-in py-4">
                                         <h3 className="text-white font-black uppercase mb-4 tracking-widest text-center">¡Resultado!</h3>
                                         <div className="mb-6 transform scale-100 pointer-events-none">
                                            {generatedCard.name && generatedCard.stats && (
                                                <Card card={{...generatedCard, id: 'temp', imageUrl: `https://source.unsplash.com/random/400x600/?monster,${generatedCard.name}`, arenaId: 1, abilityName: 'Habilidad Nueva', element: ElementType.NORMAL} as CardData} disabled />
                                            )}
                                         </div>
                                         <div className="flex gap-4 w-full max-w-xs">
                                             <button onClick={() => setGeneratedCard(null)} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700">Descartar</button>
                                             <button onClick={confirmForge} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-500 flex items-center justify-center gap-2 transition-transform hover:scale-105 border border-green-500"><CheckCircle size={18}/> Reclamar</button>
                                         </div>
                                     </div>
                                 )}
                             </div>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="h-screen w-full bg-black text-slate-200 font-sans overflow-hidden relative select-none">
            <BackgroundParticles />
            {screen !== 'SPLASH' && (
            <div className="absolute top-0 left-0 w-full h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 flex items-center justify-between px-4 shadow-lg animate-in slide-in-from-top duration-500">
                 <div className="flex items-center gap-2" onClick={() => setShowCustomize(true)}>
                     <div className="relative cursor-pointer hover:scale-105 transition-transform group">
                         <div className={`w-9 h-9 rounded border-2 overflow-hidden shadow-lg ${COSMETICS[profile.equippedAvatarFrame]?.value.replace('border-', 'border-') || 'border-slate-500'}`}>
                             <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xl">{COSMETICS[profile.equippedAvatar]?.value || '👤'}</div>
                         </div>
                         <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 border border-black text-[8px] font-black text-white w-4 h-4 flex items-center justify-center">{profile.level}</div>
                     </div>
                     <div className="flex flex-col">
                         <span className="text-xs font-black text-white leading-none tracking-wide">{profile.username}</span>
                         <div className="flex items-center gap-1 mt-0.5"><div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><div className="h-full bg-blue-500 w-[60%]"></div></div></div>
                     </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]"><Coins size={14} className="text-yellow-500 fill-yellow-500" /><span className="text-xs font-black text-yellow-100">{profile.gold}</span></div>
                     <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]"><Gem size={14} className="text-cyan-400 fill-cyan-400" /><span className="text-xs font-black text-cyan-100">{profile.gems}</span></div>
                 </div>
            </div>
            )}
            <div className={`w-full h-full ${screen === 'SPLASH' ? 'pt-0' : 'pt-14'} pb-0 relative z-0`}>{renderScreen()}</div>
            {openedPackCards && <PackOpening cards={openedPackCards} onClose={() => setOpenedPackCards(null)} onInspect={handleInspect} />}
            {showCustomize && <CustomizeModal profile={profile} setProfile={setProfile} onClose={() => setShowCustomize(false)} />}
            {inspectingCard && <CardDetailModal card={inspectingCard} onClose={() => setInspectingCard(null)} />}
        </div>
    );
};

export default App;