import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import ThemedStyles from '../../../styles/ThemedStyles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button';
import i18n from '../../services/i18n.service';
import createBottomModalStore, {
  BottomModalStore,
} from './createBottomModalStore';
import { observer, useLocalStore } from 'mobx-react';
import MText from '../MText';

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
  store: BottomModalStore;
}

const BottomModal: React.ForwardRefRenderFunction<
  BottomModalHandles,
  PropsType
> = ({ children, ...props }, ref) => {
  const store = useLocalStore(createBottomModalStore);
  React.useImperativeHandle(ref, () => ({
    store,
  }));
  return (
    <Modal
      avoidKeyboard
      swipeDirection={'down'}
      onSwipeComplete={store.hide}
      isVisible={store.visible}
      onBackdropPress={store.hide}
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
        {!!props.title && <MText style={styles.title}>{props.title}</MText>}
        {!!props.title && (
          <MIcon
            size={34}
            name="close"
            style={styles.closeIcon}
            onPress={store.hide}
          />
        )}
        {children}
        {props.showCancel && (
          <View style={styles.cancelButton}>
            <Button
              text={props.cancelText || i18n.t('cancel')}
              onPress={store.hide}
              borderless
              active
              centered={false}
            />
          </View>
        )}
        {props.barBottom && <View style={styles.bar} />}
      </View>
      <Error store={store} />
    </Modal>
  );
};

const Error = observer(({ store }: { store: BottomModalStore }) => {
  React.useEffect(() => {
    const cleanup = setTimeout(() => {
      if (store.error !== '') {
        store.setError('');
      }
    }, 3000);
    return () => {
      cleanup;
    };
  }, [store, store.error]);
  if (store.error === '') {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.errorView}
      onPress={() => store.setError('')}>
      <View style={styles.errorIconView}>
        <Icon name="error" size={32} color="white" />
      </View>
      <View style={styles.errorTextView}>
        <MText style={styles.errorText}>{store.error}</MText>
      </View>
    </TouchableOpacity>
  );
});

const styles = {
  view: ThemedStyles.combine('justifyEnd', 'margin0x'),
  container: ThemedStyles.combine(
    'bgPrimaryBackground_Dark',
    'paddingBottom2x',
    {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      overflow: 'hidden',
    },
  ),
  title: ThemedStyles.combine(
    'colorPrimaryText_Dark',
    'marginTop5x',
    'marginBottom4x',
    'bold',
    'fontXXL',
    'textCenter',
  ),
  closeIcon: ThemedStyles.combine('colorPrimaryText_Dark', {
    position: 'absolute',
    top: 24,
    right: 10,
  }),
  backIcon: ThemedStyles.combine('colorPrimaryText_Dark', {
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
  errorView: ThemedStyles.combine('bgWhite', 'rowJustifyStart', 'width90', {
    position: 'absolute',
    bottom: 20,
    left: 20,
  }),
  errorIconView: { backgroundColor: '#ca4a34', padding: 16 },
  errorText: ThemedStyles.combine('fontL', { color: '#7d7d82' }),
  errorTextView: ThemedStyles.combine(
    'flexContainer',
    'justifyCenter',
    'paddingLeft4x',
  ),
};

export default observer(React.forwardRef(BottomModal));
