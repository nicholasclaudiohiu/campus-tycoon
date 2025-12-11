// src/components/GameOverOverlay.jsx
import React from 'react';

export default function GameOverOverlay({ show, reason, onRestart, lifeScore }) {
  if (!show) return null;

  const isWin = reason === 'win';

  return (
    <div id="overlay" className="overlay show">
      <div className={`box ${isWin ? 'win' : 'lose'}`}>
        <div className="over-title">
          {isWin ? '🎉 Victory!' : 'Game Over'}
        </div>
        <div className="over-desc" id="overDesc">
          {isWin 
            ? 'Selamat! Anda berhasil hidup enak selama seminggu! 🎊' 
            : `Your ${reason} reached 0.`
          }
        </div>

        {/* Life Satisfaction Score Display */}
        {lifeScore && (
          <div className="life-score-section">
            <div className="score-title">📊 Life Satisfaction Score</div>
            <div className="score-total">
              <span className="score-number">{lifeScore.totalScore}</span>
              <span className="score-max">/ 100</span>
            </div>
            
            <div className="score-breakdown">
              <div className="score-item">
                <span className="score-label">Stat Balance</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${(lifeScore.stats.statBalance / 30) * 100}%` }}></div>
                </div>
                <span className="score-value">{lifeScore.stats.statBalance}/30</span>
              </div>

              <div className="score-item">
                <span className="score-label">Activities ({lifeScore.details.activitiesCount})</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${(lifeScore.stats.activitiesScore / 25) * 100}%` }}></div>
                </div>
                <span className="score-value">{lifeScore.stats.activitiesScore}/25</span>
              </div>

              <div className="score-item">
                <span className="score-label">Items Used ({lifeScore.details.itemsUsedCount})</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${(lifeScore.stats.itemsScore / 20) * 100}%` }}></div>
                </div>
                <span className="score-value">{lifeScore.stats.itemsScore}/20</span>
              </div>

              <div className="score-item">
                <span className="score-label">Locations Visited ({lifeScore.details.locationsVisited})</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${(lifeScore.stats.locationsScore / 15) * 100}%` }}></div>
                </div>
                <span className="score-value">{lifeScore.stats.locationsScore}/15</span>
              </div>

              <div className="score-item">
                <span className="score-label">Money Remaining</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${(lifeScore.stats.moneyScore / 10) * 100}%` }}></div>
                </div>
                <span className="score-value">{lifeScore.stats.moneyScore}/10</span>
              </div>
            </div>

            <div className="score-details">
              <p>Avg Stats: {lifeScore.details.avgStat}%</p>
              <p>Money Left: Rp {lifeScore.details.moneyRemaining.toLocaleString('id-ID')}</p>
            </div>
          </div>
        )}

        <div className="btn-row">
          <button id="restartBtn" className="btn" onClick={onRestart}>
            {isWin ? 'Play Again' : 'Restart'}
          </button>
        </div>
      </div>
    </div>
  );
}
