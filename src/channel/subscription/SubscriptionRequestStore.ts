
import { observable, action, extendObservable } from "mobx";
import api from "../../common/services/api.service";
import logService from "../../common/services/log.service";
import UserModel from "../UserModel";
import sessionService from "../../common/services/session.service";
import { FLAG_APPROVE_SUBSCRIBER } from "../../common/Permissions";

/**
 * Subscription request store
 */
export default class SubscriptionRequestStore {
  @observable requests = [];
  @observable loading = false;
  @observable errorLoading = false;

  /**
   * Load the subscriptions requests
   */
  @action
  async load(): Promise<any> {
    this.setLoading(true);
    this.setErrorLoading(false);
    try {
      let { requests } = await api.get(`api/v2/subscriptions/incoming`);

      this.setRequest(requests);
    } catch (err) {
      this.setErrorLoading(true);
      logService.exception(err);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Accept a request
   * @param {any} request
   */
  async accept(request: any): Promise<void> {

    if (!sessionService.getUser().can(FLAG_APPROVE_SUBSCRIBER, true)) {
      return;
    }

    try {
      this.setInProgress(request, true);
      await api.put(
        `api/v2/subscriptions/incoming/${request.subscriber.guid}/accept`
      );
      this.setStatus(request, 'requestAccepted');
    } catch (err) {
      logService.exception(err);
    } finally {
      this.setInProgress(request, false);
    }
  }

  /**
   * Decline a request
   * @param {any} request
   */
  async decline(request: any): Promise<void> {

    if (!sessionService.getUser().can(FLAG_APPROVE_SUBSCRIBER, true)) {
      return;
    }

    try {
      this.setInProgress(request, true);
      await api.put(
        `api/v2/subscriptions/incoming/${request.subscriber.guid}/decline`
      );
      this.setStatus(request, 'requestRejected');
    } catch (err) {
      logService.exception(err);
    } finally {
      this.setInProgress(request, false);
    }
  }

  /**
   * Set action
   */
  @action
  setLoading(value: boolean) {
    this.loading = value;
  }

  /**
   * Set requests list
   * @param {Array<any>}
   */
  @action
  setRequest(requests: Array<any>) {
    this.requests = requests;
    this.requests.forEach((r: any): any => {
      extendObservable(r, {inProgress: false, status: '' });
      r.subscriber = UserModel.create(r.subscriber);
    });
  }

  /**
   * Set the error loading flag
   * @param {boolean} value
   */
  @action
  setErrorLoading(value: boolean) {
    this.errorLoading = value;
  }

  /**
   * Set the in progress flag
   * @param {any} request
   * @param {boolean} value
   */
  @action
  setInProgress(request: any, value: boolean) {
    request.inProgress = value;
  }

  /**
   * Set the status flag
   * @param {any} request
   * @param {string} value
   */
  @action
  setStatus(request: any, value: string) {
    request.status = value;
    console.log('SETTNIG REQUEST', request)
  }

  /**
   * Clear the store to the default values
   */
  @action
  clear() {
    this.requests = [];
    this.errorLoading = false;
  }

  /**
   * Reset the store
   */
  reset() {
    this.clear();
  }
}