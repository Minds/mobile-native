//@ts-nocheck
import api from './api.service';

class RichEmbedService {
  async getMeta(url) {
    if (!url) {
      return null;
    }

    let response = await api.get('api/v1/newsfeed/preview', { url });

    if (!response) {
      return null;
    }

    const meta = {};

    if (response.meta) {
      meta.url = response.meta.canonical || url;
      meta.title = response.meta.title || meta.url;
      meta.description = response.meta.description || '';
    } else {
      meta.url = url;
      meta.title = url;
    }

    if (response.links && response.links.thumbnail && response.links.thumbnail[0]) {
      meta.thumbnail = response.links.thumbnail[0].href;
    }

    return meta;
  }
}

export default new RichEmbedService();
