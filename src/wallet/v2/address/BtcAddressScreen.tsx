import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import SaveButton from '~/common/components/SaveButton';
import SettingInput from '~/common/components/SettingInput';
import { UserError } from '~/common/UserError';
import { AppStackParamList } from '~/navigation/NavigationTypes';
import CenteredLoading from '~/common/components/CenteredLoading';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

export type BtcAddressScreenRouteProp = RouteProp<
  AppStackParamList,
  'BtcAddressScreen'
>;
export type BtcAddressScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'BtcAddressScreen'
>;

type PropsType = {
  navigation: BtcAddressScreenNavigationProp;
  route: BtcAddressScreenRouteProp;
};

const BtcAddressScreen = observer(({ navigation, route }: PropsType) => {
  const theme = sp.styles.style;
  const { walletStore } = route.params ?? {};
  const i18n = sp.i18n;
  const [address, setAddress] = useState(walletStore?.wallet.btc.address);
  const [loading, setLoading] = useState(false);

  const save = useCallback(async () => {
    setLoading(true);
    const success = await walletStore?.setBtcAccount(address);
    setLoading(false);
    if (success) {
      navigation.goBack();
    } else {
      throw new UserError(i18n.t('wallet.bitcoins.error'), 'warning');
    }
  }, [walletStore, address, navigation, setLoading, i18n]);

  /**
   * Set save button on header right
   */
  navigation.setOptions({
    headerRight: () => <SaveButton onPress={save} />,
  });

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <SettingInput
      placeholder={i18n.t('wallet.bitcoins.add')}
      onChangeText={setAddress}
      value={address}
      testID="btcAddressInput"
      wrapperBorder={[theme.borderTop, theme.borderBottom]}
      selectTextOnFocus={true}
    />
  );
});

export default withErrorBoundaryScreen(BtcAddressScreen, 'BtcAddressScreen');
