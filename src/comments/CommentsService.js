import api from './../common/services/api.service';

export function getComments(guid, reversed, loadNext, loadPrevious) {
  return api.get('api/v1/comments/' + guid + '/', { limit: 25, loadNext, loadPrevious, reversed })
    .then((data) => {
      console.log(data);
      return data
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export function postComment(id, text) {
  return api.post('api/v1/comments/' + id + '/', { comment: text })
    .then((data) => {
      return data;
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export function updateComment(guid, description) {
  return api.post('api/v1/comments/update/' + guid, {
    description: description
  });
}