import api from './../common/services/api.service';

export function getComments(guid, reversed, offset, limit = 25) {
  return api.get('api/v1/comments/' + guid + '/', { limit, offset: offset, reversed : true })
    .then((data) => {
      return data
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}

export function postComment(id, comment) {
  return api.post('api/v1/comments/' + id + '/', comment);
}

export function updateComment(guid, description) {
  return api.post('api/v1/comments/update/' + guid, {
    description: description
  });
}