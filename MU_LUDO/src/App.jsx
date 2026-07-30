import React, { useReducer, useState, useEffect } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import PlayerInfo from './components/PlayerInfo';
import Dashboard from './components/Dashboard';
import { ChatModal, EmojiModal, FriendsModal } from './components/Modals';
import { gameReducer, INITIAL_STATE } from './logic/gameState';
import { COLORS } from './logic/constants';
import { createRoom, joinRoom, generateRoomId, startVoiceChat, stopVoiceChat } from './logic/network';
import { 
  ArrowLeft, Clock, Users, Volume2, VolumeX, Music, Settings, 
  MessageSquare, Smile, Zap, Mic, MicOff, Dices, Sparkles
} from 'lucide-react';
import { playTokenMoveSound } from './logic/audio';

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [moving, setMoving] = React.useState(false);
  
  // Audio & UI states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [autoMove, setAutoMove] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [matchSeconds, setMatchSeconds] = useState(0);

  // Bottom 4 Options States
  const [activeModal, setActiveModal] = useState(null); // 'chat' | 'emoji' | 'friends' | null
  const [voiceActive, setVoiceActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Match started! Good Luck!', color: 'red', time: '00:00' }
  ]);
  const [activeToast, setActiveToast] = useState(null); // { text, type, sender, color }

  // Timer effect for match duration
  useEffect(() => {
    if (!gameState.gameStarted) {
      setMatchSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setMatchSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.gameStarted]);

  const formatMatchTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // UI states for online setup
  const [generatedCode, setGeneratedCode] = React.useState('');
  const [joinCode, setJoinCode] = React.useState('');
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [guestCount, setGuestCount] = React.useState(0);
  
  // Custom name states
  const [localPlayersCount, setLocalPlayersCount] = React.useState(2);
  const [localNames, setLocalNames] = React.useState({
    [COLORS.RED]: 'Player 1',
    [COLORS.YELLOW]: 'Player 2',
    [COLORS.GREEN]: 'Player 3',
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
      playTokenMoveSound(soundEnabled);
      dispatchNetworkAction({ type: 'FINISH_MOVE', payload: { color, tokenId } });
    } else {
      if (token.position + diceValue > 56) return; // Invalid move

      setMoving(true);
      let stepsTaken = 0;

      const stepSpeed = fastMode ? 150 : 350;
      const interval = setInterval(() => {
        stepsTaken++;
        dispatchNetworkAction({ type: 'STEP_TOKEN', payload: { color, tokenId } });
        playTokenMoveSound(soundEnabled);
        
        if (stepsTaken === diceValue) {
          clearInterval(interval);
          setMoving(false);
          dispatchNetworkAction({ type: 'FINISH_MOVE', payload: { color, tokenId } });
        }
      }, stepSpeed);
    }
  };

  const currentPlayer = gameState.players[gameState.turnIndex];
  const isReturning = Object.values(gameState.tokens).some(tokens => tokens.some(t => t.isReturning));

  React.useEffect(() => {
    if (isReturning) {
      const interval = setInterval(() => {
        dispatchNetworkAction({ type: 'STEP_BACK_TOKENS' });
        playTokenMoveSound(soundEnabled);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isReturning, soundEnabled]);

  // Chat & Emoji Handlers with Real-Time Multiplayer Network Sync
  const handleNetworkData = (data) => {
    if (!data) return;

    if (data.type === 'RECEIVE_CHAT') {
      setChatMessages(prev => [...prev, data.payload]);
      setActiveToast({ ...data.payload, type: 'chat' });
      setTimeout(() => setActiveToast(null), 4000);
      return;
    }

    if (data.type === 'RECEIVE_EMOJI') {
      setActiveToast(data.payload);
      setTimeout(() => setActiveToast(null), 3500);
      return;
    }

    dispatch(data);
  };

  const handleSendMessage = (text) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderColor = gameState.isOnline ? gameState.myColor : currentPlayer;
    const newMsg = {
      sender: gameState.playerNames[senderColor] || 'Player',
      text,
      color: senderColor,
      time: nowStr
    };
    setChatMessages(prev => [...prev, newMsg]);
    setActiveToast({ ...newMsg, type: 'chat' });
    setTimeout(() => setActiveToast(null), 4000);

    if (gameState.isOnline && networkRef.current) {
      networkRef.current.sendAction({ type: 'RECEIVE_CHAT', payload: newMsg });
    }
  };

  const handleSendEmoji = (emoji) => {
    const senderColor = gameState.isOnline ? gameState.myColor : currentPlayer;
    const newMsg = {
      sender: gameState.playerNames[senderColor] || 'Player',
      text: emoji,
      color: senderColor,
      type: 'emoji'
    };
    setActiveToast(newMsg);
    setTimeout(() => setActiveToast(null), 3500);

    if (gameState.isOnline && networkRef.current) {
      networkRef.current.sendAction({ type: 'RECEIVE_EMOJI', payload: newMsg });
    }
  };

  const handleCreateRoom = () => {
    setIsConnecting(true);
    const newCode = generateRoomId();
    setGeneratedCode(newCode);

    networkRef.current = createRoom(newCode, {
      onConnected: () => {},
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
      onData: (data) => handleNetworkData(data),
      onError: (err) => dispatch({ type: 'SET_PEER_ERROR', payload: err })
    });
  };

  const handleStartLobbyGame = () => {
    const playersCount = guestCount + 1;
    const hostNamesState = { ...gameState.playerNames, [COLORS.RED]: myOnlineName || 'Host' };
    
    dispatch({ 
      type: 'LOBBY_START_GAME', 
      payload: { isHost: true, myColor: COLORS.RED, playersCount, roomId: generatedCode, playerNames: hostNamesState } 
    });
    
    if (networkRef.current && networkRef.current.sendTargetedAction) {
      networkRef.current.sendTargetedAction((index) => {
         let guestColor;
         if (playersCount === 2) {
           guestColor = COLORS.YELLOW;
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
        setIsConnected(true);
      },
      onData: (data) => handleNetworkData(data),
      onError: (err) => {
        setIsConnecting(false);
        setIsConnected(false);
        dispatch({ type: 'SET_PEER_ERROR', payload: err });
      }
    });
  };

  const handleStartLocalGame = (count) => {
    dispatch({ 
      type: 'START_GAME', 
      payload: { playerCount: count, playerNames: localNames } 
    });
  };

  const handleReset = () => {
    stopVoiceChat();
    setVoiceActive(false);
    if (networkRef.current) networkRef.current.close();
    setIsConnected(false);
    setIsConnecting(false);
    dispatch({ type: 'RESET_GAME' });
  };

  const handleToggleVoice = async () => {
    if (voiceActive) {
      stopVoiceChat();
      setVoiceActive(false);
      setActiveToast({
        sender: 'Voice Chat',
        text: 'Microphone turned off',
        color: 'yellow',
        type: 'system'
      });
      setTimeout(() => setActiveToast(null), 3000);
    } else {
      const stream = await startVoiceChat();
      setVoiceActive(true);
      setActiveToast({
        sender: 'Voice Chat',
        text: stream ? 'Voice Chat Live! Mic active 🎙️' : 'Voice Chat Active 🎙️',
        color: 'green',
        type: 'system'
      });
      setTimeout(() => setActiveToast(null), 3000);
    }
  };

  // If game hasn't started, show Dashboard Homepage
  if (!gameState.gameStarted) {
    return (
      <Dashboard
        onSelectLocalPlayers={(count) => setLocalPlayersCount(count)}
        onCreateRoom={handleCreateRoom}
        onOpenJoinRoom={() => {}}
        generatedCode={generatedCode}
        guestCount={guestCount}
        isConnecting={isConnecting}
        peerError={gameState.peerError}
        myOnlineName={myOnlineName}
        setMyOnlineName={setMyOnlineName}
        joinCode={joinCode}
        setJoinCode={setJoinCode}
        onJoinRoom={handleJoinRoom}
        onStartLobbyGame={handleStartLobbyGame}
        localNames={localNames}
        setLocalNames={setLocalNames}
        onStartLocalGame={handleStartLocalGame}
        isConnected={isConnected}
      />
    );
  }

  // Active Reference Match Game Screen Layout
  return (
    <div className="game-screen-main-bg">
      <div className="game-screen-wrapper">
        
        {/* VOICE CHAT ACTIVE LIVE INDICATOR */}
        {voiceActive && (
          <div className="voice-active-bar-pill">
            <Mic size={16} className="voice-mic-icon" />
            <span className="voice-text">Voice Chat Live</span>
            <div className="audio-wave-bars">
              <span className="bar b1"></span>
              <span className="bar b2"></span>
              <span className="bar b3"></span>
              <span className="bar b4"></span>
            </div>
          </div>
        )}

        {/* FLOATING CHAT / EMOJI SPEECH TOAST */}
        {activeToast && (
          <div className={`floating-speech-toast toast-${activeToast.color || 'red'} ${activeToast.type}`}>
            <div className="toast-sender">{activeToast.sender}</div>
            <div className="toast-body">{activeToast.text}</div>
          </div>
        )}

        {/* TOP BAR HEADER */}
        <header className="game-top-bar-ref">
          <button className="exit-dashboard-btn-ref" onClick={handleReset}>
            <ArrowLeft size={16} /> Exit to Dashboard
          </button>
          
          <div className="match-info-pill-ref">
            <div className="match-time-group">
              <Clock size={16} className="pill-icon" />
              <span className="pill-label desktop-only-label">Match Time</span>
              <span className="pill-label mobile-only-label">Time</span>
              <span className="pill-val">{formatMatchTime(matchSeconds)}</span>
            </div>
            <div className="pill-divider">|</div>
            <div className="room-id-group">
              <Users size={16} className="pill-icon" />
              <span className="pill-label">Room ID</span>
              <span className="pill-val">#{gameState.roomId || 'MU1245'}</span>
            </div>
          </div>

          <div className="top-right-actions">
            <button className={`audio-icon-btn ${soundEnabled ? 'active' : ''}`} onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className={`audio-icon-btn ${musicEnabled ? 'active' : ''}`} onClick={() => setMusicEnabled(!musicEnabled)}>
              <Music size={18} />
            </button>
            <button className="audio-icon-btn">
              <Settings size={18} />
            </button>
          </div>
        </header>
        
        {/* MAIN GAMEPLAY AREA (3 COLUMNS DESKTOP / TOP-BOARD-BOTTOM MOBILE) */}
        <main className="game-area-ref">
          {/* Left Column / Top Left (Player 1 Red) & Bottom Left (Player 4 Blue) */}
          <div className="players-col col-left">
            {gameState.players.includes(COLORS.RED) && (
              <PlayerInfo 
                color={COLORS.RED} 
                isActive={currentPlayer === COLORS.RED} 
                isWinner={gameState.winner === COLORS.RED || (Array.isArray(gameState.winners) && gameState.winners.includes(COLORS.RED))}
                name={gameState.playerNames[COLORS.RED] || 'Player 1'} 
                side="left"
                mobileSide="top"
              />
            )}
            {gameState.players.includes(COLORS.BLUE) && (
              <PlayerInfo 
                color={COLORS.BLUE} 
                isActive={currentPlayer === COLORS.BLUE} 
                isWinner={gameState.winner === COLORS.BLUE || (Array.isArray(gameState.winners) && gameState.winners.includes(COLORS.BLUE))}
                name={gameState.playerNames[COLORS.BLUE] || 'Player 4'} 
                side="left"
                mobileSide="bottom"
              />
            )}
          </div>
          
          {/* Center Column (Ludo Board) */}
          <div className="board-center-wrapper">
            <div className="board-outer-frame">
              <Board gameState={gameState} onTokenClick={handleTokenClick} />
            </div>
          </div>

          {/* Right Column / Top Right (Player 3 Green) & Bottom Right (Player 2 Yellow) */}
          <div className="players-col col-right">
            {gameState.players.includes(COLORS.GREEN) && (
              <PlayerInfo 
                color={COLORS.GREEN} 
                isActive={currentPlayer === COLORS.GREEN} 
                isWinner={gameState.winner === COLORS.GREEN || (Array.isArray(gameState.winners) && gameState.winners.includes(COLORS.GREEN))}
                name={gameState.playerNames[COLORS.GREEN] || 'Player 3'} 
                side="right"
                mobileSide="top"
              />
            )}
            {gameState.players.includes(COLORS.YELLOW) && (
              <PlayerInfo 
                color={COLORS.YELLOW} 
                isActive={currentPlayer === COLORS.YELLOW} 
                isWinner={gameState.winner === COLORS.YELLOW || (Array.isArray(gameState.winners) && gameState.winners.includes(COLORS.YELLOW))}
                name={gameState.playerNames[COLORS.YELLOW] || 'Player 2'} 
                side="right"
                mobileSide="bottom"
              />
            )}
          </div>
        </main>

        {/* BOTTOM ACTION & CONTROLS BAR */}
        <footer className="game-bottom-bar-ref">
          {/* Left Bottom Icons */}
          <div className="bottom-left-tools">
            <div className="tool-btn-group">
              <button className="circular-tool-btn" onClick={() => setActiveModal('chat')}>
                <MessageSquare size={18} />
              </button>
              <span className="tool-label">Chat</span>
            </div>
            <div className="tool-btn-group">
              <button className="circular-tool-btn" onClick={() => setActiveModal('emoji')}>
                <Smile size={18} />
              </button>
              <span className="tool-label">Emoji</span>
            </div>
          </div>

          {/* Middle Action Bar */}
          <div className="bottom-middle-controls">
            <button 
              className={`pill-mode-btn ${autoMove ? 'active' : ''}`}
              onClick={() => setAutoMove(!autoMove)}
            >
              <Dices size={16} /> Auto Move
            </button>

            <Dice 
              onRoll={handleRollDice} 
              value={gameState.diceValue} 
              disabled={gameState.diceRolled || isReturning || moving || (gameState.isOnline && currentPlayer !== gameState.myColor)}
              currentPlayer={currentPlayer}
              soundEnabled={soundEnabled}
            />

            <button 
              className={`pill-mode-btn ${fastMode ? 'active' : ''}`}
              onClick={() => setFastMode(!fastMode)}
            >
              <Zap size={16} /> Fast Mode
            </button>
          </div>

          {/* Right Bottom Icons */}
          <div className="bottom-right-tools">
            <div className="tool-btn-group">
              <button className="circular-tool-btn" onClick={() => setActiveModal('friends')}>
                <Users size={18} />
              </button>
              <span className="tool-label">Friends</span>
            </div>
            <div className="tool-btn-group">
              <button 
                className={`circular-tool-btn ${voiceActive ? 'active-voice' : ''}`}
                onClick={handleToggleVoice}
              >
                {voiceActive ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <span className="tool-label">Voice Chat</span>
            </div>
          </div>
        </footer>

        {/* MODAL POPUPS */}
        {activeModal === 'chat' && (
          <ChatModal 
            onSendMessage={handleSendMessage} 
            messages={chatMessages} 
            onClose={() => setActiveModal(null)} 
          />
        )}

        {activeModal === 'emoji' && (
          <EmojiModal 
            onSendEmoji={handleSendEmoji} 
            onClose={() => setActiveModal(null)} 
          />
        )}

        {activeModal === 'friends' && (
          <FriendsModal 
            roomId={gameState.roomId} 
            onClose={() => setActiveModal(null)} 
          />
        )}

      </div>
    </div>
  );
}

export default App;
