import { isApiForbidden } from './ApiErrors';

import UserModel from '../../channel/UserModel';
import type { ApiService } from './api.service';
import type { EntitiesStorage } from './storage/entities.storage';

/**
 * Channels services
 */
export class ChannelsService {
  /**
   * Constructor
   */
  constructor(
    private apiService: ApiService,
    private entitiesStorage: EntitiesStorage,
  ) {}

  /**
   * Get one channel
   * @param {string} guid
   */
  async get(
    guidOrUsername: string,
    defaultChannel?: UserModel | object,
    forceUpdate: boolean = false,
  ): Promise<UserModel | undefined> {
    try {
      const urn = `urn:channels:${guidOrUsername}`;

      const local = this.entitiesStorage.read(urn);

      if ((!local && !defaultChannel) || forceUpdate) {
        // we fetch from the server

        return await this.fetch(guidOrUsername);
      }

      const channel = UserModel.create((local || defaultChannel) as object);

      this.fetch(guidOrUsername, channel); // Update in the background

      return channel;
    } catch (err) {
      console.log(err);
    }
  }

  async getMany(guids: string[]) {
    const promises: Promise<UserModel | undefined>[] = guids.map(async guid => {
      try {
        const urn = `urn:channels:${guid}`;
        const local = this.entitiesStorage.read(urn);
        if (!local) {
          return await this.fetch(guid);
        }
        const channel = UserModel.create(local);
        this.fetch(guid, channel); // Update in the background
        return channel;
      } catch (err) {
        console.log(err);
        return undefined;
      }
    });
    return await Promise.all(promises);
  }

  /**
   * Get channel from entity
   * @param {string} guid
   */
  async getFromEntity(
    guidOrUsername: string,
    defaultChannel: UserModel,
  ): Promise<UserModel> {
    const channel = UserModel.checkOrCreate(defaultChannel);

    this.fetch(guidOrUsername, channel); // Update in the background

    return channel;
  }

  /**
   * Fetch a channel
   * on success is added or updated
   * @param {string} guidOrUsername
   */
  async fetch(guidOrUsername: string, channel?: UserModel) {
    try {
      const response: any = await this.apiService.get(
        `api/v1/channel/${guidOrUsername}`,
        {},
      );

      if (response.channel) {
        const urn = `urn:channels:${response.channel.guid}`;

        if (channel) {
          channel.update(response.channel);
        } else {
          channel = UserModel.create(response.channel);
        }
        // add urn to channel
        response.channel.urn = urn;
        this.entitiesStorage.save(response.channel);
        return channel;
      } else {
        throw new Error('No channel response');
      }
    } catch (err) {
      // if the server response is a 403
      if (isApiForbidden(err)) {
        // remove the permissions to force the UI update\
        if (channel) {
          channel.setPermissions({ permissions: [] });
        }
        // remove it from local storage
        this.removeFromCache(channel);
        return;
      }
      throw err;
    }
  }

  /**
   * Save to cache
   * @param {UserModel} channel
   */
  async save(channel) {
    // add urn to channel
    channel.urn = `urn:channels:${channel.guid}`;
    this.entitiesStorage.save(channel);
  }

  /**
   * Remove from cache
   * @param {UserModel} channel
   */
  removeFromCache(channel) {
    const urn = `urn:channels:${channel.guid}`;
    this.entitiesStorage.remove(urn);
  }

  async getGroupCount(channel: UserModel): Promise<number> {
    try {
      const response: any = await this.apiService.get(
        `api/v3/channel/${channel.guid}/groups/count`,
      );
      return response.count;
    } catch (err) {
      return 0;
    }
  }
}
