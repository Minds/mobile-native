import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import ThemedStyles from '../../../styles/ThemedStyles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../Button';
import i18n from '../../services/i18n.service';

type PropsType = {
  children: React.ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
  title?: string;
  onPressClose?: () => void;
  showBackButton?: boolean;
  onPressBack?: () => void;
  showCancel?: boolean;
  cancelText?: string;
  barTop?: boolean;
  barBottom?: boolean;
};

export interface BottomModalHandles {
  show(): void;
  hide(): void;
}

const BottomModal: React.ForwardRefRenderFunction<
  BottomModalHandles,
  PropsType
> = ({ children, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const show = () => setVisible(true),
    hide = () => {
      !!props.onPressClose && props.onPressClose();
      setVisible(false);
    };
  React.useImperativeHandle(ref, () => ({
    show: () => {
      show();
    },
    hide: () => {
      hide();
    },
  }));
  return (
    <Modal
      isVisible={visible}
      useNativeDriver={true}
      onBackdropPress={hide}
      style={styles.view}>
      <View style={[styles.container, props.containerStyle]}>
        {props.barTop && <View style={styles.bar} />}
        {props.showBackButton && !!props.onPressBack && (
          <MIcon
            size={34}
            name="chevron-left"
            style={styles.backIcon}
            onPress={props.onPressBack}
          />
        )}
        {!!props.title && <Text style={styles.title}>{props.title}</Text>}
        {!!props.title && (
          <MIcon
            size={34}
            name="close"
            style={styles.closeIcon}
            onPress={hide}
          />
        )}
        {children}
        {props.showCancel && (
          <View style={styles.cancelButton}>
            <Button
              text={props.cancelText || i18n.t('cancel')}
              onPress={hide}
              borderless
              active
              centered={false}
            />
          </View>
        )}
        {props.barBottom && <View style={styles.bar} />}
      </View>
    </Modal>
  );
};

const styles = {
  view: ThemedStyles.combine('justifyEnd', 'margin0x'),
  container: ThemedStyles.combine('bgPrimaryBackground', 'paddingBottom2x', {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  }),
  title: ThemedStyles.combine(
    'marginTop5x',
    'marginBottom4x',
    'bold',
    'fontXXL',
    'textCenter',
  ),
  closeIcon: ThemedStyles.combine('colorPrimaryText', {
    position: 'absolute',
    top: 24,
    right: 10,
  }),
  backIcon: ThemedStyles.combine('colorPrimaryText', {
    position: 'absolute',
    top: 24,
    left: 10,
  }),
  cancelButton: ThemedStyles.combine('paddingHorizontal6x'),
  bar: ThemedStyles.combine('centered', 'halfWidth', 'marginTop4x', {
    borderColor: '#D8D8D8',
    borderWidth: 3,
    borderRadius: 15,
  }),
};

export default React.forwardRef(BottomModal);
