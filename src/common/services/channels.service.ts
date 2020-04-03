//@ts-nocheck
import apiService, { isApiForbidden } from "./api.service";

import UserModel from "../../channel/UserModel";
import { abort } from "../helpers/abortableFetch";
import entitiesStorage from "./sql/entities.storage";

/**
 * Channels services
 */
class ChannelsService {

  /**
   * Get one channel
   * @param {string} guid
   */
  async get(guid: string, defaultChannel) {

    const urn = `urn:channels:${guid}`;

    const local = await entitiesStorage.read(urn);

    if (!local && !defaultChannel) {
      // we fetch from the server
      return await this.fetch(guid);
    }

    const channel = UserModel.checkOrCreate(local || defaultChannel);

    this.fetch(guid, channel); // Update in the background

    return channel;
  }

  /**
   * Fetch a channel
   * on success is added or updated
   * @param {string} guid
   */
  async fetch(guid: string, channel: UserModel) {
    try {
      const response: any = await apiService.get(`api/v1/channel/${guid}`, {});

      if (response.channel) {
        const urn = `urn:channels:${guid}`;

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
          channel.setPermissions({permissions:[]});
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
    entitiesStorage.remove( urn );
  }
}

export default new ChannelsService();