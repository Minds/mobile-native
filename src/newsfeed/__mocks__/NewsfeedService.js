export default class NewsfeedService {
  constructor() {
    this.getFeed = jest.fn();
    this.getFeedLegacy = jest.fn();
    this.getFeedSuggested = jest.fn();
    this.getFeedChannel = jest.fn();
    this.getBoosts = jest.fn();
  }
}

export const update = jest.fn();
export const toggleComments = jest.fn();
export const setViewed = jest.fn();
export const toggleMuteNotifications = jest.fn();
export const follow = jest.fn();
export const unfollow = jest.fn();
export const isFollowing = jest.fn();
export const toggleExplicit = jest.fn();
export const monetize = jest.fn();
export const deleteItem = jest.fn();
export const getSingle = jest.fn();
export const setPinPost = jest.fn();
