import { B1, Button, Screen } from '~/common/ui';
import subscriptionProService from '~/common/services/subscription.pro.service';
import { useCallback, useEffect, useRef, useState } from 'react';
import sessionService from '~/common/services/session.service';
import { useNavigation } from '@react-navigation/native';
import BottomSheetModal from '~/common/components/bottom-sheet/BottomSheetModal';
import { BottomSheetButton } from '~/common/components/bottom-sheet';

export default function () {
  const { show, shown, ref, close, cancelSubscription, expiryString } =
    useCancelProSubscription();
  return (
    <Screen>
      <B1 horizontal="XL2">Manage your subscription</B1>
      <Button
        mode="outline"
        type="warning"
        horizontal="XL2"
        vertical="XL2"
        spinner
        onPress={show}>
        Cancel Subscription
      </Button>
      <B1 horizontal="XL2">You still have Minds Pro until {expiryString}</B1>
      {shown && (
        <BottomSheetModal ref={ref} autoShow>
          <B1 horizontal="XL" align="center">
            {'Are you sure you want to cancel your\nPro subscription?'}
          </B1>
          <BottomSheetButton
            action
            solid
            text="Yes, I'm sure"
            onPress={cancelSubscription}
          />

          <BottomSheetButton text={'No'} onPress={close} />
        </BottomSheetModal>
      )}
    </Screen>
  );
}

const useCancelProSubscription = () => {
  const navigation = useNavigation();
  const user = sessionService.getUser();
  const [expiryString, setExpiryString] = useState('');
  const [shown, setShown] = useState(false);

  const ref = useRef<any>();

  const close = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  const show = useCallback(() => {
    shown ? ref.current?.present() : setShown(true);
  }, [shown]);

  useEffect(() => {
    subscriptionProService
      .expires()
      .then(() => setExpiryString(subscriptionProService.expiryString));
  }, [expiryString]);

  const cancelSubscription = async () => {
    await subscriptionProService.disable();
    user.togglePro();
    navigation.goBack();
  };

  return {
    shown,
    show,
    ref,
    close,
    cancelSubscription,
    expiryString,
  };
};
