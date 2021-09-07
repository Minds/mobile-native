import React from 'react';
import {
  BottomSheet,
  BottomSheetButton,
} from '../common/components/bottom-sheet';
import i18n from '../common/services/i18n.service';
import AuthService from './AuthService';
import PasswordConfirmScreen from './PasswordConfirmScreen';

const RelogModal = () => {
  const ref = React.useRef<any>();
  const onConfirm = React.useCallback((password: string) => {}, []);

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);

  const show = React.useCallback(() => {
    ref.current?.present();
  }, []);

  AuthService.showLoginPasswordModal = show;

  return (
    <BottomSheet ref={ref} autoShow>
      <PasswordConfirmScreen onConfirm={onConfirm} />
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheet>
  );
};

export default RelogModal;
