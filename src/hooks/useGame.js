// src/hooks/useGame.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { clamp, H, between, DOW } from '../utils/helpers';
import { LOCATIONS, HOTSPOTS_DATA, ROAD_LABEL } from '../utils/constants';
import { getItemById, applyItemEffect } from '../utils/inventoryItems';

const initialGame = {
  started: false,
  name: 'Ucup',
  face: '🙂',
  hunger: 80, energy: 80, hygiene: 80, happiness: 70, money: 100000,
  day: 1, minutes: 7 * 60, timeScale: 60,
  decay: { hunger: 2 / 60, energy: 2 / 60, hygiene: 2 / 60, happiness: 2 / 60 },
  x: 77.36, y: 56.76, currentLoc: 'Rumah',
  enteredLoc: null, // Track which location player has entered (null = not entered)
  enteredLocX: null, // Save x position when entering location
  enteredLocY: null, // Save y position when entering location
  flags: { checkin: false },
  counters: { mandi: 0, makan: 0, barista: 0, kasir: 0, kerjaRumah: 0 },
  daily: { attendedKuliah: false },
  inventory: [],
  // Tracking for Life Satisfaction Score (using arrays instead of Set)
  visitedLocations: [],
  activitiesPerformed: {},
  itemsUsed: [],
  // Activity animation state
  activeActivity: null, // { key, label, startTime, duration }
  activityProgress: 0, // 0-100 percentage of completion
  // Hotel sub-location state (null = not in hotel, 'lobby' = in lobby, 'kamar' = in room)
  hotelSubLoc: null,
  // Room sub-location state for Rumah (bedroom, bathroom, living_room, office)
  roomSubLoc: null,
  // Kampus zone state (main_building, dorm, toilet, field, bazaar)
  kampusZone: null
};

export function useGame() {
  const [game, setGame] = useState(initialGame);
  const loopRef = useRef(null);
  const toastRef = useRef(null);

  // helpers
  const isWeekend = useCallback(() => {
    const dow = DOW[(game.day - 1) % 7];
    return dow === 'Sat' || dow === 'Sun';
  }, [game.day]);

  const isWeekday = useCallback(() => !isWeekend(), [isWeekend]);

  // start game
  const startGame = (opts = {}) => {
    setGame(g => ({ ...g, started: true, name: opts.name || g.name, face: opts.face || g.face }));
    startTick();
  };

  // startTick as regular function (avoid useCallback misuse)
  function startTick() {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = setInterval(() => {
      advanceMinutes(1);
    }, 1000 / (initialGame.timeScale / 60));
  }

  useEffect(() => {
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, []);

  const toast = (msg) => {
    if (toastRef.current) clearTimeout(toastRef.current);
    console.info('TOAST:', msg);
    toastRef.current = setTimeout(() => {}, 1500);
  };

  function greeting() {
    const { h } = H(game.minutes);
    if (h >= 5 && h < 12) return 'Good morning';
    if (h >= 12 && h < 16) return 'Good afternoon';
    if (h >= 16 && h < 20) return 'Good evening';
    return 'Good night';
  }

  function clockStr() {
    const { h, m } = H(game.minutes);
    const dow = DOW[(game.day - 1) % 7];
    return `Day ${game.day} • ${dow} • ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // detect location based on hero x/y and hotspots geometry (percent)
  function detectLocation(x = game.x, y = game.y) {
    let matched = null;
    HOTSPOTS_DATA.forEach(spot => {
      const leftP = (spot.left / 1060) * 100;
      const topP = (spot.top / 740) * 100;
      const wP = (spot.width / 1060) * 100;
      const hP = (spot.height / 740) * 100;
      if (x >= leftP && x <= leftP + wP && y >= topP && y <= topP + hP) {
        matched = spot.loc;
      }
    });
    const newLoc = matched || ROAD_LABEL;
    if (newLoc !== game.currentLoc) {
      setGame(g => ({ ...g, currentLoc: newLoc }));
    }
    return newLoc;
  }

  // detect room within a location (for Rumah)
  function detectRoom(x = game.x, y = game.y, location = game.enteredLoc) {
    if (location !== 'Rumah') return null;
    
    // Room layout based on the rumah.jpg image
    // Rumah dibagi menjadi 4 ruangan: kiri atas = bedroom, kiri bawah = bathroom, 
    // kanan atas = living room, kanan bawah = office
    
    // Simple quadrant detection (left/right, top/bottom)
    const isLeft = x < 50;
    const isTop = y < 50;
    
    if (isLeft && isTop) {
      return 'bedroom';
    } else if (isLeft && !isTop) {
      return 'bathroom';
    } else if (!isLeft && isTop) {
      return 'living_room';
    } else {
      return 'office';
    }
  }

  function detectKampusZone(x = game.x, y = game.y) {
    // Deteksi zona berdasarkan posisi spesifik di gambar kampus
    // Menggunakan koordinat yang lebih presisi sesuai layout asli
    
    // TOILET - Pos kecil biru di kanan tengah (88-100% x, 38-55% y)
    if (x >= 88 && x <= 100 && y >= 38 && y <= 55) {
      return "toilet";
    }
    
    // DORM - Gedung kubah besar di kanan atas (55-85% x, 0-50% y)
    if (x >= 55 && x < 85 && y >= 0 && y <= 50) {
      return "dorm";
    }
    
    // MAIN BUILDING - Gedung kuning dengan jam di kiri atas (0-45% x, 0-40% y)
    if (x >= 0 && x <= 45 && y >= 0 && y <= 40) {
      return "main_building";
    }
    
    // BAZAAR - Area kantin dengan meja di kiri bawah (0-35% x, 55-100% y)
    if (x >= 0 && x <= 35 && y >= 55 && y <= 100) {
      return "bazaar";
    }
    
    // FIELD - Lapangan hijau di tengah (area yang lebih besar dan presisi)
    // Lapangan mencakup area tengah yang cukup luas
    if (x >= 20 && x <= 85 && y >= 30 && y <= 85) {
      // Tapi exclude area yang sudah didefinisikan di atas
      // Kalau sudah terdeteksi dorm atau toilet, tidak override
      if (!(x >= 85 && y <= 35)) { // bukan toilet
        if (!(x >= 55 && x < 85 && y <= 45)) { // bukan dorm
          return "field";
        }
      }
    }
    
    // Area transisi atau pinggir - tidak ada zona
    return null;
  }

  function detectMallZone(x = game.x, y = game.y) {
    const col = x < 33 ? 1 : (x < 66 ? 2 : 3);
    const row = y < 50 ? 1 : 2;

    // row 1 (atas)
    if (row === 1 && col === 1) return "cinema";
    if (row === 1 && col === 2) return "arcade";
    if (row === 1 && col === 3) return "karaoke";

    // row 2 (bawah)
    if (row === 2 && col === 1) return "foodcourt";
    if (row === 2 && col === 2) return "shopping";

    // fashion & tas tampil sama → shopping
    if (row === 2 && col === 3) return "shopping";

    return null;
}


  // movement
  const moveHero = (dir) => {
    setGame(g => {
      let nx = g.x, ny = g.y;
      const step = 2;
      if (dir === 'left') nx = g.x - step;
      if (dir === 'right') nx = g.x + step;
      if (dir === 'up') ny = g.y - step;
      if (dir === 'down') ny = g.y + step;
      
      // If inside a location, allow free movement within bounds
      if (g.enteredLoc) {
        // Allow wider boundaries for inside location
        nx = Math.max(0, Math.min(nx, 100));
        ny = Math.max(0, Math.min(ny, 100));
        const res = { ...g, x: nx, y: ny };
        
        // Detect room if in Rumah
        if (g.enteredLoc === 'Rumah') {
          const newRoom = detectRoom(nx, ny, g.enteredLoc);
          if (newRoom !== g.roomSubLoc) {
            res.roomSubLoc = newRoom;
          }
        }
        
        // Kampus — detect zone
        if (g.enteredLoc === 'Kampus') {
          const newZone = detectKampusZone(nx, ny);
          if (newZone !== g.kampusZone) {
            res.kampusZone = newZone;
          }
        }
        
        // Mall — detect zone
        if (g.enteredLoc === 'Mall') {
          const newZone = detectMallZone(nx, ny);
          if (newZone !== g.mallZone) {
            res.mallZone = newZone;
          }
        }

        // Check if moved far outside the map bounds (exit condition)
        // If x is near edge (< 5 or > 95), consider it as attempt to exit
        if (nx < 5 || nx > 95 || ny < 5 || ny > 95) {
          // Check if actually at road by using detectLocation
          let atHotspot = false;
          HOTSPOTS_DATA.forEach(spot => {
            const leftP = (spot.left / 1060) * 100;
            const topP = (spot.top / 740) * 100;
            const wP = (spot.width / 1060) * 100;
            const hP = (spot.height / 740) * 100;
            if (nx >= leftP && nx <= leftP + wP && ny >= topP && ny <= topP + hP) {
              atHotspot = true;
            }
          });
          
          // Only exit if at map edge and NOT at any hotspot
          if (!atHotspot) {
            res.currentLoc = ROAD_LABEL;
            res.enteredLoc = null;
            res.enteredLocX = null;
            res.enteredLocY = null;
            res.roomSubLoc = null;
            // Restore to saved entry position
            res.x = g.enteredLocX || g.x;
            res.y = g.enteredLocY || g.y;
          }
        }
        
        return res;
      } else {
        // Not entered yet, restrict movement to normal bounds
        nx = Math.max(0.5, Math.min(nx, 95));
        ny = Math.max(0.5, Math.min(ny, 93));
        const res = { ...g, x: nx, y: ny };
        const loc = detectLocation(nx, ny);
        res.currentLoc = loc;
        return res;
      }
    });
  };

  // time advance & decay helpers
  function crossedHour(prevH, nextH, target) {
    if (prevH === nextH) return false;
    if (prevH < nextH) return prevH < target && nextH >= target;
    return target <= nextH || target > prevH;
  }

  function advanceMinutes(mins) {
    setGame(g => {
      const beforeH = H(g.minutes).h;
      let minutes = g.minutes + mins;
      let day = g.day;
      const dayMin = 24 * 60;
      while (minutes >= dayMin) {
        minutes -= dayMin;
        day += 1;
      }
      const afterH = H(minutes).h;

      let flags = { ...g.flags };
      if (flags.checkin && flags.checkinDay !== null) {
        if (day > flags.checkinDay && crossedHour(beforeH, afterH, 10)) {
          flags.checkin = false;
          flags.checkinDay = null;
          toast('Check-in hotel telah berakhir');
        }
        if (day > flags.checkinDay && afterH >= 10) {
          flags.checkin = false;
          flags.checkinDay = null;
        }
      }

      let happiness = g.happiness;
      if (isWeekday() && crossedHour(beforeH, afterH, 11) && !g.daily.attendedKuliah) {
        happiness = clamp(happiness - 10);
        toast('Tidak masuk kuliah: 🙂 -10');
      }

      // decay
      const dec = g.decay;
      let hunger = clamp(g.hunger - (dec.hunger * mins));
      let energy = clamp(g.energy - (dec.energy * mins));
      let hygiene = clamp(g.hygiene - (dec.hygiene * mins));
      happiness = clamp(happiness - (dec.happiness * mins));

      const newGame = {
        ...g,
        minutes,
        day,
        flags,
        hunger,
        energy,
        hygiene,
        happiness
      };

      // handle rolling to next day: if day changed, reset daily counters
      if (day !== g.day) {
        newGame.counters = { mandi: 0, makan: 0, barista: 0, kasir: 0, kerjaRumah: 0 };
        newGame.daily = { attendedKuliah: false };
      }

      // check death
      if (newGame.hunger <= 0 || newGame.energy <= 0 || newGame.hygiene <= 0 || newGame.happiness <= 0) {
        if (loopRef.current) clearInterval(loopRef.current);
        newGame.started = false;
        newGame.gameOver = true;
        newGame.overReason = newGame.hunger <= 0 ? 'hunger' : newGame.energy <= 0 ? 'energy' : newGame.hygiene <= 0 ? 'hygiene' : 'happiness';
      }

      // check win condition - day 8 (completed 7 days)
      if (day >= 8) {
        if (loopRef.current) clearInterval(loopRef.current);
        newGame.started = false;
        newGame.gameOver = true;
        newGame.overReason = 'win';
      }

      return newGame;
    });
  }

  // timeAllowed check for an activity
  function timeAllowed(act) {
    // Handle item purchases - only check money
    if (act.type === 'item') {
      if (game.money < act.price) {
        return { ok: false, msg: "Uang tidak cukup" };
      }
      return { ok: true };
    }

    // Regular activities
    const cost = act.effects.money || 0;
    if (cost < 0 && game.money + cost < 0) return { ok: false, msg: "Uang tidak cukup" };
    const now = game.minutes % (24 * 60);
    if (act.window) {
      const [s, e] = act.window;
      if (!between(now, s, e)) return { ok: false, msg: "Di luar jam aktivitas" };
    }
    if (act.maxHour) {
      if (H(now).h >= act.maxHour) return { ok: false, msg: "Terlambat untuk shift" };
    }
    if (act.needs === 'checkin' && !game.flags.checkin) return { ok: false, msg: "Hotel: check-in dulu" };
    if (act.weekdayOnly && !isWeekday()) return { ok: false, msg: "Hanya Sen–Jum" };
    if (act.limitCount) {
      const [k, max] = act.limitCount;
      if ((game.counters[k] || 0) >= max) return { ok: false, msg: `Batas ${max}×/hari tercapai` };
    }
    return { ok: true };
  }

  // doActivity (applies effects) - can be instant or animated
  const doActivity = (key, fastForward = false) => {
    const list = LOCATIONS[game.currentLoc] || [];
    const act = list.find(a => a.key === key);
    if (!act) return;
    const chk = timeAllowed(act);
    if (!chk.ok) {
      toast(chk.msg);
      return;
    }

    // Handle item purchases - add to inventory directly
    if (act.type === 'item' && act.itemId) {
      const item = getItemById(act.itemId);
      if (!item) {
        toast('Item tidak ditemukan');
        return;
      }

      setGame(g => {
        const newInventory = [...g.inventory];
        
        // Find existing item or create new entry
        const existingIdx = newInventory.findIndex(inv => inv.id === act.itemId);
        if (existingIdx >= 0) {
          // Item already exists, increase quantity
          newInventory[existingIdx] = {
            ...newInventory[existingIdx],
            quantity: (newInventory[existingIdx].quantity || 1) + 1
          };
        } else {
          // New item
          newInventory.push({
            id: act.itemId,
            name: item.name,
            icon: item.icon,
            quantity: 1,
            itemData: item
          });
        }

        toast(`✓ Beli ${item.name}! (Rp ${act.price.toLocaleString('id-ID')})`);

        return {
          ...g,
          inventory: newInventory,
          money: g.money - act.price
        };
      });
      return;
    }

    setGame(g => {
      const newG = { ...g };
      let moneyDelta = act.effects.money || 0;

      if (act.weekend && isWeekend() && act.limitCount) {
        if (typeof act.weekend.money === 'number') moneyDelta = act.weekend.money;
      }
      if (typeof moneyDelta === 'number') newG.money += moneyDelta;

      if (act.effects.hunger) newG.hunger = clamp(newG.hunger + act.effects.hunger);
      if (act.effects.energy) newG.energy = clamp(newG.energy + act.effects.energy);
      if (act.effects.hygiene) newG.hygiene = clamp(newG.hygiene + act.effects.hygiene);
      if (act.effects.happiness) newG.happiness = clamp(newG.happiness + act.effects.happiness);

      if (act.tag === 'bazar') {
        const delta = Math.floor((Math.random() * 10001) - 5000);
        newG.money += 20000 + delta;
        toast(`Bazar: Rp ${ (20000 + delta).toLocaleString('id-ID') }`);
      }
      if (act.tag === 'arkade') {
        if (Math.random() < 0.35) {
          newG.money += 5000;
          toast('Bonus Arkade: +Rp 5.000');
        }
      }
      if (act.tag === 'checkin') {
        newG.flags.checkin = true;
        toast('Check-in aktif hingga 10.00');
      }
      if (act.flag === 'kuliah') {
        newG.daily.attendedKuliah = true;
      }

      if (act.bonus && act.bonus.cond && act.bonus.cond(newG)) {
        const extra = act.bonus.apply();
        for (const k in extra) {
          newG[k] = clamp(newG[k] + extra[k]);
        }
      }

      if (act.limitCount) {
        const [k] = act.limitCount;
        newG.counters = { ...newG.counters, [k]: (newG.counters[k] || 0) + 1 };
      }

      // Track activity performed
      const newActivities = { ...g.activitiesPerformed };
      newActivities[act.key] = (newActivities[act.key] || 0) + 1;
      newG.activitiesPerformed = newActivities;

      // Set activity animation if not fast forwarding
      if (!fastForward) {
        const duration = act.time || 0;
        newG.activeActivity = {
          key: act.key,
          label: act.label,
          startTime: Date.now(),
          duration: duration * 1000 // Convert to milliseconds
        };
        newG.activityProgress = 0;
      } else {
        // Fast forward: apply effects immediately and advance time
        const duration = act.time || 0;
        newG.activeActivity = null;
        newG.activityProgress = 0;
        setTimeout(() => advanceMinutes(duration), 50);
      }

      return newG;
    });
  };

  const restart = () => {
    if (loopRef.current) clearInterval(loopRef.current);
    setGame({
      ...initialGame,
      name: game.name,
      face: game.face
    });
    startTick();
  };

  // Buy item and add to inventory
  const buyItem = (itemId) => {
    const item = getItemById(itemId);
    if (!item) {
      toast('Item tidak ditemukan');
      return;
    }

    // Check if enough money
    if (game.money < item.price) {
      toast(`Uang tidak cukup. Butuh Rp ${(item.price - game.money).toLocaleString('id-ID')}`);
      return;
    }

    setGame(g => {
      const newInventory = [...g.inventory];
      
      // Find existing item or create new entry
      const existingIdx = newInventory.findIndex(inv => inv.id === itemId);
      if (existingIdx >= 0) {
        // Item already exists, increase quantity
        newInventory[existingIdx] = {
          ...newInventory[existingIdx],
          quantity: (newInventory[existingIdx].quantity || 1) + 1
        };
      } else {
        // New item
        newInventory.push({
          id: itemId,
          name: item.name,
          icon: item.icon,
          quantity: 1,
          itemData: item // store full item data for later use
        });
      }

      toast(`✓ Beli ${item.name}! (Rp ${item.price.toLocaleString('id-ID')})`);

      return {
        ...g,
        inventory: newInventory,
        money: g.money - item.price
      };
    });
  };

  // Use item from inventory and apply effects
  const useItem = (itemId) => {
    const item = getItemById(itemId);
    if (!item) {
      toast('Item tidak ditemukan');
      return;
    }

    // Check if item is consumable
    if (item.type !== 'Consumable') {
      toast(`Hanya item consumable yang bisa dipakai`);
      return;
    }

    setGame(g => {
      const inventoryIdx = g.inventory.findIndex(inv => inv.id === itemId);
      if (inventoryIdx === -1) {
        toast('Item tidak ada di inventory');
        return g;
      }

      // Apply item effects
      let newGame = { ...applyItemEffect(g, itemId) };

      // Remove or decrease item quantity
      const newInventory = [...g.inventory];
      if (newInventory[inventoryIdx].quantity > 1) {
        newInventory[inventoryIdx] = {
          ...newInventory[inventoryIdx],
          quantity: newInventory[inventoryIdx].quantity - 1
        };
      } else {
        newInventory.splice(inventoryIdx, 1);
      }

      newGame.inventory = newInventory;

      // Track item used (using array)
      const newItemsUsed = g.itemsUsed.includes(itemId)
        ? g.itemsUsed
        : [...g.itemsUsed, itemId];
      newGame.itemsUsed = newItemsUsed;

      toast(`✓ Gunakan ${item.name}!`);
      // Advance time slightly when using item
      setTimeout(() => advanceMinutes(2), 50);

      return newGame;
    });
  };

  // Enter a location (show activities and reset avatar position to center)
  const enterLocation = (loc) => {
    setGame(g => {
      // Save current position before entering
      const savedX = g.x;
      const savedY = g.y;
      
      // Find the hotspot for this location to get its center position
      const hotspot = HOTSPOTS_DATA.find(spot => spot.loc === loc);
      let centerX = 50; // default center
      let centerY = 50;
      
      if (hotspot) {
        // Calculate center of hotspot as percentage
        centerX = ((hotspot.left + hotspot.width / 2) / 1060) * 100;
        centerY = ((hotspot.top + hotspot.height / 2) / 740) * 100;
      }
      
      // Track visited location (using array)
      const newVisited = g.visitedLocations.includes(loc) 
        ? g.visitedLocations 
        : [...g.visitedLocations, loc];
      
      // Special handling for Hotel: enter to lobby first
      let hotelSubLoc = g.hotelSubLoc;
      if (loc === 'Hotel') {
        hotelSubLoc = 'lobby'; // Always enter to lobby first
      }
      
      // Detect initial room if entering Rumah
      let roomSubLoc = null;
      if (loc === 'Rumah') {
        roomSubLoc = detectRoom(centerX, centerY, loc);
      }
      
      // Detect initial zone if entering Kampus
      let kampusZone = null;
      if (loc === 'Kampus') {
        kampusZone = detectKampusZone(centerX, centerY);
      }
      
      return {
        ...g,
        enteredLoc: loc,
        enteredLocX: savedX,
        enteredLocY: savedY,
        x: centerX,
        y: centerY,
        visitedLocations: newVisited,
        hotelSubLoc: hotelSubLoc,
        roomSubLoc: roomSubLoc,
        kampusZone: kampusZone
      };
    });
  };

  // Exit a location (go back to saved position)
  const exitLocation = () => {
    setGame(g => {
      // Restore saved position or use hotspot center if not available
      let restoreX = g.enteredLocX;
      let restoreY = g.enteredLocY;
      
      if (restoreX === null || restoreY === null) {
        // Fallback: use hotspot center
        const hotspot = HOTSPOTS_DATA.find(spot => spot.loc === g.enteredLoc);
        if (hotspot) {
          restoreX = ((hotspot.left + hotspot.width / 2) / 1060) * 100;
          restoreY = ((hotspot.top + hotspot.height / 2) / 740) * 100;
        }
      }
      
      return {
        ...g,
        enteredLoc: null,
        enteredLocX: null,
        enteredLocY: null,
        x: restoreX,
        y: restoreY,
        hotelSubLoc: null, // Clear hotel sub-location when exiting
        kampusZone: null // Clear kampus zone when exiting
      };
    });
  };

  // Move to hotel sub-location (lobby <-> kamar)
  const moveToHotelRoom = () => {
    // Check if checked in
    if (!game.flags.checkin) {
      toast('Harus check-in dulu di lobby');
      return;
    }

    if (game.hotelSubLoc === 'lobby') {
      setGame(g => ({
        ...g,
        hotelSubLoc: 'kamar'
      }));
      toast('Masuk ke kamar hotel');
    }
  };

  const moveToHotelLobby = () => {
    if (game.hotelSubLoc === 'kamar') {
      setGame(g => ({
        ...g,
        hotelSubLoc: 'lobby'
      }));
      toast('Kembali ke lobby');
    }
  };

  // Calculate Life Satisfaction Score
  // Animation progress updater
  useEffect(() => {
    if (!game.activeActivity) return;

    const animInterval = setInterval(() => {
      setGame(g => {
        if (!g.activeActivity) {
          clearInterval(animInterval);
          return g;
        }

        const elapsed = Date.now() - g.activeActivity.startTime;
        const progress = Math.min(100, (elapsed / g.activeActivity.duration) * 100);

        if (progress >= 100) {
          // Animation complete - advance time and clear activity
          const list = LOCATIONS[g.currentLoc] || [];
          const act = list.find(a => a.key === g.activeActivity.key);
          const duration = act?.time || 0;
          
          setTimeout(() => advanceMinutes(duration), 50);
          
          clearInterval(animInterval);
          return {
            ...g,
            activeActivity: null,
            activityProgress: 0
          };
        }

        return {
          ...g,
          activityProgress: Math.round(progress)
        };
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(animInterval);
  }, [game.activeActivity]);

  // Skip activity animation (fast forward)
  const skipActivity = () => {
    if (!game.activeActivity) return;
    
    const list = LOCATIONS[game.currentLoc] || [];
    const act = list.find(a => a.key === game.activeActivity.key);
    const duration = act?.time || 0;
    
    // Clear animation state and advance time
    setGame(g => ({
      ...g,
      activeActivity: null,
      activityProgress: 0
    }));
    
    setTimeout(() => advanceMinutes(duration), 50);
  };

  const calculateLifeSatisfactionScore = () => {
    // 1. Stat balance (max 30 points)
    const avgStat = (game.hunger + game.energy + game.hygiene + game.happiness) / 4;
    const statBalance = Math.min(30, Math.max(0, (avgStat / 100) * 30));

    // 2. Activities performed (max 25 points)
    const activitiesCount = Object.keys(game.activitiesPerformed).length;
    const activitiesScore = Math.min(25, (activitiesCount / 30) * 25);

    // 3. Items collected and used (max 20 points)
    const itemsUsedCount = game.itemsUsed.length;
    const itemsScore = Math.min(20, (itemsUsedCount / 15) * 20);

    // 4. Variety of visited areas (max 15 points)
    const locationsVisited = game.visitedLocations.length;
    const locationsScore = Math.min(15, (locationsVisited / 6) * 15);

    // 5. Money remaining (max 10 points)
    const moneyScore = Math.min(10, (game.money / 100000) * 10);

    // Total score
    const totalScore = Math.round(statBalance + activitiesScore + itemsScore + locationsScore + moneyScore);

    return {
      totalScore,
      stats: {
        statBalance: Math.round(statBalance),
        activitiesScore: Math.round(activitiesScore),
        itemsScore: Math.round(itemsScore),
        locationsScore: Math.round(locationsScore),
        moneyScore: Math.round(moneyScore)
      },
      details: {
        avgStat: Math.round(avgStat),
        activitiesCount,
        itemsUsedCount,
        locationsVisited,
        moneyRemaining: game.money
      }
    };
  };

  return {
    game,
    startGame,
    moveHero,
    doActivity,
    detectLocation,
    greeting,
    clockStr,
    startTick,
    restart,
    timeAllowed,
    isWeekend,
    isWeekday,
    buyItem,
    useItem,
    enterLocation,
    exitLocation,
    skipActivity,
    moveToHotelRoom,
    moveToHotelLobby,
    calculateLifeSatisfactionScore
  };
}
