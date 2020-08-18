import React, { useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import ThemedStyles from '../styles/ThemedStyles';
import i18nService from '../common/services/i18n.service';
import { useAppState } from '@react-native-community/hooks';
import permissionsService from '../common/services/permissions.service';

type PropsType = {
  children: React.ReactNode;
};

/**
 * Camera permissions check
 * @param props
 */
export default function PermissionsCheck(props: PropsType) {
  const theme = ThemedStyles.style;
  const [status, setStatus] = useState<any>(null);

  const state = useAppState();

  const tap = useCallback(() => {
    // android doesn't return the blocked state on check so we request permission to retrieve if it is blocked
    if (Platform.OS === 'android') {
      permissionsService.cameraRaw().then(setStatus);
    } else {
      setStatus(true);
    }
  }, [setStatus]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA).then(setStatus);
    } else {
      check(PERMISSIONS.ANDROID.CAMERA).then(setStatus);
    }
  }, [state]);

  if (status === null) {
    return <View style={theme.flexContainer} />;
  }

  if (status === RESULTS.DENIED) {
    return (
      <TouchableOpacity
        style={[theme.flexContainer, theme.centered, theme.padding2x]}
        onPress={tap}>
        <Text style={[theme.fontXL, theme.textCenter]}>
          {i18nService.t('capture.allowMinds')}
        </Text>
        <Text style={[theme.fontL, theme.paddingTop2x]}>
          {i18nService.t('permissions.tapAllow')}
        </Text>
      </TouchableOpacity>
    );
  }

  if (status === RESULTS.BLOCKED) {
    return (
      <View style={[theme.flexContainer, theme.centered, theme.padding2x]}>
        <Text
          style={[theme.fontXL, theme.textCenter]}
          onPress={() => openSettings()}>
          {i18nService.t('capture.blockedMinds')}
        </Text>
        <Text
          style={[theme.fontL, theme.paddingTop2x]}
          onPress={() => openSettings()}>
          {i18nService.t('permissions.tapAllow')}
        </Text>
      </View>
    );
  }

  return props.children;
}
