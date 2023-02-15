import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect, useReducer } from 'react';
import { Linking } from 'react-native';
import { RemotePackage } from 'react-native-code-push';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import { useLegacyStores } from '~/common/hooks/use-stores';
import { useThrottledCallback } from '~/common/hooks/useDebouncedCallback';
import i18nService from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
import updateService from '~/common/services/update.service';
import { B2 } from '~/common/ui';
import { IS_FROM_STORE, STORE_LINK } from '~/config/Config';
import { Version } from '~/config/Version';
import { codePush } from '../';
import { CommonReducer } from '../../../types/Common';

const DISMISS_DURATION = 1 * 24 * 60 * 60 * 1000; // one day

type CodePushUpdatePromptState = {
  updateAvailable?: boolean;
  nativeUpdate?: RemotePackage;
};

/**
 * Will continuously sync codepush on screen focus and show a Restart prompt if
 * there was a Pending update
 */
function CodePushUpdatePrompt() {
  const { dismissal } = useLegacyStores();
  const [{ updateAvailable, nativeUpdate }, setState] = useReducer<
    CommonReducer<CodePushUpdatePromptState>
  >((prev, next) => ({ ...prev, ...next }), {
    updateAvailable: false,
    nativeUpdate: undefined,
  });

  const onVersionMismatch = (remotePackage: RemotePackage) => {
    setState({
      nativeUpdate: remotePackage,
    });
  };

  const onDismiss = () => dismissal.dismiss('update-prompt', DISMISS_DURATION);

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
        codePush.getUpdateMetadata().then(data => {
          if (!data?.deploymentKey) return;

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
        setState({ updateAvailable: true });
        return;
      }
    });
  }, []);

  if (dismissal.isDismissed('update-prompt')) {
    return null;
  }

  if (updateAvailable) {
    return (
      <BaseNotice
        title={i18nService.t('codePush.prompt.title')}
        description={i18nService.t('codePush.prompt.description')}
        btnText={i18nService.t('codePush.prompt.action')}
        iconName="warning"
        onPress={() => codePush.restartApp()}
        onClose={onDismiss}
      />
    );
  }

  if (nativeUpdate) {
    return (
      <BaseNotice
        title={i18nService.t('codePush.prompt.title')}
        description={
          <B2 color="secondary">
            {i18nService.t('codePush.nativePrompt.description')}{' '}
            {i18nService.t('codePush.nativePrompt.current')}
            <B2 color="primary"> {Version.VERSION} </B2>
            {i18nService.t('codePush.nativePrompt.available')}
            <B2 color="primary"> {nativeUpdate.appVersion}</B2>
          </B2>
        }
        btnText={i18nService.t('codePush.nativePrompt.action')}
        iconName="warning"
        onPress={onDownload}
        onClose={onDismiss}
      />
    );
  }

  return null;
}

export default observer(CodePushUpdatePrompt);
