# Room-Based Activities System

## Overview
Sistem ini memungkinkan aktivitas untuk hanya tersedia di ruangan spesifik dalam lokasi Rumah. Avatar dapat bergerak ke ruangan yang berbeda dan aktivitas akan berubah sesuai dengan lokasi avatar saat ini.

## Struktur Rumah
Rumah dibagi menjadi 4 ruangan berdasarkan posisi di peta:

```
┌─────────────────────┬──────────────────────┐
│   BEDROOM (TL)      │  LIVING ROOM (TR)    │
│  (Kiri Atas)        │  (Kanan Atas)        │
├─────────────────────┼──────────────────────┤
│   BATHROOM (BL)     │   OFFICE (BR)        │
│  (Kiri Bawah)       │  (Kanan Bawah)       │
└─────────────────────┴──────────────────────┘
```

- **Bedroom (x < 50, y < 50)**: Kamar Tidur
  - Aktivitas: Tidur, Bersantai di kasur
  
- **Bathroom (x < 50, y ≥ 50)**: Kamar Mandi
  - Aktivitas: Mandi
  
- **Living Room (x ≥ 50, y < 50)**: Ruang Keluarga
  - Aktivitas: Makan, Menonton TV
  
- **Office (x ≥ 50, y ≥ 50)**: Ruang Kerja
  - Aktivitas: Kerja tugas rumah, Belajar coding

## Implementasi Teknis

### 1. Constants (src/utils/constants.js)
Setiap aktivitas di Rumah sekarang memiliki property `room`:

```javascript
{ 
  key: "tidur", 
  label: "Tidur", 
  room: "bedroom",  // <- Property baru
  // ... properties lainnya
}
```

Aktivitas tanpa property `room` (seperti item purchases) akan tersedia di semua ruangan.

### 2. Game State (src/hooks/useGame.js)

#### Tambahan pada initialGame:
```javascript
roomSubLoc: null  // Tracks current room in Rumah
```

#### Function detectRoom():
Mendeteksi ruangan berdasarkan posisi x,y avatar:
- Membagi peta menjadi 4 kuadran dengan titik pivot x=50, y=50
- Mengembalikan nama ruangan: 'bedroom', 'bathroom', 'living_room', atau 'office'

#### Update moveHero():
Setiap kali avatar bergerak di dalam Rumah, room detection dijalankan otomatis

#### Update enterLocation():
Ketika memasuki Rumah, room awal dideteksi berdasarkan posisi awal

### 3. Activity Filtering (src/App.jsx)

Filter activities dijalankan setelah mendapatkan aktivitas dari LOCATIONS:

```javascript
if (game.enteredLoc === 'Rumah' && game.roomSubLoc) {
  activities = activities.filter(act => {
    if (act.room) {
      return act.room === game.roomSubLoc;
    }
    return true; // Item purchases available everywhere
  });
}
```

### 4. Display Location Name (src/App.jsx)

Display name menunjukkan nama ruangan saat ini:
- "Rumah (Kamar Tidur)"
- "Rumah (Kamar Mandi)"
- "Rumah (Ruang Keluarga)"
- "Rumah (Ruang Kerja)"

## Testing

1. Masuk ke Rumah dengan menekan ENTER
2. Gerakkan avatar ke berbagai area rumah
3. Perhatikan:
   - Location name berubah sesuai ruangan
   - Aktivitas yang tersedia berubah sesuai ruangan
   - Item purchases selalu tersedia

## Extension untuk Lokasi Lain

Sistem ini dapat diperluas untuk lokasi lain dengan:

1. Menambahkan property `room` pada aktivitas
2. Menambahkan logic detectRoom untuk lokasi tersebut
3. Menambahkan filter di App.jsx

Contoh untuk Kampus dengan ruangan library, cafeteria, lapangan:
```javascript
// Di constants.js
{ key: "pinjam", label: "Pinjam buku", room: "library", ... }
{ key: "makan", label: "Makan", room: "cafeteria", ... }
```
