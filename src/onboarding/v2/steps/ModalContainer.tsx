import React, { useRef } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  title: string;
  onPressBack: () => void;
  children: React.ReactNode;
};

/**
 * Modal container
 * @param props
 */
export default function ModalContainer(props: PropsType) {
  const theme = ThemedStyles.style;
  const insets = useSafeAreaInsets();
  const { current: cleanTop } = useRef({
    marginTop: insets.top + (Platform.OS === 'ios' ? 60 : 50),
    paddingBottom: insets.bottom,
  });
  return (
    <View style={[cleanTop, styles.contentContainer, theme.backgroundPrimary]}>
      <Text style={styles.title}>{props.title}</Text>
      <MIcon
        size={45}
        name="chevron-left"
        style={[styles.backIcon, ThemedStyles.style.colorPrimaryText]}
        onPress={props.onPressBack}
      />
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    top: 17,
    left: 10,
  },
  title: {
    marginTop: 25,
    marginBottom: 30,
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    borderLeftWidth: 5,
  },
  contentContainer: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
  },
});
