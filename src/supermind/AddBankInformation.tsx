import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';

import { useStores } from '~/common/hooks/use-stores';
import { B2, PressableLine, Spacer } from '~/common/ui';

import useStripeAccount from '~/wallet/hooks/useStripeAccount';
import sp from '~/services/serviceProvider';

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
  const i18n = sp.i18n;
  return (
    <PressableLine
      style={borderTop ? borderTopStyle : borderBottomStyle}
      onPress={() =>
        navigation.navigate('BankInfoScreen', { walletStore: wallet })
      }>
      <Spacer space="L">
        <B2 color="link" font="medium">
          {i18n.t('supermind.addBank')}
        </B2>
        <B2>{i18n.t('supermind.addBankDetail')}</B2>
      </Spacer>
    </PressableLine>
  );
}

export default observer(AddBankInformation);

export const borderBottomStyle = sp.styles.combine(
  'bcolorPrimaryBorder',
  'borderBottomHair',
);
export const borderTopStyle = sp.styles.combine(
  'bcolorPrimaryBorder',
  'borderTopHair',
);
