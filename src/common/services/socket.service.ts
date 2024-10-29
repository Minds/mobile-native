import { Socket, io } from 'socket.io-client';
import { GlobalChatSocketService } from '~/modules/chat/service/chat-socket-service';
import { APP_HOST } from '~/config/Config';
import type { SessionService } from './session.service';
import type { LogService } from './log.service';

/**
 * Socket Service
 */
export class SocketService {
  socket?: Socket;

  chat?: GlobalChatSocketService;

  private rooms: string[] = [];

  /**
   * Constructor
   */
  constructor(
    private sessionService: SessionService,
    private logService: LogService,
  ) {}

  init() {
    this.sessionService.onSession(token => {
      if (token) {
        this.setUp();
      } else if (this.socket) {
        this.disconnect();
      }
    });
  }

  setUp() {
    this.socket?.close();

    this.logService.info('[ws]::connecting to ', APP_HOST);
    this.socket = io('wss://' + APP_HOST, {
      path: '/api/sockets/socket.io',
      reconnection: true,
      timeout: 30000,
      autoConnect: false,
      transports: ['websocket'], // important with RNs
      auth: {
        accessToken: this.sessionService.token,
      },
    });

    this.chat = new GlobalChatSocketService(this);

    this.rooms = [];

    this.setUpDefaultListeners();

    this.reconnect();

    return this;
  }

  setUpDefaultListeners() {
    if (!this.socket) {
      return;
    }

    console.log('[ws]::setting up listeners');

    // connect
    this.socket.on('connect', () => {
      this.logService.info(`[ws]::connected to ${APP_HOST}`);
      // Re-join previously join room on a reconnect
      this.rooms.forEach(room => this.socket?.emit('join', room));
    });

    // disconnect
    this.socket.on('disconnect', () => {
      this.logService.info(`[ws]::disconnected from ${APP_HOST}`);
    });

    // error
    this.socket.on('error', e => {
      this.logService.info('[ws]::error', e);
    });
  }

  reconnect() {
    this.logService.info('[ws]::reconnect');

    // this.socket?.disconnect();
    this.socket?.connect();

    return this;
  }

  disconnect() {
    this.logService.info('[ws]::disconnect');
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

  unsubscribe(name, callback?) {
    this.socket?.off(name, callback);
    return this;
  }

  subscribeAny(callback) {
    this.socket?.onAny(callback);
    return this;
  }

  unsubscribeAny(callback?) {
    this.socket?.offAny(callback);
    return this;
  }

  join(room: string) {
    if (!room) {
      return this;
    }

    // Even if the socket isn't connected, it will join the room on socket.on('connect')
    this.rooms.push(room);

    if (!this.socket?.connected) {
      return this;
    }

    this.logService.info('[ws]:joining room', room);

    return this.emit('join', room);
  }

  leave(room) {
    if (!room) {
      return this;
    }

    const i = this.rooms.indexOf(room);
    this.rooms.splice(i, 1);

    this.logService.info('[ws]:leaving room', room);

    return this.emit('leave', room);
  }
}
