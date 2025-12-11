// src/components/Controls.jsx
import React from 'react';

export default function Controls({ onMove }) {
  return (
    <div className="controls-container">
      <div className="controls">
        <button className="btn secondary circle-btn" data-dir="up" onClick={() => onMove('up')}>^</button>
        <button className="btn secondary circle-btn" data-dir="left" onClick={() => onMove('left')}>{'<'}</button>
        <button className="btn secondary circle-btn" data-dir="right" onClick={() => onMove('right')}>{'>'}</button>
        <button className="btn secondary circle-btn" data-dir="down" onClick={() => onMove('down')}>v</button>
      </div>
    </div>
  );
}
