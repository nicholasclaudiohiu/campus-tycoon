// src/utils/constants.js
import { clamp } from './helpers.js';

import Mahasiswa1 from '../assets/Mahasiswa1.jpg';
import Mahasiswa2 from '../assets/Mahasiswa2.jpg';
import Mahasiswa3 from '../assets/Mahasiswa3.jpg';
import Mahasiswa4 from '../assets/Mahasiswa4.jpg';
import Mahasiswa5 from '../assets/Mahasiswa5.jpg';
import KampusImg from '../assets/kampus.jpg';
import RumahImg from '../assets/rumah.jpg';
import CafeImg from '../assets/cafe.jpg';
import MinimarketImg from '../assets/minimarket.jpg';
import LobbyHotelImg from '../assets/lobbyhotel.jpg';
import KamarHotelImg from '../assets/kamarhotel.jpg';
import MallImg from '../assets/mall.jpg';
import MapDefault from '../assets/map.png';

export const ROAD_LABEL = "Jalan";

export const AVATARS = [
  Mahasiswa1,
  Mahasiswa2,
  Mahasiswa3,
  Mahasiswa4,
  Mahasiswa5
];

// Location background images mapping
export const LOCATION_BACKGROUNDS = {
  "Kampus": KampusImg,
  "Rumah": RumahImg,
  "Café": CafeImg,
  "Minimarket": MinimarketImg,
  "Hotel_Lobby": LobbyHotelImg,
  "Hotel_Kamar": KamarHotelImg,
  "Mall": MallImg
};

// Location map images for HotspotMap component
export const LOCATION_MAPS = {
  "Kampus": KampusImg,      // Map display when inside Kampus
  "Rumah": RumahImg,        // Map display when inside Rumah
  "Café": CafeImg,          // Map display when inside Café
  "Minimarket": MinimarketImg, // Map display when inside Minimarket
  "Hotel_Lobby": LobbyHotelImg,  // Map display when in hotel lobby
  "Hotel_Kamar": KamarHotelImg,  // Map display when in hotel room
  "Mall": MallImg,          // Map display when inside Mall
  // Default map for other locations or when on road
  "DEFAULT": MapDefault
};

export const HOTSPOTS_DATA = [
  { loc: "Kampus", left: 60, top: 70, width: 240, height: 170 },
  { loc: "Mall", left: 520, top: 70, width: 250, height: 170 },
  { loc: "Minimarket", left: 810, top: 70, width: 230, height: 170 },
  { loc: "Hotel", left: 60, top: 360, width: 260, height: 190 },
  { loc: "Café", left: 390, top: 360, width: 260, height: 190 },
  { loc: "Rumah", left: 760, top: 360, width: 260, height: 190 }
];

export const MAP_ORIGINAL_WIDTH = 1060;
export const MAP_ORIGINAL_HEIGHT = 740;

// LOCATIONS copied & lightly adapted from your app.js
// UPDATED: Struktur sekarang memisahkan "enter location" dari activities
export const LOCATIONS = {
  "Kampus": [
    { key: "kuliah", label: "Ikut kuliah", info: "🍔 -4 • ⚡ -10 • 🙂 +5 • ⏱10 • (09–11 Sen–Jum)", effects: { hunger: -4, energy: -10, happiness: +5, money: 0 }, time: 10, window: [9 * 60, 11 * 60], weekdayOnly: true, flag: "kuliah", zone: "main_building" },
    { key: "fokus", label: "Belajar fokus", info: "🍔 -3 • ⚡ -8 • 🙂 -3 • ⏱10 • bonus 🙂 +2 jika ⚡ ≥ 70", effects: { hunger: -3, energy: -8, happiness: -3, money: 0 }, time: 10, bonus: { cond: (game) => game.energy >= 70, apply: () => ({ happiness: +2 }) }, zone: "main_building" },
    { key: "bareng", label: "Belajar bareng", info: "🍔 -2 • ⚡ -8 • 🙂 +6 • ⏱10", effects: { hunger: -2, energy: -8, happiness: +6, money: 0 }, time: 10, zone: "main_building" },
    { key: "pinjam", label: "Pinjam buku", info: "⚡ -2 • 🙂 +2 • ⏱5", effects: { energy: -2, happiness: +2, money: 0 }, time: 5, zone: "main_building" },
    { key: "olahraga", label: "Olahraga ringan", info: "🍔 -3 • ⚡ -12 • 🧼 -6 • 🙂 +10 • ⏱30", effects: { hunger: -3, energy: -12, hygiene: -6, happiness: +10, money: 0 }, time: 30, zone: "field" },
    { key: "bazar", label: "Jaga stand bazar", info: "🍔 -2 • ⚡ -15 • 🙂 +8 • 💰 +20.000 (±5k) • ⏱60 • Sen–Jum", effects: { hunger: -2, energy: -15, happiness: +8 }, time: 60, weekdayOnly: true, tag: "bazar", zone: "bazaar" },
    { key: "cuci", label: "Cuci muka", info: "🧼 +8 • 🙂 +2 • ⏱4", effects: { hygiene: +8, happiness: +2, money: 0 }, time: 4, zone: "toilet" },
    { key: "ganti", label: "Ganti baju", info: "⚡ -1 • 🧼 +10 • 🙂 +1 • ⏱5", effects: { energy: -1, hygiene: +10, happiness: +1, money: 0 }, time: 5, zone: "dorm" },
    { key: "hemat", label: "Paket hemat", info: "🍔 +30 • ⚡ +2 • 🙂 +4 • 💰 -15.000 • ⏱8", effects: { hunger: +30, energy: +2, happiness: +4, money: -15000 }, time: 8, zone: "bazaar" },
    { key: "sehat", label: "Menu sehat", info: "🍔 +20 • ⚡ +5 • 🙂 +5 • 💰 -20.000 • ⏱10", effects: { hunger: +20, energy: +5, happiness: +5, money: -20000 }, time: 10, zone: "bazaar" },
    // ITEMS
    { key: "buy_coffee", label: "☕ Kopi Kampus", info: "💰 -8.000 • ⚡ +15 • 🙂 +2 • ⏱5", itemId: "coffee", type: "item", price: 8000, effects: { hunger: 0, energy: 15, hygiene: 0, happiness: 2, money: -8000 }, time: 5, zone: "bazaar" }
  ],
  "Rumah": [
    // Bedroom activities
    { key: "tidur", label: "Tidur", info: "⚡ +50 • 🙂 +10 • 🍔 -8 • ⏱60 • (22–06)", effects: { energy: +50, happiness: +10, hunger: -8 }, time: 60, window: [22 * 60, 6 * 60], room: "bedroom" },
    { key: "bersantai", label: "Bersantai di kasur", info: "🙂 +1 • ⚡ +5 • ⏱8", effects: { happiness: +8, energy: +5, money: 0 }, time: 8, room: "bedroom" },
    
    // Bathroom activities
    { key: "mandi", label: "Mandi", info: "🧼 +35 • ⚡ +6 • 🙂 +3 • ⏱10 • max 2×/hari", effects: { hygiene: +35, energy: +6, happiness: +3, money: 0 }, time: 10, limitCount: ["mandi", 2], room: "bathroom" },
    
    // Living room activities
    { key: "makan", label: "Makan", info: "🍔 +28 • ⚡ +4 • 🙂 +6 • 💰 0 • ⏱10 • max 2×/hari", effects: { hunger: +28, energy: +4, happiness: +6, money: 0 }, time: 10, limitCount: ["makan", 2], room: "living_room" },
    { key: "nonton", label: "Menonton TV", info: "🙂 +8 • ⚡ -3 • 🍔 -2 • ⏱15", effects: { happiness: +12, energy: -3, hunger: -2, money: 0 }, time: 15, room: "living_room" },
    
    // Office/Computer room activities
    { key: "kerja", label: "Kerja tugas rumah", info: "💰 +40.000 • 🍔 -3 • ⚡ -8 • 🧼 -2 • 🙂 +2 • ⏱10 • max 2×/hari", effects: { money: +40000, hunger: -3, energy: -8, hygiene: -2, happiness: +2 }, time: 10, limitCount: ["kerjaRumah", 2], room: "office" },
    { key: "coding", label: "Belajar coding", info: "💰 +30.000 • ⚡ -10 • 🙂 +5 • ⏱15 • max 2×/hari", effects: { money: +30000, energy: -10, happiness: +5, money: 0 }, time: 15, limitCount: ["coding", 2], room: "office" }
  ],
  "Café": [
    { key: "ringkas", label: "Makan ringan", info: "🍔 +20 • ⚡ +3 • 🙂 +6 • 💰 -20.000 • ⏱10", effects: { hunger: +20, energy: +3, happiness: +6, money: -20000 }, time: 10 },
    { key: "nongkrong", label: "Nongkrong", info: "🙂 +10 • ⚡ -4 • 🍔 -2 • 💰 -15.000 • ⏱12", effects: { happiness: +10, energy: -4, hunger: -2, money: -15000 }, time: 12 },
    { key: "barista", label: "Part-time barista", info: "Weekday: 💰 +45.000 • ⏱180 • ≤20.00 • max 2×/hari • Weekend: 💰 +75.000 • ⏱300", effects: { money: +45000, energy: -20, hygiene: -8, happiness: -4 }, time: 180, limitCount: ["barista", 2], maxHour: 20, weekend: { money: +75000, time: 300 } },
    // ITEMS - BUY TYPE
    { key: "buy_pastry", label: "🥐 Pastry Lezat", info: "💰 -20.000 • 🍔 +15 • 🙂 +8 • ⏱5", itemId: "pastry", type: "item", price: 20000, effects: { hunger: 15, energy: 0, hygiene: 0, happiness: 8, money: -20000 }, time: 5 },
    { key: "buy_specialty_coffee", label: "☕✨ Kopi Spesial", info: "💰 -25.000 • ⚡ +20 • 🙂 +5 • ⏱5", itemId: "specialty_coffee", type: "item", price: 25000, effects: { hunger: 0, energy: 20, hygiene: 0, happiness: 5, money: -25000 }, time: 5 }
  ],
  "Mall": [
    { key: "shopping", label: "Shopping", zone: "shopping",
      info: "🙂 +10 • ⚡ -1 • 🧼 +2 • 💰 -25.000 • ⏱30",
      effects: { happiness: +10, energy: -1, hygiene: +2, money: -25000 }, time: 30
    },

    { key: "bioskop", label: "Bioskop", zone: "cinema",
      info: "🙂 +15 • ⚡ -6 • 💰 -35.000 • ⏱12",
      effects: { happiness: +15, energy: -6, money: -35000 }, time: 12
    },

    { key: "arkade", label: "Arkade (token)", zone: "arcade",
      info: "🙂 +15 • ⚡ -6 • 💰 -10.000 • ⏱30 • 35% bonus +5.000",
      effects: { happiness: +15, energy: -6, money: -10000 }, time: 30
    },

    { key: "foodcourt", label: "Makan", zone: "foodcourt",
      info: "🍔 +28 • ⚡ +4 • 🙂 +8 • 💰 -25.000 • ⏱10",
      effects: { hunger: +28, energy: +4, happiness: +8, money: -25000 }, time: 10
    },

    { key: "karaoke", label: "Karaoke", zone: "karaoke",
      info: "🙂 +18 • ⚡ -10 • 🧼 -6 • 💰 -40.000 • ⏱60",
      effects: { happiness: +18, energy: -10, hygiene: -6, money: -40000 }, time: 60
    },



    { key: "toilet", label: "Toilet mall", zone: "toilet",
      info: "🧼 +8 • 🙂 +2 • ⏱3",
      effects: { hygiene: +8, happiness: +2, money: 0 }, time: 3
    },

    // items → zone foodcourt karena biasanya beli snack di foodcourt
    { key: "buy_snack", label: "🍿 Snack Pack", zone: "foodcourt",
      info: "💰 -15.000 • 🍔 +12 • 🙂 +6 • ⏱5",
      price: 15000,
      itemId: "snack_pack",
      type: "item",
      effects: { hunger: 12, happiness: 6, money: -15000 }, time: 5
    },

    { key: "buy_burger", label: "🍔 Premium Burger", zone: "foodcourt",
      info: "💰 -35.000 • 🍔 +28 • 🙂 +10 • ⏱5",
      price: 35000,
      itemId: "premium_burger",
      type: "item",
      effects: { hunger: 28, happiness: 10, money: -35000 }, time: 5
    }
],

  "Hotel": [
    { key: "checkin", label: "Check-in", info: "💰 -70.000 • fasilitas aktif hingga 10.00", effects: { money: -70000 }, time: 2, tag: "checkin", hotelArea: "lobby" },
    { key: "tv", label: "Get some happiness (TV)", info: "🙂 +20 • ⚡ -6 • ⏱10 • perlu check-in", effects: { happiness: +20, energy: -6 }, time: 10, needs: "checkin", hotelArea: "kamar" },
    { key: "istirahat", label: "Istirahat", info: "⚡ +30 • 🙂 +6 • ⏱60 • perlu check-in", effects: { energy: +30, happiness: +6 }, time: 60, needs: "checkin", hotelArea: "kamar" },
    { key: "mandi", label: "Mandi", info: "🧼 +35 • 🙂 +4 • ⚡ +6 • ⏱12 • perlu check-in", effects: { hygiene: +35, happiness: +4, energy: +6 }, time: 12, needs: "checkin", hotelArea: "kamar" },
    { key: "roomsvc", label: "Room service makan", info: "🍔 +30 • ⚡ +6 • 🙂 +8 • 💰 -35.000 • ⏱10 • perlu check-in", effects: { hunger: +30, energy: +6, happiness: +8, money: -35000 }, time: 10, needs: "checkin", hotelArea: "kamar" }
  ],
  "Minimarket": [
    { key: "kasir", label: "Part-time kasir", info: "Weekday: 💰 +45.000 • ⏱180 • ≤20.00 • max 2×/hari • Weekend: 💰 +75.000 • ⏱300", effects: { money: +45000, energy: -20, hygiene: -4, happiness: -8, hunger: -2 }, time: 180, limitCount: ["kasir", 2], maxHour: 20, weekend: { money: +75000, time: 300 } },
    { key: "snack", label: "Belanja snack", info: "🍔 +12 • ⚡ +2 • 🙂 +2 • 💰 -8.000 • ⏱10", effects: { hunger: +12, energy: +2, happiness: +2, money: -8000 }, time: 10 },
    { key: "toiletries", label: "Belanja toiletries", info: "🧼 +15 • 🙂 +3 • 💰 -10.000 • ⏱10", effects: { hygiene: +15, happiness: +3, money: -10000 }, time: 10 },
    // ITEMS
    { key: "buy_water", label: "💧 Air Mineral", info: "💰 -3.000 • ⚡ +3 • ⏱5", itemId: "mineral_water", type: "item", price: 3000, effects: { hunger: 0, energy: 3, hygiene: 0, happiness: 0, money: -3000 }, time: 5 },
    { key: "buy_noodles", label: "🍜 Mie Instan", info: "💰 -3.000 • 🍔 +20 • 🙂 +1 • ⏱5", itemId: "instant_noodles", type: "item", price: 3000, effects: { hunger: 20, energy: 0, hygiene: 0, happiness: 1, money: -3000 }, time: 5 },
    { key: "buy_energy", label: "⚡ Minuman Energi", info: "💰 -12.000 • ⚡ +25 • 🙂 +3 • ⏱5", itemId: "energy_drink", type: "item", price: 12000, effects: { hunger: 0, energy: 25, hygiene: 0, happiness: 3, money: -12000 }, time: 5 },
    { key: "buy_instant_snack", label: "🍘 Snack Instan", info: "💰 -5.000 • 🍔 +8 • 🙂 +2 • ⏱5", itemId: "instant_snack", type: "item", price: 5000, effects: { hunger: 8, energy: 0, hygiene: 0, happiness: 2, money: -5000 }, time: 5 }
  ]
};
