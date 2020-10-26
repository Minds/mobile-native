//@ts-nocheck
import { observable, action, toJS } from 'mobx';
import groupsService from './GroupsService';
import socketService from '../common/services/socket.service';
import logService from '../common/services/log.service';
import GroupModel from './GroupModel';
import storageService from '../common/services/storage.service';
import { isNetworkFail } from '../common/helpers/abortableFetch';

/**
 * Groups bar store
 */
class GroupsBarStore {
  @observable groups = [];
  @observable loading = false;

  showingLocal = false;

  offset = '';
  muted = [];

  @action
  finishGathering() {
    this['marker_gathering-heartbeat'] = false;
  }

  @action
  setGroups(groups, replace = false, listen = true) {
    if (replace) this.groups = [];
    groups.forEach((group) => {
      if (listen) this.listenMarkers(group);
      this.groups.push(GroupModel.checkOrCreate(group));
    });
  }

  @action
  setLoading(value) {
    this.loading = value;
  }

  persist() {
    const data = toJS(this.groups);
    storageService.setItem('groupsBar', data);
  }

  async readLocal() {
    const groups = await storageService.getItem('groupsBar');

    if (groups) {
      this.showingLocal = true;
      this.setGroups(groups, true, false);
    }
  }

  clearLocal() {
    storageService.removeItem('groupsBar');
  }

  /**
   * Load markers
   */
  async loadMarkers() {
    const markers = await groupsService.loadGroupMarkers();
    markers.forEach((m) => this.handleMarker(m, false));
  }

  /**
   * Handle marker
   * @param {Object} marker
   * @param {Boolean} bringToFront
   */
  handleMarker(marker, bringToFront = true) {
    this.groups.forEach((group) => {
      if (group.guid == marker.entity_guid) {
        this.setGroupMarker(group, marker, bringToFront);
      }
    });
  }

  /**
   * Listen for markers socket events
   * @param {Object} group
   */
  listenMarkers(group) {
    socketService.join(`marker:${group.guid}`);
    socketService.subscribe(`marker:${group.guid}`, this.handleMessage);
  }

  /**
   * Unlisten markers
   * @param {Object} group
   */
  unlistenMarkers(group) {
    socketService.unsubscribe(`marker:${group.guid}`, this.handleMessage);
    socketService.leave(`marker:${group.guid}`);
  }

  /**
   * Unlisten all groups for markers
   */
  unlistenAll() {
    this.groups.forEach((g) => this.unlistenMarkers(g));
  }

  /**
   * Handle socket message
   * @param {Object} marker
   */
  handleMessage = (marker) => {
    this.handleMarker(JSON.parse(marker));
  };

  /**
   * Mark a group as readed
   * @param {Object} group
   * @param {String} markerType
   */
  @action
  async markAsRead(group, markerType) {
    const myGroup = this.groups.find((g) => g.guid === group.guid);
    if (!myGroup) return;
    await groupsService.markAsRead({
      entity_guid: group.guid,
      marker: markerType,
      entity_type: 'group',
    });
    myGroup[`marker_${markerType}`] = false;
  }

  /**
   * Set group marker
   * @param {Object} group
   * @param {Object} marker
   * @param {Boolean} bringToFront
   */
  @action
  setGroupMarker(group, marker, bringToFront) {
    if (!group.markers) group.markers = {};
    if (
      !marker.read_timestamp ||
      marker.read_timestamp < marker.updated_timestamp
    ) {
      if (marker.marker === 'gathering-heartbeat') {
        // is the first one?
        if (group.marker_gathering_hartbeat) {
          clearInterval(group.marker_gathering_hartbeat);
        }
        group.marker_gathering_hartbeat = setTimeout(
          this.finishGathering.bind(group),
          10000,
        );
      }
      group[`marker_${marker.marker}`] = true;
    }
    group.markers_muted = marker.disabled;

    if (bringToFront) {
      const index = this.groups.findIndex((g) => g === group);

      // move to the first place
      this.groups.unshift(this.groups.splice(index, 1)[0]);
    }
  }

  /**
   * Can't load more
   * @returns {Bollean}
   */
  cantLoadMore() {
    return !this.offset && this.groups.length && !this.showingLocal;
  }

  /**
   * Load groups
   */
  async loadGroups() {
    if (this.loading || this.cantLoadMore()) return;

    this.setLoading(true);
    try {
      const groups = await groupsService.loadMyGroups(this.offset);
      this.setGroups(groups.entities, this.showingLocal);
      if (this.showingLocal) {
        this.showingLocal = false;
      }
      this.persist();
      this.offset = groups.offset;
      return groups;
    } catch (err) {
      if (!isNetworkFail(err)) {
        logService.exception('[GroupsBarStore]', err);
      }
      throw err; //continue error flow
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Reset store to default values
   */
  reset() {
    this.unlistenAll();
    this.groups = [];
    this.muted = [];
    this.loading = false;
    this.offset = '';
  }
}

export default GroupsBarStore;
