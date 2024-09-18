import React from 'react';
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ModalHeader from './ModalHeader';
import sp from '~/services/serviceProvider';

type PropsType = {
  title: string;
  source: ImageSourcePropType;
  children: React.ReactNode;
  testID?: string;
};

const ModalScreen = ({ children, testID, ...props }: PropsType) => {
  const theme = sp.styles.style;
  const insets = useSafeAreaInsets();
  const cleanTop = insets.top
    ? { marginTop: insets.top + 50 }
    : { marginTop: 50 };
  return (
    <View
      testID={testID}
      style={[styles.container, theme.bgPrimaryBackground, cleanTop]}>
      <ModalHeader {...props} />
      <ScrollView contentContainerStyle={theme.paddingBottom3x}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
});

export default ModalScreen;
