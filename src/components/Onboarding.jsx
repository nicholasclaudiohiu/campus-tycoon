// src/components/Onboarding.jsx
import React, { useState } from 'react';
import { AVATARS } from '../utils/constants';

export default function Onboarding({ onStart }) {
  const [name, setName] = useState('');
  const [face, setFace] = useState(AVATARS[0]);

  return (
    <section id="onboarding" className="onboard">
      <div className="hero">
        <h1>Mulai Perjalanan</h1>
        <p className="muted">Pilih avatar, isi nama, lalu tekan <b>Start Exploring</b>. Gerak: <b>← ↑ → ↓</b> atau tombol di layar.</p>
      </div>
      <div className="bd">
        <label htmlFor="playerName">Nama Traveler</label>
        <input id="playerName" type="text" placeholder="Ketik Nama" maxLength="16" value={name} onChange={e => setName(e.target.value)} />
        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Avatar</div>
          <div id="avatarChoices" className="avatars">
            {AVATARS.map((a, i) => (
              <div key={a} className={`avatar ${face === a ? 'selected' : ''}`} onClick={() => setFace(a)} data-face={a}>
                <img src={a} alt={`avatar-${i}`} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end', marginTop: 6 }}>
          <button id="startBtn" className="btn" onClick={() => onStart({ name: name.trim() || 'Ucup', face })}>Start Exploring</button>
        </div>
      </div>
    </section>
  );
}
