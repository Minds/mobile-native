//@ts-nocheck
// import ReactNativeAPK from 'rn-apk';
import { Alert } from 'react-native';

import RNFS from 'react-native-fs';
import api from './api.service';
import moment from 'moment-timezone';
import { Version } from '../../config/Version';
import { action, observable } from 'mobx';
import navigationService from '../../navigation/NavigationService';
import logService from './log.service';
import i18n from './i18n.service';
import storageService from './storage.service';

const ReactNativeAPK = {};

/**
 * Update service
 */
class UpdateService {
  version = '';
  @observable progress = 0;
  @observable downloading = false;

  /**
   * Check if it has to ignore the update
   */
  async rememberTomorrow() {
    try {
      const ignoreDate = await storageService.getItem('@mindsUpdateDate');
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
  async checkUpdate(stable = true) {
    if (this.downloading) return;

    logService.info('[UpdateService] Checking for updates...');

    const last = await this.getLastVersion(stable);

    if (last) {
      try {
        if (this.needUpdate(Version.VERSION, last.version)) {
          if (await this.rememberTomorrow()) return;

          Alert.alert(
            i18n.t('updateAvailable') + ' v' + last.version,
            i18n.t('wantToUpdate'),
            [
              { text: i18n.t('no'), style: 'cancel' },
              {
                text: i18n.t('rememberTomorrow'),
                onPress: () => {
                  storageService.setItem(
                    '@mindsUpdateDate',
                    moment().format('YYYY-MM-DD'),
                  );
                },
              },
              {
                text: i18n.t('yes'),
                onPress: () => {
                  // goto update screen
                  navigationService.navigate('Update');
                  this.version = last.version;
                  this.updateApk(last.href);
                },
              },
            ],
            { cancelable: false },
          );
        }
      } catch (e) {
        logService.exception('[UpdateService]', e);
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
    const needUpdate = this.compareVersions(v1, '<', v2);
    if (!needUpdate) {
      if (!this.compareVersions(v1, '=', v2)) return false;
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
      logService.exception('[UpdateService]', e);
      return false;
    }

    if (data.versions && data.versions.find) {
      const version = data.versions.find((v) => (stable ? !v.unstable : true));
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
    this.setProgress(0);

    const filePath = RNFS.CachesDirectoryPath + '/update.apk';

    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      progress: (res) => {
        this.setProgress(
          Math.round((res.bytesWritten / res.contentLength) * 100),
        );
      },
      progressDivider: 1,
    });

    download.promise
      .then((result) => {
        navigationService.navigate('Tabs');
        if (result.statusCode == 200) {
          ReactNativeAPK.installApp(filePath);
        } else {
          logService.info('[UpdateService] Download failes');
        }
        this.setProgress(0);
        this.setDownloading(false);
      })
      .catch((e) => {
        logService.exception('[UpdateService]', e);
        this.setProgress(0);
        this.setDownloading(false);
        navigationService.navigate('Tabs');
      });
  }

  /**
   * Compare semver
   * @param {string} v1
   * @param {string} comparator
   * @param {string} v2
   */
  compareVersions(v1, comparator, v2) {
    var comparator = comparator == '=' ? '==' : comparator;
    if (
      ['==', '===', '<', '<=', '>', '>=', '!=', '!=='].indexOf(comparator) == -1
    ) {
      throw new Error('Invalid comparator. ' + comparator);
    }
    var v1parts = v1.split('.'),
      v2parts = v2.split('.');
    var maxLen = Math.max(v1parts.length, v2parts.length);
    var part1, part2;
    var cmp = 0;
    for (var i = 0; i < maxLen && !cmp; i++) {
      part1 = parseInt(v1parts[i], 10) || 0;
      part2 = parseInt(v2parts[i], 10) || 0;
      if (part1 < part2) cmp = 1;
      if (part1 > part2) cmp = -1;
    }
    return eval('0' + comparator + cmp);
  }
}

export default new UpdateService();
