import React from 'react';
import {
  BottomSheet,
  BottomSheetButton,
} from '../common/components/bottom-sheet';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import AuthService from './AuthService';
import PasswordConfirmScreen from './PasswordConfirmScreen';

const RelogModal = () => {
  const ref = React.useRef<any>();
  const onConfirm = React.useCallback((password: string) => {}, []);

  const close = React.useCallback(() => {
    ref.current?.dismiss();
    sessionService.logout();
  }, []);

  const show = React.useCallback(() => {
    ref.current?.present();
  }, []);

  React.useEffect(() => {
    const dispose = sessionService.onSessionExpired(show);
    return dispose;
  }, [show]);

  return (
    <BottomSheet ref={ref}>
      <PasswordConfirmScreen onConfirm={onConfirm} />
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheet>
  );
};

export default RelogModal;
