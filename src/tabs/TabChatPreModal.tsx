import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { Platform } from 'react-native';
import i18n from '~/common/services/i18n.service';
import {
  BottomSheetModal,
  BottomSheetButton,
} from '~/common/components/bottom-sheet';
import { useStores } from '~/common/hooks/use-stores';
import { useIsAndroidFeatureOn } from 'ExperimentsProvider';

export type ChatModalHandle = {
  showModal: () => void;
};

type ChatModalProps = {};

export const TabChatPreModal = forwardRef<ChatModalHandle, ChatModalProps>(
  (props: {}, ref: any) => {
    const { chat } = useStores();
    const [isShown, setShown] = useState(false);
    const modalRef: any = useRef();
    const isChatHidden = useIsAndroidFeatureOn('mob-4630-hide-chat-icon');

    useImperativeHandle(
      ref,
      () => ({
        async showModal() {
          const isInstalled = await chat.checkAppInstalled(false);
          if (isInstalled) {
            // if it is installed opens the chat
            chat.openChat();
            return;
          }

          if (isShown === true) {
            modalRef.current?.present();
            return;
          }
          setShown(true);
        },
      }),
      [chat, isShown],
    );

    const close = () => {
      modalRef.current?.dismiss();
    };

    const handleChatOpen = async () => {
      // Check if it is installed; Open the store if it isn't
      const isInstalled = await chat.checkAppInstalled(!isChatHidden);

      if (isInstalled) {
        // if it is installed opens the chat
        chat.openChat();
      }
    };

    if (!isShown) {
      return null;
    }

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
        autoShow
        ref={modalRef}>
        <BottomSheetButton
          action={true}
          text={i18n.t('messenger.modal.action')}
          onPress={handleChatOpen}
        />
        <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
      </BottomSheetModal>
    );
  },
);

export default TabChatPreModal;
