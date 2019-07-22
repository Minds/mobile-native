import api from './../common/services/api.service';
import commentStorageService from './CommentStorageService';

const decodeUrn = (urn) => {
  let parts = urn.split(':');

  const obj = {
    entity_guid: parts[2],
    parent_guid_l1: parts[3],
    parent_guid_l2: parts[4],
    parent_guid_l3: parts[5],
    guid: parts[6],
    parent_path: parts[5] ? `${parts[3]}:${parts[4]}:0` : `${parts[3]}:0:0`,
  };

  return obj;
}

/**
 * Get comments
 * @param {string} guid
 * @param {boolean} reversed
 * @param {string} offset
 * @param {integer} limit
 */
export async function getComments(focusedUrn, entity_guid, parent_path, level, limit, loadNext, loadPrevious, descending ) {

  let focusedUrnObject = focusedUrn ? decodeUrn(focusedUrn) : null;
  if (focusedUrn) {
    if (entity_guid != focusedUrnObject.entity_guid)
       focusedUrn = null; //wrong comment thread to focus on
    if (loadNext || loadPrevious)
      focusedUrn = null; //can not focus and have pagination
    if (focusedUrn && parent_path === '0:0:0') {
      loadNext = focusedUrnObject.parent_guid_l1;
    }
    if (focusedUrn && parent_path === `${focusedUrnObject.parent_guid_l1}:0:0`) {
      loadNext = focusedUrnObject.parent_guid_l2;
    }
    if (focusedUrn && parent_path === `${focusedUrnObject.parent_guid_l1}:${focusedUrnObject.parent_guid_l2}:0`) {
      loadNext = focusedUrnObject.guid;
    }
  }

  const opts = {
    entity_guid,
    parent_path,
    focused_urn: focusedUrn,
    limit: limit,
    'load-previous': loadPrevious || null,
    'load-next': loadNext || null,
  };

  let uri = `api/v2/comments/${opts.entity_guid}/0/${opts.parent_path}`;

  let response;

  try {
    response = await api.get(uri, opts);
    commentStorageService.write(entity_guid, parent_path, descending, loadNext || loadPrevious, focusedUrn, response);
  } catch(err) {
    response = await commentStorageService.read(entity_guid, parent_path, descending, loadNext || loadPrevious, focusedUrn);

    // if there is no local data we throw the exception again
    if (!response) throw err;
  }

  if (focusedUrn && focusedUrnObject) {
    for (let comment of response.comments) {
      switch (level) {
        case 0:
          comment.expanded = (comment.child_path === `${focusedUrnObject.parent_guid_l1}:0:0`);
          break;
        case 1:
          comment.expanded = comment.child_path === `${focusedUrnObject.parent_guid_l1}:${focusedUrnObject.parent_guid_l2}:0`;
          break;
        default:
          console.log('Level out of scope', level);
      }
      comment.focused = (comment._guid === focusedUrnObject.guid);
    }
  }

  //only use once
  focusedUrn = null;
  return response;
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