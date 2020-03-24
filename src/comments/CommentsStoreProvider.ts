import CommentsStore from './CommentsStore';

/**
 * Comments Store Provider
 */
class CommentsStoreProvider {
  /**
   * Return a new instance of CommentStore
   */
  static get() {
    return new CommentsStore();
  }
}

export default CommentsStoreProvider;