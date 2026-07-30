import React from 'react';
import { Star } from 'lucide-react';

const Token = ({ color, id, index, total, x, y, onClick }) => {
  let tokenClass = `ludo-token token-${color} `;
  
  // Base position centered in cell (x, y)
  let style = {
    left: `calc(var(--cell-size) * ${x + 0.5})`,
    top: `calc(var(--cell-size) * ${y + 0.5})`,
  };

  // Logic to handle multiple tokens in the same cell
  if (total > 1) {
    const angle = (2 * Math.PI * index) / total;
    const radius = 7; // px displacement
    style.transform = `translate(calc(-50% + ${Math.cos(angle) * radius}px), calc(-50% + ${Math.sin(angle) * radius}px)) scale(0.85)`;
  } else {
    style.transform = `translate(-50%, -50%)`;
  }

  return (
    <div className={tokenClass} style={style} onClick={onClick}>
      <div className="token-inner">
        <Star size={11} fill="rgba(255, 255, 255, 0.9)" color="rgba(255, 255, 255, 0.9)" className="token-star-icon" />
      </div>
    </div>
  );
};

export default Token;
