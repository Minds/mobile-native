import React, { useRef } from 'react';
import { View, Platform, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '~ui/icons';
import { HORIZONTAL } from '~styles/Tokens';
import Handle from '~/common/components/bottom-sheet/Handle';
import MText from '~/common/components/MText';
import { useNavigation } from '@react-navigation/core';
import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

type PropsType = {
  title: string;
  onPressBack: () => void;
  children: React.ReactNode;
  leftButton?: React.ReactNode;
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
      <Handle style={sp.styles.style.bgPrimaryBackgroundHighlight} />
      <View style={styles.header}>
        <MText style={titleStyle}>{props.title}</MText>
        {props.leftButton}
        <View />
        <IconButton size="large" name="close" onPress={props.onPressBack} />
      </View>

      {props.children}
    </View>
  );
}

const styles = sp.styles.create({
  header: [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: HORIZONTAL,
    },
    'paddingVertical2x',
  ],
  title: [
    {
      fontSize: 20,
      position: 'absolute',
      width: '100%',
      marginLeft: HORIZONTAL,
    },
    'paddingVertical3x',
    'textCenter',
    'fontSemibold',
    { flex: 1 },
  ],
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
