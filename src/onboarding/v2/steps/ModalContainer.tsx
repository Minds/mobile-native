import React, { useRef } from 'react';
import { View, Platform, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Handle from '../../../common/components/bottom-sheet/Handle';
import MText from '../../../common/components/MText';
import PressableScale from '../../../common/components/PressableScale';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';

type PropsType = {
  title: string;
  onPressBack: () => void;
  children: React.ReactNode;
  marginTop?: number;
  contentContainer?: ViewStyle;
  titleStyle?: TextStyle;
  backIconStyle?: TextStyle;
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
  const backIconStyle = useStyle(
    ThemedStyles.style.colorPrimaryText,
    props.backIconStyle || {},
  );
  return (
    <View style={contentContainer}>
      <Handle />
      <View style={styles.backIcon}>
        <PressableScale onPress={props.onPressBack}>
          <Icon size={22} name={'close'} style={backIconStyle} />
        </PressableScale>
      </View>
      <MText style={titleStyle}>{props.title}</MText>
      {props.children}
    </View>
  );
}

const styles = ThemedStyles.create({
  backIcon: [
    'padding',
    {
      zIndex: 1000,
      position: 'absolute',
      top: 31,
      right: 15,
    },
  ],
  title: [{ fontSize: 20 }, 'paddingVertical3x', 'textCenter', 'fontSemibold'],
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
