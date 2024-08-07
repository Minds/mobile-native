import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import Icon from '@expo/vector-icons/MaterialIcons';

import GroupModel from '~/groups/GroupModel';
import ThemedStyles from '~/styles/ThemedStyles';
import { pushComposeCreateScreen } from '~/compose/ComposeCreateScreen';
import PermissionsService from '~/common/services/permissions.service';
import { IS_TENANT } from '~/config/Config';

type CaptureFabProps = {
  group?: GroupModel;
  navigation: any;
  testID?: string;
};

const CaptureFab = ({ navigation, group, testID }: CaptureFabProps) => {
  if (PermissionsService.shouldHideCreatePost()) {
    return null;
  }

  const pushComposeCreate = () =>
    PermissionsService.canCreatePost(true) &&
    pushComposeCreateScreen({
      onItemPress: async key => {
        navigation.goBack();
        navigation.navigate('Compose', { createMode: key });
      },
    });

  const handleComposePress = () => {
    if (PermissionsService.canCreatePost(true)) {
      navigation.push('Compose', {
        group: group,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CaptureFabIcon
        onLongPress={IS_TENANT ? undefined : handleComposePress}
        onPress={IS_TENANT ? handleComposePress : pushComposeCreate}
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
      style={ThemedStyles.style.colorPrimaryBackground}
      size={32}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
    />
  </View>
);

const styles = ThemedStyles.create({
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
