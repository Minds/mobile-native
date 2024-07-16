import { action, observable } from 'mobx';
import moment from 'moment-timezone';
import { Alert } from 'react-native';
import { nativeApplicationVersion } from 'expo-application';
import * as UpdateAPK from 'rn-update-apk';

import { showNotification } from '../../../AppMessages';
import { compareVersions } from '../helpers/compareVersions';
import type { Storages } from './storage/storages.service';
import type { NavigationService } from '~/navigation/NavigationService';
import type { LogService } from './log.service';
import type { I18nService } from './i18n.service';

/**
 * Update service
 */
export class UpdateService {
  @observable progress = 0;
  @observable version = '';
  @observable downloading = false;

  constructor(
    private storages: Storages,
    private navigation: NavigationService,
    private log: LogService,
    private i18n: I18nService,
  ) {}

  /**
   * Check if it has to ignore the update
   */
  async rememberTomorrow() {
    try {
      const ignoreDate = this.storages.app.getString('@mindsUpdateDate');
      if (ignoreDate) {
        const now = moment();
        if (ignoreDate === now.format('YYYY-MM-DD')) return true;
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Check and update
   */
  async checkUpdate(stable = true, requireConfirmation = true) {
    if (this.downloading) return;

    this.log.info('[UpdateService] Checking for updates...');

    const last = await this.getLastVersion(stable);

    if (last) {
      try {
        if (this.needUpdate(nativeApplicationVersion, last.version)) {
          if (await this.rememberTomorrow()) return;

          const doUpdate = () => {
            // goto update screen
            this.navigation.navigate('Update', { href: last.href });
            this.version = last.version;
            this.updateApk(last.href);
          };

          if (!requireConfirmation) {
            return doUpdate();
          }

          Alert.alert(
            this.i18n.t('updateAvailable') + ' v' + last.version,
            this.i18n.t('wantToUpdate'),
            [
              { text: this.i18n.t('no'), style: 'cancel' },
              {
                text: this.i18n.t('rememberTomorrow'),
                onPress: () => {
                  this.storages.app.set(
                    '@mindsUpdateDate',
                    moment().format('YYYY-MM-DD'),
                  );
                },
              },
              {
                text: this.i18n.t('yes'),
                onPress: doUpdate,
              },
            ],
            { cancelable: false },
          );
        }
      } catch (e) {
        this.log.exception('[UpdateService]', e);
      }
    }
  }

  /**
   * Check for release candidates
   * @param {string} v1
   * @param {string} v2
   */
  checkReleaseCandidates(v1, v2) {
    const regex1 = /-rc([0-9][0-9]?)/gm;
    const regex2 = /-rc([0-9][0-9]?)/gm;
    const r1 = regex1.exec(v1);
    const r2 = regex2.exec(v2);

    if (r1) {
      if (r2) {
        return parseInt(r1[1]) < parseInt(r2[1]);
      }
      return true;
    }
    return false;
  }

  /**
   * Check if the app needs an update
   * @param {string} v1
   * @param {string} v2
   */
  needUpdate(v1, v2) {
    const needUpdate = compareVersions(v1, '<', v2);
    if (!needUpdate) {
      if (!compareVersions(v1, '=', v2)) return false;
      return this.checkReleaseCandidates(v1, v2);
    }
    return needUpdate;
  }

  /**
   * Get latest version
   * @param {boolean} stable
   */
  async getLastVersion(stable = true) {
    let data;

    try {
      const response = await fetch(
        'https://cdn-assets.minds.com/android/releases/releases.json?timestamp=' +
          Math.floor(Date.now() / 1000),
      );

      // Bad response
      if (!response.ok) {
        throw response;
      }
      data = await response.json();
    } catch (e) {
      this.log.exception('[UpdateService]', e);
      return false;
    }

    if (data.versions && data.versions.find) {
      const version = data.versions.find(v => (stable ? !v.unstable : true));
      if (version) return version;
    }

    return false;
  }

  @action
  setProgress(p) {
    this.progress = p;
  }

  @action
  setDownloading(d) {
    this.downloading = d;
  }

  /**
   * Download and update apk
   * @param {string} url
   */
  updateApk(url) {
    this.setDownloading(true);

    const updater = new UpdateAPK.UpdateAPK({
      fileProviderAuthority: 'com.minds.mobile.provider',

      downloadApkProgress: progress => {
        this.setProgress(progress);
      },

      onError: err => {
        showNotification(this.i18n.t('update.failed'), 'danger');
        this.log.exception(err);
        this.navigation.goBack();
      },
    });

    updater.downloadApk({ apkUrl: url });
  }
}
