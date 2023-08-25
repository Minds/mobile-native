import React from 'react';
import { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  BottomSheetButton,
  BottomSheetModal,
} from '~/common/components/bottom-sheet';
import { B2, Row } from '~/common/ui';
import sessionService from '~/common/services/session.service';
import { MINDS_URI } from '~/config/Config';
import { showNotification } from 'AppMessages';
import { IconButtonCircle } from './IconButtonCircle';
import { Linking } from 'react-native';
import ShareService from '~/share/ShareService';

/**
 * Links Bottom Sheet
 */
const InviteToMindsSheet = React.forwardRef<BottomSheetModalType>(
  (props, ref) => {
    return (
      <BottomSheetModal ref={ref} title="Invite to Minds">
        <Row align="centerBetween" vertical="XXL" horizontal="XL">
          <IconButtonCircle
            name="twitter"
            title="Twitter"
            color="White"
            backgroundColor="#1DA1F1"
            onPress={inviteTweeter}
          />
          <IconButtonCircle
            name="facebook"
            title="Facebook"
            color="White"
            backgroundColor="#1977F2"
            onPress={inviteFacebook}
          />
          <IconButtonCircle
            name="email"
            title="Email"
            color="White"
            backgroundColor="#334155"
            onPress={inviteEmail}
          />
          <IconButtonCircle
            name="chat-solid"
            color="White"
            title="Messages"
            backgroundColor="#19C734"
            onPress={openShare}
          />
        </Row>
        <B2 align="center" color="secondary">
          Earn for up to 1 year from when someone uses your link.
        </B2>
        <BottomSheetButton text="Copy link" onPress={copyReferrer} />
      </BottomSheetModal>
    );
  },
);

const getURL = () => {
  return encodeURI(
    `${MINDS_URI}?referrer=${sessionService.getUser().username}`,
  );
};

const inviteTweeter = () => {
  const url = getURL();
  Linking.openURL(
    `https://twitter.com/intent/tweet?tw_p=tweetbutton&url=${url}`,
  );
};
const inviteEmail = () => {
  const url = getURL();
  Linking.openURL(`mailto:?body=${url}`);
};

const inviteFacebook = () => {
  const url = getURL();
  Linking.openURL(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&display=popup&ref=plugin&src=share_button`,
  );
};

const openShare = () => {
  ShareService.share('Join me on Minds', getURL());
};

const copyReferrer = () => {
  Clipboard.setString(getURL());
  showNotification('Link copied to clipboard');
};

export default InviteToMindsSheet;
