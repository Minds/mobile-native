import { MINDS_CDN_URI } from '../../config/Config';

export default function channelAvatarUrl(channel) {
  if (!channel) {
    // TODO: better ways to fallback?
    return `${MINDS_CDN_URI}icon/100000000000000078/large/0`;
  }

  return `${MINDS_CDN_URI}icon/${channel.guid}/large/${channel.icontime}`;
}
