import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { Screen } from '../../common/ui';
import { InAppVerificationStackNavigationProp } from '../InAppVerificationStack';

type NavigationProp = InAppVerificationStackNavigationProp<'InAppVerificationCamera'>;

export default function InAppVerificationCameraScreen() {
  const navigation = useNavigation<NavigationProp>();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('InAppVerificationConfirmation');
    }, 1500);
  }, [navigation]);

  return <Screen safe></Screen>;
}
