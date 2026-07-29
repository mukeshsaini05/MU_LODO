import React from 'react';
import { COLORS } from '../logic/constants';

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
    const radius = 6; // px displacement
    style.transform = `translate(calc(-50% + ${Math.cos(angle) * radius}px), calc(-50% + ${Math.sin(angle) * radius}px)) scale(0.8)`;
  } else {
    style.transform = `translate(-50%, -50%)`;
  }

  return (
    <div className={tokenClass} style={style} onClick={onClick}>
      <div className="token-inner"></div>
    </div>
  );
};

export default Token;
