import { B1, Button, Screen } from '~/common/ui';
import subscriptionProService from '~/common/services/subscription.pro.service';
import { useEffect, useState } from 'react';
import sessionService from '~/common/services/session.service';
import { useNavigation } from '@react-navigation/native';
import { confirm } from '~/common/components/Confirm';

export default function () {
  const { cancelSubscription, expiryString } = useCancelProSubscription();
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

const useCancelProSubscription = () => {
  const navigation = useNavigation();
  const user = sessionService.getUser();
  const [expiryString, setExpiryString] = useState('');

  useEffect(() => {
    subscriptionProService
      .expires()
      .then(() => setExpiryString(subscriptionProService.expiryString));
  }, [expiryString]);

  const cancelSubscription = async () => {
    if (
      await confirm({
        title: 'Confirm Cancellation',
        actionText: 'Yes, I’m sure',
        description: 'Are you sure you want to cancel your Pro subscription?',
      })
    ) {
      await subscriptionProService.disable();
      user.togglePro();
      navigation.goBack();
    }
  };

  return {
    cancelSubscription,
    expiryString,
  };
};
