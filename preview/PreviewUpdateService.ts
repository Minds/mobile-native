import { showNotification } from 'AppMessages';
import * as Updates from 'expo-updates';
import logService from '~/common/services/log.service';
import { storages } from '~/common/services/storage/storages.service';

/**
 * This service is used to download the demo app using the modified expo-updates library.
 */
export default class PreviewUpdateService {
  public static async updatePreview(channel: string): Promise<void> {
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
        storages.session?.clearStore();

        // restart the app with the new demo app
        await Updates.reloadAsync();
      } else {
        showNotification('Demo is not ready yet.');
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      showNotification('Error installing demo app');
      logService.error(error);
      throw error;
    }
  }

  public static isPreviewURL(url: string) {
    return url.startsWith('mindspreview://preview/');
  }

  public static getPreviewChannel(url: string) {
    return url.replace('mindspreview://preview/', '');
  }
}
