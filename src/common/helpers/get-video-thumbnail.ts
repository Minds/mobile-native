import { Source } from 'react-native-fast-image';
import CommentModel from '../../comments/v2/CommentModel';
import ActivityModel from '../../newsfeed/ActivityModel';
import mediaProxyUrl from './media-proxy-url';

const getVideoThumb = (
  entity: ActivityModel | CommentModel,
  size?: number,
): Pick<Source, 'uri'> | undefined => {
  const source = entity.getThumbSource('xlarge');

  if (source && size) {
    source.uri = mediaProxyUrl(source.uri, size);
  }

  return source;
};

export default getVideoThumb;
