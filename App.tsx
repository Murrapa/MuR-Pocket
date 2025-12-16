
import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, ScreenState, CardData, Rarity, BattleEntity, ElementType, ArenaLevel, DamageEvent, Cosmetic, MarketListing, Clan, ClanChatMessage } from './types';
import { ALL_CARDS, INITIAL_CARDS, MAX_MANA, LANE_COUNT, ARENAS, ELEMENT_ICONS, BATTLE_PASS_REWARDS, COSMETICS, RARITY_PRICES } from './constants';
import { Card } from './components/Card';
import { generateCardFromPrompt } from './services/gemini';
import { Coins, Gem, Zap, Swords, User, Shield, Trophy, Users, Star, Gift, ArrowRight, Lock, LogOut, Disc, Search, ShoppingBag, Crown, Palette, Hexagon, DollarSign, Store, Layers, Gamepad2, Flag, Image as ImageIcon, Trash2, PlusCircle, CheckCircle, Skull, Heart, X, CreditCard, Calendar, MessageSquare, Globe, LogIn, Activity, Flame, Infinity } from 'lucide-react';
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
    // Usar estadísticas REALES de la base de datos
    const defense = card.stats.defense * 10;
    const magic = card.stats.magic * 10;
    const attack = card.stats.attack * 10;
    const health = card.stats.health * 10;
    
    // Arena info
    const arena = ARENAS.find(a => a.id === card.arenaId);
    // Gradient matching card element for modal bg
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
                        <div>
                            <div className="text-[10px] text-red-300 font-bold uppercase">Ataque</div>
                            <div className="text-2xl font-black text-white">{attack}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-green-900/20 p-2 rounded-lg border border-green-500/30">
                        <div className="bg-green-500 p-2 rounded-lg text-white shadow-lg shadow-green-500/50"><Heart size={20} /></div>
                        <div>
                            <div className="text-[10px] text-green-300 font-bold uppercase">Vida</div>
                            <div className="text-2xl font-black text-white">{health}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-blue-900/20 p-2 rounded-lg border border-blue-500/30">
                        <div className="bg-blue-500 p-2 rounded-lg text-white shadow-lg shadow-blue-500/50"><Shield size={20} /></div>
                        <div>
                            <div className="text-[10px] text-blue-300 font-bold uppercase">Defensa</div>
                            <div className="text-2xl font-black text-white">{defense}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-purple-900/20 p-2 rounded-lg border border-purple-500/30">
                        <div className="bg-purple-500 p-2 rounded-lg text-white shadow-lg shadow-purple-500/50"><Zap size={20} /></div>
                        <div>
                            <div className="text-[10px] text-purple-300 font-bold uppercase">Magia</div>
                            <div className="text-2xl font-black text-white">{magic}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center text-slate-400 text-xs italic px-4">
                    "{card.description}"
                </div>
            </div>
        </div>
    );
};

// --- Component: Clan Screen ---
const ClanScreen = ({ profile, setProfile, onBack }: { profile: PlayerProfile, setProfile: React.Dispatch<React.SetStateAction<PlayerProfile>>, onBack: () => void }) => {
    const [view, setView] = useState<'BROWSE' | 'CREATE' | 'MY_CLAN'>('BROWSE');
    const [clans, setClans] = useState<Clan[]>(MOCK_CLANS);
    const [searchTerm, setSearchTerm] = useState('');
    const [newClanName, setNewClanName] = useState('');
    const [newClanDesc, setNewClanDesc] = useState('');
    const [newClanIcon, setNewClanIcon] = useState('🛡️');
    const [chatMessages, setChatMessages] = useState<ClanChatMessage[]>(INITIAL_CLAN_CHAT);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        if (profile.clanId) {
            setView('MY_CLAN');
        } else {
            setView('BROWSE');
        }
    }, [profile.clanId]);

    const handleCreateClan = () => {
        if (profile.gold < 1000) return alert("Necesitas 1000 Oro para crear un clan.");
        if (!newClanName.trim()) return alert("Nombre requerido.");
        const newClan: Clan = { id: simpleId(), name: newClanName, description: newClanDesc || 'Sin descripción', icon: newClanIcon, members: 1, minRank: 0, isPrivate: false };
        setClans(p => [newClan, ...p]);
        setProfile(p => ({ ...p, gold: p.gold - 1000, clanId: newClan.id, clanName: newClan.name }));
        alert("¡Clan creado con éxito!");
    };
    const handleJoinClan = (clan: Clan) => {
        if (profile.rankPoints < clan.minRank) return alert(`Necesitas ${clan.minRank} puntos para unirte.`);
        if (clan.isPrivate) return alert("Este clan es privado.");
        setProfile(p => ({ ...p, clanId: clan.id, clanName: clan.name }));
        setChatMessages(p => [...p, { id: simpleId(), sender: 'System', text: `${profile.username} se ha unido al clan.`, timestamp: Date.now(), isSystem: true }]);
    };
    const handleLeaveClan = () => { if (confirm("¿Seguro que quieres abandonar el clan?")) { setProfile(p => ({ ...p, clanId: undefined, clanName: undefined })); } };
    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const msg: ClanChatMessage = { id: simpleId(), sender: profile.username, text: chatInput, timestamp: Date.now() };
        setChatMessages(p => [...p, msg]);
        setChatInput('');
        setTimeout(() => {
            const replies = ["¡Jaja, buena esa!", "Vamos a jugar.", "¿Alguien tiene cartas de fuego?", "GG WP"];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMsg: ClanChatMessage = { id: simpleId(), sender: ['Misty', 'Brock', 'Gary', 'Jessie'][Math.floor(Math.random() * 4)], text: randomReply, timestamp: Date.now() };
            setChatMessages(p => [...p, replyMsg]);
        }, 2000);
    };

    const currentClan = clans.find(c => c.id === profile.clanId) || { id: 'mock', name: profile.clanName || 'Mi Clan', icon: '🛡️', description: 'Clan actual', members: 1 };

    if (view === 'MY_CLAN') {
        return (
            <div className="flex flex-col h-full bg-slate-900 animate-in fade-in">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-lg z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-slate-600">{currentClan.icon}</div>
                        <div><h2 className="text-xl font-black text-white leading-none">{currentClan.name}</h2><p className="text-xs text-slate-400">{currentClan.members} Miembros • {profile.username} (Miembro)</p></div>
                    </div>
                    <button onClick={onBack} className="text-slate-400 p-2"><X /></button>
                </div>
                <div className="flex border-b border-slate-700 bg-slate-900/50">
                    <button className="flex-1 py-3 text-sm font-bold text-blue-400 border-b-2 border-blue-500 bg-blue-500/10">CHAT</button>
                    <button className="flex-1 py-3 text-sm font-bold text-slate-500">MIEMBROS</button>
                    <button className="flex-1 py-3 text-sm font-bold text-slate-500">GUERRA</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
                    {chatMessages.map(msg => (<div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center' : msg.sender === profile.username ? 'items-end' : 'items-start'}`}>{msg.isSystem ? (<span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded-full">{msg.text}</span>) : (<><span className="text-[10px] text-slate-400 ml-1 mb-0.5">{msg.sender}</span><div className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${msg.sender === profile.username ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>{msg.text}</div></>)}</div>))}
                </div>
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage} className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors"><ArrowRight size={20} /></button>
                </div>
                <button onClick={handleLeaveClan} className="absolute top-16 right-4 p-1 bg-red-900/20 rounded hover:bg-red-900/50 text-red-500 text-xs flex items-center gap-1 border border-red-900/30"><LogOut size={10} /> Salir</button>
            </div>
        );
    }
    if (view === 'CREATE') { return (<div className="p-6 h-full flex flex-col bg-slate-900 animate-in slide-in-from-right"><div className="flex items-center gap-2 mb-6"><button onClick={() => setView('BROWSE')} className="p-2 bg-slate-800 rounded-full text-slate-300"><ArrowRight className="rotate-180" size={20}/></button><h2 className="text-2xl font-black text-white">Crear Clan</h2></div><div className="space-y-4"><div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Icono del Clan</label><div className="flex gap-2 overflow-x-auto pb-2">{['🛡️','🚀','🐉','👑','🔥','💧','⚡','💀'].map(icon => (<button key={icon} onClick={() => setNewClanIcon(icon)} className={`w-12 h-12 text-2xl rounded-xl border-2 flex items-center justify-center ${newClanIcon === icon ? 'border-yellow-500 bg-yellow-500/20' : 'border-slate-700 bg-slate-800'}`}>{icon}</button>))}</div></div><div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nombre del Clan</label><input value={newClanName} onChange={e => setNewClanName(e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3 text-white font-bold focus:border-yellow-500 outline-none" placeholder="Ej: Maestros Pokemon" /></div><div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Descripción</label><textarea value={newClanDesc} onChange={e => setNewClanDesc(e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3 text-white h-24 focus:border-yellow-500 outline-none" placeholder="Describe tu clan..." /></div></div><div className="mt-auto"><div className="flex justify-between items-center mb-4 p-4 bg-slate-800 rounded-xl border border-slate-700"><span className="text-slate-400">Costo de creación</span><span className="text-yellow-400 font-black flex items-center gap-1">1000 <Coins size={16}/></span></div><button onClick={handleCreateClan} className="w-full py-4 bg-yellow-500 text-yellow-900 font-black rounded-xl text-lg shadow-lg hover:bg-yellow-400">CREAR CLAN</button></div></div>); }
    return (<div className="h-full flex flex-col bg-slate-900 animate-in fade-in"><div className="p-4 bg-slate-800 border-b border-slate-700 flex flex-col gap-4 shadow-lg z-10"><div className="flex justify-between items-center"><h2 className="text-2xl font-black text-white flex items-center gap-2"><Globe className="text-blue-400"/> Clanes</h2><button onClick={onBack} className="text-slate-400 p-2"><X /></button></div><div className="flex gap-2"><div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3"><Search size={16} className="text-slate-500" /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar clan..." className="bg-transparent border-none text-white text-sm p-2 w-full focus:outline-none"/></div><button onClick={() => setView('CREATE')} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg text-sm whitespace-nowrap shadow-md">+ Crear</button></div></div><div className="flex-1 overflow-y-auto p-4 space-y-2">{clans.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(clan => (<div key={clan.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center shadow-md hover:border-blue-500/50 transition-colors"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-2xl border border-slate-700">{clan.icon}</div><div><h3 className="font-bold text-white">{clan.name}</h3><div className="flex items-center gap-3 text-xs text-slate-400"><span className="flex items-center gap-1"><Users size={12}/> {clan.members}/50</span><span className="flex items-center gap-1"><Trophy size={12}/> Min: {clan.minRank}</span></div></div></div><button onClick={() => handleJoinClan(clan)} className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">Unirse</button></div>))}</div></div>);
};

// --- Component: Pack Opening Modal ---
const PackOpening = ({ cards, onClose, onInspect }: { cards: CardData[], onClose: () => void, onInspect: (c: CardData) => void }) => {
    const [step, setStep] = useState<'SEALED' | 'OPENING' | 'REVEALING' | 'FINISHED'>('SEALED');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleRip = () => { setStep('OPENING'); setTimeout(() => setStep('REVEALING'), 800); };
    const handleNextCard = () => { if (currentCardIndex < cards.length - 1) { setIsCardFlipped(false); setCurrentCardIndex(prev => prev + 1); } else { setStep('FINISHED'); } };

    const currentCard = cards[currentCardIndex];

    return (
        <div className="fixed inset-0 z-[70] bg-slate-950/95 flex flex-col items-center justify-center p-4 overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
             </div>

             {step === 'SEALED' || step === 'OPENING' ? (
                <div className="flex flex-col items-center z-10 animate-in zoom-in duration-500">
                     <h2 className="text-2xl text-white font-bold mb-8 uppercase tracking-widest animate-pulse">Toca para abrir</h2>
                     <div onClick={handleRip} className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${step === 'OPENING' ? 'animate-shake opacity-0' : 'animate-in fade-in'}`}><div className="w-64 h-96 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-lg shadow-[0_0_50px_rgba(234,179,8,0.4)] border-4 border-yellow-300 relative overflow-hidden flex items-center justify-center"><div className="absolute inset-0 foil-texture opacity-40"></div><div className="text-center z-10"><Star size={48} className="text-white drop-shadow-md mx-auto mb-4" /><h1 className="text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] italic transform -rotate-6">LEGENDARY</h1><h2 className="text-2xl font-bold text-white drop-shadow-md">PACK</h2></div></div></div>
                </div>
             ) : step === 'REVEALING' ? (
                 <div className="flex flex-col items-center z-20 w-full max-w-md">
                     <div className="text-white mb-4 font-bold tracking-widest text-lg">CARTA {currentCardIndex + 1} DE {cards.length}</div>
                     <div className="relative w-64 h-96 perspective-container cursor-pointer mb-8" onClick={() => setIsCardFlipped(true)}>
                         <div className={`w-full h-full transition-all duration-500 transform-style-3d ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                             <div className="absolute inset-0 backface-hidden"><div className="w-full h-full bg-blue-700 rounded-xl border-4 border-white shadow-2xl flex items-center justify-center bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-blue-500 to-blue-900"><div className="w-16 h-16 bg-red-500 rounded-full border-4 border-white shadow-inner"></div></div></div>
                             <div className="absolute inset-0 backface-hidden rotate-y-180"><div className="transform scale-125 origin-top"><Card card={currentCard} onInspect={onInspect} /></div></div>
                         </div>
                     </div>
                     {isCardFlipped && (
                         <div className="flex flex-col items-center gap-4 w-full animate-in slide-in-from-bottom-10 fade-in">
                             <button onClick={handleNextCard} className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black text-xl rounded-xl shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">SIGUIENTE <ArrowRight size={24} /></button>
                         </div>
                     )}
                 </div>
             ) : (
                 <div className="flex flex-col items-center animate-in zoom-in">
                      <h2 className="text-4xl font-black text-white mb-6">¡RESUMEN!</h2>
                      <div className="grid grid-cols-4 gap-2 mb-8 max-w-sm">
                          {cards.map((c, i) => (<div key={i} className="transform scale-75"><Card card={c} small onInspect={onInspect} /></div>))}
                      </div>
                      <button onClick={onClose} className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1">GUARDAR TODO</button>
                 </div>
             )}
        </div>
    );
};

// --- Component: Marketplace ---
const Marketplace = ({ profile, onBuy, onSell, onInspect }: { profile: PlayerProfile, onBuy: (listing: MarketListing) => void, onSell: (card: CardData) => void, onInspect: (c: CardData) => void }) => {
    const [view, setView] = useState<'BUY' | 'SELL'>('BUY');
    const [listings, setListings] = useState<MarketListing[]>([]);

    useEffect(() => {
        const fakeListings: MarketListing[] = Array.from({length: 6}).map(() => {
            const card = INITIAL_CARDS[Math.floor(Math.random() * INITIAL_CARDS.length)];
            const price = RARITY_PRICES[card.rarity] * (1 + Math.random() * 0.5); 
            return { id: simpleId(), sellerName: ['DarkKaiba', 'YugiBoy', 'AshK', 'MistyWater'][Math.floor(Math.random()*4)], card: {...card, id: simpleId()}, price: Math.floor(price) };
        });
        setListings(fakeListings);
    }, []);

    return (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 min-h-[400px]">
            <div className="flex gap-2 mb-4">
                <button onClick={() => setView('BUY')} className={`flex-1 py-2 rounded-lg font-bold ${view === 'BUY' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>COMPRAR</button>
                <button onClick={() => setView('SELL')} className={`flex-1 py-2 rounded-lg font-bold ${view === 'SELL' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>VENDER</button>
            </div>
            
            <div className="flex items-center justify-end mb-4 gap-2 bg-slate-800 p-2 rounded-lg">
                <span className="text-slate-400 text-xs font-bold uppercase">Tu Saldo:</span>
                <span className="text-cyan-400 font-black text-lg flex items-center gap-1">{profile.murCoins} <Hexagon size={16} className="fill-cyan-400/20" /></span>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {view === 'BUY' ? (
                    listings.map(listing => (
                        <div key={listing.id} className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex flex-col items-center">
                            <div className="transform scale-75 origin-top mb-[-20px]"><Card card={listing.card} small onInspect={onInspect} /></div>
                            <div className="w-full mt-2">
                                <div className="text-[10px] text-slate-500 mb-1">Vendedor: {listing.sellerName}</div>
                                <button onClick={() => { if(profile.murCoins >= listing.price) { onBuy(listing); setListings(p => p.filter(l => l.id !== listing.id)); } else alert("Faltan Mur Coins"); }} className="w-full py-1.5 bg-cyan-900 hover:bg-cyan-800 text-cyan-200 text-xs font-bold rounded flex items-center justify-center gap-1 border border-cyan-700">{listing.price} <Hexagon size={10} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    profile.collection.map((card, idx) => {
                        const sellPrice = RARITY_PRICES[card.rarity];
                        const inDeck = profile.deck.includes(card.id);
                        if (inDeck) return null;
                        return (
                            <div key={card.id + idx} className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex flex-col items-center relative">
                                <div className="transform scale-75 origin-top mb-[-20px]"><Card card={card} small onInspect={onInspect} /></div>
                                <div className="w-full mt-2">
                                    <button onClick={() => { if(confirm(`¿Vender ${card.name} por ${sellPrice} Mur Coins?`)) { onSell(card); } }} className="w-full py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 text-xs font-bold rounded flex items-center justify-center gap-1 border border-red-800">VENDER: {sellPrice} <Hexagon size={10} /></button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

// --- Component: BoosterPack ---
const BoosterPack = ({ type, price, currency, onClick }: { type: 'basic' | 'epic', price: number, currency: 'gold' | 'gems', onClick: () => void }) => {
    const isEpic = type === 'epic';
    return (
        <button 
            onClick={onClick}
            className={`relative group w-32 h-48 rounded-xl flex flex-col items-center justify-between p-2 shadow-xl transition-transform hover:scale-105 active:scale-95 border-2
                ${isEpic ? 'bg-gradient-to-b from-purple-900 to-indigo-900 border-purple-400' : 'bg-gradient-to-b from-slate-700 to-slate-900 border-slate-500'}
            `}
        >
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${isEpic ? 'bg-purple-500/20' : 'bg-white/10'}`}></div>
            
            <div className="w-full text-center z-10">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isEpic ? 'text-purple-300' : 'text-slate-300'}`}>
                    {isEpic ? 'Mítico' : 'Básico'}
                </span>
            </div>

            <div className="flex-1 flex items-center justify-center z-10">
                {isEpic ? (
                    <Star size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse" /> 
                ) : (
                    <Layers size={48} className="text-slate-300 drop-shadow-md" />
                )}
            </div>

            <div className={`w-full py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold z-10 ${isEpic ? 'bg-purple-950/80 text-purple-200' : 'bg-slate-950/80 text-slate-200'}`}>
                {price} {currency === 'gold' ? <Coins size={12} className="text-yellow-500" /> : <Gem size={12} className="text-cyan-400" />}
            </div>
        </button>
    );
};

// --- Component: Customize Modal ---
const CustomizeModal = ({ profile, setProfile, onClose }: { profile: PlayerProfile, setProfile: React.Dispatch<React.SetStateAction<PlayerProfile>>, onClose: () => void }) => {
    const [tab, setTab] = useState<'ARENA' | 'FRAME' | 'BANNER' | 'AVATAR'>('ARENA');

    const equip = (id: string) => {
        if (tab === 'ARENA') setProfile(p => ({...p, equippedArenaSkin: id}));
        if (tab === 'FRAME') setProfile(p => ({...p, equippedAvatarFrame: id}));
        if (tab === 'BANNER') setProfile(p => ({...p, equippedBanner: id}));
        if (tab === 'AVATAR') setProfile(p => ({...p, equippedAvatar: id}));
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md">
             <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[80vh]">
                 <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                     <h2 className="text-xl font-bold text-white flex items-center gap-2"><Palette size={20}/> Personalización</h2>
                     <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                 </div>
                 
                 <div className="flex p-2 gap-1 bg-slate-950 overflow-x-auto">
                     {[
                         {id: 'ARENA', icon: <ImageIcon size={14} />, label: 'Arena'},
                         {id: 'FRAME', icon: <Shield size={14} />, label: 'Marco'},
                         {id: 'BANNER', icon: <Flag size={14} />, label: 'Banner'},
                         {id: 'AVATAR', icon: <User size={14} />, label: 'Avatar'},
                     ].map(t => (
                         <button 
                            key={t.id} 
                            onClick={() => setTab(t.id as any)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                         >
                             {t.icon} {t.label}
                         </button>
                     ))}
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
                     {profile.ownedCosmetics.filter(id => COSMETICS[id]?.type.includes(tab === 'ARENA' ? 'ARENA_SKIN' : tab === 'FRAME' ? 'AVATAR_FRAME' : tab)).map(id => {
                         const item = COSMETICS[id];
                         if (!item) return null;
                         const isEquipped = (tab === 'ARENA' && profile.equippedArenaSkin === id) ||
                                            (tab === 'FRAME' && profile.equippedAvatarFrame === id) ||
                                            (tab === 'BANNER' && profile.equippedBanner === id) ||
                                            (tab === 'AVATAR' && profile.equippedAvatar === id);
                         
                         return (
                             <div key={id} onClick={() => equip(id)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${isEquipped ? 'border-green-500 bg-green-900/20' : 'border-slate-700 bg-slate-800 hover:border-blue-500'}`}>
                                 <div className="text-sm font-bold text-white mb-1">{item.name}</div>
                                 {tab === 'AVATAR' && <div className="text-4xl text-center my-2">{item.value}</div>}
                                 {tab === 'BANNER' && <div className={`h-8 w-full rounded my-2 ${item.value}`}></div>}
                                 {isEquipped && <div className="text-[10px] text-green-400 font-bold text-center">EQUIPADO</div>}
                             </div>
                         )
                     })}
                 </div>
             </div>
        </div>
    );
};

// --- Component: Deck Editor ---
const DeckEditor = ({ profile, setProfile, onInspect }: { profile: PlayerProfile, setProfile: React.Dispatch<React.SetStateAction<PlayerProfile>>, onInspect: (c: CardData) => void }) => {
    const deckCards = profile.deck.map(id => profile.collection.find(c => c.id === id)).filter(Boolean) as CardData[];
    const collectionCards = profile.collection.filter(c => !profile.deck.includes(c.id));

    const toggleCard = (card: CardData) => {
        const inDeck = profile.deck.includes(card.id);
        if (inDeck) {
            if (profile.deck.length > 1) { setProfile(p => ({ ...p, deck: p.deck.filter(id => id !== card.id) })); } else { alert("El mazo no puede estar vacío."); }
        } else {
            if (profile.deck.length < 5) { setProfile(p => ({ ...p, deck: [...p.deck, card.id] })); } else { alert("El mazo ya está lleno (Máx 5)."); }
        }
    };

    return (
        <div className="p-4 h-full flex flex-col animate-in fade-in">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center justify-between"><span>Tu Mazo</span><span className={`text-sm px-3 py-1 rounded-full ${deckCards.length === 5 ? 'bg-green-600' : 'bg-red-600'}`}>{deckCards.length}/5</span></h2>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mb-6 flex gap-2 overflow-x-auto min-h-[140px] items-center">
                {deckCards.length === 0 && <span className="text-slate-500 w-full text-center italic">Mazo vacío</span>}
                {deckCards.map(card => (<div key={card.id} className="relative group flex-shrink-0"><div className="transform scale-75 origin-center"><Card card={card} small onClick={() => toggleCard(card)} onInspect={onInspect} /></div><div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} className="text-white" /></div></div>))}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Colección</h3>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2 pb-20">
                {collectionCards.map(card => (<div key={card.id} className="relative group"><div className="transform scale-[0.8] origin-top-left"><Card card={card} small onClick={() => toggleCard(card)} onInspect={onInspect} /></div>{profile.deck.length < 5 && (<div className="absolute top-0 right-0 p-1 pointer-events-none"><PlusCircle className="text-green-400 drop-shadow-md" size={16} /></div>)}</div>))}
            </div>
        </div>
    );
};

// --- Battle Screen Logic (REDESIGNED YU-GI-OH STYLE) ---
const BattleScreen = ({ playerDeck, onExit, allCards, arenaLevel, profile, isFriendMatch, onInspect }: { playerDeck: string[], onExit: (win: boolean) => void, allCards: CardData[], arenaLevel: ArenaLevel, profile: PlayerProfile, isFriendMatch?: boolean, onInspect: (c: CardData) => void }) => {
    const [mana, setMana] = useState(1);
    const [enemyMana, setEnemyMana] = useState(1);
    // Increased health for YGO feel (LP 4000)
    const [playerHealth, setPlayerHealth] = useState(4000);
    const [enemyHealth, setEnemyHealth] = useState(4000);
    const [hand, setHand] = useState<CardData[]>([]);
    const [entities, setEntities] = useState<BattleEntity[]>([]);
    const [damageEvents, setDamageEvents] = useState<DamageEvent[]>([]);
    const [turn, setTurn] = useState<'PLAYER' | 'ENEMY'>('PLAYER');
    const [gameOver, setGameOver] = useState<'WIN' | 'LOSE' | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [skillAnim, setSkillAnim] = useState<string | null>(null);
    
    // New State for Mode Selection
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

    const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 3));

    // Initialize Battle
    useEffect(() => {
        const deckCards = playerDeck.map(id => allCards.find(c => c.id === id)).filter(Boolean) as CardData[];
        const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
        setHand(shuffled.slice(0, 3));
        addLog(isFriendMatch ? "¡Duelo Amistoso!" : "¡Duelo Iniciado!");
    }, []);

    // Helper: Play Card
    const playCard = (card: CardData, laneIndex: number, mode: 'ATTACK' | 'DEFENSE') => {
        if (mana < card.stats.cost) { addLog("¡Faltan orbes!"); return; }
        if (entities.some(e => e.laneIndex === laneIndex && e.owner === 'PLAYER')) { addLog("¡Zona ocupada!"); return; }

        setMana(p => p - card.stats.cost);
        setHand(p => p.filter(c => c.id !== card.id));
        const newEntity: BattleEntity = {
            instanceId: simpleId(),
            cardId: card.id,
            currentHealth: card.stats.health * 100, // Scaled up HP for YGO feel
            maxHealth: card.stats.health * 100,
            owner: 'PLAYER',
            laneIndex,
            canAttack: false,
            mode: mode
        };
        setEntities(p => [...p, newEntity]);
        addLog(`Invocación: ${card.name} (${mode === 'ATTACK' ? 'ATK' : 'DEF'})`);
        
        // Visual summon effect
        setSkillAnim(`¡INVOCACIÓN! ${card.name}`);
        setTimeout(() => setSkillAnim(null), 1500);

        setSelectedCard(null);
    };

    // Helper: Auto Play Card
    const handleAutoPlay = (mode: 'ATTACK' | 'DEFENSE') => {
        if (!selectedCard) return;
        const availableLanes = [0, 1, 2].filter(lane => !entities.some(e => e.laneIndex === lane && e.owner === 'PLAYER'));
        if (availableLanes.length === 0) {
            addLog("¡Campo lleno!");
            setSelectedCard(null);
            return;
        }
        let bestLane = availableLanes[0];
        if (mode === 'DEFENSE') {
            const blockingLane = availableLanes.find(lane => entities.some(e => e.laneIndex === lane && e.owner === 'ENEMY'));
            if (blockingLane !== undefined) bestLane = blockingLane;
        } else {
            const openLane = availableLanes.find(lane => !entities.some(e => e.laneIndex === lane && e.owner === 'ENEMY'));
            if (openLane !== undefined) bestLane = openLane;
        }
        playCard(selectedCard, bestLane, mode);
    };

    // Helper: End Turn & Combat
    const endTurn = async () => {
        setTurn('ENEMY');
        const newEntities = [...entities];
        let pHealth = playerHealth;
        let eHealth = enemyHealth;
        const events: DamageEvent[] = [];

        // 1. Player Units Attack
        for (const entity of newEntities.filter(e => e.owner === 'PLAYER' && e.mode === 'ATTACK')) {
             const target = newEntities.find(e => e.owner === 'ENEMY' && e.laneIndex === entity.laneIndex && e.currentHealth > 0);
             const card = allCards.find(c => c.id === entity.cardId);
             const dmg = (card ? card.stats.attack : 1) * 100; // Scaled DMG

             // Trigger skill visual
             setSkillAnim(`¡${card?.abilityName.toUpperCase()}!`);
             await new Promise(r => setTimeout(r, 500)); 
             setSkillAnim(null);

             if (target) {
                 if (target.mode === 'ATTACK') {
                    // YGO Logic: ATK vs ATK -> diff damage to LP? keeping simple for now
                    target.currentHealth -= dmg;
                    events.push({ id: target.instanceId, value: dmg, x: 0, y: 0, isPlayer: false });
                 } else {
                    // Defense mode absorbs dmg but doesn't hurt LP
                    const def = target.currentHealth; // Using HP as DEF for simplicity in this model
                    if (dmg > def) {
                        target.currentHealth = 0; // Destroyed
                        events.push({ id: target.instanceId, value: dmg, x: 0, y: 0, isPlayer: false });
                    }
                 }
             } else {
                 eHealth -= dmg;
                 events.push({ id: 'ENEMY_HERO', value: dmg, x: 0, y: 0, isPlayer: false });
             }
        }

        // 2. Enemy Units Attack
        for (const entity of newEntities.filter(e => e.owner === 'ENEMY')) {
            const target = newEntities.find(e => e.owner === 'PLAYER' && e.laneIndex === entity.laneIndex && e.currentHealth > 0);
             const card = ALL_CARDS.find(c => c.id === entity.cardId) || ALL_CARDS[0]; 
             const dmg = (card ? card.stats.attack : 1) * 100;

             if (target) {
                 target.currentHealth -= dmg;
                 events.push({ id: target.instanceId, value: dmg, x: 0, y: 0, isPlayer: true });
             } else {
                 pHealth -= dmg;
                 events.push({ id: 'PLAYER_HERO', value: dmg, x: 0, y: 0, isPlayer: true });
             }
        }

        setDamageEvents(events);
        await new Promise(r => setTimeout(r, 600));

        setEntities(newEntities.filter(e => e.currentHealth > 0));
        setPlayerHealth(pHealth);
        setEnemyHealth(eHealth);
        setDamageEvents([]);

        if (pHealth <= 0) { setGameOver('LOSE'); return; }
        if (eHealth <= 0) { setGameOver('WIN'); return; }

        await new Promise(r => setTimeout(r, 1000));
        
        // Enemy Logic
        const emptyLanes = [0, 1, 2].filter(l => !newEntities.some(e => e.owner === 'ENEMY' && e.laneIndex === l));
        if (emptyLanes.length > 0 && enemyMana >= 2) {
            const lane = emptyLanes[Math.floor(Math.random() * emptyLanes.length)];
            // Enemy draws from ALL unlocked cards generically for now
            const randomCard = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
            const enemyEntity: BattleEntity = {
                instanceId: simpleId(),
                cardId: randomCard.id,
                currentHealth: randomCard.stats.health * 100,
                maxHealth: randomCard.stats.health * 100,
                owner: 'ENEMY',
                laneIndex: lane,
                canAttack: false,
                mode: 'ATTACK'
            };
            setEntities(p => [...p, enemyEntity]);
            addLog(`Enemigo jugó ${randomCard.name}`);
        }

        setTurn('PLAYER');
        setMana(p => Math.min(MAX_MANA, p + 2));
        setEnemyMana(p => Math.min(MAX_MANA, p + 2));
        if (hand.length < 5) {
             const deckCards = playerDeck.map(id => allCards.find(c => c.id === id)).filter(Boolean) as CardData[];
             const nextCard = deckCards[Math.floor(Math.random() * deckCards.length)];
             if (nextCard) setHand(p => [...p, nextCard]);
        }
    };

    // Render YGO Style
    return (
        <div className={`flex flex-col h-full relative overflow-hidden bg-[url('https://img.freepik.com/free-vector/cyber-grid-background_23-2148080646.jpg')] bg-cover bg-center font-mono`}>
             <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]"></div>
             
             {/* Skill Animation Overlay */}
             {skillAnim && (
                 <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
                     <div className="text-4xl font-black text-white italic bg-gradient-to-r from-transparent via-red-600 to-transparent w-full text-center py-4 animate-in slide-in-from-left duration-300 drop-shadow-[0_0_10px_red]">
                         {skillAnim}
                     </div>
                 </div>
             )}

             {/* Game Over Overlay */}
             {gameOver && (
                 <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center animate-in zoom-in">
                     <h1 className={`text-6xl font-black mb-4 ${gameOver === 'WIN' ? 'text-yellow-400' : 'text-red-500'}`}>
                         {gameOver === 'WIN' ? '¡VICTORIA!' : 'DERROTA'}
                     </h1>
                     <button onClick={() => onExit(gameOver === 'WIN')} className="px-8 py-3 bg-white text-black font-bold rounded-xl text-xl hover:scale-105 transition-transform">
                         CONTINUAR
                     </button>
                 </div>
             )}

             {/* Mode Selection Modal */}
             {selectedCard && (
                 <div className="absolute inset-0 z-[90] bg-black/80 flex flex-col items-center justify-center animate-in fade-in backdrop-blur-sm p-6">
                     <h2 className="text-3xl font-black text-white mb-8 drop-shadow-lg text-center font-sans">POSICIÓN DE BATALLA</h2>
                     <div className="flex gap-6 w-full max-w-sm">
                         <button onClick={() => handleAutoPlay('ATTACK')} className="flex-1 bg-red-600 border-4 border-red-800 rounded-2xl p-6 flex flex-col items-center gap-4 transition-transform hover:scale-105 shadow-[0_0_30px_red]">
                             <Swords size={64} className="text-white" />
                             <span className="text-2xl font-black text-white uppercase">ATAQUE</span>
                         </button>
                         <button onClick={() => handleAutoPlay('DEFENSE')} className="flex-1 bg-blue-600 border-4 border-blue-800 rounded-2xl p-6 flex flex-col items-center gap-4 transition-transform hover:scale-105 shadow-[0_0_30px_blue]">
                             <Shield size={64} className="text-white" />
                             <span className="text-2xl font-black text-white uppercase">DEFENSA</span>
                         </button>
                     </div>
                     <button onClick={() => setSelectedCard(null)} className="mt-8 text-slate-400 hover:text-white flex items-center gap-2"><X size={20} /> CANCELAR</button>
                 </div>
             )}

             {/* Top Bar (Enemy LP) */}
             <div className="p-4 flex justify-between items-start z-10">
                 <div className="flex flex-col items-start">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-slate-900 flex items-center justify-center"><Skull className="text-red-500" size={20}/></div>
                        <span className="text-red-400 font-bold bg-black/50 px-2 rounded">{isFriendMatch ? "RIVAL" : "ENEMIGO"}</span>
                     </div>
                     <div className="relative bg-gradient-to-r from-red-900 to-black px-6 py-2 rounded-r-full border-l-4 border-red-500 shadow-[0_0_15px_red] w-48">
                         <span className="text-3xl font-black text-white tracking-widest tabular-nums">LP {enemyHealth}</span>
                         {damageEvents.find(e => e.id === 'ENEMY_HERO') && <div className="absolute right-2 top-0 text-red-400 font-bold animate-ping">-{damageEvents.find(e => e.id === 'ENEMY_HERO')?.value}</div>}
                     </div>
                 </div>
                 {/* Enemy Hand (Backs) */}
                 <div className="flex gap-1">
                     {[...Array(3)].map((_, i) => <div key={i} className="w-10 h-14 bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-400 rounded shadow-lg"></div>)}
                 </div>
             </div>

             {/* Battlefield 3D */}
             <div className="flex-1 relative perspective-field flex items-center justify-center my-4 overflow-visible">
                 <div className="field-grid w-full max-w-sm h-full grid grid-cols-3 gap-x-6 gap-y-12 p-8 transform rotate-x-60">
                     {/* Lanes */}
                     {[0, 1, 2].map(lane => {
                         const playerEntity = entities.find(e => e.laneIndex === lane && e.owner === 'PLAYER');
                         const enemyEntity = entities.find(e => e.laneIndex === lane && e.owner === 'ENEMY');
                         
                         const pCard = playerEntity ? allCards.find(c => c.id === playerEntity.cardId) : null;
                         const eCard = enemyEntity ? ALL_CARDS.find(c => c.id === enemyEntity.cardId) || ALL_CARDS[0] : null;

                         return (
                             <div key={lane} className="relative h-full flex flex-col justify-between py-2 group">
                                 {/* Enemy Zone */}
                                 <div className="w-full aspect-[3/4] border-2 border-red-500/30 bg-red-900/10 rounded-lg relative flex items-center justify-center shadow-[0_0_10px_inset_rgba(220,38,38,0.2)]">
                                     {enemyEntity && eCard && (
                                         <div className="transform scale-75 rotate-180 relative transition-all duration-300">
                                              <Card card={eCard} small isEnemy onInspect={onInspect} />
                                              <div className="absolute -bottom-4 w-full text-center bg-black/70 text-red-400 text-[10px] font-bold border border-red-500 rounded">ATK/{eCard.stats.attack * 100}</div>
                                         </div>
                                     )}
                                 </div>

                                 {/* Connector Line (Holo) */}
                                 <div className="w-0.5 h-12 bg-gradient-to-b from-red-500/0 via-cyan-400/50 to-blue-500/0 self-center opacity-30"></div>

                                 {/* Player Zone */}
                                 <div 
                                    className={`w-full aspect-[3/4] border-2 rounded-lg relative flex items-center justify-center transition-all duration-500
                                        ${playerEntity ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_20px_inset_rgba(34,211,238,0.3)]' : 'border-slate-600/30 bg-slate-900/20'}
                                    `}
                                 >
                                     {playerEntity && pCard && (
                                         <div className={`relative w-full h-full flex items-center justify-center`}>
                                            <div className={`absolute inset-0 z-20 transform transition-all duration-500 card-3d-summon ${playerEntity.mode === 'DEFENSE' ? 'rotate-[-90deg] scale-90 grayscale-[0.3]' : 'scale-100'}`}>
                                                <Card card={pCard} small onInspect={onInspect} />
                                                <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-16 text-center bg-black/80 text-[8px] font-bold border rounded px-1
                                                    ${playerEntity.mode === 'DEFENSE' ? 'border-blue-500 text-blue-300' : 'border-red-500 text-red-300'}
                                                `}>
                                                    {playerEntity.mode === 'DEFENSE' ? `DEF/${pCard.stats.defense * 100}` : `ATK/${pCard.stats.attack * 100}`}
                                                </div>
                                            </div>
                                            {/* Shockwave Effect */}
                                            <div className="summon-shockwave z-10"></div>
                                         </div>
                                     )}
                                 </div>
                             </div>
                         )
                     })}
                 </div>
             </div>

             {/* Bottom Bar (Player) - Duel Disk Style */}
             <div className="bg-slate-900 border-t-2 border-cyan-600 relative z-20 pb-4 pt-2 px-2 shadow-[0_-10px_30px_rgba(8,145,178,0.3)]">
                 {/* Player Info & LP */}
                 <div className="flex justify-between items-end mb-3 px-2">
                     <div className="relative bg-gradient-to-l from-blue-900 to-black px-6 py-2 rounded-l-full border-r-4 border-cyan-500 shadow-[0_0_15px_cyan] w-48 text-right">
                         <span className="text-3xl font-black text-white tracking-widest tabular-nums">LP {playerHealth}</span>
                         {damageEvents.find(e => e.id === 'PLAYER_HERO') && <div className="absolute left-2 top-0 text-red-400 font-bold animate-ping">-{damageEvents.find(e => e.id === 'PLAYER_HERO')?.value}</div>}
                     </div>
                     
                     <div className="flex flex-col items-end gap-1">
                         <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded border border-cyan-500/50">
                             <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                             <span className="text-cyan-200 text-xs font-bold tracking-widest">ORBES: {mana}/{MAX_MANA}</span>
                         </div>
                         <button 
                             onClick={endTurn}
                             disabled={turn !== 'PLAYER'}
                             className={`px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest clip-path-polygon shadow-lg transition-all
                                 ${turn === 'PLAYER' ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_yellow]' : 'bg-slate-800 text-slate-600'}
                             `}
                         >
                             {turn === 'PLAYER' ? 'Battle Phase' : 'Enemy Turn'}
                         </button>
                     </div>
                 </div>

                 {/* Hand */}
                 <div className="flex justify-center gap-2 overflow-x-auto pb-2 min-h-[140px] px-4">
                     {hand.map(card => (
                         <div key={card.id} className="relative group">
                             <div className={`transform transition-transform duration-200 ${selectedCard?.id === card.id ? '-translate-y-8 scale-110 z-50 drop-shadow-[0_10px_20px_rgba(255,255,0,0.5)]' : 'hover:-translate-y-4'}`}>
                                 <Card 
                                    card={card} 
                                    small 
                                    onInspect={onInspect}
                                    onClick={() => {
                                        if (turn === 'PLAYER' && mana >= card.stats.cost) {
                                            setSelectedCard(card);
                                        } else if (mana < card.stats.cost) {
                                            addLog("Falta maná");
                                        }
                                    }} 
                                 />
                             </div>
                             {selectedCard?.id === card.id && (
                                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg animate-bounce uppercase">
                                     Select
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [screen, setScreen] = useState<ScreenState>('SPLASH'); // START AT SPLASH
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

    // STATE FOR INSPECTION
    const [inspectingCard, setInspectingCard] = useState<CardData | null>(null);
    const handleInspect = (card: CardData) => setInspectingCard(card);

    // --- SPLASH SCREEN TIMER ---
    useEffect(() => {
        if (screen === 'SPLASH') {
            const timer = setTimeout(() => {
                setScreen('HOME');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    const handleOpenPack = (isEpic: boolean) => {
        const price = isEpic ? 200 : 100;
        const currency = isEpic ? 'gems' : 'gold';
        const cost = isEpic ? 50 : 500;
        if (currency === 'gems' && profile.gems < cost) return alert("No tienes suficientes gemas.");
        if (currency === 'gold' && profile.gold < cost) return alert("No tienes suficiente oro.");
        setProfile(p => ({ ...p, gold: currency === 'gold' ? p.gold - cost : p.gold, gems: currency === 'gems' ? p.gems - cost : p.gems }));
        
        // --- LOGIC CHANGE: Unlock cards based on Unlocked Arenas ---
        // Determine the highest arena index unlocked based on rankPoints
        const highestArenaIndex = ARENAS.findIndex(a => a.minRankPoints > profile.rankPoints);
        const maxArenaId = highestArenaIndex === -1 ? ARENAS[ARENAS.length - 1].id : ARENAS[Math.max(0, highestArenaIndex - 1)].id;
        
        // Filter cards that belong to unlocked arenas (1 to maxArenaId)
        const availablePool = ALL_CARDS.filter(c => c.arenaId <= maxArenaId);
        
        // If pool is somehow empty (shouldn't happen), fallback to all cards
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

    // --- NEW SUBSCRIPTION LOGIC ---
    const handleSubscribe = () => {
        if(confirm("¿Confirmar suscripción mensual por $2.99? (Simulación)")) {
            // Simulate payment processing
            setIsForging(true); // Reuse loading state temporarily
            setTimeout(() => {
                setProfile(p => ({
                    ...p,
                    unlockedForge: true,
                    labSubscriptionExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 Days
                }));
                setIsForging(false);
                alert("¡Bienvenido al Club de Forja! Suscripción activada.");
            }, 1500);
        }
    };

    const handleForge = async () => {
        if (!forgePrompt.trim()) return;
        // Logic changed: Check subscription instead of gems
        if (!profile.unlockedForge) return alert("Necesitas una suscripción activa.");

        setIsForging(true);
        // Removed gem deduction
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
                arenaId: 1 // Forged cards available immediately
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
                         <div className="absolute bottom-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                             Powered by Gemini AI
                         </div>
                    </div>
                );
            case 'HOME':
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 relative z-10 animate-in fade-in">
                        <div className="text-center mb-8">
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] tracking-tighter">MuR</h1>
                            <p className="text-slate-400 tracking-[0.5em] text-xs uppercase font-bold">Trading Card Game</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
                            <button onClick={() => setScreen('BATTLE')} className="col-span-2 py-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center hover:scale-[1.02] transition-transform group border border-red-400/30">
                                <Swords size={40} className="text-white mb-2 group-hover:rotate-12 transition-transform" /><span className="text-2xl font-black text-white italic tracking-wider">JUGAR</span><span className="text-[10px] text-red-200 font-bold bg-red-900/40 px-2 py-0.5 rounded mt-1">CLASIFICATORIA</span>
                            </button>
                            <button onClick={() => setScreen('DECK')} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors flex flex-col items-center gap-2 group"><Layers size={24} className="text-blue-400 group-hover:scale-110 transition-transform"/><span className="font-bold text-slate-200">Mazo</span></button>
                            <button onClick={() => setScreen('SHOP')} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-yellow-500 transition-colors flex flex-col items-center gap-2 group"><Store size={24} className="text-yellow-400 group-hover:scale-110 transition-transform"/><span className="font-bold text-slate-200">Tienda</span></button>
                            <button onClick={() => setScreen('CLANS')} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-green-500 transition-colors flex flex-col items-center gap-2 group"><Users size={24} className="text-green-400 group-hover:scale-110 transition-transform"/><span className="font-bold text-slate-200">Clanes</span></button>
                            <button onClick={() => setScreen('FORGE')} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors flex flex-col items-center gap-2 group"><Zap size={24} className="text-purple-400 group-hover:scale-110 transition-transform"/><span className="font-bold text-slate-200">Forja AI</span></button>
                        </div>
                    </div>
                );
            case 'BATTLE':
               const currentArena = ARENAS.find(a => a.minRankPoints <= profile.rankPoints) || ARENAS[0];
               return (
                   <BattleScreen 
                      playerDeck={profile.deck}
                      allCards={profile.collection}
                      arenaLevel={currentArena}
                      profile={profile}
                      onInspect={handleInspect}
                      onExit={(win) => {
                          setScreen('HOME');
                          if (win) { setProfile(p => ({ ...p, gold: p.gold + 50, rankPoints: p.rankPoints + 25 })); alert("¡Victoria!"); } 
                          else { setProfile(p => ({ ...p, gold: p.gold + 10, rankPoints: Math.max(0, p.rankPoints - 15) })); alert("Derrota..."); }
                      }}
                   />
               );
            case 'DECK':
                return (
                    <div className="h-full flex flex-col">
                        <div className="p-4 flex items-center gap-4 border-b border-slate-800"><button onClick={() => setScreen('HOME')} className="p-2 bg-slate-800 rounded-full"><ArrowRight className="rotate-180 text-white" /></button><h2 className="text-xl font-bold text-white">Editar Mazo</h2></div>
                        <DeckEditor profile={profile} setProfile={setProfile} onInspect={handleInspect} />
                    </div>
                );
            case 'SHOP':
                return (
                    <div className="h-full flex flex-col p-4 overflow-y-auto">
                        <div className="flex items-center gap-4 mb-6"><button onClick={() => setScreen('HOME')} className="p-2 bg-slate-800 rounded-full"><ArrowRight className="rotate-180 text-white" /></button><h2 className="text-xl font-bold text-white">Mercado Negro</h2></div>
                        <div className="mb-8"><h3 className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-wider">Paquetes de Cartas</h3><div className="flex gap-4"><BoosterPack type="basic" price={500} currency="gold" onClick={() => handleOpenPack(false)} /><BoosterPack type="epic" price={50} currency="gems" onClick={() => handleOpenPack(true)} /></div></div>
                        <div className="mb-4"><h3 className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-wider">Mercado de Jugadores</h3><Marketplace profile={profile} onBuy={(listing) => { setProfile(p => ({...p, murCoins: p.murCoins - listing.price, collection: [...p.collection, listing.card]})); alert(`¡Compraste ${listing.card.name}!`); }} onSell={(card) => { const price = RARITY_PRICES[card.rarity]; setProfile(p => ({...p, murCoins: p.murCoins + price, collection: p.collection.filter(c => c.id !== card.id)})); alert("Carta vendida."); }} onInspect={handleInspect} /></div>
                    </div>
                );
            case 'CLANS': return <ClanScreen profile={profile} setProfile={setProfile} onBack={() => setScreen('HOME')} />;
            case 'FORGE':
                return (
                    <div className="h-full flex flex-col p-6 animate-in fade-in bg-slate-950">
                         <div className="flex items-center gap-4 mb-6"><button onClick={() => setScreen('HOME')} className="p-2 bg-slate-800 rounded-full"><ArrowRight className="rotate-180 text-white" /></button><h2 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-purple-400"/> Forja GenAI</h2></div>
                        
                        {/* --- Subscription Logic / Paywall --- */}
                        {!profile.unlockedForge ? (
                             <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center mt-10">
                                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-purple-500 shadow-[0_0_20px_purple]">
                                     <Lock size={32} className="text-purple-400" />
                                 </div>
                                 <div>
                                     <h3 className="text-2xl font-black text-white">Laboratorio Cerrado</h3>
                                     <p className="text-slate-400 max-w-xs mx-auto">Suscríbete para acceder a la tecnología de generación de cartas con IA.</p>
                                 </div>
                                 <button onClick={handleSubscribe} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border border-purple-400/50">
                                     <Zap size={18} className="fill-white" /> Suscribirse ($2.99/mes)
                                 </button>
                             </div>
                        ) : (
                             <div className="flex-1 flex flex-col space-y-4">
                                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-xl">
                                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><Zap size={12} className="text-yellow-400"/> Prompt de la Carta</label>
                                     <textarea 
                                         value={forgePrompt}
                                         onChange={(e) => setForgePrompt(e.target.value)}
                                         placeholder="Ej: Un dragón mecánico que escupe láseres..."
                                         className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white h-32 focus:border-purple-500 outline-none resize-none placeholder-slate-600"
                                     />
                                     <div className="flex justify-between items-center mt-2">
                                         <span className="text-[10px] text-green-400 font-bold uppercase border border-green-500/30 bg-green-900/20 px-2 py-0.5 rounded">Suscripción Activa</span>
                                         <button 
                                             onClick={handleForge}
                                             disabled={isForging || !forgePrompt.trim()}
                                             className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isForging || !forgePrompt.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_purple]'}`}
                                         >
                                             {isForging ? <span className="animate-spin">🌀</span> : <Zap size={16} className="fill-white"/>} 
                                             {isForging ? 'Forjando...' : 'GENERAR'}
                                         </button>
                                     </div>
                                 </div>
 
                                 {generatedCard && (
                                     <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom fade-in py-4">
                                         <h3 className="text-white font-black uppercase mb-4 tracking-widest text-center">¡Resultado!</h3>
                                         <div className="mb-6 transform scale-100">
                                            {/* We create a temporary CardData object to preview */}
                                            {generatedCard.name && generatedCard.stats && (
                                                <div className="pointer-events-none">
                                                    <Card card={{
                                                        ...generatedCard, 
                                                        id: 'temp', 
                                                        imageUrl: `https://source.unsplash.com/random/400x600/?monster,${generatedCard.name}`, 
                                                        arenaId: 1, 
                                                        abilityName: 'Habilidad Nueva',
                                                        element: ElementType.NORMAL
                                                    } as CardData} disabled />
                                                </div>
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
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-full bg-black text-slate-200 font-sans overflow-hidden relative select-none">
            <BackgroundParticles />
            
            {/* Top Bar (Global) */}
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
                         <div className="flex items-center gap-1 mt-0.5">
                             <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><div className="h-full bg-blue-500 w-[60%]"></div></div>
                         </div>
                     </div>
                 </div>

                 <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                         <Coins size={14} className="text-yellow-500 fill-yellow-500" />
                         <span className="text-xs font-black text-yellow-100">{profile.gold}</span>
                     </div>
                     <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                         <Gem size={14} className="text-cyan-400 fill-cyan-400" />
                         <span className="text-xs font-black text-cyan-100">{profile.gems}</span>
                     </div>
                 </div>
            </div>
            )}

            {/* Main Content Area */}
            <div className={`w-full h-full ${screen === 'SPLASH' ? 'pt-0' : 'pt-14'} pb-0 relative z-0`}>
                {renderScreen()}
            </div>

            {/* Overlays */}
            {openedPackCards && <PackOpening cards={openedPackCards} onClose={() => setOpenedPackCards(null)} onInspect={handleInspect} />}
            {showCustomize && <CustomizeModal profile={profile} setProfile={setProfile} onClose={() => setShowCustomize(false)} />}
            {inspectingCard && <CardDetailModal card={inspectingCard} onClose={() => setInspectingCard(null)} />}
        </div>
    );
};

export default App;
