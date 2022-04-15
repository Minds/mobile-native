import AbstractPlatform from './abstract-platform';

/**
 * Android Platform
 */
export default class AndroidPlatform extends AbstractPlatform {
  requestPermission() {
    return null;
  }
}
