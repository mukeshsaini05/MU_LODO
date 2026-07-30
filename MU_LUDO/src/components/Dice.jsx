import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import { playDiceRollSound } from '../logic/audio';

const Dice = ({ onRoll, value, disabled, currentPlayer, soundEnabled = true }) => {
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    if (disabled || rolling) return;
    setRolling(true);
    playDiceRollSound(soundEnabled);
    
    setTimeout(() => {
      setRolling(false);
      onRoll();
    }, 550);
  };

  const getDiceDots = (val) => {
    switch (val) {
      case 1: return <div className="dot center"></div>;
      case 2: return <><div className="dot top-right"></div><div className="dot bottom-left"></div></>;
      case 3: return <><div className="dot top-right"></div><div className="dot center"></div><div className="dot bottom-left"></div></>;
      case 4: return <><div className="dot top-left"></div><div className="dot top-right"></div><div className="dot bottom-left"></div><div className="dot bottom-right"></div></>;
      case 5: return <><div className="dot top-left"></div><div className="dot top-right"></div><div className="dot center"></div><div className="dot bottom-left"></div><div className="dot bottom-right"></div></>;
      case 6: return <><div className="dot top-left"></div><div className="dot top-right"></div><div className="dot mid-left"></div><div className="dot mid-right"></div><div className="dot bottom-left"></div><div className="dot bottom-right"></div></>;
      default: return null;
    }
  };

  return (
    <div className={`dice-wrapper-ref ${currentPlayer}`}>
      <div className={`dice-container ${currentPlayer}`}>
        <button 
          className={`dice ${rolling ? 'rolling' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleRoll}
          disabled={disabled}
        >
          {value && !rolling ? (
            getDiceDots(value)
          ) : (
            getDiceDots(5)
          )}
        </button>
      </div>
      <span className="dice-roll-label">Roll Dice</span>
    </div>
  );
};

export default Dice;
