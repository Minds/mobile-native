import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '~ui/icons';
import { useStores } from '~/common/hooks/use-stores';
import ChatBubbleIcon from './ChatBubbleIcon';
import {
  BottomSheetModal,
  BottomSheetButton,
} from '~/common/components/bottom-sheet';
import MText from '~/common/components/MText';
import i18n from '~/common/services/i18n.service';

type PropsType = {
  active: boolean;
};

const ChatTabIcon = ({ active }: PropsType) => {
  const { chat } = useStores();

  useEffect(() => {
    chat.init();
    return () => {
      chat.clear();
    };
  }, [chat]);

  return (
    <View style={styles.container}>
      <Icon size="large" name="chat" active={active} />
      <ChatBubbleIcon chatStore={chat} />
    </View>
  );
};

export const ChatPreModal = ({ isShown }) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  const show = React.useCallback(() => {
    ref.current?.present();
  }, []);

  useEffect(() => {
    if (isShown) {
      close();
      return;
    }
    show();
  }, [isShown, close, show]);

  return (
    <BottomSheetModal ref={ref}>
      <MText>
        For an enhanced chat experience install Minds Chat directly from the
        store
      </MText>
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatTabIcon;
