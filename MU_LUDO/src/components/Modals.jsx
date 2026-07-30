import React from 'react';
import { X, Copy, Check, Trophy, ShoppingBag, Gift, Volume2, VolumeX, Sparkles, Share2, Users, Shield, Award, Key, Play, User, MessageSquare } from 'lucide-react';
import { COLORS } from '../logic/constants';

// Modal Container Wrapper
export function ModalWrapper({ title, onClose, children, icon: Icon }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content glass-card glowing-border">
        <div className="modal-header">
          <div className="modal-title-box">
            {Icon && <Icon className="modal-header-icon" size={24} />}
            <h2>{title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

// Local Player Setup Modal
export function LocalSetupModal({ playerCount, localNames, setLocalNames, onStart, onClose }) {
  return (
    <ModalWrapper title={`Setup ${playerCount} Player Game`} onClose={onClose} icon={Users}>
      <div className="setup-modal-content">
        <p className="modal-subtitle">Customize player names before rolling the dice!</p>
        <div className="player-input-list">
          <div className="player-input-row red-border">
            <span className="color-badge red-bg">P1</span>
            <input
              type="text"
              value={localNames[COLORS.RED]}
              onChange={(e) => setLocalNames({ ...localNames, [COLORS.RED]: e.target.value })}
              placeholder="Player 1 Name (Red)"
            />
          </div>

          <div className="player-input-row yellow-border">
            <span className="color-badge yellow-bg">P2</span>
            <input
              type="text"
              value={localNames[COLORS.YELLOW]}
              onChange={(e) => setLocalNames({ ...localNames, [COLORS.YELLOW]: e.target.value })}
              placeholder="Player 2 Name (Yellow)"
            />
          </div>

          {playerCount >= 3 && (
            <div className="player-input-row green-border">
              <span className="color-badge green-bg">P3</span>
              <input
                type="text"
                value={localNames[COLORS.GREEN]}
                onChange={(e) => setLocalNames({ ...localNames, [COLORS.GREEN]: e.target.value })}
                placeholder="Player 3 Name (Green)"
              />
            </div>
          )}

          {playerCount === 4 && (
            <div className="player-input-row blue-border">
              <span className="color-badge blue-bg">P4</span>
              <input
                type="text"
                value={localNames[COLORS.BLUE]}
                onChange={(e) => setLocalNames({ ...localNames, [COLORS.BLUE]: e.target.value })}
                placeholder="Player 4 Name (Blue)"
              />
            </div>
          )}
        </div>

        <button className="primary-action-btn green-glow start-game-btn" onClick={onStart}>
          <Play size={20} />
          Start Local Match
        </button>
      </div>
    </ModalWrapper>
  );
}

// Host Online Room Modal
export function HostRoomModal({ roomCode, guestCount, isConnecting, peerError, onStartGame, onClose }) {
  const [copied, setCopied] = React.useState(false);

  const copyRoomCode = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(roomCode);
      } else {
        const input = document.createElement('input');
        input.value = roomCode;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ModalWrapper title="Create Online Room" onClose={onClose} icon={Shield}>
      <div className="online-room-modal">
        <p className="modal-subtitle">Share this code with your friends to join your match!</p>
        
        <div className="room-code-card">
          <span className="code-label">ROOM CODE</span>
          <div className="code-display">
            <span className="code-text">{roomCode || '...'}</span>
            <button className="copy-code-btn" onClick={copyRoomCode} title="Copy Code">
              {copied ? <Check size={18} className="success-icon" /> : <Copy size={18} />}
            </button>
          </div>
          {copied && <span className="copied-toast">Code copied to clipboard!</span>}
        </div>

        <div className="connected-players-box">
          <h3>Players Joined: <span className="highlight-text">{guestCount + 1} / 4</span></h3>
          <p className="connected-sub">(Host + {guestCount} Guests)</p>
          <div className="player-slots-grid">
            <div className="slot-card filled red-slot">
              <div className="slot-avatar">👑</div>
              <span>Host (You)</span>
            </div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className={`slot-card ${idx < guestCount ? 'filled green-slot' : 'empty'}`}>
                <div className="slot-avatar">{idx < guestCount ? '🎮' : '?'}</div>
                <span>{idx < guestCount ? `Guest ${idx + 1}` : 'Waiting...'}</span>
              </div>
            ))}
          </div>
        </div>

        {peerError && <p className="modal-error">{peerError}</p>}

        {guestCount > 0 ? (
          <button className="primary-action-btn green-glow full-width" onClick={onStartGame}>
            <Play size={20} />
            Start Match with {guestCount + 1} Players
          </button>
        ) : (
          <div className="waiting-spinner-box">
            <div className="pulse-ring"></div>
            <span>{isConnecting ? 'Initializing room...' : 'Waiting for friends to enter room code...'}</span>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

// Join Online Room Modal
export function JoinRoomModal({ myOnlineName, setMyOnlineName, joinCode, setJoinCode, isConnecting, isConnected, peerError, onJoinRoom, onClose }) {
  return (
    <ModalWrapper title="Join Online Room" onClose={onClose} icon={Key}>
      <div className="online-room-modal">
        <p className="modal-subtitle">Enter your name and the 5-digit room code from host</p>
        
        <div className="join-inputs-group">
          <div className="input-field-wrapper">
            <label>YOUR DISPLAY NAME</label>
            <input
              type="text"
              value={myOnlineName}
              onChange={(e) => setMyOnlineName(e.target.value)}
              placeholder="e.g. Mukesh"
              maxLength={15}
              disabled={isConnecting || isConnected}
            />
          </div>

          <div className="input-field-wrapper">
            <label>ROOM CODE</label>
            <input
              type="text"
              className="uppercase-input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB12C"
              maxLength={5}
              disabled={isConnecting || isConnected}
            />
          </div>
        </div>

        {isConnected ? (
          <div className="connected-status-card">
            <Check size={28} className="success-icon" />
            <h4>Connected to Host!</h4>
            <p>Waiting for room host to start the game...</p>
          </div>
        ) : (
          <button
            className="primary-action-btn blue-glow full-width"
            onClick={onJoinRoom}
            disabled={isConnecting || !joinCode || !myOnlineName.trim()}
          >
            {isConnecting ? 'Connecting to Room...' : 'Enter Room'}
          </button>
        )}

        {peerError && <p className="modal-error">{peerError}</p>}
      </div>
    </ModalWrapper>
  );
}

// Leaderboard Modal
export function LeaderboardModal({ onClose }) {
  const [tab, setTab] = React.useState('global');

  const leaderData = [
    { rank: 1, name: 'KingLudo_99', level: 42, winRate: '78%', wins: 1420, score: '45,200', avatar: '👑' },
    { rank: 2, name: 'Raj_7', level: 38, winRate: '74%', wins: 1180, score: '38,900', avatar: '😎' },
    { rank: 3, name: 'AmanKing', level: 35, winRate: '71%', wins: 950, score: '31,400', avatar: '🔥' },
    { rank: 4, name: 'Queen_Riya', level: 31, winRate: '68%', wins: 870, score: '28,100', avatar: '👸' },
    { rank: 5, name: 'Mukesh (You)', level: 15, winRate: '65%', wins: 250, score: '12,500', avatar: '👑', isUser: true },
    { rank: 6, name: 'ShadowGamer', level: 28, winRate: '61%', wins: 620, score: '21,300', avatar: '⚡' },
    { rank: 7, name: 'MasterPro', level: 25, winRate: '59%', wins: 540, score: '18,700', avatar: '🎯' },
  ];

  return (
    <ModalWrapper title="Leaderboard Rankings" onClose={onClose} icon={Trophy}>
      <div className="leaderboard-modal">
        <div className="modal-tab-header">
          <button className={`tab-btn ${tab === 'global' ? 'active' : ''}`} onClick={() => setTab('global')}>Global Top</button>
          <button className={`tab-btn ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>Weekly Champions</button>
          <button className={`tab-btn ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>Friends</button>
        </div>

        <div className="leader-table">
          <div className="leader-table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Level</span>
            <span>Wins</span>
            <span>XP Points</span>
          </div>

          <div className="leader-table-rows">
            {leaderData.map((item) => (
              <div key={item.rank} className={`leader-row ${item.isUser ? 'user-highlight' : ''}`}>
                <span className="rank-num">
                  {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                </span>
                <div className="leader-player-cell">
                  <span className="leader-avatar">{item.avatar}</span>
                  <span className="leader-name">{item.name}</span>
                </div>
                <span className="leader-level">Lv. {item.level}</span>
                <span className="leader-wins">{item.wins}</span>
                <span className="leader-score">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Shop Modal
export function ShopModal({ onClose }) {
  return (
    <ModalWrapper title="MU_LUDO Store" onClose={onClose} icon={ShoppingBag}>
      <div className="shop-modal-content">
        <div className="shop-section">
          <h3>🪙 Coin Bundles</h3>
          <div className="shop-grid">
            <div className="shop-card">
              <div className="shop-icon-box gold-glow">💰</div>
              <h4>5,000 Coins</h4>
              <p className="shop-desc">Starter Coin Pack</p>
              <button className="buy-btn yellow-btn">₹49</button>
            </div>
            <div className="shop-card featured">
              <div className="badge-tag">POPULAR</div>
              <div className="shop-icon-box gold-glow">🏆</div>
              <h4>25,000 Coins</h4>
              <p className="shop-desc">+2,500 Bonus Coins!</p>
              <button className="buy-btn yellow-btn">₹199</button>
            </div>
            <div className="shop-card">
              <div className="shop-icon-box purple-glow">💎</div>
              <h4>500 Gems</h4>
              <p className="shop-desc">Premium Gem Pack</p>
              <button className="buy-btn purple-btn">₹299</button>
            </div>
          </div>
        </div>

        <div className="shop-section">
          <h3>🎨 Custom Board Themes</h3>
          <div className="shop-grid">
            <div className="shop-card">
              <div className="theme-preview neon-theme"></div>
              <h4>Cyber Neon Board</h4>
              <p className="shop-desc">Futuristic glowing aesthetics</p>
              <button className="buy-btn blue-btn">100 Gems</button>
            </div>
            <div className="shop-card">
              <div className="theme-preview royal-theme"></div>
              <h4>Royal Gold Board</h4>
              <p className="shop-desc">Luxury golden finish</p>
              <button className="buy-btn yellow-btn">2,500 Coins</button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Daily Reward Modal
export function DailyRewardModal({ onClose }) {
  const [claimed, setClaimed] = React.useState(false);

  const rewards = [
    { day: 1, reward: '100 Coins', icon: '🪙', done: true },
    { day: 2, reward: '250 Coins', icon: '💰', done: true },
    { day: 3, reward: '500 Coins + 5 Gems', icon: '🎁', isToday: true },
    { day: 4, reward: '1,000 Coins', icon: '⚡', done: false },
    { day: 5, reward: '25 Gems', icon: '💎', done: false },
    { day: 6, reward: '2,500 Coins', icon: '👑', done: false },
    { day: 7, reward: 'MYSTERY CHEST', icon: '🧰', done: false, super: true },
  ];

  return (
    <ModalWrapper title="Daily Rewards & Streak" onClose={onClose} icon={Gift}>
      <div className="daily-reward-modal">
        <p className="modal-subtitle">Log in daily to claim bigger coin and gem rewards!</p>
        
        <div className="rewards-grid">
          {rewards.map((r) => (
            <div
              key={r.day}
              className={`reward-card ${r.done ? 'claimed' : ''} ${r.isToday ? 'today-active' : ''} ${r.super ? 'super-reward' : ''}`}
            >
              <span className="reward-day">Day {r.day}</span>
              <div className="reward-icon-box">{r.icon}</div>
              <span className="reward-amount">{r.reward}</span>
              {r.done && <span className="claimed-badge"><Check size={14} /> Claimed</span>}
            </div>
          ))}
        </div>

        <button
          className={`primary-action-btn ${claimed ? 'disabled-btn' : 'gold-glow'} claim-main-btn`}
          disabled={claimed}
          onClick={() => setClaimed(true)}
        >
          <Sparkles size={20} />
          {claimed ? 'Already Claimed Today!' : 'CLAIM TODAY REWARD (500 Coins)'}
        </button>
      </div>
    </ModalWrapper>
  );
}

// Settings Modal
export function SettingsModal({ onClose }) {
  const [sound, setSound] = React.useState(true);
  const [music, setMusic] = React.useState(true);
  const [vibration, setVibration] = React.useState(true);

  return (
    <ModalWrapper title="Game Settings" onClose={onClose} icon={Volume2}>
      <div className="settings-modal-content">
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Sound Effects (SFX)</span>
            <span className="setting-desc">Dice rolls, token move sounds & captures</span>
          </div>
          <button className={`toggle-switch ${sound ? 'on' : 'off'}`} onClick={() => setSound(!sound)}>
            <div className="toggle-handle"></div>
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Background Music</span>
            <span className="setting-desc">Smooth chill gaming tunes</span>
          </div>
          <button className={`toggle-switch ${music ? 'on' : 'off'}`} onClick={() => setMusic(!music)}>
            <div className="toggle-handle"></div>
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Haptic Vibration</span>
            <span className="setting-desc">Vibrate on your turn and dice roll</span>
          </div>
          <button className={`toggle-switch ${vibration ? 'on' : 'off'}`} onClick={() => setVibration(!vibration)}>
            <div className="toggle-handle"></div>
          </button>
        </div>

        <div className="setting-info-box">
          <p>MU_LUDO Version: <strong>1.0.0 (Build 2026)</strong></p>
          <p>Account ID: <strong>MU_8849201</strong></p>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Invite & Earn Modal
export function InviteEarnModal({ onClose }) {
  const [copied, setCopied] = React.useState(false);
  const referralLink = "https://muludo.app/invite?ref=MUKESH15";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalWrapper title="Invite Friends & Earn Coins" onClose={onClose} icon={Share2}>
      <div className="invite-modal-content">
        <div className="invite-hero-banner">
          <div className="coin-stack-img">🪙💰🪙</div>
          <h3>Earn 100 Gold Coins</h3>
          <p>For every friend who registers using your referral link!</p>
        </div>

        <div className="referral-box">
          <span className="code-label">YOUR REFERRAL LINK</span>
          <div className="code-display">
            <input type="text" readOnly value={referralLink} />
            <button className="copy-code-btn" onClick={copyLink}>
              {copied ? <Check size={18} className="success-icon" /> : <Copy size={18} />}
            </button>
          </div>
          {copied && <span className="copied-toast">Referral link copied!</span>}
        </div>
      </div>
    </ModalWrapper>
  );
}

// Single-field Login Modal
export function LoginModal({ onLogin }) {
  const [nameInput, setNameInput] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onLogin(nameInput.trim());
  };

  return (
    <div className="modal-backdrop login-backdrop">
      <div className="modal-content glass-card glowing-border login-card">
        <div className="login-logo-header">
          <div className="login-crown-badge">👑</div>
          <h1 className="logo-text login-logo">
            <span className="logo-mu">MU</span>
            <span className="logo-hyphen">_</span>
            <span className="logo-ludo">LUDO</span>
          </h1>
          <p className="login-subtitle">Enter your name to start playing</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field-wrapper login-field-wrapper">
            <User className="input-field-icon" size={20} />
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter Your Name"
              className="login-name-input"
              autoFocus
              maxLength={20}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={!nameInput.trim()}
          >
            <span>SUBMIT & ENTER GAME</span>
            <Sparkles size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

// 1. Chat Modal
export function ChatModal({ onSendMessage, messages = [], onClose }) {
  const [inputText, setInputText] = React.useState('');

  const quickPresets = [
    'Good Luck!', 'Nice Move!', 'GG', 
    'Well Played!', 'Hurry Up!', 'Ouch! 😂'
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;
    onSendMessage(text);
    setInputText('');
  };

  return (
    <ModalWrapper title="In-Game Chat" onClose={onClose} icon={MessageSquare}>
      <div className="chat-modal-body">
        {/* Quick Messages Section */}
        <div className="quick-presets-section">
          <span className="section-label">Quick Messages:</span>
          <div className="preset-buttons-grid">
            {quickPresets.map((preset, idx) => (
              <button 
                key={idx} 
                className="preset-btn"
                onClick={() => handleSend(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Message Feed */}
        <div className="chat-feed-box">
          {messages.length === 0 ? (
            <div className="empty-chat-msg">No messages yet. Send a quick chat or emoji!</div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`chat-item-row ${msg.color || 'red'}`}>
                <span className={`sender-badge ${msg.color || 'red'}`}>{msg.sender}</span>
                <span className="msg-text">{msg.text}</span>
                <span className="msg-time">{msg.time}</span>
              </div>
            ))
          )}
        </div>

        {/* Custom Input Box */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }} className="chat-input-form">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a custom message..."
            className="chat-text-input"
            maxLength={60}
          />
          <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
            Send
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}

// 2. Emoji Picker Modal
export function EmojiModal({ onSendEmoji, onClose }) {
  const emojiList = [
    '😀', '😂', '😎', '😭', 
    '😡', '❤️', '👍', '👏', 
    '👑', '🔥', '🎯', '🎉', 
    '🚀', '🎲', '🏆', '💥'
  ];

  return (
    <ModalWrapper title="Send Emoji" onClose={onClose} icon={Sparkles}>
      <div className="emoji-modal-body">
        <p className="modal-subtitle">Tap an emoji to react live on screen!</p>
        <div className="emoji-grid-select">
          {emojiList.map((emoji, i) => (
            <button 
              key={i} 
              className="emoji-select-btn"
              onClick={() => {
                onSendEmoji(emoji);
                onClose();
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
}

// 3. Friends & Invites Modal
export function FriendsModal({ roomId, onClose }) {
  const [activeTab, setActiveTab] = React.useState('online');
  const [copied, setCopied] = React.useState(false);
  const [pendingRequests, setPendingRequests] = React.useState([
    { id: 1, name: 'Vikram Singh', level: 'Lv. 14', avatar: '👨‍💼' },
    { id: 2, name: 'Ananya Sharma', level: 'Lv. 22', avatar: '👩‍🎨' }
  ]);

  const friendsList = [
    { id: 101, name: 'Rahul Kumar', status: 'Online', level: 'Lv. 18', avatar: '👨‍💻' },
    { id: 102, name: 'Priya Verma', status: 'In Game', level: 'Lv. 30', avatar: '👩‍💼' },
    { id: 103, name: 'Amit Patel', status: 'Offline', level: 'Lv. 9', avatar: '🧑‍🔧' },
    { id: 104, name: 'Sneha Gupta', status: 'Online', level: 'Lv. 12', avatar: '👩‍⚕️' }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId || 'MU1245');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptRequest = (id) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleRejectRequest = (id) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ModalWrapper title="Friends & Invites" onClose={onClose} icon={Users}>
      <div className="friends-modal-body">
        {/* Tab Navigation Header */}
        <div className="friends-tabs-header">
          <button 
            className={`friends-tab-btn ${activeTab === 'online' ? 'active' : ''}`}
            onClick={() => setActiveTab('online')}
          >
            Friends ({friendsList.filter(f => f.status !== 'Offline').length})
          </button>
          <button 
            className={`friends-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests ({pendingRequests.length})
          </button>
          <button 
            className={`friends-tab-btn ${activeTab === 'invite' ? 'active' : ''}`}
            onClick={() => setActiveTab('invite')}
          >
            Invite Room
          </button>
        </div>

        {/* Tab 1: Friends List */}
        {activeTab === 'online' && (
          <div className="friends-list-container">
            {friendsList.map((friend) => (
              <div key={friend.id} className="friend-card-row">
                <div className="friend-avatar-box">{friend.avatar}</div>
                <div className="friend-info">
                  <h4 className="friend-name">{friend.name}</h4>
                  <span className="friend-meta">{friend.level} • <span className={`status-text ${friend.status.toLowerCase().replace(' ', '-')}`}>{friend.status}</span></span>
                </div>
                {friend.status === 'Online' && (
                  <button className="invite-friend-btn" onClick={handleCopyCode}>
                    Invite
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Pending Requests */}
        {activeTab === 'requests' && (
          <div className="requests-list-container">
            {pendingRequests.length === 0 ? (
              <div className="empty-requests-msg">No pending friend requests!</div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="friend-card-row">
                  <div className="friend-avatar-box">{req.avatar}</div>
                  <div className="friend-info">
                    <h4 className="friend-name">{req.name}</h4>
                    <span className="friend-meta">{req.level}</span>
                  </div>
                  <div className="request-actions">
                    <button className="accept-req-btn" onClick={() => handleAcceptRequest(req.id)}>Accept</button>
                    <button className="reject-req-btn" onClick={() => handleRejectRequest(req.id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Invite Room */}
        {activeTab === 'invite' && (
          <div className="invite-room-tab-body">
            <div className="room-code-card">
              <span className="code-label">YOUR ROOM CODE</span>
              <div className="code-display">
                <span className="code-text">#{roomId || 'MU1245'}</span>
                <button className="copy-code-btn" onClick={handleCopyCode}>
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              {copied && <span className="copied-toast">Room Code copied to clipboard!</span>}
            </div>

            <div className="share-links-group">
              <button className="share-btn whatsapp-share" onClick={handleCopyCode}>
                <Share2 size={16} /> Share via WhatsApp
              </button>
              <button className="share-btn copy-link-share" onClick={handleCopyCode}>
                <Copy size={16} /> Copy Invite Link
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

