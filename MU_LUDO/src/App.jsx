import React, { useReducer } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import PlayerInfo from './components/PlayerInfo';
import { gameReducer, INITIAL_STATE } from './logic/gameState';
import { COLORS } from './logic/constants';
import { createRoom, joinRoom, generateRoomId } from './logic/network';

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [moving, setMoving] = React.useState(false);
  
  // UI states for online setup
  const [onlineMenu, setOnlineMenu] = React.useState(null); // 'host' or 'guest'
  const [generatedCode, setGeneratedCode] = React.useState('');
  const [joinCode, setJoinCode] = React.useState('');
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [guestCount, setGuestCount] = React.useState(0);
  
  // Custom name states
  const [localPlayersCount, setLocalPlayersCount] = React.useState(null);
  const [localNames, setLocalNames] = React.useState({
    [COLORS.RED]: 'Player 1',
    [COLORS.GREEN]: 'Player 2',
    [COLORS.YELLOW]: 'Player 3',
    [COLORS.BLUE]: 'Player 4'
  });
  const [myOnlineName, setMyOnlineName] = React.useState('');
  
  const networkRef = React.useRef(null);

  const dispatchNetworkAction = (action) => {
    dispatch(action);
    if (gameState.isOnline && networkRef.current) {
      networkRef.current.sendAction(action);
    }
  };

  const handleRollDice = () => {
    const currentPlayer = gameState.players[gameState.turnIndex];
    if (moving || isReturning) return;
    if (gameState.isOnline) {
      if (currentPlayer !== gameState.myColor) return;
    }
    const value = Math.floor(Math.random() * 6) + 1;
    dispatchNetworkAction({ type: 'ROLL_DICE', payload: { value } });
  };

  const handleTokenClick = (color, tokenId) => {
    const isReturning = Object.values(gameState.tokens).some(tokens => tokens.some(t => t.isReturning));
    if (moving || isReturning) return;

    const currentPlayer = gameState.players[gameState.turnIndex];
    
    if (gameState.isOnline) {
      if (color !== gameState.myColor || currentPlayer !== gameState.myColor) return;
    }

    if (color !== currentPlayer || !gameState.diceRolled) return;

    const tokens = gameState.tokens[color];
    const token = tokens.find(t => t.id === tokenId);
    const diceValue = gameState.diceValue;

    if (token.isHome) return;

    if (token.position === -1) {
      if (diceValue !== 6) return;
      dispatchNetworkAction({ type: 'MOVE_OUT_OF_HOME', payload: { color, tokenId } });
      dispatchNetworkAction({ type: 'FINISH_MOVE', payload: { color, tokenId } });
    } else {
      if (token.position + diceValue > 56) return; // Invalid move

      setMoving(true);
      let stepsTaken = 0;

      const interval = setInterval(() => {
        stepsTaken++;
        dispatchNetworkAction({ type: 'STEP_TOKEN', payload: { color, tokenId } });
        
        if (stepsTaken === diceValue) {
          clearInterval(interval);
          setMoving(false);
          dispatchNetworkAction({ type: 'FINISH_MOVE', payload: { color, tokenId } });
        }
      }, 400); // Wait 400ms per step to match CSS transition
    }
  };

  const currentPlayer = gameState.players[gameState.turnIndex];
  const isReturning = Object.values(gameState.tokens).some(tokens => tokens.some(t => t.isReturning));

  React.useEffect(() => {
    if (isReturning) {
      const interval = setInterval(() => {
        dispatchNetworkAction({ type: 'STEP_BACK_TOKENS' });
      }, 80); // Move back quickly step-by-step
      return () => clearInterval(interval);
    }
  }, [isReturning]);

  const handleCreateRoom = () => {
    setIsConnecting(true);
    const newCode = generateRoomId();
    setGeneratedCode(newCode);

    networkRef.current = createRoom(newCode, {
      onConnected: () => {}, // Connection handled by onGuestJoined
      onGuestJoined: (count, guestName, guestIndex) => {
        setIsConnecting(false);
        setGuestCount(count);
        if (guestName) {
           const assignedColor = count === 1 && guestIndex === 0 ? COLORS.YELLOW : 
                                 count === 2 && guestIndex === 0 ? COLORS.GREEN :
                                 count === 2 && guestIndex === 1 ? COLORS.YELLOW :
                                 guestIndex === 0 ? COLORS.GREEN : guestIndex === 1 ? COLORS.YELLOW : COLORS.BLUE;
           dispatch({ type: 'UPDATE_PLAYER_NAMES', payload: { [assignedColor]: guestName } });
        }
      },
      onData: (data) => dispatch(data),
      onError: (err) => dispatch({ type: 'SET_PEER_ERROR', payload: err })
    });
  };

  const handleStartLobbyGame = () => {
    const playersCount = guestCount + 1; // Host + Guests
    
    const hostNamesState = { ...gameState.playerNames, [COLORS.RED]: myOnlineName || 'Host' };
    
    // Dispatch to self
    dispatch({ 
      type: 'LOBBY_START_GAME', 
      payload: { isHost: true, myColor: COLORS.RED, playersCount, roomId: generatedCode, playerNames: hostNamesState } 
    });
    
    // Dispatch to guests
    if (networkRef.current && networkRef.current.sendTargetedAction) {
      networkRef.current.sendTargetedAction((index) => {
         let guestColor;
         if (playersCount === 2) {
           guestColor = COLORS.YELLOW; // Only 1 guest
         } else if (playersCount === 3) {
           guestColor = index === 0 ? COLORS.GREEN : COLORS.YELLOW;
         } else {
           guestColor = index === 0 ? COLORS.GREEN : index === 1 ? COLORS.YELLOW : COLORS.BLUE;
         }
         return {
           type: 'LOBBY_START_GAME',
           payload: { isHost: false, myColor: guestColor, playersCount, roomId: generatedCode, playerNames: hostNamesState }
         };
      });
    }
  };

  const handleJoinRoom = () => {
    if (!joinCode || !myOnlineName.trim()) return alert("Please enter room code and your name!");
    setIsConnecting(true);
    networkRef.current = joinRoom(joinCode.toUpperCase(), myOnlineName, {
      onConnected: () => {
        setIsConnecting(false);
        // Do not dispatch game start here. Wait for Host to send LOBBY_START_GAME.
      },
      onData: (data) => dispatch(data),
      onError: (err) => {
        setIsConnecting(false);
        dispatch({ type: 'SET_PEER_ERROR', payload: err });
      }
    });
  };

  const handleReset = () => {
    if (networkRef.current) networkRef.current.close();
    setOnlineMenu(null);
    setLocalPlayersCount(null);
    dispatch({ type: 'RESET_GAME' });
  };

  if (!gameState.gameStarted) {
    return (
      <div className="app-container setup-menu">
        <header className="header">
          <h1>MU_LUDO</h1>
          <p className="status-text">Select game mode</p>
        </header>
        
        {localPlayersCount !== null ? (
          <div className="online-setup">
            <h2>Enter Player Names:</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <input type="text" className="code-input" value={localNames[COLORS.RED]} onChange={e => setLocalNames({...localNames, [COLORS.RED]: e.target.value})} style={{borderLeft: `4px solid var(--red-color)`}} placeholder="Player 1 (Red)" />
              <input type="text" className="code-input" value={localNames[COLORS.YELLOW]} onChange={e => setLocalNames({...localNames, [COLORS.YELLOW]: e.target.value})} style={{borderLeft: `4px solid var(--yellow-color)`}} placeholder="Player 2 (Yellow)" />
              {localPlayersCount >= 3 && <input type="text" className="code-input" value={localNames[COLORS.GREEN]} onChange={e => setLocalNames({...localNames, [COLORS.GREEN]: e.target.value})} style={{borderLeft: `4px solid var(--green-color)`}} placeholder="Player 3 (Green)" />}
              {localPlayersCount === 4 && <input type="text" className="code-input" value={localNames[COLORS.BLUE]} onChange={e => setLocalNames({...localNames, [COLORS.BLUE]: e.target.value})} style={{borderLeft: `4px solid var(--blue-color)`}} placeholder="Player 4 (Blue)" />}
            </div>
            <button onClick={() => dispatch({ type: 'START_GAME', payload: { playerCount: localPlayersCount, playerNames: localNames } })} style={{ background: 'var(--green-color)', width: '100%' }}>Start Local Game</button>
            <button className="back-btn" style={{position:'static', marginTop: '1rem'}} onClick={handleReset}>Cancel</button>
          </div>
        ) : onlineMenu === null ? (
          <div className="menu-options" style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <button onClick={() => setLocalPlayersCount(2)}>2 Players</button>
              <button onClick={() => setLocalPlayersCount(3)}>3 Players</button>
              <button onClick={() => setLocalPlayersCount(4)}>4 Players</button>
            </div>
            
            <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
               <button onClick={() => { handleCreateRoom(); setOnlineMenu('host'); }} style={{ background: 'rgba(239, 68, 68, 0.2)' }}>Create Online Game</button>
               <button onClick={() => setOnlineMenu('guest')} style={{ background: 'rgba(59, 130, 246, 0.2)' }}>Join Online Game</button>
            </div>
          </div>
        ) : onlineMenu === 'host' ? (
          <div className="online-setup">
            <h2>Your Room Code:</h2>
            <div className="room-code">{generatedCode}</div>
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <h3>Players Connected: {guestCount + 1} / 4</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>(You + {guestCount} Guests)</p>
            </div>

            {guestCount > 0 ? (
              <button 
                onClick={handleStartLobbyGame} 
                style={{ background: 'var(--green-color)', marginTop: '1rem', width: '100%' }}
              >
                Start Game with {guestCount + 1} Players
              </button>
            ) : (
              <p>{isConnecting ? 'Setting up room...' : 'Waiting for friends to join...'}</p>
            )}

            {gameState.peerError && <p className="error-text">{gameState.peerError}</p>}
            <button className="back-btn" style={{position:'static', marginTop: '2rem'}} onClick={handleReset}>Cancel</button>
          </div>
        ) : (
          <div className="online-setup">
            <h2>Join Room</h2>
            <input 
              type="text" 
              className="code-input" 
              value={myOnlineName} 
              onChange={e => setMyOnlineName(e.target.value)} 
              placeholder="Your Name" 
              maxLength={15}
              style={{ marginBottom: '1rem' }}
              disabled={isConnecting || (networkRef.current && !gameState.peerError)}
            />
            <input 
              type="text" 
              className="code-input" 
              value={joinCode} 
              onChange={e => setJoinCode(e.target.value)} 
              placeholder="Room Code (e.g. XYZ99)" 
              maxLength={5}
              disabled={isConnecting || (networkRef.current && !gameState.peerError)}
            />
            
            {networkRef.current && !isConnecting && !gameState.peerError ? (
               <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                 <h3>Connected to Host!</h3>
                 <p style={{ color: 'var(--yellow-color)', marginTop: '0.5rem' }}>Waiting for host to start the game...</p>
               </div>
            ) : (
               <button onClick={handleJoinRoom} disabled={isConnecting || !joinCode}>Join Game</button>
            )}
            
            <p>{isConnecting ? 'Connecting...' : ''}</p>
            {gameState.peerError && <p className="error-text">{gameState.peerError}</p>}
            <button className="back-btn" style={{position:'static', marginTop: '2rem'}} onClick={handleReset}>Cancel</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Back button - fixed on mobile, inside header on desktop */}
      <button className="back-btn back-btn-mobile" onClick={handleReset} style={{ zIndex: 999 }}>
        &#8592; Back
      </button>
      <header className="header header-game">
        <div>
          <h1>MU_LUDO</h1>
          <p className="status-text">{gameState.logs[gameState.logs.length - 1]}</p>
        </div>
      </header>
      
      <div className="game-area">
        <div className="players-left">
          {gameState.players.includes(COLORS.RED) && <PlayerInfo color={COLORS.RED} isActive={currentPlayer === COLORS.RED} name={gameState.playerNames[COLORS.RED]} />}
          {gameState.players.includes(COLORS.BLUE) && <PlayerInfo color={COLORS.BLUE} isActive={currentPlayer === COLORS.BLUE} name={gameState.playerNames[COLORS.BLUE]} />}
        </div>
        
        <div className="board-container">
          <Board gameState={gameState} onTokenClick={handleTokenClick} />
        </div>

        <div className="players-right">
          {gameState.players.includes(COLORS.GREEN) && <PlayerInfo color={COLORS.GREEN} isActive={currentPlayer === COLORS.GREEN} name={gameState.playerNames[COLORS.GREEN]} />}
          {gameState.players.includes(COLORS.YELLOW) && <PlayerInfo color={COLORS.YELLOW} isActive={currentPlayer === COLORS.YELLOW} name={gameState.playerNames[COLORS.YELLOW]} />}
        </div>
      </div>

      <div className="controls">
        <Dice 
          onRoll={handleRollDice} 
          value={gameState.diceValue} 
          disabled={gameState.diceRolled || isReturning || moving || (gameState.isOnline && currentPlayer !== gameState.myColor)}
          currentPlayer={currentPlayer}
        />
      </div>
    </div>
  );
}

export default App;
