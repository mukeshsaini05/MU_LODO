import React from 'react';
import { COLORS, SAFE_ZONES, START_POSITIONS } from '../logic/constants';
import { Star } from 'lucide-react';

const Cell = ({ x, y }) => {
  let cellClass = 'ludo-cell ';
  let innerCircleColor = null;

  // Inner 4x4 white square bounds inside 6x6 home bases
  const isInnerRedBox = x >= 1 && x <= 4 && y >= 1 && y <= 4;
  const isInnerGreenBox = x >= 10 && x <= 13 && y >= 1 && y <= 4;
  const isInnerYellowBox = x >= 10 && x <= 13 && y >= 10 && y <= 13;
  const isInnerBlueBox = x >= 1 && x <= 4 && y >= 10 && y <= 13;

  // Token start circles inside white base boxes
  const isRedStart = START_POSITIONS[COLORS.RED].some(p => p.x === x && p.y === y);
  const isGreenStart = START_POSITIONS[COLORS.GREEN].some(p => p.x === x && p.y === y);
  const isYellowStart = START_POSITIONS[COLORS.YELLOW].some(p => p.x === x && p.y === y);
  const isBlueStart = START_POSITIONS[COLORS.BLUE].some(p => p.x === x && p.y === y);

  // 1. Home Base Corner Quadrants (6x6)
  if (x >= 0 && x <= 5 && y >= 0 && y <= 5) {
    if (isInnerRedBox) {
      cellClass += 'base-inner-white ';
      if (isRedStart) innerCircleColor = COLORS.RED;
    } else {
      cellClass += 'red-base-bg ';
    }
  } else if (x >= 9 && x <= 14 && y >= 0 && y <= 5) {
    if (isInnerGreenBox) {
      cellClass += 'base-inner-white ';
      if (isGreenStart) innerCircleColor = COLORS.GREEN;
    } else {
      cellClass += 'green-base-bg ';
    }
  } else if (x >= 9 && x <= 14 && y >= 9 && y <= 14) {
    if (isInnerYellowBox) {
      cellClass += 'base-inner-white ';
      if (isYellowStart) innerCircleColor = COLORS.YELLOW;
    } else {
      cellClass += 'yellow-base-bg ';
    }
  } else if (x >= 0 && x <= 5 && y >= 9 && y <= 14) {
    if (isInnerBlueBox) {
      cellClass += 'base-inner-white ';
      if (isBlueStart) innerCircleColor = COLORS.BLUE;
    } else {
      cellClass += 'blue-base-bg ';
    }
  } 
  // 2. Center 3x3 Home Area
  else if (x >= 6 && x <= 8 && y >= 6 && y <= 8) {
    cellClass += 'center-home ';
  }
  // 3. Path Tracks
  else {
    cellClass += 'path-cell ';
    
    // Red Path home stretch
    if ((x >= 1 && x <= 5 && y === 7)) {
      cellClass += 'red-path-cell ';
    }
    // Green Path home stretch
    else if ((x === 7 && y >= 1 && y <= 5)) {
      cellClass += 'green-path-cell ';
    }
    // Yellow Path home stretch
    else if ((x >= 9 && x <= 13 && y === 7)) {
      cellClass += 'yellow-path-cell ';
    }
    // Blue Path home stretch
    else if ((x === 7 && y >= 9 && y <= 13)) {
      cellClass += 'blue-path-cell ';
    }

    // Safe Star Spots
    const isSafe = SAFE_ZONES.some(p => p.x === x && p.y === y);
    if (isSafe) {
      cellClass += 'safe-cell ';
    }
  }

  const isSafeSpot = SAFE_ZONES.some(p => p.x === x && p.y === y);

  // Colored star mapping for start positions
  const getStarColorProps = () => {
    if (x === 1 && y === 6) return { color: '#ef4444', fill: '#ef4444' }; // Red start
    if (x === 8 && y === 1) return { color: '#22c55e', fill: '#22c55e' }; // Green start
    if (x === 13 && y === 8) return { color: '#f59e0b', fill: '#f59e0b' }; // Yellow start
    if (x === 6 && y === 13) return { color: '#3b82f6', fill: '#3b82f6' }; // Blue start
    return { color: '#94a3b8', fill: '#94a3b8' }; // Gray star for standard safe spots
  };

  const starProps = isSafeSpot ? getStarColorProps() : null;

  return (
    <div className={cellClass} style={{ gridColumn: x + 1, gridRow: y + 1 }}>
      {innerCircleColor && <div className={`base-token-spot spot-${innerCircleColor}`}></div>}
      {isSafeSpot && !innerCircleColor && (
        <Star 
          className="safe-star" 
          size={16} 
          color={starProps.color} 
          fill={starProps.fill} 
        />
      )}
    </div>
  );
};

export default Cell;
