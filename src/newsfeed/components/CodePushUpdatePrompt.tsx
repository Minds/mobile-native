import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import codePush from 'react-native-code-push';
import BaseNotice from '../../common/components/in-feed-notices/notices/BaseNotice';
import i18nService from '../../common/services/i18n.service';

/**
 * Will continuously sync codepush on screen focus and show a Restart prompt if
 * there was a Pending update
 */
export default function CodePushUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useFocusEffect(
    useCallback(() => {
      codePush.getUpdateMetadata().then(data => {
        if (!data?.deploymentKey) return;

        codePush.sync({
          installMode: codePush.InstallMode.ON_NEXT_RESTART,
          mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
          deploymentKey: data.deploymentKey,
        });
      });
    }, []),
  );

  useEffect(() => {
    codePush.getUpdateMetadata(codePush.UpdateState.PENDING).then(data => {
      if (data?.isPending) {
        setUpdateAvailable(true);
        return;
      }
    });
  }, []);

  if (!updateAvailable) {
    return null;
  }

  return (
    <BaseNotice
      title={i18nService.t('codePush.prompt.title')}
      description={i18nService.t('codePush.prompt.description')}
      btnText={i18nService.t('codePush.prompt.action')}
      iconName="warning"
      onPress={() => codePush.restartApp()}
    />
  );
}
