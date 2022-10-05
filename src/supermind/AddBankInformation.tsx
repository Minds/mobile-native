import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { useStores } from '~/common/hooks/use-stores';

import i18nService from '~/common/services/i18n.service';
import { B2, PressableLine, Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import useStripeAccount from '~/wallet/hooks/useStripeAccount';

type PropsType = {
  borderTop?: boolean;
};

/**
 * Add bank information banner
 */
function AddBankInformation({ borderTop = false }: PropsType) {
  const stripe = useStripeAccount();
  const { wallet } = useStores();
  const navigation = useNavigation();

  if (!stripe.loaded || stripe.hasBank) {
    return null;
  }
  return (
    <PressableLine
      style={borderTop ? borderTopStyle : borderBottomStyle}
      onPress={() =>
        navigation.navigate('BankInfoScreen', { walletStore: wallet })
      }>
      <Spacer space="L">
        <B2 color="link" font="medium">
          {i18nService.t('supermind.addBank')}
        </B2>
        <B2>{i18nService.t('supermind.addBankDetail')}</B2>
      </Spacer>
    </PressableLine>
  );
}

export default observer(AddBankInformation);

export const borderBottomStyle = ThemedStyles.combine(
  'bcolorPrimaryBorder',
  'borderBottomHair',
);
export const borderTopStyle = ThemedStyles.combine(
  'bcolorPrimaryBorder',
  'borderTopHair',
);
