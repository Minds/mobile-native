import React, { useRef } from 'react';
import { View, Platform, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MText from '../../../common/components/MText';
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
  const backIconStyle = useStyle(styles.backIcon, props.backIconStyle || {});
  return (
    <View style={contentContainer}>
      <MText style={titleStyle}>{props.title}</MText>
      <MIcon
        size={45}
        name="chevron-left"
        style={backIconStyle}
        onPress={props.onPressBack}
      />
      {props.children}
    </View>
  );
}

const styles = ThemedStyles.create({
  backIcon: [
    'colorPrimaryText',
    {
      position: 'absolute',
      top: 17,
      left: 10,
    },
  ],
  title: [
    {
      marginTop: 25,
      marginBottom: 30,
      fontSize: 23,
      textAlign: 'center',
      fontWeight: '600',
    },
  ],
  description: [
    {
      borderLeftWidth: 5,
    },
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
