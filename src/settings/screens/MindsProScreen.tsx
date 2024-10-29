import { B1, Button, Screen } from '~/common/ui';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { confirm } from '~/common/components/Confirm';
import sp from '~/services/serviceProvider';
import { useService } from '~/services/hooks/useService';
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
  const user = sp.session.getUser();
  const [expiryString, setExpiryString] = useState('');
  const subscriptionProService = useService('subscriptionPro');

  useEffect(() => {
    subscriptionProService
      .expires()
      .then(() => setExpiryString(subscriptionProService.expiryString));
  }, [expiryString, subscriptionProService]);

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
