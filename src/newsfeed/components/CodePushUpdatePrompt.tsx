import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import codePush from 'react-native-code-push';
import { B2, Button, Icon, Row } from '../../common/ui';

/**
 * Will continuously sync codepush on screen focus and show a Restart prompt if
 * there was a Pending update
 */
export default function CodePushUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useFocusEffect(
    useCallback(() => {
      codePush
        .sync({
          installMode: codePush.InstallMode.ON_NEXT_RESTART,
          mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
        })
        .then(() => {
          codePush.getUpdateMetadata().then(data => {
            if (data?.isPending) {
              setUpdateAvailable(true);
            }
          });
        });
    }, []),
  );

  if (!updateAvailable) {
    return null;
  }

  return (
    <Row>
      <Icon name="add-circle" />
      <B2>New update available</B2>
      <Button type="action" mode="solid" onPress={() => codePush.restartApp()}>
        Restart
      </Button>
    </Row>
  );
}
