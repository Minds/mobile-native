
function load(count) {

  let activities = [...Array(count)].map((_, i) => {
    const code = 'activityguid' + i;
    return {
      attachment_guid: false,
      blurb: false,
      container_guid:code,
      custom_data:false,
      custom_type:false,
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
      message:"Smartphone Addiction & Cognitive Impairment ",
      title:'TITLE',
      owner_guid:"824853017709780997",
      parent_guid:"838106762591510528",
      perma_url:false,
      thumbnail_src:false,
      type:"activity",
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

