import { Source } from 'react-native-turbo-image';
import CommentModel from '../../comments/v2/CommentModel';
import ActivityModel from '../../newsfeed/ActivityModel';
import mediaProxyUrl from './media-proxy-url';
import { APP_API_URI } from '~/config/Config';

const getVideoThumb = (
  entity: ActivityModel | CommentModel,
  size?: number,
): Pick<Source, 'uri'> | undefined => {
  if (entity.hasSiteMembershipPaywallThumbnail) {
    return {
      uri: `${APP_API_URI}api/v3/payments/site-memberships/paywalled-entities/thumbnail/${entity.guid}`,
    };
  }
  const source = entity.getThumbSource('xlarge');

  if (source && size) {
    source.uri = mediaProxyUrl(source.uri, size);
  }

  return source;
};

export default getVideoThumb;
