import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import Icon from '@expo/vector-icons/MaterialIcons';

import GroupModel from '~/groups/GroupModel';

import { pushComposeCreateScreen } from '~/compose/ComposeCreateScreen';
import { IS_TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';
type CaptureFabProps = {
  group?: GroupModel;
  navigation: any;
  testID?: string;
};

const CaptureFab = ({ navigation, group, testID }: CaptureFabProps) => {
  if (sp.permissions.shouldHideCreatePost()) {
    return null;
  }

  const pushComposeCreate = () =>
    sp.permissions.canCreatePost(true) &&
    pushComposeCreateScreen({
      onItemPress: async key => {
        navigation.goBack();
        navigation.navigate('Compose', { createMode: key });
      },
    });

  const handleComposePress = () => {
    if (sp.permissions.canCreatePost(true)) {
      navigation.push('Compose', {
        group: group,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CaptureFabIcon
        onLongPress={handleComposePress}
        onPress={IS_TENANT || group ? handleComposePress : pushComposeCreate}
        testID={testID}
      />
    </View>
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
        ? [styles.iconContainer, { transform: [{ scale: scale }] }]
        : styles.iconContainer
    }>
    <Icon
      name="edit"
      style={sp.styles.style.colorPrimaryBackground}
      size={32}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
    />
  </View>
);

const styles = sp.styles.create({
  iconContainer: [
    {
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
    },
    'bgLink',
  ],
  container: {
    position: 'absolute',
    bottom: 28,
    zIndex: 1000,
    right: 24,
  },
});
