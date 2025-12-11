// src/components/ActivityCard.jsx
import React from 'react';
import { fmtMoney } from '../utils/helpers';

export default function ActivityCard({ act, game, onDo, chk }) {
  // Regular activity card (including item purchases)
  const ef = { ...act.effects };
  const chips = [];
  if (typeof ef.money === 'number' && ef.money !== 0) chips.push(<span key="money" className="chip">Rp {fmtMoney(ef.money)}</span>);
  if (typeof ef.hunger === 'number' && ef.hunger !== 0) chips.push(<span key="hunger" className="chip">🍔 {ef.hunger > 0 ? `+${ef.hunger}` : ef.hunger}</span>);
  if (typeof ef.energy === 'number' && ef.energy !== 0) chips.push(<span key="energy" className="chip">⚡ {ef.energy > 0 ? `+${ef.energy}` : ef.energy}</span>);
  if (typeof ef.hygiene === 'number' && ef.hygiene !== 0) chips.push(<span key="hygiene" className="chip">🧼 {ef.hygiene > 0 ? `+${ef.hygiene}` : ef.hygiene}</span>);
  if (typeof ef.happiness === 'number' && ef.happiness !== 0) chips.push(<span key="happy" className="chip">🙂 {ef.happiness > 0 ? `+${ef.happiness}` : ef.happiness}</span>);
  
  const timeChip = act.weekend && game ? (game.day && ((game.day%7===6) || (game.day%7===0)) ? (act.weekend.time || act.time) : act.time) : act.time;
  chips.push(<span key="time" className="chip">⏱ {timeChip}m</span>);

  return (
    <div className={`activity ${act.type === 'item' ? 'item-activity' : ''}`}>
      <div className="meta">
        <div dangerouslySetInnerHTML={{ __html: `<span class="i">i<span class="tip">${act.info}</span></span>` }} />
        <div><b>{act.label}</b> <small className="muted">({/* location shown by parent */})</small></div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {chips}
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          <button className={`btn ${!chk.ok ? 'disabled' : ''}`} onClick={() => onDo(act.key)}>
            {!chk.ok ? chk.msg : 'Do'}
          </button>
          {!chk.ok ? null : (
            <button 
              className="btn secondary small" 
              onClick={() => onDo(act.key, true)}
              title="Apply effects instantly and skip animation"
            >
              ⚡ Fast
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
