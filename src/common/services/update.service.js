import ReactNativeAPK from "react-native-apk";
import {
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import api from "./api.service";
import { Version } from "../../config/Version";
import { action, observable } from "mobx";
import navigationService from "../../navigation/NavigationService";

/**
 * Update service
 */
class UpdateService {
  version = '';
  @observable progress = 0;
  @observable downloading = false;

  /**
   * Check and update
   */
  async checkUpdate(stable = true) {
    if (this.downloading) return;

    const last = await this.getLastVersion(stable);

    if (last) {
      try {
        if (this.needUpdate(Version.VERSION, last.version)) {
          Alert.alert(
            'Update available v'+last.version,
            `Do you want to update the app?`,
            [
              { text: 'No', style: 'cancel' },
              { text: 'Yes', onPress: () => {
                  // goto update screen
                  navigationService.reset('Update');
                  this.version = last.version;
                  this.updateApk(last.href);
                }
              },
            ],
            { cancelable: false }
          );

        }
      } catch (e) {
        console.log('Error checking for updates');
      }
    }
  }

  /**
   * Check for release candidates
   * @param {string} v1
   * @param {string} v2
   */
  checkReleaseCandidates(v1, v2) {
    const regex = /-rc([0-9][0-9]?)/gm;
    const r1 = regex.exec(v1);
    const r2 = regex.exec(v2);
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
      const response = await fetch('https://cdn-assets.minds.com/android/releases/releases.json?timestamp='+Math.floor(Date.now() / 1000));

      // Bad response
      if (!response.ok) {
        throw response;
      }
      data = await response.json();

    } catch (e) {
      console.log('Error getting the last app versions', e);
      return false;
    }

    if (data.versions && data.versions.find) {
      const version = data.versions.find(v => stable ? !v.unstable : true);
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

    const filePath = RNFS.CachesDirectoryPath + "/update.apk";

    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      progress: res => {
        this.setProgress(Math.round(
          (res.bytesWritten / res.contentLength) * 100
        ));
      },
      progressDivider: 1
    });

    download.promise
      .then(result => {
        navigationService.reset('Tabs');
        if (result.statusCode == 200) {
          ReactNativeAPK.installApp(filePath);
        } else {
          console.log("download failed");
        }
        this.setProgress(0);
        this.setDownloading(false);
      })
      .catch(e => {
        console.log("failed down", e);
        this.setProgress(0);
        this.setDownloading(false);
        navigationService.reset('Tabs');
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
    if(['==','===','<','<=','>','>=','!=','!=='].indexOf(comparator) == -1) {
        throw new Error('Invalid comparator. ' + comparator);
    }
    var v1parts = v1.split('.'), v2parts = v2.split('.');
    var maxLen = Math.max(v1parts.length, v2parts.length);
    var part1, part2;
    var cmp = 0;
    for(var i = 0; i < maxLen && !cmp; i++) {
        part1 = parseInt(v1parts[i], 10) || 0;
        part2 = parseInt(v2parts[i], 10) || 0;
        if(part1 < part2)
            cmp = 1;
        if(part1 > part2)
            cmp = -1;
    }
    return eval('0' + comparator + cmp);
  }
}

export default new UpdateService();