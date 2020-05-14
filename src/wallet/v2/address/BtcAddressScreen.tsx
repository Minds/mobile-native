import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import SaveButton from '../../../common/components/SaveButton';
import SettingInput from '../../../common/components/SettingInput';
import { UserError } from '../../../common/UserError';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import CenteredLoading from '../../../common/components/CenteredLoading';

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
  const theme = ThemedStyles.style;
  const walletStore = route.params.walletStore;

  const [address, setAddress] = useState(walletStore.wallet.btc.address);
  const [loading, setLoading] = useState(false);

  const save = useCallback(async () => {
    setLoading(true);
    const success = await walletStore.setBtcAccount(address);
    setLoading(false);
    if (success) {
      navigation.goBack();
    } else {
      throw new UserError(i18n.t('wallet.bitcoins.error'), 'warning');
    }
  }, [walletStore, address, navigation, setLoading]);

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

export default BtcAddressScreen;
