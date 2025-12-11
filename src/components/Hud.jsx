// src/components/Hud.jsx
import React from 'react';
import { fmtMoney } from '../utils/helpers';
import Inventory from './Inventory';

export default function Hud({ game, greeting, clockStr, onUseItem }) {
  return (
    <div className="card">
      <div className="hd toolbar">
        <div className="grow">
          <div style={{ fontWeight: 800 }} id="greet">{greeting()}, {game.name}</div>
          <div className="small" id="clock">{clockStr()}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="badge">Money: <span id="money">{fmtMoney(Math.max(0, Math.round(game.money)))}</span></div>
          <Inventory inventory={game.inventory || []} onUseItem={onUseItem} />
        </div>
      </div>
      <div className="bd hud">
        <div className="status-row">
          <div className="bar">
            <label>Meal (Hunger)</label>
            <div className="track"><div id="bar-hunger" className="fill" style={{ width: `${Math.round(game.hunger)}%` }} /></div>
            <div id="num-hunger" className="nums">{Math.round(game.hunger)}%</div>
          </div>
          <div className="bar">
            <label>Sleep (Energy)</label>
            <div className="track"><div id="bar-energy" className="fill" style={{ width: `${Math.round(game.energy)}%` }} /></div>
            <div id="num-energy" className="nums">{Math.round(game.energy)}%</div>
          </div>
        </div>
        <div className="status-row">
          <div className="bar">
            <label>Hygiene</label>
            <div className="track"><div id="bar-hygiene" className="fill" style={{ width: `${Math.round(game.hygiene)}%` }} /></div>
            <div id="num-hygiene" className="nums">{Math.round(game.hygiene)}%</div>
          </div>
          <div className="bar">
            <label>Happiness</label>
            <div className="track"><div id="bar-happiness" className="fill" style={{ width: `${Math.round(game.happiness)}%` }} /></div>
            <div id="num-happiness" className="nums">{Math.round(game.happiness)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
