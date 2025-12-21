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
  const {
    game,
    startGame,
    moveHero,
    doActivity,
    greeting,
    clockStr,
    restart,
    timeAllowed,
    useItem,
    enterLocation,
    exitLocation,
    skipActivity,
    moveToHotelRoom,
    moveToHotelLobby,
    calculateLifeSatisfactionScore
  } = useGame();

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();

      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) return;

      if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
        e.preventDefault();
        moveHero(key.replace("arrow", ""));
        return;
      }

      const wasdMap = { w: "up", a: "left", s: "down", d: "right" };
      if (wasdMap[key]) {
        e.preventDefault();
        moveHero(wasdMap[key]);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveHero]);

  if (!game.started) {
    return (
      <>
        <div className="container">
          <div className="title">
            <span>🧭 Campus Tycoon — build routines, beat bills</span>
            <span className="tag">Hotspot Map</span>
          </div>
        </div>
        <Onboarding onStart={(opts) => startGame(opts)} />
        <GameOverOverlay
          show={!!game.gameOver}
          reason={game.overReason}
          onRestart={restart}
          lifeScore={game.gameOver ? calculateLifeSatisfactionScore() : null}
        />
      </>
    );
  }

  let activities = LOCATIONS[game.currentLoc] || [];

  if (game.enteredLoc === 'Hotel' && game.hotelSubLoc) {
    activities = activities.filter(act =>
      act.hotelArea ? act.hotelArea === game.hotelSubLoc : true
    );
  }

  if (game.enteredLoc === 'Rumah' && game.roomSubLoc) {
    activities = activities.filter(act =>
      act.room ? act.room === game.roomSubLoc : true
    );
  }

  if (game.enteredLoc === "Mall" && game.mallZone) {
    activities = activities.filter(act =>
      act.zone ? act.zone === game.mallZone : true
    );
  }

  if (game.enteredLoc === "Kampus") {
    if (game.kampusZone) {
      activities = activities.filter(act =>
        act.zone ? act.zone === game.kampusZone : true
      );
    } else {
      activities = [];
    }
  }

  const isAtHotspot = game.currentLoc !== 'Jalan';
  const isLocationEntered = game.enteredLoc === game.currentLoc && isAtHotspot;

  let displayLocName = game.currentLoc;

  if (game.enteredLoc === 'Hotel' && game.hotelSubLoc) {
    displayLocName = `Hotel (${game.hotelSubLoc === 'lobby' ? 'Lobby' : 'Kamar'})`;
  }

  let bgKey = game.enteredLoc;
  if (game.enteredLoc === 'Hotel' && game.hotelSubLoc) {
    bgKey = game.hotelSubLoc === 'kamar' ? 'Hotel_Kamar' : 'Hotel_Lobby';
  }

  const bgImage =
    isLocationEntered && bgKey && LOCATION_BACKGROUNDS[bgKey]
      ? LOCATION_BACKGROUNDS[bgKey]
      : null;

  return (
    <>
      <section
        id="game"
        style={bgImage ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        <div className="container grid grid-2">
          <div className="grid" style={{ gap: 16 }}>
            <Hud
              game={game}
              greeting={() => greeting()}
              clockStr={() => clockStr()}
              onUseItem={useItem}
            />
            <HotspotMap
              game={game}
              enteredLoc={game.enteredLoc}
              isLocationEntered={isLocationEntered}
            />
          </div>

          <div className="card">

            <Controls onMove={moveHero} />

            <div className="hd toolbar">
              <div>
                <b>Lokasi</b> • <span>{displayLocName}</span>
              </div>
              <div className="small">
                {game.currentLoc === 'Jalan'
                  ? 'Gerakkan avatar ke area gambar untuk mendekati lokasi'
                  : isLocationEntered
                    ? 'Pilih aktivitas atau tekan EXIT'
                    : 'Tekan ENTER untuk memasuki lokasi'}
              </div>
            </div>

            <div id="activities" className="bd panel">

              {/* HOTEL LOBBY → KAMAR (TETAP ADA) */}
              {isLocationEntered &&
                game.enteredLoc === 'Hotel' &&
                game.hotelSubLoc === 'lobby' &&
                game.flags.checkin && (
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

              {/* HOTEL KAMAR → LOBBY (TETAP ADA) */}
              {isLocationEntered &&
                game.enteredLoc === 'Hotel' &&
                game.hotelSubLoc === 'kamar' && (
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

              {isLocationEntered ? (
                <>
                  {activities.length === 0 ? (
                    <div className="muted">Tidak ada aktivitas</div>
                  ) : (
                    activities.map(act => {
                      const chk = timeAllowed(act);
                      return (
                        <ActivityCard
                          key={act.key}
                          act={act}
                          game={game}
                          onDo={doActivity}
                          chk={chk}
                        />
                      );
                    })
                  )}

                  <div style={{ marginTop: 16 }}>
                    <button
                      className="btn secondary"
                      onClick={exitLocation}
                      style={{ width: '100%', padding: '10px' }}
                    >
                      ← EXIT {game.currentLoc.toUpperCase()}
                    </button>
                  </div>
                </>
              ) : (
                <div className="muted">
                  {game.currentLoc === 'Jalan'
                    ? 'Tidak ada aktivitas di jalan.'
                    : `Masuki ${game.currentLoc} untuk melihat aktivitas`}
                </div>
              )}

              {/* 🔽 ENTER DIPINDAH KE BAWAH */}
              {isAtHotspot && !isLocationEntered && (
                <div style={{ marginTop: 16 }}>
                  <button
                    className="btn primary"
                    onClick={() => enterLocation(game.currentLoc)}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    📍 ENTER {game.currentLoc.toUpperCase()}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <ActivityAnimationPanel
        activity={game.activeActivity}
        progress={game.activityProgress}
        game={game}
        onSkip={skipActivity}
      />

      <GameOverOverlay
        show={!!game.gameOver}
        reason={game.overReason}
        onRestart={restart}
        lifeScore={game.gameOver ? calculateLifeSatisfactionScore() : null}
      />
    </>
  );
}