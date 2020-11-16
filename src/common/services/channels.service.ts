import apiService, { isApiForbidden } from './api.service';

import UserModel from '../../channel/UserModel';
import entitiesStorage from './sql/entities.storage';
import { action, observable, reaction } from 'mobx';
import logService from './log.service';

/**
 * Channels services
 */
class ChannelsService {
  /**
   * Keep track of background channel update process
   */
  @observable channelUpdated = false;

  @action
  setChannelUpdated(channelUpdated) {
    this.channelUpdated = channelUpdated;
  }

  /**
   * Run on channel update
   * @return dispose (remember to dispose!)
   * @param {function} fn
   * @param {string} guidOrUsername
   */
  onChannelUpdate(fn, guidOrUsername?: string) {
    return reaction(
      () => [this.channelUpdated],
      async (channelUpdated) => {
        if (channelUpdated && guidOrUsername) {
          try {
            const channel = await this.getFromLocal(guidOrUsername);
            await fn(channel);
          } catch (error) {
            logService.exception('[ChannelsService]', error);
          } finally {
            this.setChannelUpdated(false);
          }
        }
      },
      { fireImmediately: true },
    );
  }

  /**
   * Get one channel
   * @param {string} guid
   */
  async get(
    guidOrUsername: string,
    defaultChannel?: UserModel | object,
    forceUpdate: boolean = false,
  ): Promise<UserModel | undefined> {
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
   * Try to retrieve from local
   * @param {string} guidOrUsername
   */
  async getFromLocal(guidOrUsername: string) {
    const urn = `urn:channels:${guidOrUsername}`;

    const local = await entitiesStorage.read(urn);

    if (!local) {
      return false;
    }

    return UserModel.checkOrCreate(local);
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

        const onSave = () => this.setChannelUpdated(true);
        entitiesStorage.save(response.channel, onSave);

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
