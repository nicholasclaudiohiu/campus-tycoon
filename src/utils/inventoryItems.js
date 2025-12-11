// src/utils/inventoryItems.js
// Daftar item inventory untuk game Campus Tycoon

export const INVENTORY_ITEMS = [
  // ===== CONSUMABLE ITEMS (Bisa dipakai, habis) =====
  
  // Kampus
  {
    id: 'coffee',
    name: 'Kopi Kampus',
    icon: '☕',
    location: 'Kampus',
    type: 'Consumable',
    price: 8000,
    effects: { hunger: 0, energy: 15, hygiene: 0, happiness: 2, money: 0 },
    notes: 'Bisa dipakai kapan saja',
    rarity: 'common'
  },
  
  {
    id: 'textbook',
    name: 'Buku Ajar',
    icon: '📖',
    location: 'Kampus',
    type: 'Consumable',
    price: 0,
    effects: { hunger: 0, energy: -5, hygiene: 0, happiness: 2, money: 0 },
    notes: 'Bonus happiness +2 saat belajar fokus',
    rarity: 'common',
    usageLimit: { count: 3, period: 'daily' }
  },

  // Rumah
  {
    id: 'instant_noodles',
    name: 'Mie Instan',
    icon: '🍜',
    location: 'Rumah',
    type: 'Consumable',
    price: 3000,
    effects: { hunger: 20, energy: 2, hygiene: 0, happiness: 1, money: 0 },
    notes: 'Item rumahan sederhana',
    rarity: 'common'
  },

  {
    id: 'energy_drink',
    name: 'Minuman Energi',
    icon: '⚡',
    location: 'Rumah',
    type: 'Consumable',
    price: 12000,
    effects: { hunger: -2, energy: 25, hygiene: 0, happiness: 3, money: 0 },
    notes: 'Efektif sebelum aktivitas berat',
    rarity: 'uncommon'
  },

  {
    id: 'vitamin',
    name: 'Suplemen Vitamin',
    icon: '💊',
    location: 'Rumah',
    type: 'Consumable',
    price: 15000,
    effects: { hunger: 0, energy: 10, hygiene: 5, happiness: 2, money: 0 },
    notes: 'Konsumsi rutin untuk hasil maksimal',
    usageLimit: { count: 1, period: 'daily' },
    rarity: 'uncommon'
  },

  // Café
  {
    id: 'pastry',
    name: 'Pastry Lezat',
    icon: '🥐',
    location: 'Café',
    type: 'Consumable',
    price: 20000,
    effects: { hunger: 15, energy: 3, hygiene: 0, happiness: 8, money: 0 },
    notes: 'Boost happiness yang bagus',
    rarity: 'uncommon'
  },

  {
    id: 'specialty_coffee',
    name: 'Kopi Spesial',
    icon: '☕✨',
    location: 'Café',
    type: 'Consumable',
    price: 25000,
    effects: { hunger: 0, energy: 20, hygiene: 0, happiness: 5, money: 0 },
    notes: 'Energy boost yang kuat, minim hunger penalty',
    rarity: 'rare'
  },

  // Mall
  {
    id: 'snack_pack',
    name: 'Snack Pack',
    icon: '🍿',
    location: 'Mall',
    type: 'Consumable',
    price: 15000,
    effects: { hunger: 12, energy: 1, hygiene: 0, happiness: 6, money: 0 },
    notes: 'Bisa dimakan sambil main atau belajar',
    rarity: 'common'
  },

  {
    id: 'premium_burger',
    name: 'Burger Premium',
    icon: '🍔',
    location: 'Mall',
    type: 'Consumable',
    price: 35000,
    effects: { hunger: 28, energy: 5, hygiene: 0, happiness: 10, money: 0 },
    notes: 'Lebih bergizi dan memuaskan',
    rarity: 'uncommon'
  },

  // Hotel
  {
    id: 'hotel_meal',
    name: 'Menu Hotel',
    icon: '🍽️',
    location: 'Hotel',
    type: 'Consumable',
    price: 35000,
    effects: { hunger: 30, energy: 8, hygiene: 0, happiness: 12, money: 0 },
    notes: 'Hanya tersedia saat check-in',
    rarity: 'uncommon'
  },

  {
    id: 'spa_voucher',
    name: 'Spa Voucher',
    icon: '💆',
    location: 'Hotel',
    type: 'Voucher',
    price: 40000,
    effects: { hunger: 0, energy: 15, hygiene: 20, happiness: 15, money: 0 },
    notes: 'Pakai untuk relaksasi total',
    usageLimit: { count: 1, period: 'weekly' },
    rarity: 'rare'
  },

  // Minimarket
  {
    id: 'instant_snack',
    name: 'Snack Instan',
    icon: '🍘',
    location: 'Minimarket',
    type: 'Consumable',
    price: 5000,
    effects: { hunger: 8, energy: 0, hygiene: 0, happiness: 2, money: 0 },
    notes: 'Paling murah, cukup mengenyangkan',
    rarity: 'common'
  },

  {
    id: 'mineral_water',
    name: 'Air Mineral',
    icon: '💧',
    location: 'Minimarket',
    type: 'Consumable',
    price: 3000,
    effects: { hunger: 0, energy: 3, hygiene: 0, happiness: 0, money: 0 },
    notes: 'Item dasar yang penting',
    rarity: 'common'
  },

  {
    id: 'facial_mask',
    name: 'Masker Wajah',
    icon: '🧖',
    location: 'Minimarket',
    type: 'Consumable',
    price: 12000,
    effects: { hunger: 0, energy: -2, hygiene: 15, happiness: 3, money: 0 },
    notes: 'Meningkatkan hygiene signifikan',
    usageLimit: { count: 2, period: 'weekly' },
    rarity: 'uncommon'
  },

  // ===== PERMANENT ITEMS (Tidak habis, bonus berkelanjutan) =====

  {
    id: 'laptop',
    name: 'Laptop Secondhand',
    icon: '💻',
    location: 'Mall',
    type: 'Permanent',
    price: 2000000,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 0, money: 0 },
    notes: '+5% earning dari part-time, dapat digunakan di mana saja',
    bonus: { earningBonus: 0.05 },
    rarity: 'rare'
  },

  {
    id: 'textbook_collection',
    name: 'Koleksi Buku Ajar',
    icon: '📚',
    location: 'Kampus',
    type: 'Permanent',
    price: 500000,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 0, money: 0 },
    notes: '+3 happiness saat belajar, -10% energy cost untuk kuliah',
    bonus: { studyBonus: 0.1 },
    rarity: 'rare'
  },

  {
    id: 'gaming_console',
    name: 'Gaming Console',
    icon: '🎮',
    location: 'Mall',
    type: 'Permanent',
    price: 1500000,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 0, money: 0 },
    notes: '+8 happiness saat bersantai di rumah, -15% energy drain saat istirahat',
    bonus: { relaxBonus: 0.2 },
    rarity: 'rare'
  },

  {
    id: 'bicycle',
    name: 'Sepeda',
    icon: '🚲',
    location: 'Mall',
    type: 'Permanent',
    price: 800000,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 0, money: 0 },
    notes: 'Movement faster (+20% speed), dapat jalan kapan saja',
    bonus: { movementSpeed: 1.2 },
    rarity: 'uncommon'
  },

  // ===== SPECIAL ITEMS (Item unik dengan efek spesial) =====

  {
    id: 'scholarship_letter',
    name: 'Surat Beasiswa',
    icon: '📜',
    location: 'Kampus',
    type: 'Voucher',
    price: 0,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 10, money: 300000 },
    notes: 'Reward langka dari achievement kuliah rajin',
    usageLimit: { count: 1, period: 'permanent' },
    rarity: 'legendary'
  },

  {
    id: 'job_offer_letter',
    name: 'Offer Letter Kerja',
    icon: '💼',
    location: 'Mall',
    type: 'Voucher',
    price: 0,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 15, money: 500000 },
    notes: 'Reward dari achievement part-time excellence',
    usageLimit: { count: 1, period: 'permanent' },
    rarity: 'legendary'
  },

  {
    id: 'birthday_gift',
    name: 'Hadiah Ulang Tahun',
    icon: '🎁',
    location: 'Rumah',
    type: 'Consumable',
    price: 0,
    effects: { hunger: 10, energy: 5, hygiene: 0, happiness: 20, money: 0 },
    notes: 'Random item dengan efek positif tinggi, dapat muncul di event',
    rarity: 'rare'
  },

  {
    id: 'lucky_coin',
    name: 'Koin Beruntung',
    icon: '🪙',
    location: 'Unknown',
    type: 'Permanent',
    price: 0,
    effects: { hunger: 0, energy: 0, hygiene: 0, happiness: 0, money: 0 },
    notes: '+10% RNG bonus untuk semua aktivitas, effect permanen',
    bonus: { luckBonus: 1.1 },
    rarity: 'legendary'
  }
];

// Helper function untuk get item by ID
export function getItemById(itemId) {
  return INVENTORY_ITEMS.find(item => item.id === itemId);
}

// Helper function untuk get items by location
export function getItemsByLocation(location) {
  return INVENTORY_ITEMS.filter(item => item.location === location);
}

// Helper function untuk get items by type
export function getItemsByType(type) {
  return INVENTORY_ITEMS.filter(item => item.type === type);
}

// Helper function untuk apply item effect ke game state
export function applyItemEffect(game, itemId) {
  const item = getItemById(itemId);
  if (!item) return game;

  const { effects } = item;
  return {
    ...game,
    hunger: Math.min(100, Math.max(0, game.hunger + (effects.hunger || 0))),
    energy: Math.min(100, Math.max(0, game.energy + (effects.energy || 0))),
    hygiene: Math.min(100, Math.max(0, game.hygiene + (effects.hygiene || 0))),
    happiness: Math.min(100, Math.max(0, game.happiness + (effects.happiness || 0))),
    money: Math.max(0, game.money + (effects.money || 0))
  };
}
