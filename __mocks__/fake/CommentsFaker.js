
function load(count) {

  let comments = [...Array(count)].map((_, i) => {
    let code = 'guid' +i;
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
        time_created: "1522036284"
      },
      owner_guid:"824853017709780997",
      parent_guid:"838106762591510528",
      perma_url:false,
      thumbnail_src:false,
      type:"comment",
    }
  });

  return {
    'comments': comments,
    'load-next': 'aaaaaa',
    'load-previous': 'aaaaaa'
  }
  
}

/**
 * comment service data faker
 * @param {integer} count
 */
export function commentsServiceFaker() {
  return { load: load} 
}

