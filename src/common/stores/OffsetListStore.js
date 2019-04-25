import { observable, action, extendObservable } from 'mobx'
import channelService from '../../channel/ChannelService';
import { revokeBoost, rejectBoost, acceptBoost} from '../../boost/BoostService';
import logService from '../services/log.service';

/**
 * Common infinite scroll list
 */
export default class OffsetListStore {
  /**
   * list is refreshing
   */
  @observable refreshing = false;

  /**
   * list loaded
   */
  @observable loaded = false;

  /**
   * list load error
   */
  @observable errorLoading = false;

  /**
   * list next offset
   * if loaded == true and offset == '' there is no more data
   */
  @observable offset = '';

  /**
   * Constructor
   * @param {string} 'shallow'|'ref'|null
   */
  constructor(type = null) {
    if (type) {
      extendObservable(this,{
        entities: [],
      },{
        entities: observable[type],
      });
    } else {
      extendObservable(this,{
        entities: [],
      }, {
       entities: observable
      });
    }
  }

  @action
  setList(list, replace = false) {
    if (list.entities && replace) {
      this.entities = list.entities;
    }

    if (list.entities && !replace) {
      list.entities.forEach(element => {
        this.entities.push(element);
      });
    }

    this.loaded = true;
    this.offset = list.offset;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  @action
  prepend(entity) {
    this.entities.unshift(entity);
  }

  @action
  async clearList(updateLoaded=true) {
    this.entities = [];
    this.offset   = '';
    this.errorLoading = false;
    if (updateLoaded) {
      this.loaded = false;
    }
    return true;
  }

  @action
  async refresh() {
    this.refreshing = true;
    this.errorLoading = false;
    this.entities = [];
    this.offset = '';
    this.loaded = false;
    return true;
  }

  @action
  refreshDone() {
    this.refreshing = false;
  }

  @action
  cantLoadMore() {
    return this.loaded && !this.offset && !this.refreshing;
  }

  @action
  toggleSubscription(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      let value = !entity.subscribed;
      entity.subscribed = value;
      return channelService.toggleSubscription(entity.guid, value)
        .then(action(response => {
          entity.subscribed = value;
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          entity.subscribed = !value;
          this.entities[index] = entity;
          logService.exception('[OffsetListStore]', err);
        }));
    }
  }

  @action
  reject(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      return rejectBoost(guid)
        .then(action(response => {
          entity.state = 'rejected';
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          logService.exception('[OffsetListStore]', err);
        }));
    }
  }

  @action
  accept(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      return acceptBoost(guid)
        .then(action(response => {
          entity.state = 'accepted';
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          logService.exception('[OffsetListStore]', err);
        }));
    }
  }

  @action
  revoke(guid, filter) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      return revokeBoost(guid, filter)
        .then(action(response => {
          entity.state = 'revoked';
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          logService.exception('[OffsetListStore]', err);
        }));
    }
  }
}