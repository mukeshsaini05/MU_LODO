import React from 'react';
import { User, Trophy, Heart, Hourglass, Crown, Bot } from 'lucide-react';

const PlayerInfo = ({ color = 'red', isActive, isWinner, isBot = false, turnSecondsLeft = 15, name = 'Player', side = 'left', mobileSide = 'top' }) => {
  const playerColor = color || 'red';
  
  const getHeartsColor = () => {
    switch (playerColor) {
      case 'red': return '#ef4444';
      case 'green': return '#22c55e';
      case 'yellow': return '#eab308';
      case 'blue': return '#3b82f6';
      default: return '#ef4444';
    }
  };

  const heartColor = getHeartsColor();

  return (
    <div className={`player-card-ref ${playerColor} ${isActive ? 'active-turn' : ''} ${isWinner ? 'winner' : ''}`}>
      {/* Active turn badge with countdown timer */}
      {isActive && (
        <div className={`turn-badge badge-${playerColor}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Crown size={11} className="crown-badge-icon" />
          <span>TURN</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.9, marginLeft: '0.2rem', fontWeight: 800 }}>⏱️{turnSecondsLeft}s</span>
        </div>
      )}

      {/* Pointer arrow matching player color pointing towards the center ludo board */}
      {isActive && (
        <div className={`turn-pointer-arrow pointer-${side} mobile-pointer-${mobileSide} pointer-${playerColor}`}></div>
      )}

      <div className="card-top-row">
        <div className={`card-avatar avatar-${playerColor}`}>
          {isBot ? <Bot size={24} /> : <User size={24} />}
        </div>
        <div className="card-user-info">
          <h4 className="card-player-name" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {name}
            {isBot && <span style={{ fontSize: '0.6rem', background: '#3b82f6', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 800 }}>BOT</span>}
          </h4>
          <div className="card-hearts-row">
            {[...Array(4)].map((_, i) => (
              <Heart key={i} size={13} fill={heartColor} color={heartColor} className="heart-icon" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Row */}
      {!isActive && !isWinner && (
        <div className="card-status-row">
          <Hourglass size={13} className="waiting-hourglass" />
          <span>Waiting</span>
        </div>
      )}

      {isWinner && (
        <div className="card-status-row winner-status">
          <Trophy size={13} />
          <span>Winner!</span>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;

