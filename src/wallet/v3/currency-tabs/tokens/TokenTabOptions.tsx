import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomButtonOptions, {
  ItemType,
} from '../../../../common/components/BottomButtonOptions';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';

const TokenTabOptions = observer(() => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const localStore = useLocalStore(() => ({
    showMenu: false,
    show() {
      localStore.showMenu = true;
    },
    hide() {
      localStore.showMenu = false;
    },
  }));

  const dismissOptions: Array<Array<ItemType>> = React.useMemo(() => {
    const actions: Array<Array<ItemType>> = [[]];
    actions[0].push({
      title: i18n.t('wallet.transferToOnchain'),
      onPress: () => {
        localStore.hide();
        navigation.navigate('WalletWithdrawal');
      },
    });
    actions[0].push({
      title: i18n.t('buyTokensScreen.title'),
      onPress: () => {
        localStore.hide();
        navigation.navigate('BuyTokens');
      },
    });
    actions.push([
      {
        title: i18n.t('cancel'),
        titleStyle: theme.colorSecondaryText,
        onPress: localStore.hide,
      },
    ]);
    return actions;
  }, [localStore, navigation, theme.colorSecondaryText]);

  return (
    <TouchableOpacity style={theme.alignSelfCenter} onPress={localStore.show}>
      <Icon size={24} name="dots-vertical" style={theme.colorSecondaryText} />
      <BottomButtonOptions
        list={dismissOptions}
        isVisible={localStore.showMenu}
        onPressClose={localStore.hide}
      />
    </TouchableOpacity>
  );
});

export default TokenTabOptions;
