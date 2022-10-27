import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ScrollView, Text, View } from 'react-native';

export function RegisterDeviceScreen(): JSX.Element {
  const navigation = useNavigation();
  const { t } = useTranslation('mainModule');

  const onPressNext = async () => {
    navigation.navigate('VerifyOtp');
  };

  return (
    <ScrollView scrollEnabled={false}>
      <Text>{t('This device will now be registered')}</Text>
      <View>
        <Button title="" testID="continue-button" onPress={onPressNext}>
          {t('CONTINUE')}
        </Button>
      </View>
    </ScrollView>
  );
}
