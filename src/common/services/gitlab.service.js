import api from './api.service';
import version from '../../config/Version';
import { MINDS_GITLAB_ID, MINDS_GITLAB_TOKEN } from '../../config/Config';

const baseUrl = `https://gitlab.com/api/v4/projects/${MINDS_GITLAB_ID}`;

/**
 * Gitlab service
 */
class GitlabService {

  /**
   * returns call headers
   */
  headers() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': MINDS_GITLAB_TOKEN
    };
  }

  /**
   * Post a new issue
   * @param {string} title
   * @param {string} description
   */
  async postIssue(title, description) {

    const endpoint = `${baseUrl}/issues`;
    const headers = this.headers();
    const body = {title, description, labels:'by user'};

    try {
      let response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(body), headers });

      if (!response.ok) {
        throw response;
      }

      // Convert from JSON
      const data = await response.json();

      return data;
    } catch(err) {
      console.log(err);
      throw err;
    }
  }
}

export default new GitlabService();
