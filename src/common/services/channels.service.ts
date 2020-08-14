//@ts-nocheck
import apiService, { isApiForbidden } from './api.service';

import UserModel from '../../channel/UserModel';
import entitiesStorage from './sql/entities.storage';

/**
 * Channels services
 */
class ChannelsService {
  /**
   * Get one channel
   * @param {string} guid
   */
  async get(
    guidOrUsername: string,
    defaultChannel?: UserModel | object = undefined,
    forceUpdate: boolean = false,
  ): Promise<UserModel> {
    const urn = `urn:channels:${guidOrUsername}`;

    const local = await entitiesStorage.read(urn);

    if ((!local && !defaultChannel) || forceUpdate) {
      // we fetch from the server
      return await this.fetch(guidOrUsername);
    }

    const channel = UserModel.checkOrCreate(local || defaultChannel);

    this.fetch(guidOrUsername, channel); // Update in the background

    return channel;
  }

  /**
   * Fetch a channel
   * on success is added or updated
   * @param {string} guidOrUsername
   */
  async fetch(guidOrUsername: string, channel: UserModel) {
    try {
      const response: any = await apiService.get(
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
        entitiesStorage.save(response.channel);
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
    entitiesStorage.save(channel);
  }

  /**
   * Remove from cache
   * @param {UserModel} channel
   */
  removeFromCache(channel) {
    const urn = `urn:channels:${channel.guid}`;
    entitiesStorage.remove(urn);
  }

  async getGroupCount(channel: UserModel): Promise<number> {
    try {
      const response: any = await apiService.get(
        `api/v3/channel/${channel.guid}/groups/count`,
      );
      return response.count;
    } catch (err) {
      return 0;
    }
  }
}

export default new ChannelsService();
