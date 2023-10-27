import React from 'react';

import { observer } from 'mobx-react';
import { View, ViewStyle } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import Icon from '@expo/vector-icons/MaterialIcons';
import settingsStore from '../settings/SettingsStore';
import GroupModel from '~/groups/GroupModel';
import ThemedStyles from '~/styles/ThemedStyles';
import { storages } from '~/common/services/storage/storages.service';
import { pushComposeCreateScreen } from '~/compose/ComposeCreateScreen';

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
  const pushComposeCreate = () =>
    pushComposeCreateScreen({
      onItemPress: async key => {
        navigation.goBack();
        storages.user?.setBool('compose:create', true);
        navigation.navigate('Compose', { createMode: key });
      },
    });
  const handleComposePress = () => {
    if (storages.user?.getBool('compose:create')) {
      return navigation.push('Compose', {
        group: group,
      });
    }

    pushComposeCreate();
  };

  return (
    <AnimatePresence>
      {visible && (
        <ShowHide
          style={[
            settingsStore.leftHanded ? styles.leftSide : styles.rightSide,
            style,
          ]}>
          <CaptureFabIcon
            onPress={handleComposePress}
            onLongPress={pushComposeCreate}
            testID={testID}
          />
        </ShowHide>
      )}
    </AnimatePresence>
  );
};

export default observer(CaptureFab);

export const CaptureFabIcon = ({
  onPress,
  onLongPress,
  testID,
  scale,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  testID?: string;
  scale?: number;
}) => (
  <View
    style={
      scale
        ? [styles.container, { transform: [{ scale: scale }] }]
        : styles.container
    }>
    <Icon
      name="edit"
      style={ThemedStyles.style.colorPrimaryBackground}
      size={32}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
    />
  </View>
);

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
