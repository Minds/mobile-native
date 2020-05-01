import React from 'react';
import i18n from '../../../common/services/i18n.service';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import ThemedStyles from '../../../styles/ThemedStyles';
import OptionsDrawer from '../../../common/components/OptionsDrawer';
import AboutScreen from './AboutScreen';
import type { ChannelStoreType } from '../createChannelStore';
import BioScreen from './BioScreen';

export type EditChannelStackParamList = {
  EditChannelScreen: {};
  Bio: {
    store: ChannelStoreType;
  };
  About: {
    store: ChannelStoreType;
  };
};

const EditChannelOptions = (navigation) => [
  {
    title: i18n.t('channel.edit.bio'),
    onPress: () => navigation.push('Bio'),
  },
  {
    title: i18n.t('channel.edit.about'),
    onPress: () => navigation.push('About'),
  },
  {
    title: i18n.t('channel.edit.hashtags'),
    onPress: () => false,
  },
  {
    title: i18n.t('channel.edit.links'),
    onPress: () => false,
  },
];

const EditChannelStackNav = createNativeStackNavigator<
  EditChannelStackParamList
>();

const EditChannelStack = function ({ route }) {
  return (
    <EditChannelStackNav.Navigator
      screenOptions={{
        title: '',
        ...ThemedStyles.defaultScreenOptions,
        headerStyle: {
          backgroundColor: ThemedStyles.getColor('primary_background'),
        },
        headerHideShadow: true,
      }}>
      <EditChannelStackNav.Screen
        name="EditChannelScreen"
        component={OptionsDrawer}
        options={{ title: i18n.t('channel.editChannel') }}
        initialParams={{ options: EditChannelOptions }}
      />
      <EditChannelStackNav.Screen
        name="Bio"
        component={BioScreen}
        options={{ title: i18n.t('channel.edit.about') }}
        initialParams={{ store: route.params.store }}
      />
      <EditChannelStackNav.Screen
        name="About"
        component={AboutScreen}
        options={{ title: i18n.t('channel.edit.about') }}
        initialParams={{ store: route.params.store }}
      />
    </EditChannelStackNav.Navigator>
  );
};

export default EditChannelStack;
