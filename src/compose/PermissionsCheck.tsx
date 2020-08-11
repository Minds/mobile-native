import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ThemedStyles from '../styles/ThemedStyles';
import i18nService from '../common/services/i18n.service';

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

  useEffect(() => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA).then(setStatus);
    } else {
      check(PERMISSIONS.ANDROID.CAMERA).then(setStatus);
    }
  }, []);

  if (status === null) {
    return <View style={theme.flexContainer} />;
  }

  if (status === RESULTS.DENIED) {
    return (
      <TouchableOpacity
        style={[theme.flexContainer, theme.centered, theme.padding2x]}
        onPress={() => setStatus(true)}>
        <Text style={[theme.fontXL, theme.textCenter]}>
          {i18nService.t('capture.allowMinds')}
        </Text>
        <Text style={[theme.fontL, theme.paddingTop2x]}>Tap to allow</Text>
      </TouchableOpacity>
    );
  }

  if (status === RESULTS.BLOCKED) {
    return (
      <View style={[theme.flexContainer, theme.centered, theme.padding2x]}>
        <Text style={[theme.fontXL, theme.textCenter]}>
          {i18nService.t('capture.blockedMinds')}
        </Text>
      </View>
    );
  }

  return props.children;
}
