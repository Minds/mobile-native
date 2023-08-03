import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import i18n from './i18n.service';
import { Platform } from 'react-native';
import { showNotification } from '../../../AppMessages';

/**
 * Permissions service
 */
class PermissionsService {
  /**
   * Request push notification permission
   */

  async requestNotificationPermission() {
    return (
      RESULTS.GRANTED ===
      (await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS, {
        title: 'Minds',
        message: i18n.t('permissions.notification'),
        buttonPositive: i18n.t('permissions.grant'),
        buttonNegative: i18n.t('no'),
      }))
    );
  }

  /**
   * Request external storage read permission
   */
  async readExternalStorage() {
    return (
      RESULTS.GRANTED ===
      (await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, {
        title: 'Minds',
        message: i18n.t('permissions.externalStorage'),
        buttonPositive: i18n.t('permissions.grant'),
        buttonNegative: i18n.t('no'),
      }))
    );
  }

  /**
   * Check external storage read permission (ANDROID ONLY)
   */
  async checkReadExternalStorage(warnBlocked = false) {
    try {
      const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (warnBlocked && result === RESULTS.BLOCKED) {
        showNotification(
          i18n.t('permissions.blockedStorageRead'),
          'warning',
          3000,
        );
      }

      return result === RESULTS.GRANTED;
    } catch (err) {
      console.warn('permissions', err);
      return false;
    }
  }

  /**
   * Request external storage write permission (ANDROID ONLY)
   */
  async writeExternalStorage() {
    return (
      RESULTS.GRANTED ===
      (await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, {
        title: 'Minds',
        message: i18n.t('permissions.writeExternalStorage'),
        buttonPositive: i18n.t('permissions.grant'),
        buttonNegative: i18n.t('no'),
      }))
    );
  }

  /**
   * Check external storage write permission (ANDROID ONLY)
   */
  async checkWriteExternalStorage(warnBlocked = false): Promise<boolean> {
    try {
      const result = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if (warnBlocked && result === RESULTS.BLOCKED) {
        showNotification(
          i18n.t('permissions.blockedStorageWrite'),
          'warning',
          3000,
        );
      }

      return result === RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  /**
   * Request media library access (IOS ONLY)
   */
  async mediaLibrary() {
    return (
      RESULTS.GRANTED ===
      (await request(PERMISSIONS.IOS.MEDIA_LIBRARY, {
        title: 'Minds',
        message: i18n.t('permissions.mediaLibrary'),
        buttonPositive: i18n.t('permissions.grant'),
        buttonNegative: i18n.t('no'),
      }))
    );
  }

  /**
   * Check external storage write permission (ANDROID ONLY)
   */
  async checkMediaLibrary(warnBlocked = false): Promise<boolean> {
    try {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (warnBlocked && result === RESULTS.BLOCKED) {
        showNotification(
          i18n.t('permissions.blockedMediaLibrary'),
          'warning',
          3000,
        );
      }

      return result === RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  /**
   * Request camera permission
   */
  async camera() {
    return RESULTS.GRANTED === (await this.cameraRaw());
  }

  /**
   * Request camera permission and return the result
   */
  cameraRaw() {
    return request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
      {
        title: 'Minds',
        message: i18n.t('permissions.camera'),
        buttonPositive: i18n.t('permissions.grant'),
        buttonNegative: i18n.t('no'),
      },
    );
  }

  /**
   * Check camera
   */
  async checkCamera(warnBlocked = false): Promise<boolean> {
    try {
      const result = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );
      if (warnBlocked && result === RESULTS.BLOCKED) {
        showNotification(i18n.t('permissions.blockedCamera'), 'warning', 3000);
      }

      return result === RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}

export default new PermissionsService();
