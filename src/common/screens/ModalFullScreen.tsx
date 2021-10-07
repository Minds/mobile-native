import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../components/MText';
import PressableScale from '../components/PressableScale';
import { DotIndicator } from 'react-native-reanimated-indicators';

type PropsType = {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
};

/**
 * Base full screen modal
 */
export default function ModalFullScreen({
  title,
  children,
  loading,
}: PropsType) {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const goBack = React.useCallback(() => navigation.goBack(), [navigation]);
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <PressableScale onPress={goBack} style={styles.backButton}>
            <Icon size={23} name={'close'} style={theme.colorSecondaryText} />
          </PressableScale>
          <MText numberOfLines={1} style={styles.title}>
            {title}
          </MText>
          <View style={theme.padding4x} />
        </View>
        {children}
      </SafeAreaView>
      {loading && (
        <View style={styles.loading}>
          <DotIndicator
            dotSize={12}
            color={ThemedStyles.getColor('White')}
            scaleEnabled={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = ThemedStyles.create({
  loading: [
    'positionAbsolute',
    'centered',
    { backgroundColor: 'rgba(0,0,0,0.45)' },
  ],
  screen: ['flexContainer', 'bgPrimaryBackground'],
  title: ['colorPrimaryText', 'fontXL', 'fontBold'],
  header: [
    'rowJustifySpaceBetween',
    'alignCenter',
    'paddingVertical',
    'paddingHorizontal2x',
    'bcolorPrimaryBorder',
    'borderBottom1x',
  ],
  backButton: ['padding2x'],
});
