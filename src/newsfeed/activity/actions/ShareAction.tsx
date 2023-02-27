import React from 'react';

import { Linking, Platform } from 'react-native';

import { IconButtonNext } from '~ui/icons';

import type ActivityModel from '../../ActivityModel';
import { observer, useLocalStore } from 'mobx-react';
import i18n from '../../../common/services/i18n.service';
import SendIntentAndroid from 'react-native-send-intent';
import { ANDROID_CHAT_APP, MINDS_URI } from '../../../config/Config';
import logService from '../../../common/services/log.service';
import ShareService from '../../../share/ShareService';
import { actionsContainerStyle } from './styles';
import {
  BottomSheetButton,
  BottomSheetModal,
  BottomSheetMenuItem,
} from '~/common/components/bottom-sheet';

type PropsType = {
  entity: ActivityModel;
};

export default observer(function ShareAction({ entity }: PropsType) {
  // Do not render BottomSheet unless it is necessary
  const ref = React.useRef<any>(null);
  const { guid, entity_guid, type, text, urn } = entity ?? {};

  const title = type === 'comment' ? '' : text;

  const requestParams =
    type === 'comment' ? `${entity_guid}?focusedCommentUrn=${urn}` : guid;

  const sharedLink = `${MINDS_URI}newsfeed/${requestParams}`;

  const localStore = useLocalStore(() => ({
    menuShown: false,
    onPress() {
      if (Platform.OS === 'ios') {
        localStore.share();
      } else {
        if (!localStore.menuShown) {
          localStore.menuShown = true;
          return;
        }
        if (ref.current) {
          ref.current?.present();
        }
      }
    },
    hide() {
      ref.current?.dismiss();
    },
    share() {
      ShareService.share(title, sharedLink);
    },
    async sendTo() {
      ref.current?.dismiss();
      try {
        const installed = await SendIntentAndroid.isAppInstalled(
          ANDROID_CHAT_APP,
        );
        if (installed) {
          SendIntentAndroid.sendText({
            title: '',
            text: sharedLink,
            type: SendIntentAndroid.TEXT_PLAIN,
            package: ANDROID_CHAT_APP,
          });
        } else {
          Linking.openURL('market://details?id=com.minds.chat');
        }
      } catch (error) {
        logService.exception(error);
        console.log(error);
      }
    },
  }));

  return (
    <>
      <IconButtonNext
        scale
        fill
        style={actionsContainerStyle}
        onPress={localStore.onPress}
        name="share"
        size="small"
      />
      {localStore.menuShown && (
        <BottomSheetModal ref={ref} autoShow>
          <BottomSheetMenuItem
            onPress={localStore.sendTo}
            title={i18n.t('sendTo')}
            iconName="repeat"
            iconType="material"
          />
          <BottomSheetMenuItem
            title={i18n.t('share')}
            onPress={localStore.share}
            iconName="edit"
            iconType="material"
          />

          <BottomSheetButton
            text={i18n.t('cancel')}
            onPress={localStore.hide}
          />
        </BottomSheetModal>
      )}
    </>
  );
});
