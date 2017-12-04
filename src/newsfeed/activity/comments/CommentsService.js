import api from './../../../common/services/api.service';

export function getComments(id, offset) {
  offset = offset ? offset : '';
  return api.get('api/v1/comments/' + id + '/', { limit: 25, offset: offset, reversed: true })
    .then((data) => {
      return {
        comments: data.comments,
      }
    })
    .catch(err => {
      console.log('error');
      throw "Ooops";
    })
}