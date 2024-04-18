import React, { useState, useEffect, useCallback } from 'react';
import { Linking, View } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import i18nService from '../common/services/i18n.service';
import { useAppState } from '@react-native-community/hooks';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { IS_IOS, TENANT } from '../config/Config';
import MText from '../common/components/MText';
import NavigationService from '~/navigation/NavigationService';
import { Button } from '~/common/ui';

type PropsType = {
  children: React.ReactNode;
};

const requestPermissions = async (): Promise<
  [CameraPermissionStatus, CameraPermissionStatus]
> => {
  const m = await Camera.requestMicrophonePermission();
  const c = await Camera.requestCameraPermission();
  return [m, c];
};

export const PermissionsContext = React.createContext<
  null | [CameraPermissionStatus, CameraPermissionStatus]
>(null);

/**
 * Camera permissions check
 * @param props
 */
export default function PermissionsCheck(props: PropsType) {
  const theme = ThemedStyles.style;
  const [status, setStatus] = useState<
    null | [CameraPermissionStatus, CameraPermissionStatus]
  >(null);

  const state = useAppState();

  const tap = useCallback(() => {
    requestPermissions().then(r => {
      setStatus(r);
    });
  }, [setStatus]);

  useEffect(() => {
    Promise.all([
      Camera.getMicrophonePermissionStatus(),
      Camera.getCameraPermissionStatus(),
    ]).then(r => {
      setStatus(r);
    });
  }, [state]);

  if (status === null) {
    return <View style={theme.flexContainer} />;
  }

  if (status[1] === 'not-determined' || (status[1] === 'denied' && !IS_IOS)) {
    return (
      <View style={[theme.flexContainer, theme.centered, theme.padding8x]}>
        <MText style={[theme.fontXL, theme.textCenter, theme.colorWhite]}>
          {i18nService.t('capture.allowMinds', { TENANT })}
        </MText>
        <Button
          size="small"
          align="center"
          onPress={tap}
          type="action"
          top="XL">
          {i18nService.t('continue')}
        </Button>

        {!IS_IOS && (
          <MText
            style={[theme.fontL, theme.paddingTop8x, theme.colorSecondaryText]}
            onPress={() => NavigationService.goBack()}>
            {i18nService.t('back')}
          </MText>
        )}
      </View>
    );
  }

  if (status[1] === 'denied' || status[1] === 'restricted') {
    return (
      <View style={[theme.flexContainer, theme.centered, theme.padding8x]}>
        <MText
          style={[theme.fontXL, theme.textCenter, theme.colorWhite]}
          onPress={() => Linking.openSettings()}>
          {i18nService.t('capture.blockedMinds')}
        </MText>
        <Button
          size="small"
          align="center"
          onPress={() => Linking.openSettings()}
          type="action"
          top="XL">
          {i18nService.t('moreScreen.settings')}
        </Button>
        <MText
          style={[theme.fontL, theme.paddingTop10x, theme.colorSecondaryText]}
          onPress={() => NavigationService.goBack()}>
          {i18nService.t('back')}
        </MText>
      </View>
    );
  }

  return (
    <PermissionsContext.Provider value={status}>
      {props.children}
    </PermissionsContext.Provider>
  );
}
