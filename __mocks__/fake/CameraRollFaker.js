
function buildPhoto(count) {

  const photos = [];

  return [...Array(count)].map((_, i) => {
    const code = Math.random().toString(16).substring(2).toUpperCase();
    return {
      'node': {
        'timestamp': Date.now(),
        'group_name': 'Camera Roll',
        'type': 'ALAssetTypePhoto',
        'location': {
          'speed': 2.0533344256922823,
          'latitude': 63.5314,
          'heading': 0,
          'longitude': -19.5112,
          'altitude': 0
        },
        'image': {
          'playableDuration': 0,
          'isStored': true,
          'filename': 'IMG_000'+i+'.JPG',
          'width': 3000,
          'height': 2002,
          'uri': 'assets-library://asset/asset.JPG?id=ED7AC36B-A150-4C38-BB8C-'+code+'&ext=JPG'
        }
      }
    }
  });
}

/**
 * getPhotos data faker
 * @param {integer} count
 */
export function getPhotosFaker(count = 3) {
  const photos = buildPhoto(count);
  return {
    'edges': photos,
    'page_info': {
      'has_next_page': false,
      'start_cursor': photos[0].node.image.uri,
      'end_cursor': photos[count-1].node.image.uri
    }
  };
}

