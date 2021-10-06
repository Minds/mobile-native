import React, { useRef } from 'react';
import { View, Platform, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '~ui/icons';
import { ICON_SIZES, HORIZONTAL } from '~styles/Tokens';
import Handle from '../../../common/components/bottom-sheet/Handle';
import MText from '../../../common/components/MText';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';

type PropsType = {
  title: string;
  onPressBack: () => void;
  children: React.ReactNode;
  marginTop?: number;
  contentContainer?: ViewStyle;
  titleStyle?: TextStyle;
};

/**
 * Modal container
 * @param props
 */
export default function ModalContainer(props: PropsType) {
  const insets = useSafeAreaInsets();
  const margin = props.marginTop || 50;
  const { current: cleanTop } = useRef({
    marginTop: insets.top + (Platform.OS === 'ios' ? margin + 10 : margin),
    paddingBottom: insets.bottom,
  });
  const contentContainer = useStyle(
    cleanTop,
    styles.contentContainer,
    props.contentContainer || {},
  );
  const titleStyle = useStyle(styles.title, props.titleStyle || {});

  return (
    <View style={contentContainer}>
      <Handle />
      <View style={styles.header}>
        <MText style={titleStyle}>{props.title}</MText>
        <View style={styles.backIcon}>
          <IconButton size="large" name="close" onPress={props.onPressBack} />
        </View>
      </View>

      {props.children}
    </View>
  );
}

const styles = ThemedStyles.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL,
  },
  title: [
    { fontSize: 20, marginLeft: ICON_SIZES.large },
    'paddingVertical3x',
    'textCenter',
    'fontSemibold',
    { flex: 1 },
  ],
  description: ['borderLeft5x'],
  contentContainer: [
    'bgPrimaryBackground',
    {
      flex: 1,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      overflow: 'hidden',
    },
  ],
});
