import Peer from 'peerjs';

let peer = null;
let connections = []; // Array to support multiple guests
let activeCalls = []; // Active MediaConnection calls
let localAudioStream = null;
let remoteAudioElements = {}; // Map of peerId -> HTMLAudioElement

// STUN servers configuration for mobile network NAT traversal
const PEER_CONFIG = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  }
};

// Generate a random 5-character alphanumeric ID
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const playRemoteAudioStream = (peerId, stream) => {
  try {
    let audio = remoteAudioElements[peerId];
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = `remote-audio-${peerId}`;
      audio.autoplay = true;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.style.display = 'none';
      document.body.appendChild(audio);
      remoteAudioElements[peerId] = audio;
    }
    
    audio.srcObject = stream;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn('Audio play auto-block on mobile, unlocking on touch:', e);
        const unlock = () => {
          audio.play().catch(() => {});
          document.removeEventListener('touchstart', unlock);
          document.removeEventListener('click', unlock);
        };
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('click', unlock, { once: true });
      });
    }
  } catch (err) {
    console.error('Error playing remote audio stream:', err);
  }
};

const stopRemoteAudioStream = (peerId) => {
  if (remoteAudioElements[peerId]) {
    try {
      const audio = remoteAudioElements[peerId];
      audio.pause();
      audio.srcObject = null;
      if (audio.parentNode) {
        audio.parentNode.removeChild(audio);
      }
    } catch (err) {
      console.log('Error stopping audio:', err);
    }
    delete remoteAudioElements[peerId];
  }
};

const setupIncomingCallListener = () => {
  if (!peer) return;
  peer.off('call'); // remove previous listener if any
  peer.on('call', (call) => {
    console.log('Incoming voice call from peer:', call.peer);
    call.answer(localAudioStream || undefined);
    activeCalls.push(call);

    call.on('stream', (remoteStream) => {
      console.log('Received remote audio stream from:', call.peer);
      playRemoteAudioStream(call.peer, remoteStream);
    });

    call.on('close', () => {
      stopRemoteAudioStream(call.peer);
      activeCalls = activeCalls.filter(c => c !== call);
    });

    call.on('error', (err) => {
      console.error('Voice call error:', err);
      stopRemoteAudioStream(call.peer);
    });
  });
};

export const startVoiceChat = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('Microphone access unavailable or blocked on HTTP.');
    setupIncomingCallListener();
    return null;
  }

  try {
    const constraints = { 
      audio: { 
        echoCancellation: true, 
        noiseSuppression: true, 
        autoGainControl: true 
      } 
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localAudioStream = stream;

    // Ensure incoming calls are listened to
    setupIncomingCallListener();

    // Call all connected peers
    if (peer && connections.length > 0) {
      connections.forEach(conn => {
        if (conn.open && conn.peer) {
          console.log('Initiating voice call to peer:', conn.peer);
          const call = peer.call(conn.peer, stream);
          if (call) {
            activeCalls.push(call);
            call.on('stream', (remoteStream) => {
              playRemoteAudioStream(conn.peer, remoteStream);
            });
            call.on('close', () => {
              stopRemoteAudioStream(conn.peer);
            });
            call.on('error', (err) => {
              console.error('Call error:', err);
            });
          }
        }
      });
    }
    return stream;
  } catch (err) {
    console.warn('Microphone access denied/failed:', err);
    setupIncomingCallListener();
    return null;
  }
};

export const stopVoiceChat = () => {
  if (localAudioStream) {
    localAudioStream.getTracks().forEach(track => track.stop());
    localAudioStream = null;
  }
  activeCalls.forEach(call => {
    try { call.close(); } catch (e) {}
  });
  activeCalls = [];
  Object.keys(remoteAudioElements).forEach(peerId => stopRemoteAudioStream(peerId));
};

// Cleanup any existing connections
const cleanup = () => {
  stopVoiceChat();
  if (connections.length > 0) {
    connections.forEach(conn => conn.close());
    connections = [];
  }
  if (peer) {
    peer.destroy();
    peer = null;
  }
};

export const createRoom = (roomId, { onConnected, onGuestJoined, onData, onError }) => {
  cleanup();
  
  // Initialize PeerJS with STUN servers
  peer = new Peer(roomId, PEER_CONFIG);

  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    setupIncomingCallListener();
  });

  peer.on('connection', (conn) => {
    if (connections.length >= 3) {
      conn.close();
      return;
    }
    
    connections.push(conn);
    
    conn.on('open', () => {
      console.log('Guest joined!', conn.peer);
      if (onGuestJoined) onGuestJoined(connections.length);
      
      // If local audio stream is already active, call newly joined guest
      if (localAudioStream) {
        console.log('Calling newly joined guest:', conn.peer);
        const call = peer.call(conn.peer, localAudioStream);
        if (call) {
          activeCalls.push(call);
          call.on('stream', (remoteStream) => playRemoteAudioStream(conn.peer, remoteStream));
        }
      }
    });

    conn.on('data', (data) => {
      console.log('Received data as host:', data);
      
      if (data && data.type === 'GUEST_JOINED_NAME') {
        const index = connections.indexOf(conn);
        if (onGuestJoined) onGuestJoined(connections.length, data.payload, index);
        return;
      }

      if (onData) onData(data);
      
      // Broadcast data to all *other* guests
      connections.forEach(c => {
        if (c.peer !== conn.peer && c.open) {
          c.send(data);
        }
      });
    });

    conn.on('close', () => {
      console.log('Guest disconnected');
      connections = connections.filter(c => c.peer !== conn.peer);
      stopRemoteAudioStream(conn.peer);
      if (onGuestJoined) onGuestJoined(connections.length);
      if (onError) onError('A guest disconnected');
    });
  });

  peer.on('error', (err) => {
    console.error('Peer error:', err);
    if (onError) onError(err.message);
  });

  return {
    sendAction: (action) => {
      connections.forEach(conn => {
        if (conn.open) conn.send(action);
      });
    },
    sendTargetedAction: (actionGenerator) => {
      connections.forEach((conn, index) => {
        if (conn.open) conn.send(actionGenerator(index));
      });
    },
    close: cleanup
  };
};

export const joinRoom = (roomId, guestName, { onConnected, onData, onError }) => {
  cleanup();
  
  // Initialize PeerJS with STUN servers
  peer = new Peer(null, PEER_CONFIG);

  peer.on('open', () => {
    console.log('Guest initialized, connecting to:', roomId);
    setupIncomingCallListener();

    // Connect to the host room ID
    const conn = peer.connect(roomId, { reliable: true });

    conn.on('open', () => {
      console.log('Connected to host!');
      connections = [conn];
      
      // Send the guest name to the host immediately
      conn.send({ type: 'GUEST_JOINED_NAME', payload: guestName });
      
      if (onConnected) onConnected();
    });

    conn.on('data', (data) => {
      console.log('Received data as guest:', data);
      if (onData) onData(data);
    });

    conn.on('close', () => {
      console.log('Host disconnected');
      connections = [];
      stopRemoteAudioStream(roomId);
      if (onError) onError('Connection closed by host');
    });
    
    conn.on('error', (err) => {
      console.error('Connection error:', err);
      if (onError) onError('Failed to connect to host');
    });
  });

  peer.on('error', (err) => {
    console.error('Peer error:', err);
    if (onError) onError(err.message);
  });

  return {
    sendAction: (action) => {
      if (connections.length > 0 && connections[0].open) {
        connections[0].send(action);
      }
    },
    close: cleanup
  };
};

