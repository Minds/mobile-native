import React, { useEffect, useRef, useCallback } from 'react';
import MText from '~/common/components/MText';
import i18n from '~/common/services/i18n.service';
import {
  MenuItem,
  BottomSheetModal,
  BottomSheetButton,
} from '~/common/components/bottom-sheet';

export const TabChatPreModal = ({ isShown, onPress, onCancel }) => {
  const ref = useRef<any>();
  const close = useCallback(() => {
    ref.current?.dismiss();
  }, []);
  const show = useCallback(() => {
    ref.current?.present();
  }, []);

  useEffect(() => {
    if (isShown) {
      close();
      return;
    }
    show();
  }, [isShown, close, show]);

  const item = {
    title: 'Install Minds Chat',
    iconName: 'ios-flag-outline',
    iconType: 'ionicon',
    onPress,
  };

  return (
    <BottomSheetModal ref={ref}>
      <MText>
        For an enhanced chat experience install the external Minds Chat
        application directly from the store
      </MText>
      <MenuItem {...item} />
      <BottomSheetButton text={i18n.t('cancel')} onPress={onCancel} />
    </BottomSheetModal>
  );
};

export default TabChatPreModal;
