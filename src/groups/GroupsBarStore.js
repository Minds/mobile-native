import { observable, action } from "mobx";
import groupsService from "./GroupsService";

/**
 * Groups bar store
 */
class GroupsBarStore {
  @observable groups = [];
  muted = [];

  @action
  finishGathering() {
    this['marker_gathering-heartbeat'] = false;
  }

  @action
  setGroups(groups) {
    this.groups = groups;
  }

  async loadMarkers() {
    const markers = await groupsService.loadGroupMarkers();
    markers.forEach(m => this.handleMarker(m));
  }

  handleMarker(marker) {
    this.groups.forEach(group => {
      if (group.guid == marker.entity_guid) {
        this.setGroupMarker(group, marker)
      }
    })
  }

  @action
  async markAsRead(group, markerType) {
    const myGroup = this.groups.find(g => g.guid === group.guid);
    if (!myGroup) return;
    await groupsService.markAsRead({entity_guid: group.guid, marker: markerType, entity_type: 'group'});
    myGroup[`marker_${markerType}`] = false;
  }

  @action
  setGroupMarker(group, marker) {
    if (!group.markers) group.markers = {};
    if (!marker.read_timestamp || (marker.read_timestamp < marker.updated_timestamp)) {
      if (marker.marker === 'gathering-heartbeat') {
        // is the first one?
        if (group.marker_gathering_hartbeat) {
          clearInterval(group.marker_gathering_hartbeat);
        }
        group.marker_gathering_hartbeat = setTimeout(this.finishGathering.bind(group), 10000);
      }
      group[`marker_${marker.marker}`] = true;
    }
    group.markers_muted = marker.disabled;
  }

  /**
   * Load groups
   */
  async loadGroups() {
    const groups = await groupsService.loadMyGroups();
    this.setGroups(groups.entities);
    return groups;
  }

  reset() {
    this.groups = [];
    this.muted = [];
  }
}

export default GroupsBarStore;