import CodePush, { RemotePackage } from 'react-native-code-push';
import { AcquisitionManager } from 'code-push/script/acquisition-sdk';
import { Alert } from 'react-native';

//openssl dgst -sha256  ../pushServer/bundle.zip

type CodePushUpdateCheckFunction =
  typeof AcquisitionManager.prototype.queryUpdateWithCurrentPackage;
const NULL = null as any;

async function getHijackedUpdateChecker(
  currentAppVersion: string,
  customRemotePackage: RemotePackage,
): Promise<CodePushUpdateCheckFunction> {
  // get the diff between currentPackage version and the remotePackage

  return function customQueryUpdateWithCurrentPackage(
    _,
    callbackForRemotePackage = (_err, _remotePackage) => null, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    try {
      // -------------------------
      // This function will be called by CodePush.sync to check for updates.
      // This function is expected to do a network call to the codepush servers with currentAppVersion and then do a callback with the returned metadata or error
      // The metadata is nothing but RemotePackage object that contains the bundle url, packageHash (SHA256 hash of the zip bundle) and other details.
      // CodePush.sync after calling this function will do check if currently running packageHash equals that of returned remotePackage packageHash.
      // If they dont match it will just download and update. Hence this function is also responsible for checking if an update should be allowed or not too.
      // ----------------------------
      const shouldUpdate = currentAppVersion === customRemotePackage.appVersion;
      if (shouldUpdate) {
        callbackForRemotePackage(NULL, customRemotePackage);
      } else {
        console.log(
          `Your app version (${currentAppVersion}) is not compatible with this update. ${customRemotePackage.appVersion} is required`,
        );
        Alert.alert(
          `Your app version (${currentAppVersion}) is not compatible with this update. ${customRemotePackage.appVersion} is required`,
        );
        callbackForRemotePackage(NULL, NULL);
      }
    } catch (err) {
      console.log('ERROR', err);
      callbackForRemotePackage(err, NULL);
    }
  };
}

export async function forceCodepushCustomBundle(
  customRemotePackage: RemotePackage,
) {
  const CodePushInternal = CodePush as any;
  const currentConfig = await CodePushInternal.getConfiguration();
  const AcquisitionSDK: AcquisitionManager =
    CodePushInternal.AcquisitionSdk.prototype;

  // Step1: Backup original functions
  // --------------------------------
  const _originalReportStatusDownload = AcquisitionSDK.reportStatusDownload;
  const _originalReportStatusDeploy = AcquisitionSDK.reportStatusDeploy;
  const _originalQueryUpdateWithCurrentPackage =
    AcquisitionSDK.queryUpdateWithCurrentPackage;
  try {
    // Step2: Hijack codepush update check functions
    // ---------------------------------------------
    AcquisitionSDK.reportStatusDownload = (...args) =>
      console.log('DUMMY reportStatusDownload: ', ...args);
    AcquisitionSDK.reportStatusDeploy = (...args) =>
      console.log('DUMMY reportStatusDeploy: ', ...args);
    AcquisitionSDK.queryUpdateWithCurrentPackage =
      await getHijackedUpdateChecker(
        currentConfig.appVersion,
        customRemotePackage,
      );

    // Step3: Hijacking complete. Now just run the CodePush sync and it will use our hijacked sdk
    // ------------------------------------------------------------------------------------------
    // Forcefully allow to restart and sync
    await CodePush.sync({
      updateDialog: { title: customRemotePackage.description },
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
    CodePush.restartApp();
  } catch (err) {
    console.log('UPDATE ERROR', err);
    Alert.alert('UPDATE ERROR', String(err));
  } finally {
    // Step4: Restore codepush update metadata functions.
    // ---------------------------------------------------------------------------------
    AcquisitionSDK.reportStatusDownload = _originalReportStatusDownload;
    AcquisitionSDK.reportStatusDeploy = _originalReportStatusDeploy;
    AcquisitionSDK.queryUpdateWithCurrentPackage =
      _originalQueryUpdateWithCurrentPackage;
  }
}
