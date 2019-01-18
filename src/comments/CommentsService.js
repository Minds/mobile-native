import api from './../common/services/api.service';

/**
 * Get comments
 * @param {string} guid
 * @param {boolean} reversed
 * @param {string} offset
 * @param {integer} limit
 */
export function getComments(guid, parent_path, descending, token, include_offset, limit = 12, comment_guid = 0) {
  const params = { limit, descending, reversed: false};
  if (token) params.token = token;
  if (include_offset) params.include_offset = include_offset;

  return api.get(`api/v1/comments/${guid}/${comment_guid}/${parent_path}`, params)
    .then((data) => {
      return data;
    })
    .catch(err => {
      console.log('error', err);
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