import Peer from 'peerjs';

let peer = null;
let connections = []; // Array to support multiple guests

// Generate a random 5-character alphanumeric ID
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Cleanup any existing connections
const cleanup = () => {
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
  
  // Initialize PeerJS with a specific ID
  peer = new Peer(roomId);

  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    // Wait for connection
  });

  peer.on('connection', (conn) => {
    if (connections.length >= 3) {
      // Already have 3 guests, reject new connections
      conn.close();
      return;
    }
    
    connections.push(conn);
    
    conn.on('open', () => {
      console.log('Guest joined!', conn.peer);
      if (onGuestJoined) onGuestJoined(connections.length);
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
  
  // Initialize PeerJS with no specific ID (guest)
  peer = new Peer();

  peer.on('open', () => {
    console.log('Guest initialized, connecting to:', roomId);
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
