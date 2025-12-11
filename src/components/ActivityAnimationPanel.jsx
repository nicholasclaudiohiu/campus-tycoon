import React from 'react';
import './ActivityAnimationPanel.css';

export default function ActivityAnimationPanel({ activity, progress, game, onSkip }) {
  if (!activity) return null;

  const progressPercent = progress || 0;

  // Animated behaviors based on activity
  const getAnimationBehavior = () => {
    const key = activity.key;
    
    if (key === 'kuliah') return { emoji: '📚', text: 'Mengikuti kuliah...', animation: 'bounce' };
    if (key === 'fokus') return { emoji: '🧠', text: 'Belajar fokus...', animation: 'pulse' };
    if (key === 'bareng') return { emoji: '👥', text: 'Belajar bareng...', animation: 'sway' };
    if (key === 'olahraga') return { emoji: '🏃', text: 'Berolahraga...', animation: 'bounce' };
    if (key === 'mandi') return { emoji: '🚿', text: 'Sedang mandi...', animation: 'wave' };
    if (key === 'tidur') return { emoji: '😴', text: 'Tidur...', animation: 'pulse' };
    if (key === 'makan') return { emoji: '🍽️', text: 'Makan...', animation: 'bounce' };
    if (key === 'bazar') return { emoji: '🏪', text: 'Jaga stand...', animation: 'sway' };
    if (key === 'cuci') return { emoji: '🧼', text: 'Cuci muka...', animation: 'wave' };
    if (key === 'ganti') return { emoji: '👔', text: 'Ganti baju...', animation: 'sway' };
    if (key === 'hemat') return { emoji: '🍔', text: 'Makan hemat...', animation: 'bounce' };
    if (key === 'pinjam') return { emoji: '📖', text: 'Pinjam buku...', animation: 'pulse' };
    
    return { emoji: '🎯', text: `${activity.label}...`, animation: 'pulse' };
  };

  const behavior = getAnimationBehavior();
  const timeRemaining = Math.ceil(((100 - progressPercent) / 100) * (activity.duration / 1000));

  return (
    <div className="activity-animation-panel">
      <div className="animation-card">
        {/* Animated emoji character */}
        <div className={`character ${behavior.animation}`}>
          {behavior.emoji}
        </div>

        {/* Activity label */}
        <div className="activity-text">{behavior.text}</div>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="progress-text">{progressPercent}%</div>
        </div>

        {/* Time remaining */}
        <div className="time-remaining">⏱️ {timeRemaining}s remaining</div>

        {/* Skip button */}
        <button className="btn secondary small skip-btn" onClick={onSkip}>
          ⏭️ Fast Forward
        </button>
      </div>
    </div>
  );
}
