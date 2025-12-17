

export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  DIVINE = 'DIVINE'
}

export enum ElementType {
  NORMAL = 'NORMAL',
  FIRE = 'FIRE',
  WATER = 'WATER',
  GRASS = 'GRASS',
  ELECTRIC = 'ELECTRIC',
  PSYCHIC = 'PSYCHIC',
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  DRAGON = 'DRAGON'
}

export interface CardStats {
  attack: number;
  health: number;
  cost: number;
  magic: number;
  defense: number;
  speed?: 'SLOW' | 'NORMAL' | 'FAST';
}

export interface CardData {
  id: string;
  arenaId?: number;
  name: string;
  description: string;
  rarity: Rarity;
  element: ElementType;
  stats: CardStats;
  abilityName: string;
  imageUrl: string;
}

export interface ArenaLevel {
  id: number;
  name: string;
  bgGradient: string;
  minRankPoints: number;
}

export interface Cosmetic {
  id: string;
  type: 'ARENA_SKIN' | 'AVATAR_FRAME' | 'BANNER' | 'AVATAR';
  name: string;
  value: string;
  rarity: string;
}

export interface BattlePassReward {
  level: number;
  freeType: string;
  freeValue: number | string;
  premiumType: string;
  premiumValue: number | string;
  premiumLabel?: string;
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
  unlockedForge: boolean;
  hasPremiumPass: boolean;
  passLevel: number;
  claimedRewards: number[];
  ownedCosmetics: string[];
  equippedArenaSkin: string;
  equippedAvatarFrame: string;
  equippedBanner: string;
  equippedAvatar: string;
  walletAddress?: string;
  walletType?: string;
}

export interface MarketListing {
  id: string;
  sellerName: string;
  card: CardData;
  price: number;
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

export type ScreenState = 'SPLASH' | 'HOME' | 'DECK' | 'SHOP' | 'FORGE' | 'CLANS' | 'LEADERBOARD' | 'PASS' | 'BATTLE' | 'PUZZLE';

export interface BattleEntity {
  id: string; 
  cardId: string;
  currentHealth: number;
  owner: 'PLAYER' | 'ENEMY';
  position: number;
}

export interface DamageEvent {
    targetId: string;
    amount: number;
    isCritical: boolean;
}

export interface VisualEffect {
    id: string;
    type: 'ATTACK' | 'SPELL' | 'DEATH';
    targetId: string;
}