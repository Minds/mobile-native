import React, { useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import SettingsItem from '../SettingsItem';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import authService from '../../auth/AuthService';

export default function({ navigation }) {
  const CS = ThemedStyles.style;

  const navToBlockedChannels = useCallback(() => navigation.push('BlockedChannels'), [
    navigation,
  ]);

  const navToReportedContent = useCallback(() => navigation.push('ReportedContent'), [
    navigation,
  ]);

  const navToDeleteChannel = useCallback(() => navigation.push('DeleteChannel'), [
    navigation,
  ]);

  const navToDeactivateChannel = useCallback(() => navigation.push('DeactivateChannel'), [
    navigation,
  ]);

  const navToAppInfo = useCallback(() => navigation.push('AppInfo'), [
    navigation,
  ]);

  const contentAdmin = [
    {
      title: i18n.t('settings.otherOptions.a1'),
      onPress: navToReportedContent,
    },
    {
      title: i18n.t('settings.blockedChannels'),
      onPress: navToBlockedChannels,
    },
  ];

  const paidContent = [
    {
      title: i18n.t('settings.otherOptions.b1'),
      onPress: '',
    },
    {
      title: i18n.t('settings.otherOptions.b2'),
      onPress: '',
    },
  ];

  const account = [
    {
      title: i18n.t('settings.deactivate'),
      onPress: navToDeactivateChannel,
    },
    {
      title: i18n.t('settings.otherOptions.c2'),
      onPress: navToDeleteChannel,
    },
    {
      title: i18n.t('settings.logout'),
      onPress: authService.logout,
    },
  ];

  const info = [
    {
      title: i18n.t('settings.otherOptions.d1'),
      onPress: navToAppInfo,
    },
  ];

  const subTitle = [
    CS.colorTertiaryText, 
    CS.fontM,
    CS.paddingLeft3x,
  ];


  return (
    <View style={[CS.flexContainer, CS.backgroundPrimary, CS.borderTopHair, CS.borderBottomHair, CS.borderPrimary]}>

      <Text style={[subTitle, styles.subTitle]} >{i18n.t('settings.otherOptions.a')}</Text>
      {contentAdmin.map((item, i) => (<SettingsItem item={item} i={i} />))}

      <Text style={[subTitle, styles.subTitle]} >{i18n.t('settings.otherOptions.b')}</Text>
      {paidContent.map((item, i) => (<SettingsItem item={item} i={i} />))}

      <Text style={[subTitle, styles.subTitle]} >{i18n.t('settings.otherOptions.c')}</Text>
      {account.map((item, i) => (<SettingsItem item={item} i={i} />))}

      <Text style={[subTitle, styles.subTitle]} >{i18n.t('settings.otherOptions.d')}</Text>
      {info.map((item, i) => (<SettingsItem item={item} i={i} />))}

    </View>
  )
}

const styles = {
  subTitle: {
    lineHeight: 35,
    paddingTop: 10,
  },
};