
export enum Rarity {
  COMMON = 'COMUN',
  RARE = 'RARA',
  EPIC = 'EPICA',
  LEGENDARY = 'LEGENDARIA',
  DIVINE = 'MITICA', 
}

export enum ElementType {
  NORMAL = 'NORMAL',
  FIRE = 'FUEGO',
  WATER = 'AGUA',
  GRASS = 'PLANTA',
  ELECTRIC = 'ELECTRICO',
  PSYCHIC = 'PSIQUICO',
  DARK = 'OSCURIDAD',
  LIGHT = 'LUZ',
  DRAGON = 'DRAGON'
}

export interface CardStats {
  attack: number;
  health: number;
  cost: number;
  magic: number;   // Nueva estadística
  defense: number; // Nueva estadística
}

export interface CardData {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  element: ElementType;
  stats: CardStats;
  imageUrl: string;
  abilityName: string;
  arenaId: number; // Para desbloquear por arena
}

export interface Cosmetic {
  id: string;
  type: 'ARENA_SKIN' | 'AVATAR_FRAME' | 'BANNER' | 'AVATAR';
  name: string;
  value: string; // CSS class or Image URL
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  rankPoints: number;
  gold: number;
  gems: number; 
  murCoins: number; 
  collection: CardData[];
  deck: string[]; 
  
  // Clan
  clanId?: string;
  clanName?: string;
  
  // Forge Subscription
  unlockedForge: boolean; 
  labSubscriptionExpiry?: number; 

  // Battle Pass
  hasPremiumPass: boolean;
  passLevel: number;
  claimedRewards: number[]; 

  // Cosmetics
  ownedCosmetics: string[];
  equippedArenaSkin: string; 
  equippedAvatarFrame: string; 
  equippedBanner: string;
  equippedAvatar: string;
}

export interface Clan {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: number;
  minRank: number;
  isPrivate: boolean;
}

export interface ClanChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface BattleEntity {
  instanceId: string;
  cardId: string;
  currentHealth: number;
  maxHealth: number;
  owner: 'PLAYER' | 'ENEMY';
  laneIndex: number;
  canAttack: boolean;
  attackAnim?: string;
  mode: 'ATTACK' | 'DEFENSE';
}

export interface DamageEvent {
  id: string;
  value: number;
  x: number;
  y: number;
  isPlayer: boolean;
}

export interface MarketListing {
  id: string;
  sellerName: string;
  card: CardData;
  price: number;
}

export type ScreenState = 'SPLASH' | 'AUTH' | 'LOADING' | 'HOME' | 'DECK' | 'SHOP' | 'BATTLE' | 'FORGE' | 'CLANS' | 'LEADERBOARD' | 'PASS' | 'ADMIN' | 'CUSTOMIZE';

export interface ArenaLevel {
  id: number;
  name: string;
  bgGradient: string;
  minRankPoints: number;
}

export interface BattlePassReward {
  level: number;
  freeType: 'GOLD' | 'GEMS' | 'CARD';
  freeValue: number | string; 
  premiumType: 'GOLD' | 'GEMS' | 'COSMETIC' | 'CARD';
  premiumValue: number | string; 
  premiumLabel?: string;
}
