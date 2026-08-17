import { COLOR_PATHS, SAFE_ZONES } from './constants';

/**
 * Smart Heuristic AI Bot Decision Engine for Ludo
 * Evaluates all valid moves for a bot player and picks the optimal token.
 */
export const getBestBotMove = (gameState, botColor, diceValue) => {
  const botTokens = gameState.tokens[botColor] || [];
  const validMoves = [];

  botTokens.forEach(token => {
    if (token.isHome) return;

    // Rule: Move out of base on 6
    if (token.position === -1) {
      if (diceValue === 6) {
        validMoves.push({
          token,
          score: 45, // Good priority to bring token onto board
          type: 'MOVE_OUT'
        });
      }
      return;
    }

    // Invalid move if overshooting home
    const targetPos = token.position + diceValue;
    if (targetPos > 56) return;

    // Check Home Entry Rule if active
    if (gameState.requireKill && !gameState.hasKilled?.[botColor] && targetPos > 50) {
      return; // Cannot enter home stretch without a kill
    }

    let score = 10; // Base score for moving
    const targetCell = COLOR_PATHS[botColor][targetPos];

    if (targetPos === 56) {
      score += 85; // High priority: Reach Home
    }

    // Check if target cell is a Safe Zone Star
    const isSafe = targetCell ? SAFE_ZONES.some(zone => zone.x === targetCell.x && zone.y === targetCell.y) : false;
    if (isSafe) {
      score += 40;
    }

    // Check if target cell captures an opponent token
    if (targetCell && !isSafe) {
      for (const otherColor of gameState.players) {
        if (otherColor !== botColor) {
          const otherTokens = gameState.tokens[otherColor] || [];
          for (const enemyToken of otherTokens) {
            if (enemyToken.position >= 0 && !enemyToken.isHome) {
              const enemyCell = COLOR_PATHS[otherColor][enemyToken.position];
              if (enemyCell && enemyCell.x === targetCell.x && enemyCell.y === targetCell.y) {
                score += 120; // HIGHEST PRIORITY: CAPTURE ENEMY!
              }
            }
          }
        }
      }
    }

    // Favor advancing tokens closer to home
    score += Math.floor(targetPos / 5);

    validMoves.push({
      token,
      score,
      type: 'ADVANCE'
    });
  });

  if (validMoves.length === 0) return null;

  // Sort by score descending and return the best token ID
  validMoves.sort((a, b) => b.score - a.score);
  return validMoves[0].token.id;
};
