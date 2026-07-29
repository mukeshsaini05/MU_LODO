import React from 'react';
import Cell from './Cell';
import Token from './Token';
import { START_POSITIONS, COLOR_PATHS, COLORS } from '../logic/constants';

const Board = ({ gameState, onTokenClick }) => {
  const gridSize = 15;
  const cells = [];

  // Create a mapping of tokens to their coordinates
  const tokensByCoords = {};

  gameState.players.forEach(color => {
    gameState.tokens[color].forEach(token => {
      let x, y;
      
      if (token.position === -1) {
        // Token is at start position
        // Find which start position it belongs to (0 to 3)
        const tokenIndex = parseInt(token.id[1]) - 1; 
        x = START_POSITIONS[color][tokenIndex].x;
        y = START_POSITIONS[color][tokenIndex].y;
      } else if (token.isHome) {
        // Just place them in the home triangle visually
        if (color === COLORS.RED) { x = 6; y = 7; }
        if (color === COLORS.GREEN) { x = 7; y = 6; }
        if (color === COLORS.YELLOW) { x = 8; y = 7; }
        if (color === COLORS.BLUE) { x = 7; y = 8; }
      } else {
        // Token is on the path
        const pathCoords = COLOR_PATHS[color][token.position];
        x = pathCoords.x;
        y = pathCoords.y;
      }

      const key = `${x},${y}`;
      if (!tokensByCoords[key]) {
        tokensByCoords[key] = [];
      }
      tokensByCoords[key].push({ ...token, color });
    });
  });

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      cells.push(
        <div 
          key={`${x},${y}`} 
          style={{ gridColumn: x + 1, gridRow: y + 1 }}
          className="cell-wrapper"
        >
          <Cell x={x} y={y} />
        </div>
      );
    }
  }

  const tokenElements = [];
  gameState.players.forEach(color => {
    gameState.tokens[color].forEach(token => {
      let x, y;
      
      if (token.position === -1) {
        const tokenIndex = parseInt(token.id[1]) - 1; 
        x = START_POSITIONS[color][tokenIndex].x;
        y = START_POSITIONS[color][tokenIndex].y;
      } else if (token.isHome) {
        if (color === COLORS.RED) { x = 6; y = 7; }
        if (color === COLORS.GREEN) { x = 7; y = 6; }
        if (color === COLORS.YELLOW) { x = 8; y = 7; }
        if (color === COLORS.BLUE) { x = 7; y = 8; }
      } else {
        const pathCoords = COLOR_PATHS[color][token.position];
        x = pathCoords.x;
        y = pathCoords.y;
      }

      const key = `${x},${y}`;
      const tokensInSameCell = tokensByCoords[key] || [];
      const index = tokensInSameCell.findIndex(t => t.id === token.id);

      tokenElements.push(
        <Token 
          key={token.id} 
          color={color} 
          id={token.id} 
          index={index} 
          total={tokensInSameCell.length} 
          x={x}
          y={y}
          onClick={() => {
            if (gameState.players[gameState.turnIndex] === color) {
              onTokenClick(color, token.id);
            }
          }}
        />
      );
    });
  });

  return (
    <div className="ludo-board">
      {cells}
      {tokenElements}
      
      {/* Home triangles */}
      <div className="center-triangles">
        <div className="triangle triangle-top"></div>
        <div className="triangle triangle-right"></div>
        <div className="triangle triangle-bottom"></div>
        <div className="triangle triangle-left"></div>
      </div>
    </div>
  );
};

export default Board;
