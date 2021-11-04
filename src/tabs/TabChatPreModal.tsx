import React, { forwardRef, useCallback } from 'react';
import { Platform } from 'react-native';
import i18n from '~/common/services/i18n.service';
import {
  BottomSheetModal,
  BottomSheetButton,
} from '~/common/components/bottom-sheet';

type PropsType = {
  onAction: () => void;
  onCancel: () => void;
};

export const TabChatPreModal = forwardRef((props: PropsType, ref: any) => {
  const { onAction, onCancel } = props;

  const close = useCallback(() => {
    onCancel();

    ref.current?.dismiss();
  }, [ref, onCancel]);

  return (
    <BottomSheetModal
      title={i18n.t('messenger.modal.appname')}
      detail={i18n.t('messenger.modal.text', {
        store: i18n.t(
          `messenger.modal.${
            Platform.OS === 'ios' ? 'theappstore' : 'googleplay'
          }`,
        ),
      })}
      autoShow={false}
      ref={ref}>
      <BottomSheetButton
        action={true}
        text={i18n.t('messenger.modal.action')}
        onPress={onAction}
      />
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheetModal>
  );
});

export default TabChatPreModal;
