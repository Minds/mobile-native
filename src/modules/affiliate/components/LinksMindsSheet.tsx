import React from 'react';
import { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import * as Clipboard from 'expo-clipboard';

import {
  BottomSheetButton,
  BottomSheetModal,
} from '~/common/components/bottom-sheet';
import { B2, Row } from '~/common/ui';
import sessionService from '~/common/services/session.service';
import { APP_URI } from '~/config/Config';
import { showNotification } from 'AppMessages';
import { IconButtonCircle } from './IconButtonCircle';

/**
 * Links Bottom Sheet
 */
const LinksMindsSheet = React.forwardRef<BottomSheetModalType>((props, ref) => {
  return (
    <BottomSheetModal {...props} ref={ref} title="Earn with affiliate link">
      <Row align="centerBetween" vertical="XXL" horizontal="XL">
        <IconButtonCircle name="plus" title="Minds+" onPress={copyPlus} />
        <IconButtonCircle name="boost" title="Boost" onPress={copyBoost} />
        <IconButtonCircle name="pro" title="Minds Pro" onPress={copyPro} />
      </Row>
      <B2 align="center" color="secondary">
        Earn for up to 72 hours from when someone uses your link.
      </B2>
      <BottomSheetButton text="Copy link" onPress={copyReferrer} />
    </BottomSheetModal>
  );
});

const copyLink = (link: string) => {
  Clipboard.setStringAsync(link);
  showNotification('Link copied to clipboard');
};

export const copyReferrer = () => {
  copyLink(`${APP_URI}?referrer=${sessionService.getUser().username}`);
};
const copyPlus = () => {
  copyLink(`${APP_URI}plus?referrer=${sessionService.getUser().username}`);
};
const copyBoost = () => {
  copyLink(
    `${APP_URI}boost/boost-console?referrer=${
      sessionService.getUser().username
    }`,
  );
};
const copyPro = () => {
  copyLink(`${APP_URI}pro?referrer=${sessionService.getUser().username}`);
};

export default LinksMindsSheet;
