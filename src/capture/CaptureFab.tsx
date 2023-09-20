import React from 'react';

import { observer } from 'mobx-react';
import { View, ViewStyle } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import Icon from 'react-native-vector-icons/MaterialIcons';
import settingsStore from '../settings/SettingsStore';
import GroupModel from '~/groups/GroupModel';
import ThemedStyles from '~/styles/ThemedStyles';

type CaptureFabProps = {
  group?: GroupModel;
  visible?: boolean;
  navigation: any;
  testID?: string;
  style?: ViewStyle;
};

/**
 * Animated presence container
 */
function ShowHide({ children, ...other }) {
  return (
    <MotiView {...animation} {...other}>
      {children}
    </MotiView>
  );
}

const CaptureFab = ({
  navigation,
  visible,
  group,
  testID,
  style,
}: CaptureFabProps) => {
  const navToCapture = () => {
    navigation.push('Compose', {
      group: group,
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <ShowHide
          style={[
            settingsStore.leftHanded ? styles.leftSide : styles.rightSide,
            style,
          ]}>
          <View style={styles.container}>
            <Icon
              name="edit"
              style={ThemedStyles.style.colorPrimaryText_Light}
              size={32}
              onPress={navToCapture}
              testID={testID}
            />
          </View>
        </ShowHide>
      )}
    </AnimatePresence>
  );
};

export default observer(CaptureFab);

const styles = ThemedStyles.create({
  container: [
    {
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
    },
    'bgLink',
  ],
  rightSide: {
    position: 'absolute',
    // backgroundColor:'#4690DF',
    bottom: 48,
    zIndex: 1000,
    // zIndex: 1,
    right: 24,
  },
  leftSide: {
    position: 'absolute',
    // backgroundColor:'#4690DF',
    bottom: 48,
    zIndex: 1000,
    left: 24,
  },
});

// Animation definition
const animation = {
  from: {
    opacity: 0,
    scale: 0.5,
  },
  transition: {
    type: 'timing',
    delay: 50,
    duration: 100,
  } as any, //solve moti type issue
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
  },
};
