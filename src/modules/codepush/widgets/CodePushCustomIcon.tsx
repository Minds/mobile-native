import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { LocalPackage } from 'react-native-code-push';
import { Tooltip } from 'react-native-elements';
import i18nService from '~/common/services/i18n.service';
import { B2, Button, Icon } from '~/common/ui';
import {
  CODE_PUSH_PROD_KEY,
  CODE_PUSH_RC_KEY,
  CODE_PUSH_STAGING_KEY,
} from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';
import { codePush, codePushStore } from '../';

const CodePushCustomIcon = () => {
  const [metadata, setMetadata] = useState<LocalPackage | undefined | null>();
  const tooltipRef = useRef<Tooltip>(null);

  const revertToProd = () => {
    tooltipRef.current?.toggleTooltip();
    codePushStore.syncCodepush({
      clearUpdates: true,
      force: true,
      deploymentKey: CODE_PUSH_PROD_KEY,
    });
  };

  useEffect(() => {
    codePush.getUpdateMetadata().then(data => {
      setMetadata(data);
    });
  }, []);

  if (!metadata?.deploymentKey) {
    return null;
  }

  if (CODE_PUSH_PROD_KEY === metadata.deploymentKey) {
    return null;
  }

  const isStaging = metadata.deploymentKey === CODE_PUSH_STAGING_KEY;
  const isRc = metadata.deploymentKey === CODE_PUSH_RC_KEY;

  return (
    <View style={styles.container}>
      <Tooltip
        ref={tooltipRef}
        skipAndroidStatusBar
        overlayColor="rgba(0, 0, 0, 0.7)"
        containerStyle={ThemedStyles.style.borderRadius}
        width={300}
        height={150}
        backgroundColor={ThemedStyles.getColor('Link')}
        popover={
          <>
            <B2 color="white">
              {isStaging
                ? i18nService.t('codePush.custom.staging')
                : isRc
                ? i18nService.t('codePush.custom.rc')
                : i18nService.t('codePush.custom.usingCustom')}
            </B2>
            {!!metadata.description && (
              <B2 color="white">
                {i18nService.t('codePush.custom.updateDescription')}:{' '}
                {metadata.description}
              </B2>
            )}

            <Button top="S" onPress={revertToProd}>
              {i18nService.t('codePush.custom.revertToProd')}
            </Button>
          </>
        }>
        <Icon
          name={isStaging ? 'alpha-s-circle' : isRc ? 'rocket' : 'warning'}
        />
      </Tooltip>
    </View>
  );
};

export default CodePushCustomIcon;

const styles = ThemedStyles.create({
  container: ['positionAbsoluteTopLeft', { left: 15 }],
});
