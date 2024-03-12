import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { Linking, Platform } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import { useAnalytics } from '~/common/contexts/analytics.context';
import { IconButtonNext } from '~ui/icons';
import logService from '../../../common/services/log.service';
import { ANDROID_CHAT_APP, APP_URI } from '../../../config/Config';
import ShareService from '../../../share/ShareService';
import type ActivityModel from '../../ActivityModel';
import { pushShareSheet } from '../ActivityActionSheet';
import { actionsContainerStyle } from './styles';

type PropsType = {
  entity: ActivityModel;
};

export default observer(function ShareAction({ entity }: PropsType) {
  const analytics = useAnalytics();
  const { guid, entity_guid, type, text, urn } = entity ?? {};

  const title = type === 'comment' ? '' : text;

  const requestParams =
    type === 'comment' ? `${entity_guid}?focusedCommentUrn=${urn}` : guid;

  const sharedLink = `${APP_URI}newsfeed/${requestParams}`;

  const localStore = useLocalStore(() => ({
    onPress() {
      if (Platform.OS === 'ios') {
        analytics.trackClick('share');
        localStore.share();
      } else {
        pushShareSheet({
          onSendTo: localStore.sendTo,
          onShare: localStore.share,
        });
      }
    },
    share() {
      analytics.trackClick('share');
      ShareService.share(title, sharedLink);
    },
    async sendTo() {
      analytics.trackClick('sendTo');
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
    <IconButtonNext
      scale
      fill
      style={actionsContainerStyle}
      onPress={localStore.onPress}
      name="share"
      size="small"
    />
  );
});
