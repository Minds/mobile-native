import React from 'react';
import i18nService from '~/common/services/i18n.service';
import { B2, PressableLine, Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

/**
 * Add bank information banner
 */
export default function AddBankInformation() {
  return (
    <PressableLine style={borderBottomStyle} onPress={() => console.log('tap')}>
      <Spacer space="L">
        <B2 color="link" font="medium">
          {i18nService.t('supermind.addBank')}
        </B2>
        <B2>{i18nService.t('supermind.addBankDetail')}</B2>
      </Spacer>
    </PressableLine>
  );
}

export const borderBottomStyle = ThemedStyles.combine(
  'bcolorPrimaryBorder',
  'borderBottomHair',
);
