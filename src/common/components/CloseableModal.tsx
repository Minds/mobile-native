import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { Platform, StyleSheet, View } from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';
import Modal, { ModalProps } from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  closeButton: {
    zIndex: 999,
    position: 'absolute',
    margin: 5,
    top: Platform.select({ ios: 40, android: -15 }),
  },
  buttonRight: {
    right: -10,
  },
  buttonLeft: {
    left: -10,
  },
});

export type CloseableModalProps = {
  isVisible: boolean;
  coverScreen?: boolean;
  closeButtonPosition?: 'right' | 'left';
  onCloseButtonPress: () => void;
};

type Props = CloseableModalProps & Partial<ModalProps>;

export default function ({
  isVisible,
  closeButtonPosition = 'right',
  coverScreen = false,
  children,
  onCloseButtonPress,
  ...rest
}: Props) {
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'ios' ? { paddingTop: insets.top } : {};
  return (
    <Modal
      isVisible={isVisible}
      coverScreen={coverScreen}
      onBackButtonPress={onCloseButtonPress}
      {...rest}>
      <View
        style={[
          theme.flexContainer,
          theme.justifyCenter,
          theme.borderRadius2x,
          paddingTop,
        ]}>
        <Icon
          name="closecircleo"
          onPress={onCloseButtonPress}
          size={28}
          style={[
            theme.colorTertiaryText,
            theme.positionAbsoluteTopRight,
            styles.closeButton,
            closeButtonPosition === 'right'
              ? styles.buttonRight
              : styles.buttonLeft,
          ]}
        />
        {children}
      </View>
    </Modal>
  );
}
