import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '~ui/icons';

import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../components/MText';

type PropsType = {
  title: string;
  children: React.ReactNode;
};

/**
 * Base full screen modal
 */
export default function ModalFullScreen({ title, children }: PropsType) {
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
    </View>
  );
}

const styles = ThemedStyles.create({
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
