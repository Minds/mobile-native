//@ts-nocheck
import api from './api.service';
import version from '../../config/Version';
import { MINDS_GITLAB_ID, MINDS_GITLAB_TOKEN } from '../../config/Config';

/**
 * Gitlab service
 */
class GitlabService {
  /**
   * Post a new issue
   * @param {string} title
   * @param {string} description
   */
  async postIssue(title, description) {
    const body = { title, description, labels: 'by user' };

    try {
      return await api.post('api/v2/issues/mobile', body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default new GitlabService();
