
function load(count) {

  let activities = [...Array(count)].map((_, i) => {
    const code = 'activityguid' + i;
    return {
      attachment_guid: false,
      blurb: false,
      container_guid:code,
      custom_data:false,
      custom_type:false,
      rowKey: 'something' + i,
      description:"Congratulations! ",
      edited:"",
      guid:code,
      mature:false,
      ownerObj:{
        guid: "824853017709780997",
        type: "user",
        subtype: false,
        time_created: "1522036284",
        getAvatarSource: () => {
          return {
            source:'http://thisisaurl'
          }
        }
      },
      shouldBeBlured: jest.fn(),
      message:"Message",
      title:'TITLE',
      owner_guid:"824853017709780997",
      parent_guid:"838106762591510528",
      perma_url:false,
      thumbnail_src:false,
      type:"activity",
      wire_totals: {
        tokens: 1000000000000000000
      },
      _list: {
        viewed: {
          viewed: new Map([["1019155171608096768",true]]),
          addViewed: () => {
            return;
          }
        }
      },
      getThumbSource: () => {
        return {
          source:'http://thisisaurl'
        }
      }
    }
  });

  return {
    'activities': activities,
    'load-next': 'aaaaaa',
    'load-previous': 'aaaaaa'
  }

}

/**
 * comment service data faker
 * @param {integer} count
 */
export function activitiesServiceFaker() {
  return { load: load}
}

