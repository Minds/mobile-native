import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, Text } from 'react-native';

// import { ProfileWidget } from 'modules/profile/widgets'
// import { AccountDetailsWidget } from 'modules/account/widgets'

export function HomeScreen(): JSX.Element {
  const { t } = useTranslation('mainModule');
  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}>
        {/* <ProfileWidget /> */}
        {/* <AccountDetailsWidget /> */}
        <Text>{t('home page')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
