import { ImageURISource } from 'react-native';
import CommentModel from '../../comments/CommentModel';
import ActivityModel from '../../newsfeed/ActivityModel';
import mindsService from '../services/minds.service';
import mediaProxyUrl from './media-proxy-url';

const getVideoThumb = (
  entity?: ActivityModel | CommentModel,
  size?: number,
): ImageURISource | undefined => {
  const source = entity
    ? mindsService.settings && mindsService.settings.cinemr_url
      ? {
          uri: `${mindsService.settings.cinemr_url}${
            entity.entity_guid || entity.guid
          }/thumbnail-00001.png`,
        }
      : { uri: entity.get('custom_data.thumbnail_src') || entity.thumbnail_src }
    : undefined;

  if (source && size) {
    source.uri = mediaProxyUrl(source.uri, size);
  }

  return source;
};

export default getVideoThumb;
