function load(count, container) {
  let activities = [...Array(count)].map((_, i) => {
    const code = 'activityguid' + i;
    return {
      attachment_guid: false,
      blurb: false,
      container_guid: code,
      custom_data: false,
      custom_type: false,
      rowKey: 'something' + i,
      description: 'Congratulations! ',
      edited: '',
      guid: code,
      mature: false,
      time_created: '1522036284',
      ownerObj: {
        guid: '824853017709780997',
        type: 'user',
        subtype: false,
        time_created: '1522036284',
      },
      message: 'Message',
      title: 'TITLE',
      owner_guid: '824853017709780997',
      parent_guid: '838106762591510528',
      perma_url: false,
      thumbnail_src: false,
      type: 'activity',
      wire_totals: {
        tokens: 1000000000000000000,
      },
      containerObj: container,
    };
  });

  return {
    activities: activities,
    'load-next': 'aaaaaa',
    'load-previous': 'aaaaaa',
  };
}

/**
 * comment service data faker
 * @param {integer} count
 */
export function activitiesServiceFaker() {
  return { load: load };
}

/**
 * Generate a single fake entity
 * @param {object} containerObj optional entity container
 * @returns
 */
export function fakeOne(containerObj) {
  const resp = load(1, containerObj);
  return resp.activities[0];
}
