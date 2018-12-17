import api from './../common/services/api.service';

/**
 * Get comments
 * @param {string} guid
 * @param {boolean} reversed
 * @param {string} offset
 * @param {integer} limit
 */
export function getComments(guid, reversed, offset, limit = 12) {
  return api.get('api/v1/comments/' + guid , { limit, offset: offset, reversed : true })
    .then((data) => {
      return data;
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

/**
 * Post a comment
 * @param {string} guid
 * @param {object} comment
 */
export function postComment(guid, comment) {
  return api.post(`api/v1/comments/${guid}/`, comment);
}

/**
 * Delete a comment
 * @param {string} guid
 */
export function deleteComment(guid) {
  return api.delete(`api/v1/comments/${guid}/`);
}

/**
 * Update a comment
 * @param {string} guid
 * @param {string} description
 */
export function updateComment(guid, description) {
  return api.post(`api/v1/comments/update/${guid}`, {
    description: description
  });
}

/**
 * Get child comments
 * @param {string} guid
 * @param {string} commentGuid
 * @param {boolean} reversed
 * @param {string} offset
 * @param {integer} limit
 */
export function getCommentsReply(guid, commentGuid, reversed, offset, limit = 12) {
  return api.get(`api/v1/comments/${guid}/${commentGuid}` , { limit, offset: offset, reversed : true })
    .then((data) => {
      return data;
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

/**
 * Post a reply to a comment
 * @param {string} guid
 * @param {string} commentGuid
 * @param {object} comment
 */
export function postReplyComment(guid, commentGuid, comment) {
  return api.post(`api/v1/comments/${guid}/${commentGuid}`, comment);
}

/**
 * Delete a reply from a comment
 * @param {string} guid
 * @param {string} commentGuid
 */
export function deleteReplyComment(guid, commentGuid) {
  return api.delete(`api/v1/comments/${guid}/${commentGuid}`);
}

/**
 * Update a comment reply
 * @param {string} guid
 * @param {string} commentGuid
 * @param {string} description
 */
export function updateReplyComment(guid, commentGuid, description) {
  return api.post(`api/v1/comments/update/${guid}/${commentGuid}`, {
    description: description
  });
}