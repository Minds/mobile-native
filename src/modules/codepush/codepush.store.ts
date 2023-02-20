import { action, observable } from 'mobx';
import sessionService from '../../common/services/session.service';
import { CODEPUSH_DEFAULT_CONFIG } from '../../config/Config';
import NavigationService from '../../navigation/NavigationService';
import { codePush, logError, logMessage } from './';

/**
 * Boosts Store
 */
class CodePushStore {
  @observable
  downloadProgress = 0;

  @action
  private setDownloadProgress(progress) {
    this.downloadProgress = progress;
  }

  async syncCodepush() {
    try {
      codePush.clearUpdates();
      const runningMetadata = await codePush.getUpdateMetadata();
      const runningDeploymentKey = runningMetadata?.deploymentKey;
      const sessions = sessionService.getSessions();
      const loggedOut = !sessions.length;

      const syncStatusChangedCallback = status => {
        if (loggedOut && status === codePush.SyncStatus.DOWNLOADING_PACKAGE) {
          NavigationService.navigate('CodePushSync', {});
        }
      };

      logMessage(runningMetadata, 'CodePush metadata:');
      await codePush.sync(
        {
          ...CODEPUSH_DEFAULT_CONFIG,
          installMode: loggedOut
            ? codePush.InstallMode.IMMEDIATE
            : CODEPUSH_DEFAULT_CONFIG.installMode,
          mandatoryInstallMode: loggedOut
            ? codePush.InstallMode.IMMEDIATE
            : CODEPUSH_DEFAULT_CONFIG.mandatoryInstallMode,
          deploymentKey: runningDeploymentKey,
        },
        syncStatusChangedCallback,
        ({ receivedBytes, totalBytes }) => {
          this.setDownloadProgress(receivedBytes / totalBytes);
        },
      );
    } catch (e) {
      logError(e);
    }
  }
}

const codePushStore = new CodePushStore();

export default codePushStore;
