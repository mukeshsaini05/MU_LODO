import { COLORS, START_POSITIONS, COLOR_PATHS, SAFE_ZONES } from './constants';

export const INITIAL_STATE = {
  gameStarted: false,
  isOnline: false,
  isHost: false,
  roomId: null,
  peerError: null,
  players: [COLORS.RED, COLORS.GREEN, COLORS.YELLOW, COLORS.BLUE],
  playerNames: {
    [COLORS.RED]: 'Player red',
    [COLORS.GREEN]: 'Player green',
    [COLORS.YELLOW]: 'Player yellow',
    [COLORS.BLUE]: 'Player blue'
  },
  turnIndex: 0,
  diceValue: null,
  diceRolled: false,
  winner: null,
  tokens: {
    [COLORS.RED]: [
      { id: 'r1', position: -1, isHome: false, isReturning: false },
      { id: 'r2', position: -1, isHome: false, isReturning: false },
      { id: 'r3', position: -1, isHome: false, isReturning: false },
      { id: 'r4', position: -1, isHome: false, isReturning: false }
    ],
    [COLORS.GREEN]: [
      { id: 'g1', position: -1, isHome: false, isReturning: false },
      { id: 'g2', position: -1, isHome: false, isReturning: false },
      { id: 'g3', position: -1, isHome: false, isReturning: false },
      { id: 'g4', position: -1, isHome: false, isReturning: false }
    ],
    [COLORS.YELLOW]: [
      { id: 'y1', position: -1, isHome: false, isReturning: false },
      { id: 'y2', position: -1, isHome: false, isReturning: false },
      { id: 'y3', position: -1, isHome: false, isReturning: false },
      { id: 'y4', position: -1, isHome: false, isReturning: false }
    ],
    [COLORS.BLUE]: [
      { id: 'b1', position: -1, isHome: false, isReturning: false },
      { id: 'b2', position: -1, isHome: false, isReturning: false },
      { id: 'b3', position: -1, isHome: false, isReturning: false },
      { id: 'b4', position: -1, isHome: false, isReturning: false }
    ]
  },
  logs: ['Player 1\'s turn.']
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME': {
      const playerCount = action.payload.playerCount;
      let activePlayers = [];
      if (playerCount === 2) {
        activePlayers = [COLORS.RED, COLORS.YELLOW];
      } else if (playerCount === 3) {
        activePlayers = [COLORS.RED, COLORS.GREEN, COLORS.YELLOW];
      } else {
        activePlayers = [COLORS.RED, COLORS.GREEN, COLORS.YELLOW, COLORS.BLUE];
      }

      const p1Name = action.payload.playerNames ? action.payload.playerNames[COLORS.RED] : 'Player 1';
      return {
        ...INITIAL_STATE,
        gameStarted: true,
        isOnline: false,
        players: activePlayers,
        playerNames: action.payload.playerNames || INITIAL_STATE.playerNames,
        logs: [`${p1Name}'s turn.`],
      };
    }
    case 'LOBBY_START_GAME': {
      const { isHost, myColor, playersCount, roomId, playerNames } = action.payload;
      
      let activePlayers = [];
      if (playersCount === 2) activePlayers = [COLORS.RED, COLORS.YELLOW];
      else if (playersCount === 3) activePlayers = [COLORS.RED, COLORS.GREEN, COLORS.YELLOW];
      else activePlayers = [COLORS.RED, COLORS.GREEN, COLORS.YELLOW, COLORS.BLUE];
      
      const p1Name = playerNames ? playerNames[COLORS.RED] : 'Player 1';
      return {
        ...INITIAL_STATE,
        gameStarted: true,
        isOnline: true,
        isHost,
        roomId,
        players: activePlayers,
        playerNames: playerNames || INITIAL_STATE.playerNames,
        myColor,
        logs: [`${p1Name}'s turn.`],
      };
    }
    case 'UPDATE_PLAYER_NAMES': {
      return {
        ...state,
        playerNames: { ...state.playerNames, ...action.payload }
      };
    }
    case 'SET_PEER_ERROR': {
      return {
        ...state,
        peerError: action.payload
      };
    }
    case 'ROLL_DICE': {
      if (state.diceRolled) return state;
      const value = action.payload && action.payload.value ? action.payload.value : Math.floor(Math.random() * 6) + 1;
      
      const currentPlayer = state.players[state.turnIndex];
      const tokens = state.tokens[currentPlayer];
      
      // Check if player has any valid moves
      let hasValidMove = false;
      for (const token of tokens) {
        if (!token.isHome) {
          if (token.position === -1 && value === 6) {
            hasValidMove = true;
          } else if (token.position !== -1 && token.position + value <= 56) {
            hasValidMove = true;
          }
        }
      }

      if (!hasValidMove) {
        // Next turn immediately without 'no valid moves' log clutter
        const nextTurn = (state.turnIndex + 1) % state.players.length;
        const nextPlayer = state.players[nextTurn];
        const nextName = state.playerNames[nextPlayer] || nextPlayer;
        return {
          ...state,
          diceValue: value,
          diceRolled: false,
          turnIndex: nextTurn,
          logs: [...state.logs, `${nextName}'s turn.`]
        };
      }

      return {
        ...state,
        diceValue: value,
        diceRolled: true,
        logs: [...state.logs, `${currentPlayer} rolled a ${value}.`]
      };
    }
    case 'MOVE_OUT_OF_HOME': {
      const { color, tokenId } = action.payload;
      const tokens = [...state.tokens[color]];
      const tokenIndex = tokens.findIndex(t => t.id === tokenId);
      tokens[tokenIndex] = { ...tokens[tokenIndex], position: 0 };
      return {
        ...state,
        tokens: { ...state.tokens, [color]: tokens }
      };
    }
    case 'STEP_TOKEN': {
      const { color, tokenId } = action.payload;
      const tokens = [...state.tokens[color]];
      const tokenIndex = tokens.findIndex(t => t.id === tokenId);
      const token = tokens[tokenIndex];
      const newPosition = token.position + 1;
      tokens[tokenIndex] = { ...token, position: newPosition, isHome: newPosition === 56 };
      return {
        ...state,
        tokens: { ...state.tokens, [color]: tokens }
      };
    }
    case 'STEP_BACK_TOKENS': {
      let newTokens = { ...state.tokens };
      
      Object.keys(newTokens).forEach(color => {
        newTokens[color] = newTokens[color].map(token => {
          if (token.isReturning) {
            if (token.position > 0) {
              return { ...token, position: token.position - 1, isHome: false };
            } else {
              return { ...token, position: -1, isReturning: false, isHome: false };
            }
          }
          return token;
        });
      });

      return {
        ...state,
        tokens: newTokens
      };
    }
    case 'FINISH_MOVE': {
      let nextTurnIndex = state.turnIndex;
      let logs = [...state.logs];
      let newTokens = { ...state.tokens };
      let captured = false;

      if (action.payload) {
        const { color, tokenId } = action.payload;
        const currentToken = newTokens[color].find(t => t.id === tokenId);
        
        if (currentToken && currentToken.position >= 0 && !currentToken.isHome) {
          const currentCell = COLOR_PATHS[color][currentToken.position];
          
          const isSafeZone = SAFE_ZONES.some(zone => zone.x === currentCell.x && zone.y === currentCell.y);
          
          if (!isSafeZone) {
            for (const otherColor of state.players) {
              if (otherColor !== color) {
                const otherTokens = [...newTokens[otherColor]];
                let colorCaptured = false;
                
                for (let i = 0; i < otherTokens.length; i++) {
                  const otherToken = otherTokens[i];
                  if (otherToken.position >= 0 && !otherToken.isHome) {
                    const otherCell = COLOR_PATHS[otherColor][otherToken.position];
                    if (otherCell.x === currentCell.x && otherCell.y === currentCell.y) {
                      otherTokens[i] = { ...otherToken, isReturning: true };
                      colorCaptured = true;
                      captured = true;
                      logs.push(`${color} captured ${otherColor}'s token!`);
                    }
                  }
                }
                if (colorCaptured) {
                  newTokens[otherColor] = otherTokens;
                }
              }
            }
          }
        }
      }

      if (state.diceValue !== 6 && !captured) {
        nextTurnIndex = (state.turnIndex + 1) % state.players.length;
      }

      return {
        ...state,
        tokens: newTokens,
        logs: logs,
        diceRolled: false,
        diceValue: null,
        turnIndex: nextTurnIndex
      };
    }
    case 'RESET_GAME': {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};
