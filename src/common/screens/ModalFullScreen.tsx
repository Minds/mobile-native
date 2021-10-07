import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '~ui/icons';

import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../components/MText';
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
          <IconButton size="large" name="close" onPress={goBack} />
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
    'paddingHorizontal4x',
    'bcolorPrimaryBorder',
    'borderBottom1x',
  ],
});
