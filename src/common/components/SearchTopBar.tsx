import {
  Keyboard,
  TextInputProps,
  TextInput as TextInputType,
  View,
} from 'react-native';
import React from 'react';
import TextInput from '~/common/components/TextInput';
import ThemedStyles from '~/styles/ThemedStyles';
import { IS_IOS } from '~/config/Config';
import PressableScale from '~/common/components/PressableScale';
import { AnimatePresence, MotiView } from 'moti';
import { Icon } from '~/common/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SearchTopBarProps = Pick<
  TextInputProps,
  'onSubmitEditing' | 'placeholder'
> & {
  visible?: boolean;
  onClosePress: () => void;
};

export default function SearchTopBar({
  onClosePress,
  visible,
  ...textInputProps
}: SearchTopBarProps) {
  const ref = React.useRef<TextInputType>(null);

  const { top } = useSafeAreaInsets();

  const container = { marginTop: top };

  React.useEffect(() => {
    if (visible) {
      setTimeout(() => {
        ref.current?.focus();
      }, 150);
    } else {
      Keyboard.dismiss();
      ref.current?.clear();
    }
  }, [visible]);

  return (
    <View style={[container, styles.searchInputIconContainerStyle]}>
      <AnimatePresence>
        {visible && (
          <MotiView {...animation}>
            <TextInput
              ref={ref}
              style={styles.searchInput}
              placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
              returnKeyType={'search'}
              {...textInputProps}
            />
            <PressableScale onPress={onClosePress} style={styles.close}>
              <Icon name="close" />
            </PressableScale>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = ThemedStyles.create({
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 5,
    bottom: 2, // minor alignment of text
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  nameWrapper: ['rowJustifyStart', 'flexContainer', 'alignCenter'],
  searchInput: [
    'fontL',
    'colorSecondaryText',
    'paddingLeft3x',
    'bgPrimaryBackground',
    'borderRadius25x',
    'border1x',
    'bcolorPrimaryBorder',
    IS_IOS ? { padding: 15 } : {},
  ],
  searchInputIconContainerStyle: {
    position: 'absolute',
    top: 2,
    left: 50,
    right: 50,
  },
  iconStyle: { fontSize: 25 },
});

const animation = {
  from: { opacity: 0, translateY: -50 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: -50 },
};
