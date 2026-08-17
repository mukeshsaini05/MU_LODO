import React, { useState, useEffect } from 'react';
import { ModalWrapper } from './Modals';
import { Award, Trash2 } from 'lucide-react';

const StatsModal = ({ onClose }) => {
  const [stats, setStats] = useState({
    matchesPlayed: 0,
    matchesWon: 0,
    tokensCaptured: 0,
    sixesRolled: 0
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ludo_match_stats');
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
  }, []);

  const handleClearStats = () => {
    try {
      localStorage.removeItem('ludo_match_stats');
      setStats({ matchesPlayed: 0, matchesWon: 0, tokensCaptured: 0, sixesRolled: 0 });
    } catch (e) {
      console.warn('Failed to clear stats', e);
    }
  };

  const winRate = stats.matchesPlayed > 0 ? Math.round((stats.matchesWon / stats.matchesPlayed) * 100) : 0;

  return (
    <ModalWrapper title="Match Statistics & Records" onClose={onClose} icon={Award}>
      <div className="stats-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Matches Played</span>
            <h3 style={{ fontSize: '1.8rem', color: '#60a5fa', margin: '0.2rem 0' }}>{stats.matchesPlayed}</h3>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Matches Won</span>
            <h3 style={{ fontSize: '1.8rem', color: '#4ade80', margin: '0.2rem 0' }}>{stats.matchesWon}</h3>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Win Rate</span>
            <h3 style={{ fontSize: '1.8rem', color: '#fbbf24', margin: '0.2rem 0' }}>{winRate}%</h3>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tokens Cut</span>
            <h3 style={{ fontSize: '1.8rem', color: '#f87171', margin: '0.2rem 0' }}>{stats.tokensCaptured}</h3>
          </div>
        </div>

        <button 
          onClick={handleClearStats}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.65rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            marginTop: '0.5rem'
          }}
        >
          <Trash2 size={16} /> Reset Statistics
        </button>
      </div>
    </ModalWrapper>
  );
};

export default StatsModal;
