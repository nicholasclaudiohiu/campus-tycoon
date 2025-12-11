// src/components/HotspotMap.jsx
import React from 'react';
import { HOTSPOTS_DATA, MAP_ORIGINAL_WIDTH, MAP_ORIGINAL_HEIGHT, LOCATION_MAPS } from '../utils/constants';

export default function HotspotMap({ game, enteredLoc, isLocationEntered }) {
  // Get the map image to display based on entered location
  let mapKey = enteredLoc;
  if (enteredLoc === 'Hotel' && game.hotelSubLoc) {
    mapKey = game.hotelSubLoc === 'kamar' ? 'Hotel_Kamar' : 'Hotel_Lobby';
  }
  
  const mapImage = isLocationEntered && mapKey && LOCATION_MAPS[mapKey] 
    ? LOCATION_MAPS[mapKey] 
    : LOCATION_MAPS['DEFAULT'];

  // hotspots converted to percent values for inline style
  return (
    <div className="card">
      <div className="hd toolbar">
        <div><b>World Map</b> • <span id="currentLocation">{game.currentLoc}</span></div>
      </div>
      <div className="bd">
        <div id="world" className="world" style={{ backgroundImage: `url(${mapImage})` }}>
          {HOTSPOTS_DATA.map((spot) => {
            const left = (spot.left / MAP_ORIGINAL_WIDTH) * 100;
            const top = (spot.top / MAP_ORIGINAL_HEIGHT) * 100;
            const width = (spot.width / MAP_ORIGINAL_WIDTH) * 100;
            const height = (spot.height / MAP_ORIGINAL_HEIGHT) * 100;
            return <div key={spot.loc} className="hotspot" data-loc={spot.loc} style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, position: 'absolute', borderRadius: 12 }} />;
          })}
          <div id="hero" className="avatar-hero" style={{ left: `${game.x}%`, top: `${game.y}%` }}>
            <div id="heroFace" className="face">
              {typeof game.face === 'string' && game.face.includes('.jpg') ? <img src={game.face} alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: '50%', display: 'block' }} /> : game.face}
            </div>
          </div>
        </div>
        <div className="small muted" style={{ textAlign: 'center', marginTop: 8 }}> Campus Tycoon — build routines, beat bills </div>
      </div>
    </div>
  );
}
