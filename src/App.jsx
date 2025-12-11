// App.jsx
import React, { useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Hud from './components/Hud';
import HotspotMap from './components/HotspotMap';
import Controls from './components/Controls';
import ActivityCard from './components/ActivityCard';
import GameOverOverlay from './components/GameOverOverlay';
import ActivityAnimationPanel from './components/ActivityAnimationPanel';
import { useGame } from './hooks/useGame';
import { LOCATIONS, LOCATION_BACKGROUNDS } from './utils/constants';

export default function App() {
  const { game, startGame, moveHero, doActivity, greeting, clockStr, restart, timeAllowed, useItem, enterLocation, exitLocation, skipActivity, moveToHotelRoom, moveToHotelLobby, calculateLifeSatisfactionScore } = useGame();

  useEffect(() => {
  const onKey = (e) => {
    const key = e.key.toLowerCase();

    // Jika sedang mengetik → jangan gerak
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable
    ) {
      return;
    }

    // Arrow keys
    if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
      e.preventDefault();
      moveHero(key.replace("arrow", ""));
      return;
    }

    // WASD mapping
    const wasdMap = {
      w: "up",
      a: "left",
      s: "down",
      d: "right"
    };

    if (wasdMap[key]) {
      e.preventDefault();
      moveHero(wasdMap[key]);
    }
  };

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [moveHero]);


  if (!game.started) {
    return <>
      <div className="container">
        <div className="title">
          <span>🧭 Campus Tycoon — build routines, beat bills</span>
          <span className="tag">Hotspot Map</span>
        </div>
      </div>
      <Onboarding onStart={(opts) => startGame(opts)} />
      <GameOverOverlay show={!!game.gameOver} reason={game.overReason} onRestart={restart} lifeScore={game.gameOver ? calculateLifeSatisfactionScore() : null} />
    </>;
  }

  let activities = LOCATIONS[game.currentLoc] || [];

  // Filter activities based on hotel sub-location
  if (game.enteredLoc === 'Hotel' && game.hotelSubLoc) {
    activities = activities.filter(act => {
      // If activity has hotelArea property, only show if it matches current area
      if (act.hotelArea) {
        return act.hotelArea === game.hotelSubLoc;
      }
      // If no hotelArea property, include it (backward compatibility)
      return true;
    });
  }

  // Filter activities based on room sub-location (for Rumah)
  if (game.enteredLoc === 'Rumah' && game.roomSubLoc) {
    activities = activities.filter(act => {
      // If activity has room property, only show if it matches current room
      if (act.room) {
        return act.room === game.roomSubLoc;
      }
      // If no room property (like item purchases), include it (backward compatibility)
      return true;
    });
  }

  // Filter activities based on Mall zone
  if (game.enteredLoc === "Mall" && game.mallZone) {
    activities = activities.filter(act => {
      if (act.zone) return act.zone === game.mallZone;
      return true;
    });
  }

  // Filter activities based on Kampus zone
  if (game.enteredLoc === "Kampus") {
    if (game.kampusZone) {
      activities = activities.filter(act => {
        if (act.zone) return act.zone === game.kampusZone;
        return true;
      });
    } else {
      // If not in any specific zone, show no activities
      activities = [];
    }
  }



  // Determine if we're currently inside a location (not on the road)
  const isAtHotspot = game.currentLoc !== 'Jalan';
  const isLocationEntered = game.enteredLoc === game.currentLoc && isAtHotspot;

  // Determine display location name (handle hotel sub-locations and rooms)
  let displayLocName = game.currentLoc;
  if (game.enteredLoc === 'Hotel' && game.hotelSubLoc) {
    displayLocName = `Hotel (${game.hotelSubLoc === 'lobby' ? 'Lobby' : 'Kamar'})`;
  } else if (game.enteredLoc === 'Rumah' && game.roomSubLoc) {
    const roomNames = {
      'bedroom': 'Kamar Tidur',
      'bathroom': 'Kamar Mandi',
      'living_room': 'Ruang Keluarga',
      'office': 'Ruang Kerja'
    };
    displayLocName = `Rumah (${roomNames[game.roomSubLoc] || game.roomSubLoc})`; 
  } else if (game.enteredLoc === 'Mall' && game.mallZone) {
    const mallZoneNames = {
      cinema: 'Bioskop',
      arcade: 'Arkade',
      karaoke: 'Karaoke',
      foodcourt: 'Food Court',
      shopping: 'Shopping'
    };
    displayLocName = `Mall (${mallZoneNames[game.mallZone] || game.mallZone})`;
  } else if (game.enteredLoc === 'Kampus' && game.kampusZone) {
    const kampusZoneNames = {
      main_building: 'Gedung Utama',
      dorm: 'Asrama',
      toilet: 'Toilet',
      field: 'Lapangan',
      bazaar: 'Bazaar'
    };
    displayLocName = `Kampus (${kampusZoneNames[game.kampusZone] || game.kampusZone})`;
  }

  

  // Get background image for current entered location
  let bgKey = game.enteredLoc;
  if (game.enteredLoc === 'Hotel' && game.hotelSubLoc) {
    bgKey = game.hotelSubLoc === 'kamar' ? 'Hotel_Kamar' : 'Hotel_Lobby';
  }
  
  const bgImage = isLocationEntered && bgKey && LOCATION_BACKGROUNDS[bgKey] 
    ? LOCATION_BACKGROUNDS[bgKey] 
    : null;

  return (
    <>
      <section id="game" style={bgImage ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      } : {}}>
        <div className="container grid grid-2">
          <div className="grid" style={{ gap: 16 }}>
            <Hud game={game} greeting={() => greeting()} clockStr={() => clockStr()} onUseItem={useItem} />
            <HotspotMap game={game} enteredLoc={game.enteredLoc} isLocationEntered={isLocationEntered} />
          </div>

          <div className="card">
            <div className="hd toolbar">
              <div><b>Lokasi</b> • <span id="activityLocation">{displayLocName}</span></div>
              <div className="small">
                {game.currentLoc === 'Jalan' 
                  ? 'Gerakkan avatar ke area gambar untuk mendekati lokasi'
                  : isLocationEntered && game.enteredLoc === 'Hotel' && game.hotelSubLoc === 'lobby'
                    ? `Check-in untuk masuk kamar (saldo: Rp ${game.flags.checkin ? 'checked' : 'not checked'})`
                    : isLocationEntered
                    ? 'Pilih aktivitas atau tekan EXIT untuk keluar'
                    : 'Tekan ENTER untuk memasuki lokasi'
                }
              </div>
            </div>
            <div id="activities" className="bd panel">
              {/* Show ENTER button if at a hotspot but not entered yet */}
              {isAtHotspot && !isLocationEntered && (
                <div style={{ marginBottom: 12 }}>
                  <button 
                    className="btn primary" 
                    onClick={() => enterLocation(game.currentLoc)}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    📍 ENTER {game.currentLoc.toUpperCase()}
                  </button>
                </div>
              )}

              {/* Hotel lobby navigation button */}
              {isLocationEntered && game.enteredLoc === 'Hotel' && game.hotelSubLoc === 'lobby' && game.flags.checkin && (
                <div style={{ marginBottom: 12 }}>
                  <button 
                    className="btn primary" 
                    onClick={moveToHotelRoom}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    🛏️ Masuk Kamar
                  </button>
                </div>
              )}

              {/* Hotel room back to lobby button */}
              {isLocationEntered && game.enteredLoc === 'Hotel' && game.hotelSubLoc === 'kamar' && (
                <div style={{ marginBottom: 12 }}>
                  <button 
                    className="btn secondary" 
                    onClick={moveToHotelLobby}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    ← Kembali ke Lobby
                  </button>
                </div>
              )}

              {/* Show activities if entered location */}
              {isLocationEntered ? (
                <>
                  {activities.length === 0 ? (
                    <div className="muted">Tidak ada aktivitas</div>
                  ) : (
                    activities.map(act => {
                      const chk = timeAllowed(act);
                      return <ActivityCard key={act.key} act={act} game={game} onDo={doActivity} chk={chk} />;
                    })
                  )}
                  <div style={{ marginTop: 16 }}>
                    <button 
                      className="btn secondary" 
                      onClick={() => exitLocation()}
                      style={{ width: '100%', padding: '10px' }}
                    >
                      ← EXIT {game.currentLoc.toUpperCase()}
                    </button>
                  </div>
                </>
              ) : (
                <div className="muted">
                  {game.currentLoc === 'Jalan' 
                    ? 'Tidak ada aktivitas di jalan. Pergi ke lokasi lain!'
                    : `Masuki ${game.currentLoc} untuk melihat aktivitas`
                  }
                </div>
              )}
            </div>
            <Controls onMove={moveHero} />
          </div>
        </div>
      </section>
      <ActivityAnimationPanel 
        activity={game.activeActivity} 
        progress={game.activityProgress} 
        game={game} 
        onSkip={skipActivity}
      />
      <GameOverOverlay show={!!game.gameOver} reason={game.overReason} onRestart={restart} lifeScore={game.gameOver ? calculateLifeSatisfactionScore() : null} />
    </>
  );
}
