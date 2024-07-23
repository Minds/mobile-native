import { showNotification } from 'AppMessages';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { compareVersions } from '~/common/helpers/compareVersions';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import type { Storages } from '~/common/services/storage/storages.service';
import type { LogService } from '~/common/services/log.service';
/**
 * This service is used to download the demo app using the modified expo-updates library.
 */
export default class PreviewUpdateService {
  constructor(private storages: Storages, private logService: LogService) {}

  public async updatePreview(channel: string): Promise<void> {
    try {
      //@ts-ignore
      const update = await Updates.checkForUpdateAsync(channel);
      if (update.isAvailable) {
        showNotification('Downloading demo app...');

        try {
          //@ts-ignore
          await Updates.fetchUpdateAsync(channel);
        } catch (error) {
          // workaround for android (it randomly fails to download all the assets the first time)
          //@ts-ignore
          await Updates.fetchUpdateAsync(channel);
        }

        // we clear the session to prevent starting with the session of a different tenant demo app
        this.storages.session?.clearAll();

        // restart the app with the new demo app
        await Updates.reloadAsync();
      } else {
        showNotification('Demo is not ready yet.');
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      showNotification('Error installing demo app');

      this.logService.error(error);
      throw error;
    }
  }

  public isPreviewURL(url: string) {
    return url.startsWith('mindspreview://preview/');
  }

  public getPreviewChannel(url: string) {
    const shouldUpdate = this.checkAppVersion(url);
    if (!shouldUpdate) {
      return;
    }

    const urlObj = new URL(url);
    urlObj.search = '';
    urlObj.hash = '';
    urlObj.pathname;

    return urlObj.toString().replace('mindspreview://preview/', '');
  }

  public checkAppVersion(url: string) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const version = params.get('version');

    // if version is not provided, we try to install the preview without checking the version
    if (!version) {
      return true;
    }

    const currentVersion = Application.nativeApplicationVersion;

    // if the current version is the same as the required version, we can install the preview
    if (version === currentVersion) {
      return true;
    }

    const needUpdate = compareVersions(currentVersion, '<', version);
    if (needUpdate) {
      showNotification(
        `This preview requires the version ${version} of the Previewer, please update.`,
      );
      return false;
    }

    const needNewPreview = compareVersions(currentVersion, '>', version);
    if (needNewPreview) {
      showNotification(
        'This preview was build for an old version, please create a new one from the admin panel.',
      );
      return false;
    }

    // if we failed to check the versions for some reason, try to install the preview anyway
    return true;
  }
}
