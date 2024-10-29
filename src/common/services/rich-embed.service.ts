import type { MetaType } from '../stores/RichEmbedStore';
import type { ApiService } from './api.service';

export class RichEmbedService {
  constructor(private api: ApiService) {}

  async getMeta(url): Promise<MetaType> {
    if (!url) {
      return null;
    }

    let response: any = await this.api.get('api/v1/newsfeed/preview', { url });

    if (!response) {
      return null;
    }

    const meta = {} as MetaType;

    if (meta) {
      if (response.meta) {
        meta.url = response.meta.canonical || url;
        meta.title = response.meta.title || meta.url;
        meta.description = response.meta.description || '';
      } else {
        meta.url = url;
        meta.title = url;
      }

      if (
        response.links &&
        response.links.thumbnail &&
        response.links.thumbnail[0]
      ) {
        meta.thumbnail = response.links.thumbnail[0].href;
      }
    }

    return meta;
  }
}
