//@ts-nocheck
import { MINDS_CDN_URI } from '../../config/Config';

export default function mediaProxyUrl(url, size = 1024) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  const encodedUrl = encodeURIComponent(url),
    cdnUrl = `${MINDS_CDN_URI}api/v3/media/proxy?size=${size}&src=${encodedUrl}`;

  return cdnUrl;
}
