import React from 'react';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import OptionsDrawer from '../../../common/components/OptionsDrawer';
import AboutScreen from './AboutScreen';
import BioScreen from './BioScreen';
import BannerScreen from './BannerScreen';
import AvatarScreen from './AvatarScreen';

const EditChannelOptions = (navigation, route) => [
  {
    title: 'Banner',
    onPress: () => navigation.push('Banner', { store: route.params.store }),
  },
  {
    title: 'Avatar',
    onPress: () => navigation.push('Avatar', { store: route.params.store }),
  },
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
      backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
    },
    headerHideShadow: true,
  };

  return [
    <AppStackNav.Screen
      key="edit1"
      name="EditChannelScreen"
      component={OptionsDrawer}
      options={{ title: i18n.t('channel.editChannel'), ...navigatorOptions }}
      initialParams={{ options: EditChannelOptions }}
    />,
    <AppStackNav.Screen
      key="edit2"
      name="Bio"
      component={BioScreen}
      options={{ title: i18n.t('channel.edit.about'), ...navigatorOptions }}
    />,
    <AppStackNav.Screen
      key="edit3"
      name="About"
      component={AboutScreen}
      options={{ title: i18n.t('channel.edit.about'), ...navigatorOptions }}
    />,
    <AppStackNav.Screen
      key="banner"
      name="Banner"
      component={BannerScreen}
      options={{ title: 'Banner', ...navigatorOptions }}
    />,
    <AppStackNav.Screen
      key="avatar"
      name="Avatar"
      component={AvatarScreen}
      options={{ title: 'Avatar', ...navigatorOptions }}
    />,
  ];
};

export default EditChannelStack;
