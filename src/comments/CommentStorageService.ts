import logService from '../common/services/log.service';
import { storages } from '../common/services/storage/storages.service';

/**
 * Comment storage service
 */
export class CommentStorageService {
  /**
   * Read a page from the storage
   *
   * @param {string} entityGuid
   * @param {string} parentPath
   * @param {boolean} descending
   * @param {string} offset
   * @param {string} focusedUrn
   */
  read(
    entityGuid: string,
    parentPath: string,
    descending: boolean,
    offset: string,
    focusedUrn: string,
  ) {
    try {
      const key = `comm:${entityGuid}:${parentPath}:${offset}:${
        focusedUrn || ''
      }:${descending ? '0' : '1'}`;
      return storages.userCache?.getMap(key);
    } catch (err) {
      logService.exception('[CommentStorageService]', err);
      return null;
    }
  }

  /**
   * Write a page to the storage
   *
   * @param {string} entityGuid
   * @param {string} parentPath
   * @param {boolean} descending
   * @param {string} offset
   * @param {string} focusedUrn
   * @param {Object} data
   */
  write(
    entityGuid: string,
    parentPath: string,
    descending: boolean,
    offset: string,
    focusedUrn: string,
    data: { comments: Array<any>; status?: string },
  ) {
    try {
      const key = `comm:${entityGuid}:${parentPath}:${offset}:${
        focusedUrn || ''
      }:${descending ? '0' : '1'}`;
      return storages.userCache?.setMap(key, this.clean(data));
    } catch (err) {
      logService.exception('[CommentStorageService]', err);
      console.log(err);
    }
  }

  /**
   * Clean repeated data to reduce the stored size
   *
   * @param {Object} data
   */
  clean(data: { comments: Array<any>; status?: string }) {
    data.comments.forEach(comment => {
      delete comment.luid;
      delete comment.body;
    });
    delete data.status;
    return data;
  }
}

export default new CommentStorageService();
