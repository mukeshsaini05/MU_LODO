import React from 'react';
import { User, Trophy } from 'lucide-react';

const PlayerInfo = ({ color, isActive, isWinner, name }) => {
  return (
    <div className={`player-info ${color} ${isActive ? 'active' : ''} ${isWinner ? 'winner' : ''}`}>
      <div className="avatar">
        <User size={24} />
      </div>
      <div className="player-details">
        <p style={{ fontWeight: 'bold', margin: 0 }}>{name}</p>
        <p style={{ margin: 0, textTransform: 'capitalize' }}>({color})</p>
        {isWinner && <Trophy size={16} className="trophy" />}
      </div>
    </div>
  );
};

export default PlayerInfo;
