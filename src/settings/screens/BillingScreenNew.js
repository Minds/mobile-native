import React, { useCallback } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import SettingsItem from '../SettingsItem';
import ThemedStyles from '../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../common/services/i18n.service';

export default function() {
  const CS = ThemedStyles.style;
  const navigation = useNavigation();

  const navToBilling = useCallback(() => navigation.push('PaymentMethods'), [
    navigation,
  ]);

  const navToSubscriptions = useCallback(() => navigation.push('RecurringPayments'), [
    navigation,
  ]);

  const keyExtractor = useCallback((item, index) => index.toString());

  const list = [
    {
      title: i18n.t('settings.billingOptions.1'),
      onPress: navToBilling,
    },
    {
      title: i18n.t('settings.billingOptions.2'),
      onPress: navToSubscriptions,
    },
  ]

  return (
    <ScrollView style={CS.flexContainer}>
      <View style={[CS.flexContainer, CS.backgroundPrimary, CS.borderTopHair, CS.borderBottomHair, CS.borderPrimary]}>
        <FlatList
          data={list}
          renderItem={SettingsItem}
          style={[CS.backgroundPrimary]}
          keyExtractor={keyExtractor}
        />
      </View>
    </ScrollView>
  )
}