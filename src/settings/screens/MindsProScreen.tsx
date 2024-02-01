import { Alert } from 'react-native';
import { B1, Button, Screen } from '~/common/ui';
import subscriptionProService from '~/common/services/subscription.pro.service';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';

export default function ({
  navigation,
}: {
  navigation: StackNavigationProp<any>;
}) {
  const [expiryString, setExpiryString] = useState('');
  useEffect(() => {
    subscriptionProService
      .isActive()
      .then(() => setExpiryString(subscriptionProService.expiryString));
  }, [expiryString]);

  const cancelSubscription = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to cancel Pro subscription?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: "Yes I'm Sure",
          style: 'destructive',
          onPress: async () => {
            await subscriptionProService.isActive();
            navigation.goBack();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <Screen>
      <B1 horizontal="XL2">Manage your subscription</B1>
      <Button
        mode="outline"
        type="warning"
        horizontal="XL2"
        vertical="XL2"
        spinner
        onPress={cancelSubscription}>
        Cancel Subscription
      </Button>
      <B1 horizontal="XL2">You still have Minds Pro until {expiryString}</B1>
    </Screen>
  );
}
