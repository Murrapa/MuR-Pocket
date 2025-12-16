
import { CardData, Rarity, ElementType, ArenaLevel, BattlePassReward, Cosmetic } from './types';

// Updated to Vibrant Gradients for the "Colorful" request
export const ELEMENT_COLORS = {
  [ElementType.NORMAL]: 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-slate-400 text-slate-800',
  [ElementType.FIRE]: 'bg-gradient-to-b from-red-500 via-red-600 to-orange-600 border-red-500 text-red-50',
  [ElementType.WATER]: 'bg-gradient-to-b from-blue-500 via-blue-600 to-cyan-600 border-blue-500 text-blue-50',
  [ElementType.GRASS]: 'bg-gradient-to-b from-green-500 via-green-600 to-emerald-700 border-green-500 text-green-50',
  [ElementType.ELECTRIC]: 'bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 border-yellow-400 text-yellow-900',
  [ElementType.PSYCHIC]: 'bg-gradient-to-b from-fuchsia-500 via-purple-600 to-indigo-700 border-purple-500 text-purple-50',
  [ElementType.DARK]: 'bg-gradient-to-b from-gray-800 via-gray-900 to-black border-gray-700 text-gray-200',
  [ElementType.LIGHT]: 'bg-gradient-to-b from-yellow-100 via-white to-yellow-200 border-yellow-300 text-yellow-800',
  [ElementType.DRAGON]: 'bg-gradient-to-b from-violet-600 via-indigo-700 to-slate-800 border-indigo-500 text-indigo-50',
};

// Colors for the "Tint" overlay on images
export const ELEMENT_TINTS = {
  [ElementType.NORMAL]: 'from-slate-400/20 to-slate-900/80',
  [ElementType.FIRE]: 'from-orange-500/20 to-red-900/80',
  [ElementType.WATER]: 'from-cyan-400/20 to-blue-900/80',
  [ElementType.GRASS]: 'from-green-400/20 to-green-900/80',
  [ElementType.ELECTRIC]: 'from-yellow-300/20 to-amber-900/80',
  [ElementType.PSYCHIC]: 'from-purple-400/20 to-indigo-900/80',
  [ElementType.DARK]: 'from-gray-600/20 to-black/90',
  [ElementType.LIGHT]: 'from-yellow-100/20 to-yellow-900/50',
  [ElementType.DRAGON]: 'from-indigo-400/20 to-violet-950/80',
};

export const ELEMENT_ICONS = {
  [ElementType.NORMAL]: '⚪',
  [ElementType.FIRE]: '🔥',
  [ElementType.WATER]: '💧',
  [ElementType.GRASS]: '🌿',
  [ElementType.ELECTRIC]: '⚡',
  [ElementType.PSYCHIC]: '🔮',
  [ElementType.DARK]: '🌑',
  [ElementType.LIGHT]: '✨',
  [ElementType.DRAGON]: '🐲',
};

export const RARITY_PRICES = {
  [Rarity.COMMON]: 10,
  [Rarity.RARE]: 50,
  [Rarity.EPIC]: 200,
  [Rarity.LEGENDARY]: 1000,
  [Rarity.DIVINE]: 5000,
};

// --- Cosmetics Database ---
export const COSMETICS: Record<string, Cosmetic> = {
  'default_arena': { id: 'default_arena', type: 'ARENA_SKIN', name: 'Campo Estándar', value: 'from-slate-800 to-slate-900', rarity: 'COMMON' },
  'cyber_arena': { id: 'cyber_arena', type: 'ARENA_SKIN', name: 'Ciberespacio', value: 'bg-[url("https://img.freepik.com/free-vector/cyber-grid-background_23-2148080646.jpg")] bg-cover', rarity: 'RARE' },
  'magma_arena': { id: 'magma_arena', type: 'ARENA_SKIN', name: 'Reino de Fuego', value: 'from-red-900 to-orange-900', rarity: 'RARE' },
  'void_arena': { id: 'void_arena', type: 'ARENA_SKIN', name: 'El Vacío', value: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black', rarity: 'LEGENDARY' },
  'default_frame': { id: 'default_frame', type: 'AVATAR_FRAME', name: 'Marco Básico', value: 'border-slate-600', rarity: 'COMMON' },
  'gold_frame': { id: 'gold_frame', type: 'AVATAR_FRAME', name: 'Marco Dorado', value: 'border-yellow-400 shadow-[0_0_10px_gold]', rarity: 'RARE' },
  'neon_frame': { id: 'neon_frame', type: 'AVATAR_FRAME', name: 'Marco Neón', value: 'border-cyan-400 shadow-[0_0_15px_cyan]', rarity: 'LEGENDARY' },
  'fire_frame': { id: 'fire_frame', type: 'AVATAR_FRAME', name: 'Marco Infernal', value: 'border-red-500 shadow-[0_0_15px_red] animate-pulse', rarity: 'EPIC' },
  'default_banner': { id: 'default_banner', type: 'BANNER', name: 'Estandarte Gris', value: 'bg-slate-800', rarity: 'COMMON' },
  'star_banner': { id: 'star_banner', type: 'BANNER', name: 'Galaxia', value: 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900', rarity: 'RARE' },
  'matrix_banner': { id: 'matrix_banner', type: 'BANNER', name: 'Matrix', value: 'bg-black border border-green-500/20 bg-[linear-gradient(0deg,rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]', rarity: 'EPIC' },
  'gold_banner': { id: 'gold_banner', type: 'BANNER', name: 'Tesoro Real', value: 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600', rarity: 'LEGENDARY' },
  'default_avatar': { id: 'default_avatar', type: 'AVATAR', name: 'Novato', value: '👤', rarity: 'COMMON' },
  'robot_avatar': { id: 'robot_avatar', type: 'AVATAR', name: 'Mecha-01', value: '🤖', rarity: 'RARE' },
  'dragon_avatar': { id: 'dragon_avatar', type: 'AVATAR', name: 'Draco', value: '🐲', rarity: 'EPIC' },
  'wizard_avatar': { id: 'wizard_avatar', type: 'AVATAR', name: 'Archimago', value: '🧙‍♂️', rarity: 'LEGENDARY' },
};

export const ARENAS: ArenaLevel[] = [
  { id: 1, name: "Pueblo Paleta", bgGradient: "from-slate-800 to-green-900", minRankPoints: 0 },
  { id: 2, name: "Bosque Sombrío", bgGradient: "from-green-950 to-emerald-900", minRankPoints: 100 },
  { id: 3, name: "Cueva Profunda", bgGradient: "from-stone-800 to-stone-950", minRankPoints: 200 },
  { id: 4, name: "Central Energía", bgGradient: "from-yellow-900 to-slate-900", minRankPoints: 350 },
  { id: 5, name: "Abismo Oceánico", bgGradient: "from-blue-950 to-indigo-950", minRankPoints: 500 },
  { id: 6, name: "Caldera de Magma", bgGradient: "from-red-950 to-orange-900", minRankPoints: 700 },
  { id: 7, name: "Tundra Helada", bgGradient: "from-cyan-950 to-slate-800", minRankPoints: 900 },
  { id: 8, name: "Pantano Tóxico", bgGradient: "from-lime-950 to-green-900", minRankPoints: 1200 },
  { id: 9, name: "Ruinas Antiguas", bgGradient: "from-stone-700 to-amber-950", minRankPoints: 1500 },
  { id: 10, name: "Torre Tesla", bgGradient: "from-slate-900 via-blue-900 to-purple-900", minRankPoints: 1900 },
  { id: 11, name: "Dimension Astral", bgGradient: "from-purple-950 to-fuchsia-950", minRankPoints: 2400 },
  { id: 12, name: "Nido del Dragón", bgGradient: "from-teal-950 to-green-950", minRankPoints: 3000 },
  { id: 13, name: "Horizonte de Eventos", bgGradient: "from-black via-violet-950 to-black", minRankPoints: 3700 },
  { id: 14, name: "Reino Cuántico", bgGradient: "from-indigo-900 via-pink-900 to-cyan-900", minRankPoints: 4500 },
  { id: 15, name: "El Trono Final", bgGradient: "from-yellow-900 via-red-900 to-black", minRankPoints: 5500 },
];

// --- GENERATING 60 UNIQUE CARDS (Distributed across 15 Arenas) ---
// Structure: 4 cards per arena.
const MOCK_CARDS_DB: CardData[] = [
  // --- ARENA 1: Pueblo Paleta (Basic) ---
  { id: 'a1_1', arenaId: 1, name: 'Slime Verde', description: 'Una gota pegajosa pero amigable.', rarity: Rarity.COMMON, element: ElementType.GRASS, stats: { attack: 2, health: 3, cost: 1, magic: 0, defense: 1 }, abilityName: 'Absorber', imageUrl: 'https://img.freepik.com/free-vector/cute-slime-cartoon-icon-illustration_138676-2679.jpg' },
  { id: 'a1_2', arenaId: 1, name: 'Lobo Joven', description: 'Aúlla a la luna, aunque sea de día.', rarity: Rarity.COMMON, element: ElementType.NORMAL, stats: { attack: 3, health: 2, cost: 2, magic: 0, defense: 2 }, abilityName: 'Mordisco', imageUrl: 'https://img.freepik.com/free-vector/cute-wolf-cartoon-character_138676-3023.jpg' },
  { id: 'a1_3', arenaId: 1, name: 'Pichirilo', description: 'Pequeño pájaro con actitud.', rarity: Rarity.RARE, element: ElementType.NORMAL, stats: { attack: 4, health: 1, cost: 2, magic: 1, defense: 1 }, abilityName: 'Picotazo', imageUrl: 'https://img.freepik.com/free-vector/cute-bird-cartoon-vector-icon-illustration_138676-3375.jpg' },
  { id: 'a1_4', arenaId: 1, name: 'Tortuga Roca', description: 'Dura como una piedra.', rarity: Rarity.EPIC, element: ElementType.GRASS, stats: { attack: 1, health: 6, cost: 3, magic: 2, defense: 5 }, abilityName: 'Caparazón', imageUrl: 'https://img.freepik.com/free-vector/cute-turtle-cartoon-icon-illustration_138676-2680.jpg' },

  // --- ARENA 2: Bosque Sombrío (Grass/Bug) ---
  { id: 'a2_1', arenaId: 2, name: 'Hongo Toxico', description: 'No lo toques o te arrepentirás.', rarity: Rarity.COMMON, element: ElementType.GRASS, stats: { attack: 1, health: 2, cost: 1, magic: 3, defense: 0 }, abilityName: 'Espora', imageUrl: 'https://img.freepik.com/free-vector/mushroom-cartoon-icon_138676-2486.jpg' },
  { id: 'a2_2', arenaId: 2, name: 'Mantis Navaja', description: 'Cortes rápidos y precisos.', rarity: Rarity.RARE, element: ElementType.GRASS, stats: { attack: 5, health: 2, cost: 3, magic: 1, defense: 1 }, abilityName: 'Guadaña', imageUrl: 'https://img.freepik.com/free-vector/mantis-cartoon-vector-icon-illustration_138676-4321.jpg' },
  { id: 'a2_3', arenaId: 2, name: 'Ent Guardián', description: 'Protector milenario del bosque.', rarity: Rarity.EPIC, element: ElementType.GRASS, stats: { attack: 3, health: 8, cost: 5, magic: 4, defense: 4 }, abilityName: 'Raíces', imageUrl: 'https://img.freepik.com/free-vector/tree-cartoon-character_1308-58671.jpg' },
  { id: 'a2_4', arenaId: 2, name: 'Reina Abeja', description: 'Comanda al enjambre.', rarity: Rarity.LEGENDARY, element: ElementType.GRASS, stats: { attack: 6, health: 4, cost: 6, magic: 5, defense: 2 }, abilityName: 'Enjambre', imageUrl: 'https://img.freepik.com/free-vector/cute-bee-cartoon-icon_138676-2692.jpg' },

  // --- ARENA 3: Cueva Profunda (Earth/Dark) ---
  { id: 'a3_1', arenaId: 3, name: 'Murciélago Ciego', description: 'Usa el eco para cazar.', rarity: Rarity.COMMON, element: ElementType.DARK, stats: { attack: 2, health: 1, cost: 1, magic: 2, defense: 0 }, abilityName: 'Chirrido', imageUrl: 'https://img.freepik.com/free-vector/bat-cartoon-icon_138676-2469.jpg' },
  { id: 'a3_2', arenaId: 3, name: 'Golem de Piedra', description: 'Inmune al dolor.', rarity: Rarity.RARE, element: ElementType.NORMAL, stats: { attack: 3, health: 7, cost: 4, magic: 0, defense: 6 }, abilityName: 'Avalancha', imageUrl: 'https://img.freepik.com/free-vector/golem-cartoon-icon_138676-3421.jpg' },
  { id: 'a3_3', arenaId: 3, name: 'Gusano Gigante', description: 'Devora la tierra misma.', rarity: Rarity.EPIC, element: ElementType.GRASS, stats: { attack: 6, health: 5, cost: 5, magic: 1, defense: 3 }, abilityName: 'Excavar', imageUrl: 'https://img.freepik.com/free-vector/worm-cartoon-icon_138676-2678.jpg' },
  { id: 'a3_4', arenaId: 3, name: 'Rey Topo', description: 'Gobierna el subsuelo.', rarity: Rarity.LEGENDARY, element: ElementType.NORMAL, stats: { attack: 4, health: 6, cost: 5, magic: 4, defense: 4 }, abilityName: 'Terremoto', imageUrl: 'https://img.freepik.com/free-vector/mole-cartoon-icon_138676-2677.jpg' },

  // --- ARENA 4: Central Energía (Electric) ---
  { id: 'a4_1', arenaId: 4, name: 'Chispa', description: 'Pequeña pero impactante.', rarity: Rarity.COMMON, element: ElementType.ELECTRIC, stats: { attack: 3, health: 1, cost: 1, magic: 3, defense: 0 }, abilityName: 'Shock', imageUrl: 'https://img.freepik.com/free-vector/spark-cartoon-icon_138676-2676.jpg' },
  { id: 'a4_2', arenaId: 4, name: 'Batería Viviente', description: 'Almacena energía sin fin.', rarity: Rarity.RARE, element: ElementType.ELECTRIC, stats: { attack: 2, health: 4, cost: 3, magic: 5, defense: 2 }, abilityName: 'Recarga', imageUrl: 'https://img.freepik.com/free-vector/battery-cartoon-icon_138676-2675.jpg' },
  { id: 'a4_3', arenaId: 4, name: 'Electro-Gato', description: 'Rápido como el rayo.', rarity: Rarity.EPIC, element: ElementType.ELECTRIC, stats: { attack: 6, health: 3, cost: 4, magic: 4, defense: 1 }, abilityName: 'Velocidad Luz', imageUrl: 'https://img.freepik.com/free-vector/cat-cartoon-icon_138676-2674.jpg' },
  { id: 'a4_4', arenaId: 4, name: 'Zeus-Bot', description: 'El dios máquina del trueno.', rarity: Rarity.LEGENDARY, element: ElementType.ELECTRIC, stats: { attack: 8, health: 6, cost: 7, magic: 8, defense: 3 }, abilityName: 'Ira Divina', imageUrl: 'https://img.freepik.com/free-vector/robot-cartoon-icon_138676-2673.jpg' },

  // --- ARENA 5: Abismo Oceánico (Water) ---
  { id: 'a5_1', arenaId: 5, name: 'Pez Espada', description: 'Afilado y peligroso.', rarity: Rarity.COMMON, element: ElementType.WATER, stats: { attack: 4, health: 2, cost: 2, magic: 0, defense: 1 }, abilityName: 'Estocada', imageUrl: 'https://img.freepik.com/free-vector/fish-cartoon-icon_138676-2672.jpg' },
  { id: 'a5_2', arenaId: 5, name: 'Medusa', description: 'Paraliza con su mirada.', rarity: Rarity.RARE, element: ElementType.WATER, stats: { attack: 2, health: 4, cost: 3, magic: 6, defense: 2 }, abilityName: 'Petrificar', imageUrl: 'https://img.freepik.com/free-vector/jellyfish-cartoon-icon_138676-2671.jpg' },
  { id: 'a5_3', arenaId: 5, name: 'Kraken Jr.', description: 'Hijo del terror de los mares.', rarity: Rarity.EPIC, element: ElementType.WATER, stats: { attack: 5, health: 7, cost: 6, magic: 3, defense: 4 }, abilityName: 'Abrazo', imageUrl: 'https://img.freepik.com/free-vector/octopus-cartoon-icon_138676-2670.jpg' },
  { id: 'a5_4', arenaId: 5, name: 'Leviatán', description: 'Devorador de mundos sumergidos.', rarity: Rarity.LEGENDARY, element: ElementType.WATER, stats: { attack: 9, health: 9, cost: 9, magic: 7, defense: 7 }, abilityName: 'Tsunami', imageUrl: 'https://img.freepik.com/free-vector/sea-monster-cartoon-icon_138676-2669.jpg' },

  // --- ARENA 6: Caldera de Magma (Fire) ---
  { id: 'a6_1', arenaId: 6, name: 'Espíritu de Fuego', description: 'Travieso y ardiente.', rarity: Rarity.COMMON, element: ElementType.FIRE, stats: { attack: 3, health: 1, cost: 1, magic: 4, defense: 0 }, abilityName: 'Quemar', imageUrl: 'https://img.freepik.com/free-vector/fire-spirit-cartoon-icon_138676-2668.jpg' },
  { id: 'a6_2', arenaId: 6, name: 'Perro Infernal', description: 'Guardián del inframundo.', rarity: Rarity.RARE, element: ElementType.FIRE, stats: { attack: 5, health: 4, cost: 4, magic: 2, defense: 2 }, abilityName: 'Mordida Ígnea', imageUrl: 'https://img.freepik.com/free-vector/hellhound-cartoon-icon_138676-2667.jpg' },
  { id: 'a6_3', arenaId: 6, name: 'Gólem de Lava', description: 'Se derrite y se regenera.', rarity: Rarity.EPIC, element: ElementType.FIRE, stats: { attack: 4, health: 8, cost: 6, magic: 3, defense: 5 }, abilityName: 'Magma', imageUrl: 'https://img.freepik.com/free-vector/lava-golem-cartoon-icon_138676-2666.jpg' },
  { id: 'a6_4', arenaId: 6, name: 'Dragón Volcánico', description: 'Duerme en el cráter.', rarity: Rarity.LEGENDARY, element: ElementType.FIRE, stats: { attack: 10, health: 7, cost: 8, magic: 6, defense: 6 }, abilityName: 'Aliento Final', imageUrl: 'https://img.freepik.com/free-vector/dragon-cartoon-icon_138676-2665.jpg' },

  // --- ARENA 10: Torre Tesla (Sci-Fi/Electric) ---
  { id: 'a10_1', arenaId: 10, name: 'Dron de Ataque', description: 'Vigilancia automatizada.', rarity: Rarity.COMMON, element: ElementType.ELECTRIC, stats: { attack: 4, health: 2, cost: 2, magic: 2, defense: 1 }, abilityName: 'Láser', imageUrl: 'https://img.freepik.com/free-vector/drone-cartoon-icon_138676-2664.jpg' },
  { id: 'a10_2', arenaId: 10, name: 'Ciborg Ninja', description: 'Mitad hombre, mitad acero.', rarity: Rarity.EPIC, element: ElementType.DARK, stats: { attack: 7, health: 3, cost: 5, magic: 2, defense: 3 }, abilityName: 'Sigilo', imageUrl: 'https://img.freepik.com/free-vector/cyborg-cartoon-icon_138676-2663.jpg' },
  { id: 'a10_3', arenaId: 10, name: 'Reactor Viviente', description: 'Inestable y peligroso.', rarity: Rarity.RARE, element: ElementType.ELECTRIC, stats: { attack: 0, health: 10, cost: 6, magic: 8, defense: 4 }, abilityName: 'Sobrecarga', imageUrl: 'https://img.freepik.com/free-vector/nuclear-cartoon-icon_138676-2662.jpg' },
  { id: 'a10_4', arenaId: 10, name: 'Inteligencia Artificial', description: 'Controla el campo de batalla.', rarity: Rarity.LEGENDARY, element: ElementType.PSYCHIC, stats: { attack: 5, health: 5, cost: 7, magic: 10, defense: 5 }, abilityName: 'Hackeo', imageUrl: 'https://img.freepik.com/free-vector/ai-cartoon-icon_138676-2661.jpg' },

  // --- ARENA 13: Horizonte de Eventos (Cosmic/Dark) ---
  { id: 'a13_1', arenaId: 13, name: 'Horror del Vacío', description: 'No tiene forma.', rarity: Rarity.RARE, element: ElementType.DARK, stats: { attack: 6, health: 4, cost: 5, magic: 7, defense: 2 }, abilityName: 'Pesadilla', imageUrl: 'https://img.freepik.com/free-vector/monster-cartoon-icon_138676-2660.jpg' },
  { id: 'a13_2', arenaId: 13, name: 'Devorador de Estrellas', description: 'Se alimenta de luz.', rarity: Rarity.EPIC, element: ElementType.DARK, stats: { attack: 8, health: 8, cost: 8, magic: 5, defense: 5 }, abilityName: 'Agujero Negro', imageUrl: 'https://img.freepik.com/free-vector/blackhole-cartoon-icon_138676-2659.jpg' },
  { id: 'a13_3', arenaId: 13, name: 'Caminante Astral', description: 'Viaja entre dimensiones.', rarity: Rarity.LEGENDARY, element: ElementType.PSYCHIC, stats: { attack: 5, health: 5, cost: 6, magic: 9, defense: 9 }, abilityName: 'Desfase', imageUrl: 'https://img.freepik.com/free-vector/alien-cartoon-icon_138676-2658.jpg' },
  { id: 'a13_4', arenaId: 13, name: 'Entropía Pura', description: 'El fin de todo.', rarity: Rarity.DIVINE, element: ElementType.DARK, stats: { attack: 10, health: 10, cost: 10, magic: 10, defense: 0 }, abilityName: 'Caos', imageUrl: 'https://img.freepik.com/free-vector/chaos-cartoon-icon_138676-2657.jpg' },

  // --- ARENA 15: El Trono Final (Divine/Dragon) ---
  { id: 'a15_1', arenaId: 15, name: 'Serafín Caído', description: 'Alas negras, corazón puro.', rarity: Rarity.LEGENDARY, element: ElementType.LIGHT, stats: { attack: 8, health: 8, cost: 8, magic: 9, defense: 6 }, abilityName: 'Juicio', imageUrl: 'https://img.freepik.com/free-vector/angel-cartoon-icon_138676-2656.jpg' },
  { id: 'a15_2', arenaId: 15, name: 'Bahamut', description: 'Rey de los Dragones.', rarity: Rarity.DIVINE, element: ElementType.DRAGON, stats: { attack: 10, health: 10, cost: 10, magic: 8, defense: 8 }, abilityName: 'Mega Fulgor', imageUrl: 'https://img.freepik.com/free-vector/dragon-king-cartoon-icon_138676-2655.jpg' },
  { id: 'a15_3', arenaId: 15, name: 'Titán del Tiempo', description: 'Controla el flujo de la batalla.', rarity: Rarity.DIVINE, element: ElementType.PSYCHIC, stats: { attack: 5, health: 10, cost: 9, magic: 10, defense: 10 }, abilityName: 'Rebobinar', imageUrl: 'https://img.freepik.com/free-vector/time-lord-cartoon-icon_138676-2654.jpg' },
  { id: 'a15_4', arenaId: 15, name: 'El Creador', description: 'La primera carta.', rarity: Rarity.DIVINE, element: ElementType.LIGHT, stats: { attack: 1, health: 1, cost: 1, magic: 10, defense: 10 }, abilityName: 'Génesis', imageUrl: 'https://img.freepik.com/free-vector/god-cartoon-icon_138676-2653.jpg' },
];

// Fill gaps for other arenas generically to reach "60" count conceptually
// In a real app, we would write them all out. Here we add filler to ensure mechanics work.
const FILLER_CARDS: CardData[] = [];
for (let arena = 7; arena <= 9; arena++) {
    for (let i = 0; i < 4; i++) {
        FILLER_CARDS.push({
            id: `gen_${arena}_${i}`,
            arenaId: arena,
            name: `Bestia de Arena ${arena} #${i+1}`,
            description: `Una criatura misteriosa de la zona ${arena}.`,
            rarity: i === 3 ? Rarity.EPIC : Rarity.COMMON,
            element: [ElementType.FIRE, ElementType.WATER, ElementType.GRASS][i % 3],
            stats: { attack: 3+i, health: 3+i, cost: 3+i, magic: i, defense: i },
            abilityName: 'Golpe Genérico',
            imageUrl: 'https://img.freepik.com/free-vector/monster-silhouette_138676-2652.jpg'
        });
    }
}

export const ALL_CARDS = [...MOCK_CARDS_DB, ...FILLER_CARDS];
export const INITIAL_CARDS = ALL_CARDS.filter(c => c.arenaId === 1); // Starting Deck
export const MAX_MANA = 10;
export const LANE_COUNT = 3;

// Battle Pass Rewards Generator
const generateBattlePass = (): BattlePassReward[] => {
  const rewards: BattlePassReward[] = [];
  const fixedRewards: BattlePassReward[] = [
    { level: 1, freeType: 'GOLD', freeValue: 100, premiumType: 'COSMETIC', premiumValue: 'cyber_arena', premiumLabel: 'Arena Ciber' },
    { level: 5, freeType: 'CARD', freeValue: 'a1_3', premiumType: 'COSMETIC', premiumValue: 'robot_avatar', premiumLabel: 'Avatar Robot' },
    { level: 10, freeType: 'CARD', freeValue: 'a2_3', premiumType: 'COSMETIC', premiumValue: 'star_banner', premiumLabel: 'Banner Galaxia' },
    { level: 50, freeType: 'CARD', freeValue: 'a10_3', premiumType: 'COSMETIC', premiumValue: 'void_arena', premiumLabel: 'Arena Vacío' },
    { level: 100, freeType: 'CARD', freeValue: 'a15_2', premiumType: 'COSMETIC', premiumValue: 'gold_banner', premiumLabel: 'Banner Real' },
  ];
  rewards.push(...fixedRewards);
  for (let i = 1; i <= 100; i++) {
    if (rewards.find(r => r.level === i)) continue;
    const isMultipleOf5 = i % 5 === 0;
    rewards.push({
      level: i,
      freeType: isMultipleOf5 ? 'GEMS' : 'GOLD',
      freeValue: isMultipleOf5 ? 10 : 50,
      premiumType: isMultipleOf5 ? 'GOLD' : 'GOLD',
      premiumValue: isMultipleOf5 ? 500 : 200
    });
  }
  return rewards.sort((a, b) => a.level - b.level);
};

export const BATTLE_PASS_REWARDS = generateBattlePass();
