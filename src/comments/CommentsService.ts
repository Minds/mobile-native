import serviceProvider from '~/services/serviceProvider';

const decodeUrn = urn => {
  let parts: Array<string> = urn.split(':');

  const obj = {
    entity_guid: parts[2],
    parent_guid_l1: parts[3],
    parent_guid_l2: parts[4],
    parent_guid_l3: parts[5],
    guid: parts[6],
    parent_path: parts[5] ? `${parts[3]}:${parts[4]}:0` : `${parts[3]}:0:0`,
  };

  return obj;
};

type FocusedUrnObjectType = ReturnType<typeof decodeUrn>;

/**
 * Get a single comment
 * @param {string} entity_guid
 * @param {string} guid
 * @param {string} parent_path
 */
export async function getComment(entity_guid, guid, parent_path) {
  let response: any = await serviceProvider.api.get(
    `api/v2/comments/${entity_guid}/${guid}/${parent_path}`,
    {
      limit: 1,
      reversed: false,
      descending: true,
    },
  );

  if (!response.comments || response.comments.length === 0) {
    return null;
  }

  if (response.comments[0]._guid != guid) {
    return null;
  }

  return response.comments[0];
}

/**
 * Get comments
 * @param {string} guid
 * @param {boolean} reversed
 * @param {string} offset
 * @param {integer} limit
 */
export async function getComments(
  focusedCommentUrn,
  entity_guid,
  parent_path,
  level,
  limit,
  loadNext,
  loadPrevious,
  descending,
) {
  let focusedUrnObject: FocusedUrnObjectType | null = focusedCommentUrn
    ? decodeUrn(focusedCommentUrn)
    : null;
  if (focusedUrnObject) {
    if (entity_guid !== focusedUrnObject.entity_guid) {
      focusedCommentUrn = null; //wrong comment thread to focus on
    }
    if (loadNext || loadPrevious) {
      focusedCommentUrn = null; //can not focus and have pagination
    }
    if (focusedCommentUrn && parent_path === '0:0:0') {
      loadNext = focusedUrnObject.parent_guid_l1;
    }
    if (
      focusedCommentUrn &&
      parent_path === `${focusedUrnObject.parent_guid_l1}:0:0`
    ) {
      loadNext = focusedUrnObject.parent_guid_l2;
    }
    if (
      focusedCommentUrn &&
      parent_path ===
        `${focusedUrnObject.parent_guid_l1}:${focusedUrnObject.parent_guid_l2}:0`
    ) {
      loadNext = focusedUrnObject.guid;
    }
  }

  const opts = {
    entity_guid,
    parent_path,
    focused_urn: focusedCommentUrn,
    limit: limit,
    'load-previous': loadPrevious || null,
    'load-next': loadNext || null,
  };

  let uri = `api/v2/comments/${opts.entity_guid}/0/${opts.parent_path}`;

  let response;

  const commentStorageService = serviceProvider.resolve('commentsStorage');

  try {
    response = await serviceProvider.api.get(uri, opts);
    commentStorageService.write(
      entity_guid,
      parent_path,
      descending,
      loadNext || loadPrevious,
      focusedCommentUrn,
      response,
    );
  } catch (err) {
    response = commentStorageService.read(
      entity_guid,
      parent_path,
      descending,
      loadNext || loadPrevious,
      focusedCommentUrn,
    );

    // if there is no local data we throw the exception again
    if (!response) throw err;
  }

  if (focusedCommentUrn && focusedUrnObject) {
    for (let comment of response.comments) {
      switch (level) {
        case 0:
          comment.expanded =
            comment.child_path === `${focusedUrnObject.parent_guid_l1}:0:0`;
          break;
        case 1:
          comment.expanded =
            comment.child_path ===
            `${focusedUrnObject.parent_guid_l1}:${focusedUrnObject.parent_guid_l2}:0`;
          break;
        default:
          console.log('Level out of scope', level);
      }
      comment.focused = comment._guid === focusedUrnObject.guid;
    }
  }

  //only use once
  focusedCommentUrn = null;
  return response;
}

/**
 * Post a comment
 * @param {string} guid
 * @param {object} comment
 */
export function postComment(guid, comment) {
  return serviceProvider.api.post(`api/v1/comments/${guid}/`, comment);
}

/**
 * Delete a comment
 * @param {string} guid
 */
export function deleteComment(guid) {
  return serviceProvider.api.delete(`api/v1/comments/${guid}/`);
}

/**
 * Update a comment
 * @param {string} guid
 * @param {any} comment
 */
export function updateComment(guid, comment) {
  return serviceProvider.api.post(`api/v1/comments/update/${guid}`, comment);
}

/**
 * Enable/Disable comments
 * @param {string} guid
 * @param {boolean} state
 */
export function toggleAllowComments(guid, state) {
  return serviceProvider.api.post(`api/v2/permissions/comments/${guid}`, {
    allowed: state,
  });
}
