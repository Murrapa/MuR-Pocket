
import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, ScreenState, CardData, Rarity, BattleEntity, ElementType, ArenaLevel, DamageEvent, Cosmetic, MarketListing, Clan, ClanChatMessage, VisualEffect, BattlePassReward } from './types';
import { ALL_CARDS, INITIAL_CARDS, MAX_MANA, LANE_COUNT, ARENAS, ELEMENT_ICONS, BATTLE_PASS_REWARDS, COSMETICS, RARITY_PRICES } from './constants';
import { Card } from './components/Card';
import { generateCardFromPrompt } from './services/gemini';
import { Coins, Gem, Zap, Swords, User, Shield, Trophy, Users, Star, Gift, ArrowRight, Lock, LogOut, Disc, Search, ShoppingBag, Crown, Palette, Hexagon, DollarSign, Store, Layers, Gamepad2, Flag, Image as ImageIcon, Trash2, PlusCircle, CheckCircle, Skull, Heart, X, CreditCard, Calendar, MessageSquare, Globe, LogIn, Activity, Flame, Infinity, Clock, PlayCircle, Tag, LockOpen, Wallet, QrCode, ArrowUpRight, Mail, Bitcoin, Link as LinkIcon, Power, Monitor, Smartphone, ChevronDown, RefreshCw, Copy, Timer, Puzzle, Repeat, ArrowLeftRight, Tv, Video, TrendingUp, Medal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const simpleId = () => Math.random().toString(36).substr(2, 9);
const TREASURY_ADDRESS = "0x4ebd9cd06bdf2d8ee736c6ad58c0c11563f7600c";

// --- Component: Background Particles ---
const BackgroundParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950">
            {[...Array(20)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-white/5 rounded-full animate-float-particle"
                    style={{
                        width: Math.random() * 6 + 2 + 'px',
                        height: Math.random() * 6 + 2 + 'px',
                        left: Math.random() * 100 + '%',
                        animationDuration: Math.random() * 20 + 10 + 's',
                        animationDelay: Math.random() * 5 + 's'
                    }}
                ></div>
            ))}
        </div>
    );
};

// --- Component: Ad Watch Modal ---
const AdWatchModal = ({ onClose, onReward }: { onClose: () => void, onReward: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCompleted(true);
        }
    }, [timeLeft]);

    const handleClaim = () => {
        onReward();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center animate-in fade-in">
            <div className="absolute top-4 right-4 bg-slate-800/80 px-4 py-2 rounded-full text-white font-bold text-sm border border-slate-600">
                {completed ? "Recompensa Lista" : `Cerrar en ${timeLeft}s`}
            </div>
            
            <div className="w-full max-w-lg aspect-video bg-slate-900 border-2 border-slate-700 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-8 text-center shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20 animate-pulse"></div>
                 <Tv size={64} className="text-slate-500 mb-4" />
                 <h2 className="text-2xl font-black text-white uppercase mb-2">Publicidad Patrocinada</h2>
                 <p className="text-slate-400 mb-6 max-w-xs mx-auto">Viendo este anuncio apoyas el desarrollo del juego y generas ingresos para la tesorería comunitaria.</p>
                 
                 <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                     <div className="h-full bg-green-500 transition-all duration-1000 ease-linear" style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}></div>
                 </div>
                 <div className="text-[10px] text-slate-500 font-mono">Revenue Stream ID: {TREASURY_ADDRESS.substring(0,10)}...</div>

                 {completed && (
                     <button onClick={handleClaim} className="absolute inset-0 z-20 bg-green-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in zoom-in">
                         <CheckCircle size={48} className="mb-2" />
                         <span className="font-black text-xl uppercase">Reclamar Recompensa</span>
                     </button>
                 )}
            </div>
        </div>
    );
};

// --- Component: Crypto Exchange Modal ---
const ExchangeModal = ({ profile, setProfile, onClose }: any) => {
    const [direction, setDirection] = useState<'MUR_TO_USDT' | 'USDT_TO_MUR'>('MUR_TO_USDT');
    const [amount, setAmount] = useState<string>('');
    const RATE = 0.5; // 1 MuR = 0.5 USDT

    const convertedAmount = parseFloat(amount) * (direction === 'MUR_TO_USDT' ? RATE : 1/RATE);

    const handleSwap = () => {
        const val = parseFloat(amount);
        if(!val || val <= 0) return;

        if (direction === 'MUR_TO_USDT') {
            if (profile.murCoins < val) return alert("Saldo insuficiente de MuRCoins");
            // Simulate sending funds
            alert(`Has intercambiado ${val} MuR por ${convertedAmount.toFixed(2)} USDT. (Fondos enviados a Cwallet)`);
            setProfile((p: any) => ({ ...p, murCoins: p.murCoins - val }));
        } else {
             // Simulate receiving funds
             alert(`Has intercambiado ${val} USDT por ${convertedAmount.toFixed(2)} MuRCoins.`);
             setProfile((p: any) => ({ ...p, murCoins: p.murCoins + convertedAmount }));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                <h2 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2">
                    <ArrowLeftRight className="text-cyan-400"/> Exchange Crypto
                </h2>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                    {/* From */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Vender</span>
                            <span>Saldo: {direction === 'MUR_TO_USDT' ? profile.murCoins.toFixed(2) : '1000.00'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent w-full text-white font-bold outline-none text-lg"
                            />
                            <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded text-xs font-bold text-white">
                                {direction === 'MUR_TO_USDT' ? <Hexagon size={12} className="text-pink-400 fill-pink-400"/> : <DollarSign size={12} className="text-green-400"/>}
                                {direction === 'MUR_TO_USDT' ? 'MUR' : 'USDT'}
                            </div>
                        </div>
                    </div>

                    {/* Switcher */}
                    <div className="flex justify-center">
                        <button onClick={() => setDirection(d => d === 'MUR_TO_USDT' ? 'USDT_TO_MUR' : 'MUR_TO_USDT')} className="bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition-colors border border-slate-600">
                            <ArrowUpRight size={16} className="text-white"/>
                        </button>
                    </div>

                    {/* To */}
                    <div>
                         <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Recibir (Estimado)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                             <div className="w-full text-slate-300 font-bold text-lg">{isNaN(convertedAmount) ? '0.00' : convertedAmount.toFixed(2)}</div>
                             <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded text-xs font-bold text-white">
                                {direction === 'MUR_TO_USDT' ? <DollarSign size={12} className="text-green-400"/> : <Hexagon size={12} className="text-pink-400 fill-pink-400"/>}
                                {direction === 'MUR_TO_USDT' ? 'USDT' : 'MUR'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-[10px] text-center text-slate-500 mb-4">
                    Tasa de cambio: 1 MUR = {RATE} USDT <br/>
                    Red Ethereum (ERC20)
                </div>

                <button onClick={handleSwap} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold uppercase shadow-lg shadow-cyan-500/20">
                    Confirmar Canje
                </button>
            </div>
        </div>
    );
};

// --- Component: Cwallet Payment Modal ---
const CwalletPaymentModal = ({ request, onClose }: { request: { amount: number, item: string, currency: string, onSuccess: () => void }, onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [copied, setCopied] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(TREASURY_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = () => {
        setVerifying(true);
        // Simulate Blockchain Verification
        setTimeout(() => {
            setVerifying(false);
            setStep(2);
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in">
             <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                
                {step === 1 ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 mb-4 border border-blue-500/50">
                                <Wallet size={32}/>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase">Cwallet Checkout</h2>
                            <p className="text-blue-300 font-bold">{request.item}</p>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs text-slate-500 uppercase font-bold">Total a Pagar</span>
                                <span className="text-2xl font-black text-white">{request.amount} {request.currency}</span>
                            </div>
                            <div className="w-full h-px bg-slate-800 my-3"></div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase font-bold block">Red / Network</span>
                                <div className="flex items-center gap-2 text-white font-mono text-sm">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div> Ethereum (ERC20)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Dirección de Depósito</label>
                            <div onClick={handleCopy} className="bg-slate-800 border border-slate-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors group">
                                <code className="text-[10px] md:text-xs text-slate-300 font-mono break-all mr-2">{TREASURY_ADDRESS}</code>
                                <div className="text-slate-500 group-hover:text-white">
                                    {copied ? <CheckCircle size={16} className="text-green-500"/> : <Copy size={16}/>}
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-slate-500">
                                Envía exactamente <span className="text-white font-bold">{request.amount} {request.currency}</span> a esta dirección.
                            </p>
                        </div>

                        <button 
                            onClick={handleVerify} 
                            disabled={verifying}
                            className={`w-full py-4 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-2 ${verifying ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
                        >
                            {verifying ? <RefreshCw className="animate-spin"/> : 'He realizado el pago'}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-6 border border-green-500/50">
                            <CheckCircle size={40}/>
                        </div>
                        <h3 className="text-white font-black text-2xl mb-2">¡Pago Confirmado!</h3>
                        <p className="text-slate-400 text-sm mb-6">Tu transacción ha sido verificada en la blockchain.</p>
                        <button onClick={() => { request.onSuccess(); onClose(); }} className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl text-white font-bold">
                            Continuar
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};

// --- Component: Web3 Connection Modal ---
const Web3ConnectModal = ({ onClose, onConnect }: { onClose: () => void, onConnect: (type: string, address: string) => void }) => {
    const [tab, setTab] = useState<'WALLET' | 'BROKER' | 'SOCIAL'>('WALLET');
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = (type: string) => {
        setIsConnecting(true);
        // Simulate connection delay
        setTimeout(() => {
            const mockAddress = type === 'EMAIL' ? 'usuario@gmail.com' : `0x${simpleId()}${simpleId()}...${simpleId()}`;
            onConnect(type, mockAddress);
            setIsConnecting(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in">
            <div className="absolute top-4 right-4">
                <button onClick={onClose} className="p-2 bg-slate-800 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-6 bg-slate-900 border-b border-slate-800">
                    <h2 className="text-2xl font-black text-white italic tracking-wide text-center">CONECTAR</h2>
                    <p className="text-center text-slate-400 text-sm mt-1">Accede al ecosistema Web3 de MuR</p>
                </div>

                <div className="flex border-b border-slate-800">
                    <button onClick={() => setTab('WALLET')} className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${tab === 'WALLET' ? 'bg-cyan-900/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Wallets</button>
                    <button onClick={() => setTab('BROKER')} className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${tab === 'BROKER' ? 'bg-yellow-900/20 text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}>Brokers</button>
                    <button onClick={() => setTab('SOCIAL')} className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${tab === 'SOCIAL' ? 'bg-pink-900/20 text-pink-400 border-b-2 border-pink-400' : 'text-slate-500 hover:text-slate-300'}`}>Social</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {isConnecting ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-white font-bold animate-pulse">Estableciendo conexión segura...</div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tab === 'WALLET' && (
                                <>
                                    <button onClick={() => handleConnect('METAMASK')} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between border border-slate-700 transition-all hover:border-orange-500 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🦊</div>
                                            <div className="text-left">
                                                <div className="text-white font-bold group-hover:text-orange-400 transition-colors">MetaMask</div>
                                                <div className="text-xs text-slate-500">EVM Networks</div>
                                            </div>
                                        </div>
                                        <ArrowRight className="text-slate-600 group-hover:text-orange-400" />
                                    </button>
                                    <button onClick={() => handleConnect('PHANTOM')} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between border border-slate-700 transition-all hover:border-purple-500 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center text-2xl">👻</div>
                                            <div className="text-left">
                                                <div className="text-white font-bold group-hover:text-purple-400 transition-colors">Phantom</div>
                                                <div className="text-xs text-slate-500">Solana Network</div>
                                            </div>
                                        </div>
                                        <ArrowRight className="text-slate-600 group-hover:text-purple-400" />
                                    </button>
                                </>
                            )}
                            {tab === 'BROKER' && (
                                <>
                                    <button onClick={() => handleConnect('CWALLET')} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between border border-slate-700 transition-all hover:border-blue-500 group">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">C</div>
                                        <div className="text-left flex-1 ml-3">
                                            <div className="text-white font-bold group-hover:text-blue-400 transition-colors">Cwallet</div>
                                            <div className="text-xs text-slate-500">Instant Payments</div>
                                        </div>
                                        <LinkIcon className="text-slate-600 group-hover:text-blue-400" />
                                    </button>
                                </>
                            )}
                            {tab === 'SOCIAL' && (
                                <>
                                    <button onClick={() => handleConnect('EMAIL')} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between border border-slate-700 transition-all hover:border-red-500 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">G</div>
                                            <div className="text-left">
                                                <div className="text-white font-bold group-hover:text-red-400 transition-colors">Google / Email</div>
                                                <div className="text-xs text-slate-500">Cwallet Integration</div>
                                            </div>
                                        </div>
                                        <Mail className="text-slate-600 group-hover:text-red-400" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Component: Withdrawal Modal ---
const WithdrawalModal = ({ onClose, balance, onWithdraw }: { onClose: () => void, balance: number, onWithdraw: (amount: number) => void }) => {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState('');

    const handleWithdraw = () => {
        const val = parseFloat(amount);
        if(!amount || isNaN(val)) return alert("Ingresa un monto válido");
        if(val < 0.00001) return alert("El retiro mínimo es 0.00001 MurCoins");
        if(val > balance) return alert("Saldo insuficiente.");
        if(!address) return alert("Ingresa una dirección Cwallet válida.");
        
        setStep(2);
        setTimeout(() => {
            onWithdraw(val);
            setStep(3);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X/></button>
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Wallet size={20}/></div>
                    <h2 className="text-xl font-black text-white uppercase">Retiro Cwallet</h2>
                </div>
                
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-lg flex justify-between items-center border border-slate-800">
                            <span className="text-slate-400 text-sm">Disponible</span>
                            <span className="text-pink-400 font-bold font-mono">{balance.toFixed(6)} MC</span>
                        </div>
                        
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Dirección Cwallet / ID</label>
                            <input 
                                type="text" 
                                placeholder="Ej. user@cwallet.com o ID Cwallet" 
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg text-white text-sm focus:border-blue-500 outline-none mt-1" 
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold ml-1">Monto a retirar</label>
                            <div className="relative mt-1">
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)} 
                                    className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg text-white font-bold focus:border-blue-500 outline-none" 
                                />
                                <button onClick={() => setAmount(balance.toString())} className="absolute right-2 top-2 text-xs bg-slate-700 px-2 py-1 rounded text-cyan-400">MAX</button>
                            </div>
                        </div>

                        <button onClick={handleWithdraw} className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                            Confirmar Retiro
                        </button>
                        <p className="text-[10px] text-center text-slate-500">Transacción procesada por Cwallet Network. Sin comisiones.</p>
                    </div>
                )}
                {step === 2 && (
                    <div className="flex flex-col items-center justify-center py-8">
                         <RefreshCw className="animate-spin text-blue-500 mb-4" size={40} />
                         <p className="text-white font-bold">Conectando con Cwallet...</p>
                         <p className="text-xs text-slate-500 mt-2">Verificando saldo y dirección</p>
                    </div>
                )}
                {step === 3 && (
                    <div className="text-center py-8 animate-in zoom-in">
                        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4"/>
                        <h3 className="text-white font-bold text-xl mb-1">¡Retiro Exitoso!</h3>
                        <p className="text-slate-400 text-sm mb-6">Tus MuRCoins han sido enviados a tu Cwallet.</p>
                        <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-white font-bold">Cerrar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Component: Receive Modal (Cwallet) ---
const ReceiveModal = ({ onClose, walletAddress }: { onClose: () => void, walletAddress: string }) => {
    const address = walletAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d89A23"; // Fallback address
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X/></button>
                
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-3 border border-green-500/20">
                        <QrCode size={24}/>
                    </div>
                    <h2 className="text-xl font-black text-white uppercase">Recibir Crypto</h2>
                    <p className="text-sm text-slate-400">Depósito directo vía Cwallet</p>
                </div>

                <div className="bg-white p-4 rounded-xl mx-auto w-fit mb-6 shadow-lg shadow-white/5">
                    {/* Placeholder for QR Code */}
                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
                        <QrCode size={150} className="text-slate-900"/>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-1 rounded-full shadow-md">
                                <Hexagon size={24} className="text-pink-500 fill-pink-500"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold text-center block">Tu Dirección de MuRCoin</label>
                    <div onClick={handleCopy} className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors group">
                        <code className="text-xs text-slate-300 font-mono truncate mr-2">{address}</code>
                        <div className="text-slate-500 group-hover:text-white">
                            {copied ? <CheckCircle size={16} className="text-green-500"/> : <Copy size={16}/>}
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-500 mt-2">
                        Envía solo MuRCoins (MRC) o tokens compatibles a esta dirección. <br/>
                        La transacción se reflejará automáticamente en tu Cwallet.
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Component: Navbar ---
const Navbar = ({ profile, onConnect, onOpenWithdraw, onOpenExchange, screen, setScreen }: any) => {
    return (
        <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => setScreen('HOME')}>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-500/20">
                    <Gamepad2 className="text-white" size={24} />
                </div>
                <div className="hidden md:block">
                    <h1 className="text-xl font-black text-white italic leading-none tracking-tighter">POCKET<span className="text-cyan-400">BATTLE</span></h1>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Web3 Edition</span>
                </div>
            </div>

            {/* Navigation (Desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                {[
                    { id: 'HOME', icon: Monitor, label: 'Inicio' },
                    { id: 'DECK', icon: Layers, label: 'Mazo' },
                    { id: 'SHOP', icon: Store, label: 'Mercado' },
                    { id: 'FORGE', icon: Hexagon, label: 'Forja IA' },
                    { id: 'LEADERBOARD', icon: Trophy, label: 'Ranking' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setScreen(item.id)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${screen === item.id ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <item.icon size={16} />
                        <span className="text-xs font-bold uppercase">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Right Side: Stats & Wallet */}
            <div className="flex items-center gap-3">
                {/* Network Selector (Visual) */}
                <div className="hidden md:flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Globe size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-blue-400">Cwallet Network</span>
                </div>

                {/* Exchange Button */}
                 <button onClick={onOpenExchange} className="bg-slate-800 p-2 rounded-full border border-slate-600 text-white hover:bg-slate-700 transition-colors" title="Cambiar Crypto">
                    <ArrowLeftRight size={14} />
                </button>

                {/* Balances (Compact) */}
                <div className="flex items-center gap-2 mr-2">
                    <div onClick={onOpenWithdraw} className="cursor-pointer hover:bg-slate-800 rounded px-2 py-1 transition-colors flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">MurCoins</span>
                        <div className="flex items-center gap-1 text-pink-400 font-black text-sm">
                            <Hexagon size={12} className="fill-pink-400"/> {profile.murCoins.toFixed(4)}
                        </div>
                    </div>
                </div>

                {/* Connect Button */}
                {profile.walletAddress ? (
                    <button onClick={onConnect} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-green-500/30 pl-1 pr-3 py-1 rounded-full transition-all group">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/50">
                            <Wallet size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-bold text-green-400 uppercase">Conectado</span>
                            <span className="text-xs font-mono text-slate-300">{profile.walletAddress.substring(0,6)}...</span>
                        </div>
                    </button>
                ) : (
                    <button onClick={onConnect} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105">
                        <Wallet size={16} /> <span className="hidden sm:inline">Conectar Cwallet</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const CardDetailModal = ({ card, onClose }: { card: CardData, onClose: () => void }) => {
    const defense = card.stats.defense * 10;
    const magic = card.stats.magic * 10;
    const attack = card.stats.attack * 10;
    const health = card.stats.health * 10;
    
    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-200">
            <div className="absolute top-4 right-4">
                <button onClick={onClose} className="p-2 bg-slate-800 text-white rounded-full hover:bg-red-600 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl relative z-10">
                <div className="transform scale-110 md:scale-150 shadow-2xl relative z-10 animate-float-up">
                    <Card card={card} disabled />
                </div>
                <div className="w-full max-w-md bg-slate-900/90 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">{card.name}</h2>
                    <p className="text-slate-400 text-sm italic mb-6">"{card.description}"</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-red-900/20 p-2 rounded-lg border border-red-500/30">
                            <div className="bg-red-500 p-2 rounded-lg text-white"><Swords size={20} /></div>
                            <div><div className="text-[10px] text-red-300 font-bold uppercase">Ataque</div><div className="text-2xl font-black text-white">{attack}</div></div>
                        </div>
                        <div className="flex items-center gap-3 bg-green-900/20 p-2 rounded-lg border border-green-500/30">
                            <div className="bg-green-500 p-2 rounded-lg text-white"><Heart size={20} /></div>
                            <div><div className="text-[10px] text-green-300 font-bold uppercase">Vida</div><div className="text-2xl font-black text-white">{health}</div></div>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-900/20 p-2 rounded-lg border border-blue-500/30">
                            <div className="bg-blue-500 p-2 rounded-lg text-white"><Shield size={20} /></div>
                            <div><div className="text-[10px] text-blue-300 font-bold uppercase">Defensa</div><div className="text-2xl font-black text-white">{defense}</div></div>
                        </div>
                        <div className="flex items-center gap-3 bg-purple-900/20 p-2 rounded-lg border border-purple-500/30">
                            <div className="bg-purple-500 p-2 rounded-lg text-white"><Zap size={20} /></div>
                            <div><div className="text-[10px] text-purple-300 font-bold uppercase">Magia</div><div className="text-2xl font-black text-white">{magic}</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShopScreen = ({ profile, setProfile, onInspect, handleOpenPack, onBuy, onSell, onOpenWallet, onReceive, requestPayment, onWatchAd }: any) => {
    const [tab, setTab] = useState<'PACKS' | 'DAILY' | 'BANK'>('PACKS');
    const [dailyDeals, setDailyDeals] = useState<{id: string, card: CardData, price: number, currency: 'gold' | 'gems'}[]>([]);

    useEffect(() => {
        const deals = Array.from({length: 4}).map((_, i) => {
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

    const buyDeal = (deal: any) => {
         alert("Compra simulada: " + deal.card.name);
    };
    
    const buyCurrency = (type: any, amount: any, price: number) => {
        requestPayment(price, `Pack ${amount} ${type}`, () => {
            setProfile((p:any) => ({...p, [type]: p[type] + amount}));
            alert(`¡${amount} ${type} añadidos a tu cuenta!`);
        });
    };

    const handleBuyMurCoins = () => {
        requestPayment(10, '50 MuRCoins', () => {
             setProfile((p: any) => ({...p, murCoins: p.murCoins + 50}));
             alert("¡50.00 MC añadidos!");
        });
    };

    return (
        <div className="h-full flex flex-col p-4 max-w-7xl mx-auto w-full">
            <div className="flex gap-4 mb-6">
                <button onClick={() => setTab('PACKS')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${tab === 'PACKS' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-slate-800 text-slate-400'}`}><Layers size={18}/> Packs</button>
                <button onClick={() => setTab('DAILY')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${tab === 'DAILY' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-slate-800 text-slate-400'}`}><Clock size={18}/> Diario</button>
                <button onClick={() => setTab('BANK')} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${tab === 'BANK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400'}`}><DollarSign size={18}/> Banco</button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {tab === 'PACKS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                        <div className="md:col-span-3">
                            <h3 className="text-white font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2"><Star className="text-yellow-400"/> Destacados</h3>
                            <div className="flex gap-6 overflow-x-auto pb-6">
                                <div className="min-w-[200px]"><BoosterPack type="epic" price={50} currency="gems" onClick={() => handleOpenPack(true)} /></div>
                                <div className="min-w-[200px]"><BoosterPack type="basic" price={500} currency="gold" onClick={() => handleOpenPack(false)} /></div>
                            </div>
                        </div>
                        {/* Marketplace */}
                        <div className="md:col-span-3">
                             <h3 className="text-white font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2"><Users className="text-blue-400"/> Mercado P2P</h3>
                             <Marketplace profile={profile} onBuy={onBuy} onSell={onSell} onInspect={onInspect} />
                        </div>
                    </div>
                )}
                
                {tab === 'DAILY' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4">
                        {/* Free Ad Reward */}
                        <div className="bg-slate-800 p-4 rounded-xl border border-dashed border-green-500 flex flex-col items-center justify-center gap-3 group relative overflow-hidden cursor-pointer hover:bg-slate-750" onClick={onWatchAd}>
                            <div className="p-3 bg-green-500/20 rounded-full text-green-400"><Video size={32}/></div>
                            <div className="text-center">
                                <div className="text-white font-bold">Ver Anuncio</div>
                                <div className="text-xs text-green-400">Gana 50 Oro + 0.001 MC</div>
                            </div>
                        </div>

                        {dailyDeals.map(deal => (
                            <div key={deal.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-3 relative overflow-hidden hover:border-slate-500 transition-colors group">
                                <div className="transform scale-75 origin-center"><Card card={deal.card} small onInspect={onInspect} /></div>
                                <div className="text-center w-full">
                                    <div className="text-white font-bold truncate">{deal.card.name}</div>
                                    <button onClick={() => buyDeal(deal)} className="w-full mt-2 py-2 bg-slate-900 hover:bg-black border border-slate-600 rounded-lg flex items-center justify-center gap-2 text-sm font-bold">
                                        <span className="text-slate-400 uppercase text-xs">Comprar</span>
                                        <span className={deal.currency === 'gems' ? 'text-cyan-400' : 'text-yellow-400'}>{deal.price} {deal.currency === 'gems' ? '💎' : '🪙'}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'BANK' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
                        {/* Buy Crypto Card */}
                        <div onClick={handleBuyMurCoins} className="md:col-span-2 cursor-pointer bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl border border-emerald-500/50 flex items-center justify-between shadow-xl hover:scale-[1.01] transition-transform relative overflow-hidden group">
                             <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <div className="flex items-center gap-4 relative z-10">
                                <div className="p-4 bg-black/40 rounded-full border border-emerald-500/50">
                                    <Bitcoin className="text-emerald-400" size={32} />
                                </div>
                                <div>
                                    <div className="text-white font-black uppercase text-xl">Comprar MuRCoins</div>
                                    <div className="text-sm text-emerald-300">50 MC por $10.00 USDT</div>
                                </div>
                            </div>
                            <div className="px-6 py-2 bg-emerald-500 text-black font-black text-sm rounded-full uppercase flex items-center gap-2 shadow-lg shadow-emerald-500/20 relative z-10">
                                Comprar <ArrowRight size={16} />
                            </div>
                        </div>

                        {/* Withdraw Card */}
                        <div onClick={onOpenWallet} className="cursor-pointer bg-gradient-to-r from-pink-900 to-purple-900 p-6 rounded-2xl border border-pink-500/50 flex items-center justify-between shadow-xl hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-black/40 rounded-full border border-pink-500/50">
                                    <Wallet className="text-pink-400" size={32} />
                                </div>
                                <div>
                                    <div className="text-white font-black uppercase text-xl">Retirar Fondos</div>
                                    <div className="text-sm text-pink-300">Cwallet & Crypto</div>
                                </div>
                            </div>
                            <div className="px-6 py-2 bg-pink-500 text-black font-black text-sm rounded-full uppercase flex items-center gap-2">
                                Retirar <ArrowRight size={16} />
                            </div>
                        </div>

                        {/* Receive Card */}
                        <div onClick={onReceive} className="cursor-pointer bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-2xl border border-cyan-500/50 flex items-center justify-between shadow-xl hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-black/40 rounded-full border border-cyan-500/50">
                                    <QrCode className="text-cyan-400" size={32} />
                                </div>
                                <div>
                                    <div className="text-white font-black uppercase text-xl">Recibir Crypto</div>
                                    <div className="text-sm text-cyan-300">Dirección Cwallet</div>
                                </div>
                            </div>
                            <div className="px-6 py-2 bg-cyan-500 text-black font-black text-sm rounded-full uppercase flex items-center gap-2">
                                Recibir <ArrowRight size={16} />
                            </div>
                        </div>

                        {/* Currency Packs */}
                        <div className="md:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-4">Recarga Rápida (Cwallet Pay)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-4 rounded-xl text-center cursor-pointer hover:bg-slate-950 border border-slate-800" onClick={() => buyCurrency('gems', 100, 0.99)}>
                                    <Gem className="text-cyan-400 mx-auto mb-2"/>
                                    <div className="font-bold text-white">100 Gemas</div>
                                    <div className="text-xs text-slate-500">$0.99 USDT</div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl text-center cursor-pointer hover:bg-slate-950 border border-slate-800" onClick={() => buyCurrency('gold', 1000, 1.99)}>
                                    <Coins className="text-yellow-500 mx-auto mb-2"/>
                                    <div className="font-bold text-white">1000 Oro</div>
                                    <div className="text-xs text-slate-500">$1.99 USDT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BoosterPack = ({ type, price, currency, onClick }: any) => (
    <div onClick={onClick} className={`cursor-pointer relative w-40 h-60 rounded-xl shadow-xl transform transition-transform hover:scale-105 flex flex-col items-center justify-end pb-6 border-4 ${type === 'epic' ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-400' : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-400'}`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-30"><Layers size={80} className="text-white" /></div>
        <div className="z-10 text-center">
            <div className="font-black text-white text-xl uppercase italic tracking-wider drop-shadow-md">{type === 'epic' ? 'EPIC' : 'BASIC'}</div>
            <div className="bg-black/60 px-4 py-1 rounded-full flex items-center gap-1 border border-white/20 mt-2">
                <span className={`font-black ${currency === 'gems' ? 'text-cyan-400' : 'text-yellow-400'}`}>{price}</span>
                {currency === 'gems' ? <Gem size={14} className="text-cyan-400 fill-cyan-400"/> : <Coins size={14} className="text-yellow-500 fill-yellow-500"/>}
            </div>
        </div>
    </div>
);

const Marketplace = ({ profile, onBuy, onSell, onInspect }: any) => {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listings.map(listing => (
                <div key={listing.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex flex-col gap-2 group hover:border-slate-500 transition-all">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>@{listing.sellerName}</span>
                        <span className="text-yellow-400 font-bold">{listing.price} MC</span>
                    </div>
                    <div className="h-32 relative flex items-center justify-center">
                         <div className="transform scale-75"><Card card={listing.card} small onInspect={onInspect} /></div>
                    </div>
                    <button onClick={() => onBuy(listing)} className="w-full py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-bold mt-2">Comprar</button>
                </div>
            ))}
        </div>
    );
};

const PackOpening = ({ cards, onClose, onInspect }: { cards: CardData[], onClose: () => void, onInspect: (c: CardData) => void }) => {
    const [revealedCount, setRevealedCount] = useState(0);
  
    useEffect(() => {
      if (revealedCount < cards.length) {
        const timer = setTimeout(() => setRevealedCount(prev => prev + 1), 500);
        return () => clearTimeout(timer);
      }
    }, [revealedCount, cards.length]);
  
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in">
        <h2 className="text-3xl font-black text-white mb-8 animate-bounce">¡PACK ABIERTO!</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {cards.map((card, i) => (
            <div key={card.id} 
                 className={`transform transition-all duration-500 ${i < revealedCount ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-20'}`}>
              <Card card={card} onInspect={onInspect} />
            </div>
          ))}
        </div>
        {revealedCount === cards.length && (
          <button onClick={onClose} className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg shadow-cyan-500/50 animate-pulse">
            CONTINUAR
          </button>
        )}
      </div>
    );
};

const BattlePassScreen = ({ profile, setProfile, onBack, requestPayment }: any) => {
    const handleClaim = (reward: BattlePassReward, isPremium: boolean) => {
       alert(`Reclamado: ${isPremium ? reward.premiumType : reward.freeType}`);
       setProfile((prev: PlayerProfile) => ({
           ...prev,
           claimedRewards: [...prev.claimedRewards, reward.level]
       }));
    };

    const buyPremium = () => {
        requestPayment(9.99, 'Pase Premium', () => {
            setProfile((prev: PlayerProfile) => ({...prev, hasPremiumPass: true}));
            alert("¡Pase Premium Desbloqueado!");
        });
    };
  
    return (
      <div className="h-full flex flex-col bg-slate-900">
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
               <div className="flex items-center gap-3">
                   <button onClick={onBack}><ArrowRight className="rotate-180 text-white"/></button>
                   <h2 className="text-xl font-black text-white italic">BATTLE PASS</h2>
               </div>
               <div className="text-yellow-400 font-bold text-sm">Nivel {profile.passLevel}</div>
          </div>
          
          {!profile.hasPremiumPass && (
              <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/30 rounded-full"><Crown className="text-yellow-400 animate-pulse" size={24}/></div>
                      <div>
                          <div className="text-white font-black uppercase">Pase Premium</div>
                          <div className="text-indigo-300 text-xs">Recompensas exclusivas y skins</div>
                      </div>
                  </div>
                  <button onClick={buyPremium} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-4 py-2 rounded-lg shadow-lg text-sm">
                      Comprar $9.99
                  </button>
              </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {BATTLE_PASS_REWARDS.map((reward) => {
                  const isClaimed = profile.claimedRewards.includes(reward.level);
                  const isUnlocked = profile.passLevel >= reward.level;
                  return (
                      <div key={reward.level} className={`relative p-4 rounded-xl border-2 ${isUnlocked ? 'border-green-500/50 bg-green-900/10' : 'border-slate-700 bg-slate-800'} flex items-center gap-4`}>
                          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center font-black text-white border border-slate-700">
                              {reward.level}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 uppercase font-bold">Gratis</span>
                                  <div className="text-sm font-bold text-white">{reward.freeValue} {reward.freeType}</div>
                              </div>
                              <div className={`flex flex-col items-center border-l border-slate-700 ${!profile.hasPremiumPass ? 'opacity-50' : ''}`}>
                                  <span className="text-[10px] text-yellow-500 uppercase font-bold flex items-center gap-1"><Crown size={10}/> Premium</span>
                                  <div className="text-sm font-bold text-yellow-100">{reward.premiumLabel || `${reward.premiumValue} ${reward.premiumType}`}</div>
                              </div>
                          </div>
                          {isUnlocked && !isClaimed && (
                              <button onClick={() => handleClaim(reward, false)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                  <CheckCircle size={20}/>
                              </button>
                          )}
                           {isClaimed && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-bold text-xs uppercase">Reclamado</div>
                          )}
                      </div>
                  );
              })}
          </div>
      </div>
    );
};

// --- Puzzle Screen (Replaces Battle) ---
const PuzzleScreen = ({ profile, setProfile, onBack }: any) => {
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        // Initialize Game
        const pool = ALL_CARDS.slice(0, 6); // 6 pairs
        const gameCards = [...pool, ...pool]
            .sort(() => Math.random() - 0.5)
            .map((c, i) => ({ ...c, uniqueId: i }));
        setCards(gameCards);
    }, []);

    const handleCardClick = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
        
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const id1 = cards[newFlipped[0]].id;
            const id2 = cards[newFlipped[1]].id;

            if (id1 === id2) {
                setSolved([...solved, ...newFlipped]);
                setFlipped([]);
                if (solved.length + 2 === cards.length) {
                    setTimeout(() => setGameOver(true), 500);
                    // Reward
                    setProfile((p: any) => ({ ...p, gold: p.gold + 50, murCoins: p.murCoins + 0.005 }));
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="h-full flex flex-col p-4">
             <div className="flex justify-between items-center mb-4">
                 <button onClick={onBack}><ArrowRight className="rotate-180 text-white"/></button>
                 <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
                     <Puzzle className="text-purple-500" /> Memory Match
                 </h2>
                 <div className="text-sm font-bold text-slate-400">Moves: {moves}</div>
             </div>

             {gameOver ? (
                 <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in">
                     <Trophy size={64} className="text-yellow-500 mb-4 animate-bounce" />
                     <h2 className="text-3xl font-black text-white mb-2">¡VICTORIA!</h2>
                     <p className="text-slate-400 mb-6">Recompensa: 50 Oro + 0.005 MC</p>
                     <button onClick={onBack} className="bg-purple-600 px-8 py-3 rounded-xl font-bold text-white">Continuar</button>
                 </div>
             ) : (
                 <div className="flex-1 grid grid-cols-3 gap-2 auto-rows-fr pb-20">
                     {cards.map((card, index) => {
                         const isFlipped = flipped.includes(index) || solved.includes(index);
                         return (
                             <div 
                                key={index} 
                                onClick={() => handleCardClick(index)}
                                className={`relative rounded-lg cursor-pointer transition-all duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
                             >
                                 <div className={`absolute inset-0 bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                                     <Gamepad2 className="text-slate-600" />
                                 </div>
                                 <div className={`absolute inset-0 rounded-lg overflow-hidden ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                                     <Card card={card} small disabled />
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             )}
        </div>
    );
};

const ClanScreen = ({ onBack }: any) => {
    const clans = [
        { id: 1, name: 'Dragones Rojos', members: 45, power: 12000 },
        { id: 2, name: 'Cyber Punks', members: 32, power: 9800 },
        { id: 3, name: 'Místicos', members: 50, power: 15400 },
    ];
    return (
        <div className="h-full flex flex-col p-4 bg-slate-900">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack}><ArrowRight className="rotate-180 text-white"/></button>
                <h2 className="text-2xl font-black text-white italic">CLANES</h2>
            </div>
            <div className="space-y-4">
                {clans.map(clan => (
                    <div key={clan.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                        <div>
                            <div className="text-white font-bold text-lg">{clan.name}</div>
                            <div className="text-slate-400 text-sm">{clan.members}/50 Miembros</div>
                        </div>
                        <div className="text-right">
                            <div className="text-yellow-500 font-bold">{clan.power} BP</div>
                            <button className="bg-blue-600 text-xs px-3 py-1 rounded text-white mt-1">Unirse</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LeaderboardScreen = ({ onBack }: any) => {
    const players = [
        { rank: 1, name: 'Satoshi', points: 9999 },
        { rank: 2, name: 'Vitalik', points: 8500 },
        { rank: 3, name: 'Jugador1', points: 1200 }, // User
    ];
    return (
        <div className="h-full flex flex-col p-4 bg-slate-900">
             <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack}><ArrowRight className="rotate-180 text-white"/></button>
                <h2 className="text-2xl font-black text-white italic">RANKING</h2>
            </div>
            <div className="space-y-2">
                {players.map(p => (
                    <div key={p.rank} className={`p-4 rounded-xl flex items-center justify-between ${p.rank === 3 ? 'bg-cyan-900/30 border border-cyan-500/50' : 'bg-slate-800 border border-slate-700'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${p.rank === 1 ? 'bg-yellow-500 text-black' : p.rank === 2 ? 'bg-slate-400 text-black' : 'bg-slate-700 text-white'}`}>
                                {p.rank}
                            </div>
                            <div className="text-white font-bold">{p.name}</div>
                        </div>
                        <div className="text-cyan-400 font-mono font-bold">{p.points} RP</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DeckEditor = ({ profile }: any) => <div className="grid grid-cols-4 gap-2 p-4">{profile.collection.map((c:any) => <div key={c.id} className="transform scale-75"><Card card={c} small/></div>)}</div>;

const ForgeScreen = ({ profile, setProfile, onInspect, onBack, requestPayment }: any) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedCard, setGeneratedCard] = useState<CardData | null>(null);

    const handleGenerate = async () => {
        if(!prompt) return;
        setLoading(true);
        const cardData = await generateCardFromPrompt(prompt);
        if(cardData) {
            const newCard: CardData = {
                id: uuidv4(),
                name: cardData.name || 'Carta Nueva',
                description: cardData.description || '',
                rarity: (cardData.rarity as Rarity) || Rarity.COMMON,
                element: ElementType.NORMAL,
                stats: {
                    attack: cardData.stats?.attack || 1,
                    health: cardData.stats?.health || 1,
                    cost: cardData.stats?.cost || 1,
                    magic: 0,
                    defense: 0
                },
                imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " fantasy card game art style 3d render")}`,
                abilityName: 'Nueva Habilidad',
                arenaId: 1
            };
            setGeneratedCard(newCard);
        }
        setLoading(false);
    };

    const handleSave = () => {
        if(generatedCard) {
            setProfile((p: any) => ({...p, collection: [...p.collection, generatedCard]}));
            setGeneratedCard(null);
            setPrompt('');
            alert("Carta guardada en tu colección!");
        }
    };

    const handleUnlockForge = () => {
        requestPayment(2.99, 'Forja AI Pro (Mensual)', () => {
            setProfile((p: any) => ({...p, unlockedForge: true}));
            alert("¡Suscripción activada con Cwallet!");
        });
    };

    // Locked State
    if (!profile.unlockedForge) {
        return (
            <div className="h-full p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23')] bg-cover opacity-20 blur-sm"></div>
                <div className="relative z-10 bg-slate-900/90 p-8 rounded-3xl border border-purple-500/50 shadow-2xl max-w-md animate-float-up">
                    <Hexagon size={64} className="text-purple-500 mx-auto mb-6 animate-spin-slow"/>
                    <h2 className="text-3xl font-black text-white mb-2 italic uppercase">Forja AI Pro</h2>
                    <p className="text-slate-400 mb-6">Crea cartas ilimitadas potenciadas por Inteligencia Artificial y añádelas a tu colección.</p>
                    <ul className="text-left space-y-3 mb-8 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Generación Ilimitada</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Arte 3D Exclusivo</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Estadísticas Balanceadas</li>
                    </ul>
                    <button onClick={handleUnlockForge} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                        <Wallet size={20}/> Suscribirse $2.99 / Mes
                    </button>
                    <p className="text-[10px] text-slate-500 mt-4">Pago seguro vía Cwallet (USDT)</p>
                    <button onClick={onBack} className="mt-4 text-slate-400 hover:text-white text-sm">Volver</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full p-6 max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 uppercase italic">Forja de Cartas con IA</h2>
            
            {!generatedCard ? (
                <div className="w-full max-w-lg space-y-4">
                    <textarea 
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-purple-500 outline-none h-32 resize-none"
                        placeholder="Describe tu carta (ej. Dragón de cristal que dispara rayos laser...)"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                    <button 
                        onClick={handleGenerate} 
                        disabled={loading || !prompt}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${loading ? 'bg-slate-700 text-slate-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg shadow-purple-500/30'}`}
                    >
                        {loading ? 'Generando...' : 'Forjar Carta'}
                    </button>
                    <button onClick={onBack} className="w-full text-slate-400 hover:text-white mt-4">Cancelar</button>
                </div>
            ) : (
                <div className="flex flex-col items-center animate-in zoom-in">
                    <div className="transform scale-125 mb-8">
                        <Card card={generatedCard} />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold uppercase shadow-lg">Guardar Carta</button>
                        <button onClick={() => setGeneratedCard(null)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold uppercase shadow-lg">Descartar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main App Component ---
export default function App() {
  const [screen, setScreen] = useState<ScreenState>('SPLASH');
  const [profile, setProfile] = useState<PlayerProfile>({
    username: 'Jugador1',
    level: 1,
    xp: 0,
    rankPoints: 1200,
    gold: 500,
    gems: 50,
    murCoins: 100.000001, // Starting balance for demo
    collection: [...INITIAL_CARDS],
    deck: INITIAL_CARDS.map(c => c.id),
    unlockedForge: false,
    hasPremiumPass: false,
    passLevel: 3,
    claimedRewards: [],
    ownedCosmetics: ['default_arena', 'default_frame', 'default_banner', 'default_avatar'],
    equippedArenaSkin: 'default_arena',
    equippedAvatarFrame: 'default_frame',
    equippedBanner: 'default_banner',
    equippedAvatar: 'default_avatar'
  });
  
  const [inspectingCard, setInspectingCard] = useState<CardData | null>(null);
  const [packCards, setPackCards] = useState<CardData[] | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<{amount: number, item: string, currency: string, onSuccess: () => void} | null>(null);

  useEffect(() => {
    if (screen === 'SPLASH') {
        setTimeout(() => setScreen('HOME'), 2500);
    }
  }, [screen]);

  // Actions
  const handleConnect = (type: any, address: string) => {
      setProfile(p => ({...p, walletAddress: address, walletType: type}));
  };

  const handleOpenPack = (isEpic: boolean) => {
      const count = 5;
      const newCards = Array.from({length: count}).map(() => {
          const rand = Math.random();
          const rarity = isEpic 
            ? (rand > 0.9 ? Rarity.LEGENDARY : rand > 0.6 ? Rarity.EPIC : Rarity.RARE)
            : (rand > 0.98 ? Rarity.LEGENDARY : rand > 0.85 ? Rarity.EPIC : rand > 0.6 ? Rarity.RARE : Rarity.COMMON);
          const pool = ALL_CARDS.filter(c => c.rarity === rarity) || ALL_CARDS;
          const template = pool[Math.floor(Math.random() * pool.length)];
          return { ...template, id: uuidv4() };
      });
      setPackCards(newCards);
      setProfile(p => ({...p, collection: [...p.collection, ...newCards]}));
  };

  const handleBuyMarket = (listing: MarketListing) => {
    alert(`Has comprado: ${listing.card.name}`);
  };

  const handleSellCard = (card: CardData) => {
    alert(`Has puesto en venta: ${card.name}`);
  };
  
  const requestPayment = (amount: number, item: string, onSuccess: () => void) => {
      setPaymentRequest({ amount, item, currency: 'USDT', onSuccess });
  };

  const handleAdReward = () => {
      setProfile(p => ({ ...p, gold: p.gold + 50, murCoins: p.murCoins + 0.001 }));
  };

  // Render
  if (screen === 'SPLASH') {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
              <BackgroundParticles />
              <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-1000">
                  <Gamepad2 size={100} className="text-cyan-400 mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
                  <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter italic">POCKET<br/>BATTLE</h1>
                  <div className="mt-6 text-sm font-bold text-slate-500 tracking-[0.5em] uppercase animate-pulse">Iniciando Sistemas...</div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden flex flex-col">
      <BackgroundParticles />
      
      {/* Global Modals */}
      {inspectingCard && <CardDetailModal card={inspectingCard} onClose={() => setInspectingCard(null)} />}
      {packCards && <PackOpening cards={packCards} onClose={() => setPackCards(null)} onInspect={setInspectingCard} />}
      {showConnect && <Web3ConnectModal onClose={() => setShowConnect(false)} onConnect={handleConnect} />}
      {showWithdraw && <WithdrawalModal balance={profile.murCoins} onClose={() => setShowWithdraw(false)} onWithdraw={(amt) => setProfile(p => ({...p, murCoins: p.murCoins - amt}))} />}
      {showReceive && <ReceiveModal onClose={() => setShowReceive(false)} walletAddress={profile.walletAddress || ""} />}
      {showExchange && <ExchangeModal profile={profile} setProfile={setProfile} onClose={() => setShowExchange(false)} />}
      {showAd && <AdWatchModal onClose={() => setShowAd(false)} onReward={handleAdReward} />}
      {paymentRequest && <CwalletPaymentModal request={paymentRequest} onClose={() => setPaymentRequest(null)} />}

      {/* Navigation */}
      <Navbar 
        profile={profile} 
        onConnect={() => setShowConnect(true)} 
        onOpenWithdraw={() => setShowWithdraw(true)}
        onOpenExchange={() => setShowExchange(true)}
        screen={screen} 
        setScreen={setScreen} 
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col">
          
          {screen === 'HOME' && (
              <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Profile & Stats */}
                  <div className="space-y-6">
                      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity"><Crown className="text-yellow-500 animate-pulse"/></div>
                          <div className="flex items-center gap-4 mb-6">
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-1 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-4xl">
                                      {COSMETICS[profile.equippedAvatar]?.value || '👤'}
                                  </div>
                              </div>
                              <div>
                                  <h2 className="text-2xl font-black text-white">{profile.username}</h2>
                                  <div className="text-cyan-400 font-bold uppercase text-xs tracking-wider">Nivel {profile.level}</div>
                                  <div className="w-32 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden"><div className="w-2/3 h-full bg-cyan-500"></div></div>
                              </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-black/30 p-2 rounded-lg"><div className="text-yellow-500 font-black">{profile.gold}</div><div className="text-[10px] text-slate-500 uppercase">Oro</div></div>
                              <div className="bg-black/30 p-2 rounded-lg"><div className="text-cyan-400 font-black">{profile.gems}</div><div className="text-[10px] text-slate-500 uppercase">Gemas</div></div>
                              <div className="bg-black/30 p-2 rounded-lg"><div className="text-pink-400 font-black truncate">{profile.murCoins.toFixed(2)}</div><div className="text-[10px] text-slate-500 uppercase">MC</div></div>
                          </div>
                      </div>

                      {/* Play Puzzle Action (Replaced Quick Battle) */}
                      <button onClick={() => setScreen('PUZZLE')} className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl font-black text-2xl uppercase italic tracking-wider shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                          <Puzzle size={32} /> Puzzles & Rewards
                      </button>

                      {/* Watch Ad Action */}
                      <button onClick={() => setShowAd(true)} className="w-full py-4 mt-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl font-bold text-xl uppercase tracking-wider shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-green-400/30">
                          <Tv size={28} className="text-white" /> 
                          <div className="text-left">
                            <div className="leading-none text-white">Ver Anuncio</div>
                            <div className="text-[10px] text-green-200 font-normal normal-case opacity-90 mt-1">Gana Oro y Crypto Gratis</div>
                          </div>
                      </button>
                  </div>

                  {/* Center/Right: Dashboard Tiles */}
                  <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div onClick={() => setScreen('DECK')} className="bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group">
                          <Layers size={40} className="text-blue-500 group-hover:scale-110 transition-transform"/>
                          <span className="font-bold text-lg">Mazo</span>
                      </div>
                      <div onClick={() => setScreen('SHOP')} className="bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group">
                          <Store size={40} className="text-green-500 group-hover:scale-110 transition-transform"/>
                          <span className="font-bold text-lg">Tienda</span>
                      </div>
                      <div onClick={() => setScreen('FORGE')} className="bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group">
                          <Hexagon size={40} className="text-purple-500 group-hover:scale-110 transition-transform"/>
                          <span className="font-bold text-lg">Forja IA</span>
                      </div>
                      <div onClick={() => setScreen('CLANS')} className="bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group">
                          <Flag size={40} className="text-red-500 group-hover:scale-110 transition-transform"/>
                          <span className="font-bold text-lg">Clanes</span>
                      </div>
                      <div onClick={() => setScreen('LEADERBOARD')} className="bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group">
                          <Trophy size={40} className="text-yellow-500 group-hover:scale-110 transition-transform"/>
                          <span className="font-bold text-lg">Ranking</span>
                      </div>
                      <div onClick={() => setScreen('PASS')} className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-indigo-500 text-[10px] px-2 py-1 font-bold">S1</div>
                          <Crown size={40} className="text-indigo-400 group-hover:scale-110 transition-transform"/>
                          <span className="font-bold text-lg">Pase</span>
                      </div>
                  </div>
              </div>
          )}

          {/* Puzzle Screen (Replaces Battle) */}
          {screen === 'PUZZLE' && (
              <div className="flex-1 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="w-full max-w-4xl h-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
                      <PuzzleScreen 
                        profile={profile}
                        setProfile={setProfile}
                        onBack={() => setScreen('HOME')}
                      />
                  </div>
              </div>
          )}

          {/* Full Screen Modules */}
          {screen === 'SHOP' && <ShopScreen profile={profile} setProfile={setProfile} onInspect={setInspectingCard} handleOpenPack={handleOpenPack} onBuy={handleBuyMarket} onSell={handleSellCard} onOpenWallet={() => setShowWithdraw(true)} onReceive={() => setShowReceive(true)} requestPayment={requestPayment} onWatchAd={() => setShowAd(true)} />}
          
          {screen === 'DECK' && (
              <div className="h-full p-4 max-w-7xl mx-auto w-full">
                  <DeckEditor profile={profile} setProfile={setProfile} onInspect={setInspectingCard} />
              </div>
          )}

          {screen === 'FORGE' && <ForgeScreen profile={profile} setProfile={setProfile} onInspect={setInspectingCard} onBack={() => setScreen('HOME')} requestPayment={requestPayment} />}
          
          {screen === 'CLANS' && (
              <div className="h-full max-w-md mx-auto border-x border-slate-800">
                  <ClanScreen profile={profile} setProfile={setProfile} onBack={() => setScreen('HOME')} />
              </div>
          )}
          
          {screen === 'LEADERBOARD' && (
              <div className="h-full max-w-md mx-auto border-x border-slate-800">
                  <LeaderboardScreen profile={profile} onBack={() => setScreen('HOME')} />
              </div>
          )}
          
          {screen === 'PASS' && (
              <div className="h-full max-w-md mx-auto border-x border-slate-800">
                  <BattlePassScreen profile={profile} setProfile={setProfile} onBack={() => setScreen('HOME')} requestPayment={requestPayment} />
              </div>
          )}

      </main>
    </div>
  );
}
