import EventEmitter from 'eventemitter3';
import logService from '~/common/services/log.service';
import { SocketService } from '~/common/services/socket.service';
import { ChatRoomEventType } from '../types';

const CHAT_ROOM_NAME_PREFIX = 'chat:';
const CHAT_ROOM_LIST_EVENT = 'chat_rooms';

/** Chat room event. */
export type ChatRoomEvent = {
  type: ChatRoomEventType;
  metadata: {
    senderGuid?: string;
  };
};

/**
 * Service to handle global chat socket events.
 */
export class GlobalChatSocketService {
  private roomGuids: string[] = [];

  // room events
  private roomsEventEmitter = new EventEmitter();
  // all rooms events
  private allRoomsEventEmitter = new EventEmitter();

  /**
   * Service constructor
   */
  constructor(private socket: SocketService) {
    this.listen();
  }

  private allSocketEvents = (eventName: string, ...args) => {
    if (eventName === CHAT_ROOM_LIST_EVENT) {
      // Keep a refresh so we can refresh at a later date
      this.roomGuids = args[0];
    }

    if (eventName.startsWith(CHAT_ROOM_NAME_PREFIX)) {
      const roomGuid = eventName.replace(CHAT_ROOM_NAME_PREFIX, '');
      const data = JSON.parse(args[0]);
      // emit the room event
      this.roomsEventEmitter.emit(roomGuid, data);
      // emit the all rooms event
      this.allRoomsEventEmitter.emit('all', roomGuid, data);
    }
  };

  public getRooms(): string[] {
    return this.roomGuids;
  }

  public listen() {
    logService.info('[GlobalChatSocketService] listen');
    this.socket.unsubscribeAny(this.allSocketEvents);
    this.socket.subscribeAny(this.allSocketEvents);
  }

  refreshRoomList() {
    this.socket.emit('chat_refresh_rooms');
  }

  /**
   * Subscribe to a room events
   */
  public on(roomGuid: string, callback: (data: ChatRoomEvent) => void) {
    this.roomsEventEmitter.on(roomGuid, callback);
  }
  /**
   * Unsubscribe to a room events
   */
  public off(roomGuid: string, callback?: (data: ChatRoomEvent) => void) {
    this.roomsEventEmitter.off(roomGuid, callback);
  }
  /**
   * Subscribe to all rooms events
   */
  public onAny(callback: (roomGuid: string, data: ChatRoomEvent) => void) {
    this.allRoomsEventEmitter.on('all', callback);
  }

  /**
   * Unsubscribe to all rooms events
   */
  public offAny(callback?: (roomGuid: string, data: ChatRoomEvent) => void) {
    this.allRoomsEventEmitter.off('all', callback);
  }
}
