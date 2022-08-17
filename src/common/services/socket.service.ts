import SocketIOClient, { Socket } from 'socket.io-client';
import { SOCKET_URI } from '../../config/Config';
import sessionService from './session.service';

/**
 * Socket Service
 */
export class SocketService {
  LIVE_ROOM_NAME = 'live';

  socket?: Socket;
  registered = false;
  rooms: string[] = [];

  constructor() {
    sessionService.onSession(token => {
      if (token) {
        this.setUp();
      } else if (this.socket) {
        this.deregister();
      }
    });
  }

  setUp() {
    this.socket?.close();

    console.log('connecting to ', SOCKET_URI);

    this.socket = SocketIOClient(SOCKET_URI, {
      // reconnect: true,
      reconnection: true,
      timeout: 30000,
      autoConnect: false,
      transports: ['websocket'], // importat with RN
    });

    this.rooms = [];
    this.registered = false;
    this.setUpDefaultListeners();

    this.reconnect();

    return this;
  }

  setUpDefaultListeners() {
    if (!this.socket?.on) {
      return;
    }

    // connect
    this.socket?.on('connect', () => {
      //console.log(`[ws]::connected to ${SOCKET_URI}`);
      this.registerWithAccessToken();
      this.join(`${this.LIVE_ROOM_NAME}:${sessionService.guid}`);
    });

    // disconnect
    this.socket?.on('disconnect', () => {
      //console.log(`[ws]::disconnected from ${SOCKET_URI}`);
      this.registered = false;
    });

    // registered
    this.socket?.on('registered', () => {
      this.registered = true;
      this.socket?.emit('join', this.rooms);
    });

    // error
    this.socket?.on('error', _e => {
      //console.log('[ws]::error', e);
    });

    // rooms
    this.socket?.on('rooms', rooms => {
      if (!this.registered) {
        return;
      }

      //console.log(`[ws]::rcvd rooms status`, rooms);
      this.rooms = rooms;
    });

    // joined
    this.socket?.on('joined', (room, rooms) => {
      //console.log(`[ws]::joined`, room, rooms);
      this.rooms = rooms;
    });

    // left
    this.socket?.on('left', (room, rooms) => {
      //console.log(`[ws]::left`, room, rooms);
      this.rooms = rooms;
    });
  }

  reconnect() {
    //console.log('[ws]::reconnect');
    this.registered = false;

    this.socket?.disconnect();
    this.socket?.connect();

    return this;
  }

  disconnect() {
    //console.log('[ws]::disconnect');
    this.registered = false;

    this.socket?.disconnect();

    return this;
  }

  emit(...args) {
    // @ts-ignore
    this.socket?.emit.apply(this.socket, args);
    return this;
  }

  subscribe(name, callback) {
    this.socket?.on(name, callback);
    return this;
  }

  unsubscribe(name, callback) {
    this.socket?.off(name, callback);
    return this;
  }

  join(room: string) {
    if (!room) {
      return this;
    }

    if (!this.registered || !this.socket?.connected) {
      this.rooms.push(room);
      return this;
    }

    return this.emit('join', room);
  }

  leave(room) {
    if (!room) {
      return this;
    }

    return this.emit('leave', room);
  }

  registerWithAccessToken() {
    this.emit('register', sessionService.guid, sessionService.token);
  }

  deregister() {
    this.disconnect();
    this.rooms = [];
  }
}

export default new SocketService();
