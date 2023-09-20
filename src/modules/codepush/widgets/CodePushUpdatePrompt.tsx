import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { Linking } from 'react-native';
import codePush, { RemotePackage } from 'react-native-code-push';
import { useThrottledCallback } from '~/common/hooks/useDebouncedCallback';
import i18nService from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
import updateService from '~/common/services/update.service';
import { B2 } from '~/common/ui';
import { IS_FROM_STORE, STORE_LINK } from '~/config/Config';
import { CommonReducer } from '../../../types/Common';
import Banner from '~/common/components/Banner';

type CodePushUpdatePromptState = {
  updateAvailable?: boolean;
  nativeUpdate?: RemotePackage;
  appVersion?: string;
};

/**
 * Will continuously sync codepush on screen focus and show a Restart prompt if
 * there was a Pending update
 */

const CodePushUpdatePrompt = observer(({ children }: PropsWithChildren) => {
  const [{ updateAvailable, nativeUpdate, appVersion }, setState] = useReducer<
    CommonReducer<CodePushUpdatePromptState>
  >((prev, next) => ({ ...prev, ...next }), {
    updateAvailable: false,
    appVersion: undefined,
    nativeUpdate: undefined,
  });

  const onVersionMismatch = (remotePackage: RemotePackage) => {
    setState({
      nativeUpdate: remotePackage,
    });
  };

  const onDownload = () => {
    if (IS_FROM_STORE) {
      return Linking.openURL(STORE_LINK);
    }

    const user = sessionService.getUser();
    return updateService.checkUpdate(!user.canary, false);
  };

  /**
   * Syncs codepush on newsfeed screen focus
   */
  useFocusEffect(
    useThrottledCallback(
      () => {
        console.log('[CodePushUpdatePrompt] Syncing codepush');
        codePush.getUpdateMetadata().then(data => {
          if (!data?.deploymentKey) {
            return;
          }

          codePush.sync(
            {
              installMode: codePush.InstallMode.ON_NEXT_RESTART,
              mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
              deploymentKey: data.deploymentKey,
            },
            undefined,
            undefined,
            onVersionMismatch,
          );
        });
      },
      5 * 60 * 1000,
      [],
    ),
  );

  /**
   * only check whether we have an update or not when the component is rendered
   * for the first time
   */
  useEffect(() => {
    codePush.getUpdateMetadata(codePush.UpdateState.PENDING).then(data => {
      if (data?.isPending) {
        setState({ updateAvailable: true, appVersion: data.appVersion });
        return;
      }
    });
  }, []);

  if (updateAvailable) {
    return (
      <Banner
        actionText="Update"
        onAction={() => codePush.restartApp()}
        text={renderText(appVersion)}
      />
    );
  }

  if (nativeUpdate) {
    return (
      <Banner
        actionText="Download"
        onAction={onDownload}
        text={renderText(nativeUpdate?.appVersion)}
      />
    );
  }
  return <>{children}</>;
});

const renderText = (version?: string) => (
  <B2>
    {i18nService.t('codePush.prompt.heading')} {'\n'}
    {i18nService.t('codePush.prompt.getVersion')}
    <B2 font="black"> {version}</B2>
  </B2>
);

export default CodePushUpdatePrompt;
