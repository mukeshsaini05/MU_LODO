import React from 'react';
import { COLORS, SAFE_ZONES, OUTER_PATH, START_POSITIONS } from '../logic/constants';
import { Star } from 'lucide-react';
import Token from './Token';

const Cell = ({ x, y, tokens = [] }) => {
  let cellClass = 'ludo-cell ';
  let cellColor = null;
  let isSafe = false;

  // Determine cell type and color
  // Home zones (6x6 corner grids)
  if (x >= 0 && x <= 5 && y >= 0 && y <= 5) {
    cellClass += 'home-zone red-home ';
    cellColor = COLORS.RED;
  } else if (x >= 9 && x <= 14 && y >= 0 && y <= 5) {
    cellClass += 'home-zone green-home ';
    cellColor = COLORS.GREEN;
  } else if (x >= 9 && x <= 14 && y >= 9 && y <= 14) {
    cellClass += 'home-zone yellow-home ';
    cellColor = COLORS.YELLOW;
  } else if (x >= 0 && x <= 5 && y >= 9 && y <= 14) {
    cellClass += 'home-zone blue-home ';
    cellColor = COLORS.BLUE;
  } 
  // Center Home
  else if (x >= 6 && x <= 8 && y >= 6 && y <= 8) {
    cellClass += 'center-home ';
    if (x === 6 && y === 7) cellClass += 'red-path';
    if (x === 7 && y === 6) cellClass += 'green-path';
    if (x === 8 && y === 7) cellClass += 'yellow-path';
    if (x === 7 && y === 8) cellClass += 'blue-path';
  }
  else {
    // Paths
    const isOuterPath = OUTER_PATH.some(p => p.x === x && p.y === y);
    isSafe = SAFE_ZONES.some(p => p.x === x && p.y === y);
    
    if (isOuterPath || isSafe) {
      cellClass += 'path-cell ';
      if (isSafe) {
        cellClass += 'safe-cell ';
      }
      
      // Starting colored cells
      if (x === 1 && y === 6) cellClass += 'red-path ';
      if (x === 8 && y === 1) cellClass += 'green-path ';
      if (x === 13 && y === 8) cellClass += 'yellow-path ';
      if (x === 6 && y === 13) cellClass += 'blue-path ';
    }
    
    // Home stretches
    if (x >= 1 && x <= 5 && y === 7) cellClass += 'red-path path-cell ';
    if (x === 7 && y >= 1 && y <= 5) cellClass += 'green-path path-cell ';
    if (x >= 9 && x <= 13 && y === 7) cellClass += 'yellow-path path-cell ';
    if (x === 7 && y >= 9 && y <= 13) cellClass += 'blue-path path-cell ';
  }

  // Determine if it's a token starting position
  const isStartPos = 
    START_POSITIONS[COLORS.RED].some(p => p.x === x && p.y === y) ||
    START_POSITIONS[COLORS.GREEN].some(p => p.x === x && p.y === y) ||
    START_POSITIONS[COLORS.YELLOW].some(p => p.x === x && p.y === y) ||
    START_POSITIONS[COLORS.BLUE].some(p => p.x === x && p.y === y);
    
  if (isStartPos) {
      cellClass += 'start-pos-cell ';
  }

  return (
    <div className={cellClass} style={{ gridColumn: x + 1, gridRow: y + 1 }}>
      {isSafe && <Star className="safe-star" size={20} />}
    </div>
  );
};

export default Cell;
