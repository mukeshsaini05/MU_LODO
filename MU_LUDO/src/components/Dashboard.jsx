import React, { useState } from 'react';
import { 
  Home, Trophy, Users, ShoppingBag, Award, Gift, Settings, Headphones, 
  Plus, Key, Zap, Globe, Coins, Gem, Bell, ChevronRight, Crown, MessageSquare, Menu, X, MoreHorizontal, BarChart2, Download, Smartphone, Bot
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  LocalSetupModal, VsComputerModal, HostRoomModal, JoinRoomModal, LeaderboardModal, 
  ShopModal, DailyRewardModal, SettingsModal, InviteEarnModal, LoginModal, StatsModal 
} from './Modals';

// Custom SVG 3D Graphics for Visual Fidelity
function BluePawnGraphic() {
  return (
    <svg width="50" height="75" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-pawn blue-pawn-3d">
      <defs>
        <radialGradient id="blueHead" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        <linearGradient id="blueBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="22" r="14" fill="url(#blueHead)" />
      <path d="M22 34 C22 32, 38 32, 38 34 L42 42 C42 43, 18 43, 18 42 Z" fill="#2563eb" />
      <path d="M18 42 C18 40, 42 40, 42 42 L48 76 C48 78, 12 78, 12 76 Z" fill="url(#blueBody)" />
      <ellipse cx="30" cy="78" rx="22" ry="7" fill="url(#blueHead)" />
    </svg>
  );
}

function RedPawnGraphic() {
  return (
    <svg width="50" height="75" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-pawn red-pawn-3d">
      <defs>
        <radialGradient id="redHead" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <linearGradient id="redBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="22" r="14" fill="url(#redHead)" />
      <path d="M22 34 C22 32, 38 32, 38 34 L42 42 C42 43, 18 43, 18 42 Z" fill="#dc2626" />
      <path d="M18 42 C18 40, 42 40, 42 42 L48 76 C48 78, 12 78, 12 76 Z" fill="url(#redBody)" />
      <ellipse cx="30" cy="78" rx="22" ry="7" fill="url(#redHead)" />
    </svg>
  );
}

function GlowingDiceGraphic() {
  return (
    <svg width="85" height="85" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-dice-3d">
      <defs>
        <filter id="diceSunGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="45" fill="#f59e0b" opacity="0.35" filter="url(#diceSunGlow)" />
      <path d="M50 15 L82 32 L50 49 L18 32 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <path d="M18 32 L50 49 L50 85 L18 68 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      <path d="M50 49 L82 32 L82 68 L50 85 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
      <circle cx="50" cy="32" r="3.5" fill="#0f172a" />
      <circle cx="34" cy="24" r="3" fill="#0f172a" />
      <circle cx="66" cy="40" r="3" fill="#0f172a" />
      <circle cx="34" cy="40" r="3" fill="#0f172a" />
      <circle cx="66" cy="24" r="3" fill="#0f172a" />
      <circle cx="34" cy="52" r="3" fill="#0f172a" />
      <circle cx="34" cy="66" r="3" fill="#0f172a" />
      <circle cx="66" cy="52" r="3" fill="#0f172a" />
      <circle cx="66" cy="66" r="3" fill="#0f172a" />
      <circle cx="50" cy="68" r="3" fill="#0f172a" />
    </svg>
  );
}

function GoldCoinsStackGraphic() {
  return (
    <svg width="75" height="65" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="coins-stack-svg">
      <ellipse cx="30" cy="55" rx="20" ry="8" fill="#b45309" />
      <ellipse cx="30" cy="52" rx="20" ry="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
      <ellipse cx="50" cy="50" rx="20" ry="8" fill="#b45309" />
      <ellipse cx="50" cy="47" rx="20" ry="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
      <ellipse cx="30" cy="40" rx="20" ry="8" fill="#b45309" />
      <ellipse cx="30" cy="37" rx="20" ry="8" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
      <ellipse cx="50" cy="35" rx="20" ry="8" fill="#b45309" />
      <ellipse cx="50" cy="32" rx="20" ry="8" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
      <ellipse cx="40" cy="20" rx="20" ry="8" fill="#b45309" />
      <ellipse cx="40" cy="17" rx="20" ry="8" fill="#fef08a" stroke="#ffffff" strokeWidth="2" />
      <text x="40" y="20" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="900">$</text>
    </svg>
  );
}

function GlobeNetworkGraphic() {
  return (
    <svg width="65" height="65" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="globe-graphic-svg">
      <circle cx="35" cy="35" r="28" fill="#064e3b" opacity="0.4" />
      <circle cx="35" cy="35" r="26" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2" />
      <ellipse cx="35" cy="35" rx="26" ry="10" stroke="#4ade80" strokeWidth="1.5" />
      <ellipse cx="35" cy="35" rx="10" ry="26" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="25" cy="30" r="5" fill="#22c55e" />
      <circle cx="45" cy="38" r="5" fill="#4ade80" />
      <path d="M25 30 L45 38" stroke="#86efac" strokeWidth="2" />
    </svg>
  );
}

function GiftBox3DGraphic() {
  return (
    <svg width="70" height="65" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="gift-box-svg">
      <rect x="10" y="24" width="40" height="30" rx="4" fill="#6b21a8" stroke="#a855f7" strokeWidth="1.5" />
      <rect x="7" y="16" width="46" height="10" rx="3" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.5" />
      <rect x="27" y="16" width="6" height="38" fill="#f59e0b" />
      <rect x="10" y="34" width="40" height="6" fill="#f59e0b" />
      <path d="M22 12 C18 6 28 6 30 16 C32 6 42 6 38 12 C35 16 30 16 30 16 Z" fill="#fbbf24" />
    </svg>
  );
}

function TwoPlayersIcon() {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="14" r="6" fill="#22c55e" />
      <path d="M8 30 C8 23, 24 23, 24 30 Z" fill="#22c55e" />
      <circle cx="28" cy="14" r="6" fill="#4ade80" />
      <path d="M20 30 C20 23, 36 23, 36 30 Z" fill="#4ade80" />
    </svg>
  );
}

function ThreePlayersIcon() {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="16" r="5" fill="#2563eb" />
      <path d="M7 30 C7 24, 21 24, 21 30 Z" fill="#2563eb" />
      <circle cx="24" cy="13" r="6" fill="#60a5fa" />
      <path d="M16 30 C16 23, 32 23, 32 30 Z" fill="#60a5fa" />
      <circle cx="34" cy="16" r="5" fill="#3b82f6" />
      <path d="M27 30 C27 24, 41 24, 41 30 Z" fill="#3b82f6" />
    </svg>
  );
}

function FourPlayersIcon() {
  return (
    <svg width="52" height="40" viewBox="0 0 52 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="16" r="4.5" fill="#d97706" />
      <path d="M6 30 C6 25, 20 25, 20 30 Z" fill="#d97706" />
      <circle cx="21" cy="13" r="5.5" fill="#fbbf24" />
      <path d="M13 30 C13 24, 29 24, 29 30 Z" fill="#fbbf24" />
      <circle cx="31" cy="13" r="5.5" fill="#f59e0b" />
      <path d="M23 30 C23 24, 39 24, 39 30 Z" fill="#f59e0b" />
      <circle cx="39" cy="16" r="4.5" fill="#b45309" />
      <path d="M32 30 C32 25, 46 25, 46 30 Z" fill="#b45309" />
    </svg>
  );
}

export default function Dashboard({ 
  onSelectLocalPlayers, 
  onCreateRoom, 
  onOpenJoinRoom, 
  generatedCode,
  guestCount,
  isConnecting,
  peerError,
  myOnlineName,
  setMyOnlineName,
  joinCode,
  setJoinCode,
  onJoinRoom,
  onStartLobbyGame,
  localNames,
  setLocalNames,
  isBotMap,
  setIsBotMap,
  requireKill,
  setRequireKill,
  onStartLocalGame,
  isConnected
}) {
  // State variables
  const { isInstallable, isInstalled, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedLocalCount, setSelectedLocalCount] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('mu_ludo_username') || '';
  });

  const handleLoginSubmit = (name) => {
    setUserName(name);
    localStorage.setItem('mu_ludo_username', name);
    if (setLocalNames) {
      setLocalNames(prev => ({ ...prev, red: name }));
    }
    if (setMyOnlineName) {
      setMyOnlineName(name);
    }
    setActiveModal(null);
  };

  const handleModeClick = (count) => {
    setSelectedLocalCount(count);
    setActiveModal('local_setup');
  };

  const handleCreateRoomClick = () => {
    onCreateRoom();
    setActiveModal('host_room');
  };

  const handleJoinRoomClick = () => {
    onOpenJoinRoom();
    setActiveModal('join_room');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="dashboard-root">
      {/* MOBILE DRAWER BACKDROP */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* LEFT SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-drawer-open' : ''}`}>
        <div className="sidebar-logo-box">
          <h1 className="logo-text">
            <span className="logo-mu">MU</span>
            <span className="logo-hyphen">_</span>
            <span className="logo-ludo">LUDO</span>
          </h1>
          {isMobileMenuOpen && (
            <button className="mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('leaderboard'); setIsMobileMenuOpen(false); }}>
            <Trophy size={18} />
            <span>Leaderboard</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('invite'); setIsMobileMenuOpen(false); }}>
            <Users size={18} />
            <span>Friends</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('shop'); setIsMobileMenuOpen(false); }}>
            <ShoppingBag size={18} />
            <span>Shop</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('leaderboard'); setIsMobileMenuOpen(false); }}>
            <Award size={18} />
            <span>Achievements</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('reward'); setIsMobileMenuOpen(false); }}>
            <Gift size={18} />
            <span>Daily Reward</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('settings'); setIsMobileMenuOpen(false); }}>
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button className="nav-item" onClick={() => { setActiveModal('settings'); setIsMobileMenuOpen(false); }}>
            <Headphones size={18} />
            <span>Support</span>
          </button>

          <button className={`nav-item pwa-nav-btn ${isInstalled ? 'installed' : ''}`} onClick={() => { triggerInstall(); setIsMobileMenuOpen(false); }}>
            <Download size={18} className="pwa-install-icon" />
            <span>{isInstalled ? 'App Installed' : 'Install App'}</span>
          </button>
        </nav>

        {/* SIDEBAR BOTTOM DAILY REWARD CARD */}
        <div className="sidebar-reward-card">
          <GiftBox3DGraphic />
          <div className="reward-card-info">
            <span className="reward-card-title">DAILY REWARD</span>
            <p className="reward-card-desc">Play daily and win exciting rewards</p>
          </div>
          <button className="claim-now-btn" onClick={() => { setActiveModal('reward'); setIsMobileMenuOpen(false); }}>
            CLAIM NOW
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="dashboard-main-wrapper">
        {/* TOPBAR HEADER */}
        <header className="dashboard-topbar">
          {/* MOBILE HAMBURGER & LOGO */}
          <div className="mobile-header-left">
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="mobile-logo-text">
              <span className="logo-mu">MU</span>
              <span className="logo-hyphen">_</span>
              <span className="logo-ludo">LUDO</span>
            </h1>
          </div>

          {/* DESKTOP BRAND / USER PROFILE (Top Left User Name Display) */}
          <div className="desktop-brand" onClick={() => setActiveModal('login')}>
            <div className="top-left-profile-btn">
              <div className="avatar-frame">
                <div className="avatar-img">🕶️</div>
              </div>
              <div className="brand-user-meta">
                <span className="user-name">{userName || 'Login'}</span>
                <span className="level-badge">Level 15</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE STATS & ACTIONS */}
          <div className="topbar-actions">
            <button className={`top-icon-btn pwa-install-topbar-btn ${isInstalled ? 'installed' : ''}`} title="Install MU LUDO App" onClick={triggerInstall}>
              <Download size={18} />
              <span className="pwa-badge">APP</span>
            </button>

            <div className="stat-pill coin-pill" onClick={() => setActiveModal('shop')}>
              <div className="stat-icon-wrapper yellow-glow">
                <Coins size={16} />
              </div>
              <span className="stat-value">2,500</span>
              <button className="add-stat-btn yellow-add">+</button>
            </div>

            <div className="stat-pill gem-pill" onClick={() => setActiveModal('shop')}>
              <div className="stat-icon-wrapper purple-glow">
                <Gem size={16} />
              </div>
              <span className="stat-value">120</span>
              <button className="add-stat-btn purple-add">+</button>
            </div>

            <div className="top-icon-btn bell-btn" onClick={() => setActiveModal('leaderboard')}>
              <Bell size={18} />
              <span className="badge-count">3</span>
            </div>
          </div>
        </header>

        {/* MOBILE USER PROFILE ROW (Exact screenshot placement) */}
        <div className="mobile-user-profile-row">
          <div className="user-profile-badge">
            <div className="avatar-frame">
              <div className="avatar-img">🕶️</div>
            </div>
            <div className="user-meta">
              <div className="user-name-row" onClick={() => setActiveModal('login')} style={{ cursor: 'pointer' }}>
                <span className="user-name">{userName || 'Click to Login'}</span>
                <Crown size={15} className="crown-icon" />
              </div>
              <div className="level-xp-row">
                <span className="level-badge">Level 15</span>
                <div className="xp-bar-container">
                  <div className="xp-bar-fill" style={{ width: '64%' }}></div>
                  <span className="xp-text">3200 / 5000 XP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-gift-badge-btn" onClick={() => setActiveModal('reward')}>
            <Gift size={20} />
            <span className="badge-count">2</span>
          </div>
        </div>

        {/* CONTENT CENTER LAYOUT */}
        <div className="dashboard-content-grid">
          {/* CENTER ARENA */}
          <div className="center-arena">
            {/* HERO BANNER WITH 3D ARTWORK & TITLE */}
            <div className="hero-banner">
              <div className="hero-artwork">
                <BluePawnGraphic />
                <GlowingDiceGraphic />
                <RedPawnGraphic />
              </div>
              
              <h1 className="hero-title">
                <span className="blue-3d-text">MU</span>
                <span className="hyphen-3d">_</span>
                <span className="gold-3d-text">LUDO</span>
              </h1>

              <div className="hero-subtitle-box">
                <span className="sub-line left-line"></span>
                <span className="diamond-bullet">◆</span>
                <span className="sub-text">Play Online with Friends</span>
                <span className="diamond-bullet">◆</span>
                <span className="sub-line right-line"></span>
              </div>
            </div>

            {/* MODE SELECTION CARDS ROW (Vs Computer & Local Multiplayer) */}
            <div className="mode-cards-grid">
              <div className="mode-card purple-mode vs-computer-card" onClick={() => setActiveModal('vs_computer')}>
                <div className="user-icon-circle purple-circle-bg">
                  <Bot size={26} color="#c084fc" />
                </div>
                <div className="mode-info">
                  <h3>VS COMPUTER</h3>
                  <p>Play Vs Computer Bots (Offline)</p>
                </div>
              </div>

              <div className="mode-card green-mode" onClick={() => handleModeClick(2)}>
                <div className="user-icon-circle green-circle-bg">
                  <TwoPlayersIcon />
                </div>
                <div className="mode-info">
                  <h3>2 PLAYERS</h3>
                  <p>Classic 2 Player Game</p>
                </div>
              </div>

              <div className="mode-card blue-mode" onClick={() => handleModeClick(3)}>
                <div className="user-icon-circle blue-circle-bg">
                  <ThreePlayersIcon />
                </div>
                <div className="mode-info">
                  <h3>3 PLAYERS</h3>
                  <p>Fun 3 Player Game</p>
                </div>
              </div>

              <div className="mode-card orange-mode" onClick={() => handleModeClick(4)}>
                <div className="user-icon-circle orange-circle-bg">
                  <FourPlayersIcon />
                </div>
                <div className="mode-info">
                  <h3>4 PLAYERS</h3>
                  <p>Classic 4 Player Game</p>
                </div>
              </div>
            </div>

            {/* ACTION CARDS ROW (CREATE ROOM / JOIN ROOM) */}
            <div className="action-cards-grid">
              <div className="action-card create-room-card" onClick={handleCreateRoomClick}>
                <div className="action-icon-circle red-glow-circle">
                  <Plus size={28} strokeWidth={3} />
                </div>
                <div className="action-info">
                  <h3>CREATE ROOM</h3>
                  <p>Create your own room and invite friends</p>
                </div>
                <ChevronRight size={26} className="action-arrow red-arrow" />
              </div>

              <div className="action-card join-room-card" onClick={handleJoinRoomClick}>
                <div className="action-icon-circle blue-glow-circle">
                  <Key size={26} strokeWidth={2.5} />
                </div>
                <div className="action-info">
                  <h3>JOIN ROOM</h3>
                  <p>Enter room code and join your friends</p>
                </div>
                <ChevronRight size={26} className="action-arrow blue-arrow" />
              </div>
            </div>

            {/* QUICK MATCH BANNER */}
            <div className="quick-match-bar" onClick={() => handleModeClick(4)}>
              <div className="quick-icon-box">
                <Zap size={32} fill="#f59e0b" color="#f59e0b" />
              </div>
              <div className="quick-info">
                <h3>QUICK MATCH</h3>
                <p>Play with random players instantly</p>
              </div>
              <ChevronRight size={26} className="action-arrow yellow-arrow" />
            </div>

            {/* MOBILE PROMO CARDS CONTAINER */}
            <div className="mobile-promo-container">
              {/* MOBILE PLAYERS ONLINE & RECENT WINNERS GRID */}
              <div className="mobile-stats-grid">
                {/* PLAYERS ONLINE CARD */}
                <div className="panel-card online-players-card">
                  <div className="panel-card-header">
                    <span className="online-dot"></span>
                    <span className="panel-title green-header-title">PLAYERS ONLINE</span>
                  </div>
                  <div className="online-count-body">
                    <div className="count-meta">
                      <h2 className="online-number">18,453</h2>
                      <span className="online-sub">Players Online</span>
                    </div>
                    <GlobeNetworkGraphic />
                  </div>
                </div>

                {/* RECENT WINNERS CARD */}
                <div className="panel-card winners-card">
                  <div className="panel-card-header">
                    <Trophy size={16} className="trophy-gold" />
                    <span className="panel-title yellow-header-title">RECENT WINNERS</span>
                    <button className="view-all-link" onClick={() => setActiveModal('leaderboard')}>VIEW ALL</button>
                  </div>

                  <div className="winners-list">
                    <div className="winner-row">
                      <div className="winner-avatar">🕶️</div>
                      <div className="winner-details">
                        <span className="winner-name">Raj_7</span>
                        <span className="winner-prize">Won 🪙 1,250</span>
                      </div>
                      <span className="winner-time">2m ago</span>
                    </div>

                    <div className="winner-row">
                      <div className="winner-avatar">👩</div>
                      <div className="winner-details">
                        <span className="winner-name">AmanKing</span>
                        <span className="winner-prize">Won 🪙 950</span>
                      </div>
                      <span className="winner-time">10m ago</span>
                    </div>

                    <div className="winner-row">
                      <div className="winner-avatar">👸</div>
                      <div className="winner-details">
                        <span className="winner-name">Queen_Riya</span>
                        <span className="winner-prize">Won 🪙 750</span>
                      </div>
                      <span className="winner-time">15m ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INVITE & EARN CARD */}
              <div className="panel-card invite-earn-card">
                <div className="invite-content">
                  <span className="panel-title invite-title">INVITE & EARN</span>
                  <p className="invite-desc">Invite your friends and earn 100 Coins</p>
                  <button className="invite-now-btn" onClick={() => setActiveModal('invite')}>
                    INVITE NOW
                  </button>
                </div>
                <GoldCoinsStackGraphic />
              </div>

              {/* DAILY REWARD CARD (Exact screenshot placement) */}
              <div className="panel-card mobile-daily-reward-promo">
                <div className="reward-promo-left">
                  <span className="reward-card-title">DAILY REWARD</span>
                  <p className="reward-card-desc">Play daily and win exciting rewards</p>
                  <button className="claim-now-btn" onClick={() => setActiveModal('reward')}>
                    CLAIM NOW
                  </button>
                </div>
                <div className="reward-promo-right">
                  <GiftBox3DGraphic />
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP RIGHT SIDEBAR PANEL */}
          <aside className="right-dashboard-panel desktop-only-panel">
            {/* PLAYERS ONLINE CARD */}
            <div className="panel-card online-players-card">
              <div className="panel-card-header">
                <span className="online-dot"></span>
                <span className="panel-title green-header-title">PLAYERS ONLINE</span>
              </div>
              <div className="online-count-body">
                <div className="count-meta">
                  <h2 className="online-number">18,453</h2>
                  <span className="online-sub">Players Online</span>
                </div>
                <GlobeNetworkGraphic />
              </div>
            </div>

            {/* RECENT WINNERS CARD */}
            <div className="panel-card winners-card">
              <div className="panel-card-header">
                <Trophy size={18} className="trophy-gold" />
                <span className="panel-title yellow-header-title">RECENT WINNERS</span>
              </div>

              <div className="winners-list">
                <div className="winner-row">
                  <div className="winner-avatar">🕶️</div>
                  <div className="winner-details">
                    <span className="winner-name">Raj_7</span>
                    <span className="winner-prize">Won 🪙 1,250</span>
                  </div>
                  <span className="winner-time">2m ago</span>
                </div>

                <div className="winner-row">
                  <div className="winner-avatar">👩</div>
                  <div className="winner-details">
                    <span className="winner-name">AmanKing</span>
                    <span className="winner-prize">Won 🪙 950</span>
                  </div>
                  <span className="winner-time">10m ago</span>
                </div>

                <div className="winner-row">
                  <div className="winner-avatar">👸</div>
                  <div className="winner-details">
                    <span className="winner-name">Queen_Riya</span>
                    <span className="winner-prize">Won 🪙 750</span>
                  </div>
                  <span className="winner-time">15m ago</span>
                </div>
              </div>

              <button className="view-all-btn" onClick={() => setActiveModal('leaderboard')}>
                VIEW ALL
              </button>
            </div>

            {/* INVITE & EARN CARD */}
            <div className="panel-card invite-earn-card">
              <div className="invite-content">
                <span className="panel-title invite-title">INVITE & EARN</span>
                <p className="invite-desc">Invite your friends and earn 100 Coins</p>
                <button className="invite-now-btn" onClick={() => setActiveModal('invite')}>
                  INVITE NOW
                </button>
              </div>
              <GoldCoinsStackGraphic />
            </div>
          </aside>
        </div>

        {/* FOOTER BAR */}
        <footer className="dashboard-footer">
          <div className="footer-left">
            <span className="footer-logo">
              <span className="logo-mu">MU</span>
              <span className="logo-hyphen">_</span>
              <span className="logo-ludo">LUDO</span>
            </span>
          </div>

          <div className="footer-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="link-divider">|</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
            <span className="link-divider">|</span>
            <a href="#support" onClick={(e) => { e.preventDefault(); setActiveModal('settings'); }}>Support</a>
            <span className="link-divider">|</span>
            <a href="#about" onClick={(e) => e.preventDefault()}>About Us</a>
          </div>

          <div className="footer-right">
            <span className="version-tag">Version 1.0.0</span>
            <div className="social-icons">
              <a href="#discord" className="social-link discord-bg" onClick={(e) => e.preventDefault()} title="Discord">
                <MessageSquare size={14} />
              </a>
              <a href="#instagram" className="social-link insta-bg" onClick={(e) => e.preventDefault()} title="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#youtube" className="social-link yt-bg" onClick={(e) => e.preventDefault()} title="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              </a>
              <a href="#facebook" className="social-link fb-bg" onClick={(e) => e.preventDefault()} title="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
        </footer>

        {/* MOBILE FIXED BOTTOM NAVIGATION BAR (Exact screenshot layout) */}
        <div className="mobile-bottom-nav">
          <button 
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button 
            className="bottom-nav-item"
            onClick={() => setActiveModal('leaderboard')}
          >
            <Trophy size={20} />
            <span>Leaderboard</span>
          </button>

          <button 
            className="bottom-nav-item"
            onClick={() => setActiveModal('invite')}
          >
            <Users size={20} />
            <span>Friends</span>
          </button>

          <button 
            className="bottom-nav-item"
            onClick={() => setActiveModal('shop')}
          >
            <ShoppingBag size={20} />
            <span>Shop</span>
          </button>

          <button 
            className="bottom-nav-item"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MoreHorizontal size={20} />
            <span>More</span>
          </button>
        </div>
      </div>

      {activeModal === 'vs_computer' && (
        <VsComputerModal
          localNames={localNames}
          setLocalNames={setLocalNames}
          isBotMap={isBotMap}
          setIsBotMap={setIsBotMap}
          requireKill={requireKill}
          setRequireKill={setRequireKill}
          onStart={(count) => {
            onSelectLocalPlayers(count);
            onStartLocalGame(count);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}

      {activeModal === 'local_setup' && selectedLocalCount && (
        <LocalSetupModal
          playerCount={selectedLocalCount}
          localNames={localNames}
          setLocalNames={setLocalNames}
          isBotMap={isBotMap}
          setIsBotMap={setIsBotMap}
          requireKill={requireKill}
          setRequireKill={setRequireKill}
          onStart={() => {
            onSelectLocalPlayers(selectedLocalCount);
            onStartLocalGame(selectedLocalCount);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}

      {activeModal === 'stats' && <StatsModal onClose={closeModal} />}

      {activeModal === 'host_room' && (
        <HostRoomModal
          roomCode={generatedCode}
          guestCount={guestCount}
          isConnecting={isConnecting}
          peerError={peerError}
          onStartGame={() => {
            onStartLobbyGame();
            closeModal();
          }}
          onClose={closeModal}
        />
      )}

      {activeModal === 'join_room' && (
        <JoinRoomModal
          myOnlineName={myOnlineName}
          setMyOnlineName={setMyOnlineName}
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          isConnecting={isConnecting}
          isConnected={isConnected}
          peerError={peerError}
          onJoinRoom={onJoinRoom}
          onClose={closeModal}
        />
      )}

      {activeModal === 'leaderboard' && <LeaderboardModal onClose={closeModal} />}
      {activeModal === 'shop' && <ShopModal onClose={closeModal} />}
      {activeModal === 'reward' && <DailyRewardModal onClose={closeModal} />}
      {activeModal === 'settings' && <SettingsModal onClose={closeModal} />}
      {activeModal === 'invite' && <InviteEarnModal onClose={closeModal} />}
      {(!userName || activeModal === 'login') && <LoginModal onLogin={handleLoginSubmit} />}
    </div>
  );
}
