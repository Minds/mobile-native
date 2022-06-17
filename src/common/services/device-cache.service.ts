import ClearCache, { formatFileSize } from '@type-any/react-native-clear-cache';
import logService from './log.service';

/**
 * Clears the device cache if it exceeds the 2gb limit
 */
export async function clearCacheIfNeeded() {
  const size = await ClearCache.getCacheDirSize();
  logService.log('[DeviceCacheService] Cache size: ' + formatFileSize(size));
  if (size > 1024 * 1024 * 1024 * 2) {
    logService.log('[DeviceCacheService] clearing cache');
    ClearCache.clearCacheDir();
  }
}
