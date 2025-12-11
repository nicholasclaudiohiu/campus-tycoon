// CONTOH IMPLEMENTASI INVENTORY SYSTEM
// Dokumentasi lengkap cara menggunakan inventory di Campus Tycoon

/*
============================================
1. ALUR PEMBELIAN ITEM
============================================

User berdiri di Café:
1. Melihat Shop component yang menampilkan semua item dari lokasi Café
2. Melihat "Kopi Spesial" (Specialty Coffee) dengan harga Rp 25.000
3. Klik tombol "Buy - Rp 25.000"
4. Sistem validasi:
   - Cek apakah game.money >= item.price ✓ (misal punya 100.000)
5. Berhasil membeli:
   - Uang berkurang: 100.000 - 25.000 = 75.000
   - Item ditambah ke game.inventory
   - Toast: "✓ Beli Kopi Spesial! (Rp 25.000)"
   - Inventory button di HUD menunjukkan: "📦 Inventory (1/10)"

*/

/*
============================================
2. ALUR PENGGUNAAN ITEM
============================================

User di Inventory modal:
1. Lihat Kopi Spesial di inventory
2. Klik "Use" button
3. Sistem validasi:
   - Cek apakah item.type === 'Consumable' ✓
4. Berhasil digunakan:
   - Apply effects:
     - energy: +20
     - happiness: +5
     - money: 0
   - Status berubah:
     - energy: 60 + 20 = 80
     - happiness: 70 + 5 = 75
   - Item quantity berkurang
   - Toast: "✓ Gunakan Kopi Spesial!"
   - Inventory (1/10) → (0/10) jika hanya punya 1

*/

/*
============================================
3. DATA STRUCTURE INVENTORY
============================================

game.inventory adalah array of objects:

[
  {
    id: 'specialty_coffee',
    name: 'Kopi Spesial',
    icon: '☕✨',
    quantity: 2,                    // Bisa punya lebih dari 1
    itemData: { ... }               // Full item data
  },
  {
    id: 'pastry',
    name: 'Pastry Lezat',
    icon: '🥐',
    quantity: 1,
    itemData: { ... }
  }
]

*/

/*
============================================
4. CONTOH ITEM: SPECIALTY COFFEE
============================================

{
  id: 'specialty_coffee',
  name: 'Kopi Spesial',
  icon: '☕✨',
  location: 'Café',
  type: 'Consumable',              // Bisa dipakai habis
  price: 25000,                    // Harga Rp 25.000
  
  effects: {
    hunger: 0,
    energy: 20,                    // Tambah 20 energy
    hygiene: 0,
    happiness: 5,                  // Tambah 5 happiness
    money: 0
  },
  
  description: 'Kopi premium dengan aroma yang harum',
  notes: 'Energy boost yang kuat, minim hunger penalty',
  rarity: 'rare',
  
  // Optional: Usage limits
  // usageLimit: { count: 3, period: 'daily' }  // Max 3x per hari
}

*/

/*
============================================
5. HOOK FUNCTIONS
============================================

// Dari useGame hook, yang bisa diakses di App.jsx:

buyItem(itemId)
- Membeli item dan menambah ke inventory
- Mengecek uang cukup
- Mengurangi money dari game state
- Merging dengan item yang sudah ada (increase quantity)

useItem(itemId)
- Menggunakan item consumable
- Apply effects dari item ke game stats
- Mengurangi quantity atau hapus dari inventory
- Toast notification

IMPORT di App.jsx:
const { game, startGame, moveHero, doActivity, greeting, clockStr, 
        restart, timeAllowed, buyItem, useItem } = useGame();

*/

/*
============================================
6. COMPONENT STRUCTURE
============================================

App.jsx
├── Hud.jsx (menampilkan uang + Inventory button)
├── HotspotMap.jsx
├── ActivityCard.jsx (activities di lokasi)
│
└── Shop.jsx (NEW - menampilkan items bisa dibeli)
    └── ItemCard.jsx (NEW - kartu individual item)
        - Menampilkan icon, nama, description
        - Effects sebagai chips
        - Buy/Use button
        - Rarity badge

Inventory.jsx (modal popup)
├── Menampilkan 10 slots (5x2 grid)
├── Click item untuk... (bisa ditambah use button)

*/

/*
============================================
7. ITEMS YANG TERSEDIA
============================================

Lokasi: Café
- Pastry Lezat (🥐) - Rp 20.000 - Uncommon
- Kopi Spesial (☕✨) - Rp 25.000 - Rare

Lokasi: Mall
- Snack Pack (🍿) - Rp 15.000 - Common
- Premium Burger (🍔) - Rp 35.000 - Uncommon
- Laptop Secondhand (💻) - Rp 2.000.000 - Rare (Permanent)
- Gaming Console (🎮) - Rp 1.500.000 - Rare (Permanent)
- Bicycle (🚲) - Rp 800.000 - Uncommon (Permanent)

Lokasi: Kampus
- Kopi Kampus (☕) - Rp 8.000 - Common
- Buku Ajar (📖) - Free - Common
- Koleksi Buku Ajar (📚) - Rp 500.000 - Rare (Permanent)

Lokasi: Rumah
- Mie Instan (🍜) - Rp 3.000 - Common
- Minuman Energi (⚡) - Rp 12.000 - Uncommon
- Suplemen Vitamin (💊) - Rp 15.000 - Uncommon
- Hadiah Ulang Tahun (🎁) - Free - Rare

Lokasi: Hotel
- Menu Hotel (🍽️) - Rp 35.000 - Uncommon
- Spa Voucher (💆) - Rp 40.000 - Rare (Voucher)

Lokasi: Minimarket
- Air Mineral (💧) - Rp 3.000 - Common
- Snack Instan (🍘) - Rp 5.000 - Common
- Masker Wajah (🧖) - Rp 12.000 - Uncommon

Special Items (Event/Achievement):
- Surat Beasiswa (📜) - Free - Legendary
- Offer Letter Kerja (💼) - Free - Legendary
- Koin Beruntung (🪙) - Free - Legendary

*/

/*
============================================
8. TESTING FLOW
============================================

1. Start game
2. Move ke Café (atau lokasi manapun dengan shop)
3. Lihat Shop section muncul
4. Klik Buy pada Kopi Spesial
5. Check:
   - Money berkurang Rp 25.000
   - Inventory button: "📦 Inventory (1/10)"
6. Klik Inventory button
7. Modal terbuka, lihat Kopi Spesial di grid
8. (Bisa tambah Use button di modal untuk langsung gunakan)
9. Lihat effects terapply ke stats

*/

export default {};
