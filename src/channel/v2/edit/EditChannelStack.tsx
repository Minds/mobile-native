import React from 'react';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import OptionsDrawer from '../../../common/components/OptionsDrawer';
import AboutScreen from './AboutScreen';
import BioScreen from './BioScreen';

const EditChannelOptions = (navigation, route) => [
  {
    title: i18n.t('channel.edit.bio'),
    onPress: () => navigation.push('Bio', { store: route.params.store }),
  },
  {
    title: i18n.t('channel.edit.about'),
    onPress: () => navigation.push('About', { store: route.params.store }),
  },
  /*{
    title: i18n.t('channel.edit.hashtags'),
    onPress: () => false,
  },
  {
    title: i18n.t('channel.edit.links'),
    onPress: () => false,
  },*/
];

const EditChannelStack = function (AppStackNav: any) {
  const navigatorOptions = {
    headerStyle: {
      backgroundColor: ThemedStyles.getColor('primary_background'),
    },
    headerHideShadow: true,
  };

  return [
    <AppStackNav.Screen
      name="EditChannelScreen"
      component={OptionsDrawer}
      options={{ title: i18n.t('channel.editChannel'), ...navigatorOptions }}
      initialParams={{ options: EditChannelOptions }}
    />,
    <AppStackNav.Screen
      name="Bio"
      component={BioScreen}
      options={{ title: i18n.t('channel.edit.about'), ...navigatorOptions }}
    />,
    <AppStackNav.Screen
      name="About"
      component={AboutScreen}
      options={{ title: i18n.t('channel.edit.about'), ...navigatorOptions }}
    />,
  ];
};

export default EditChannelStack;
