import React, { useRef } from 'react';
import { View, Platform, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '~ui/icons';
import { ICON_SIZES, HORIZONTAL } from '~styles/Tokens';
import Handle from '../../../common/components/bottom-sheet/Handle';
import MText from '../../../common/components/MText';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/core';

type PropsType = {
  title: string;
  onPressBack: () => void;
  children: React.ReactNode;
  marginTop?: number;
  contentContainer?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

/**
 * Modal container
 * @param props
 */
export default function ModalContainer(props: PropsType) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const margin = props.marginTop || 50;
  const { current: cleanTop } = useRef({
    marginTop: insets.top + (Platform.OS === 'ios' ? margin + 10 : margin),
    paddingBottom: insets.bottom,
  });

  // Set the gestureResponseDistance dynamically (to match empty space plus the header)
  React.useLayoutEffect(() => {
    navigation.setOptions({ gestureResponseDistance: cleanTop.marginTop + 80 });
  }, [cleanTop.marginTop, navigation]);

  const contentContainer = useStyle(
    cleanTop,
    styles.contentContainer,
    (props.contentContainer || {}) as ViewStyle,
  );
  const titleStyle = useStyle(
    styles.title,
    (props.titleStyle || {}) as TextStyle,
  );

  return (
    <View style={contentContainer}>
      <Handle style={ThemedStyles.style.bgPrimaryBackgroundHighlight} />
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
