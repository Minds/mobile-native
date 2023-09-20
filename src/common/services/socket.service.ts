import SocketIOClient, { Socket } from 'socket.io-client';
import { SOCKET_URI } from '../../config/Config';
import logService from './log.service';
import sessionService from './session.service';

/**
 * Socket Service
 */
export class SocketService {
  LIVE_ROOM_NAME = 'live';

  socket?: Socket;
  registered = false;
  rooms: string[] = [];

  init() {
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

    logService.info('connecting to ', SOCKET_URI);
    this.socket = SocketIOClient(SOCKET_URI, {
      reconnection: true,
      timeout: 30000,
      autoConnect: false,
      transports: ['websocket'], // important with RN
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
      logService.info(`[ws]::connected to ${SOCKET_URI}`);
      this.registerWithAccessToken();
      this.join(`${this.LIVE_ROOM_NAME}:${sessionService.guid}`);
    });

    // disconnect
    this.socket?.on('disconnect', () => {
      logService.info(`[ws]::disconnected from ${SOCKET_URI}`);
      this.registered = false;
    });

    // registered
    this.socket?.on('registered', () => {
      logService.info(`[ws]::registeration completed`);
      this.registered = true;
      this.socket?.emit('join', this.rooms);
    });

    // error
    this.socket?.on('error', e => {
      logService.info('[ws]::error', e);
    });

    // rooms
    this.socket?.on('rooms', rooms => {
      if (!this.registered) {
        return;
      }

      logService.info(`[ws]::rcvd rooms status`, rooms);
      this.rooms = rooms;
    });

    // joined
    this.socket?.on('joined', (room, rooms) => {
      logService.info(`[ws]::joined`, room, rooms);
      this.rooms = rooms;
    });

    // left
    this.socket?.on('left', (room, rooms) => {
      logService.info(`[ws]::left`, room, rooms);
      this.rooms = rooms;
    });
  }

  reconnect() {
    logService.info('[ws]::reconnect');
    this.registered = false;

    this.socket?.disconnect();
    this.socket?.connect();

    return this;
  }

  disconnect() {
    logService.info('[ws]::disconnect');
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
