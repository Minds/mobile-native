import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UniswapWidget from '../common/components/uniswap-widget/UniswapWidget';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import mindsService from '../common/services/minds.service';
import { observer, useLocalStore } from 'mobx-react';
import createLocalStore from './createLocalStore';
import ModalScreen from '../common/components/ModalScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type EarnItemPropsType = {
  content: { name: string; icon?: string; onPress: () => void };
};

const EarnItem = ({ content }: EarnItemPropsType) => {
  const theme = ThemedStyles.style;

  const body = content.icon ? (
    <View style={theme.rowJustifyStart}>
      <Icon
        name={content.icon}
        color={ThemedStyles.getColor('primary_text')}
        size={20}
        style={[theme.centered, theme.marginRight3x]}
      />
      <Text style={[theme.fontL, theme.colorPrimaryText, theme.bold]}>
        {i18n.t(`earnScreen.${content.name}.title`)}
      </Text>
    </View>
  ) : (
    <Text style={[theme.fontL, theme.colorSecondaryText, theme.fontMedium]}>
      {i18n.t(`earnScreen.${content.name}`)}
    </Text>
  );

  return (
    <TouchableOpacity
      style={[
        theme.rowJustifySpaceBetween,
        theme.paddingLeft5x,
        theme.paddingRight5x,
        theme.marginTop5x,
      ]}
      onPress={content.onPress}>
      {body}
      <Icon
        name={'chevron-right'}
        color={ThemedStyles.getColor('secondary_text')}
        size={24}
      />
    </TouchableOpacity>
  );
};

export default observer(function ({ navigation }) {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createLocalStore);

  useEffect(() => {
    const getSettings = async () => {
      const settings = await mindsService.getSettings();
      localStore.setTokenAddress(settings.blockchain.token.address);
    };
    getSettings();
  }, [localStore]);

  const navToVideoCapture = () => {
    navigation.goBack();
    navigation.push('Capture', { mode: 'text', start: true });
  };

  const openWithdrawal = () => navigation.navigate('WalletWithdrawal');

  const earnItems = [
    {
      name: 'pool',
      icon: 'plus-circle-outline',
      onPress: localStore.toggleUniswapWidget,
    },
    {
      name: 'transfer',
      icon: 'swap-horizontal',
      onPress: openWithdrawal,
    },
    {
      name: 'create',
      icon: 'plus-box',
      onPress: navToVideoCapture,
    },
    {
      name: 'refer',
      icon: 'account-multiple',
      onPress: () => false,
    },
  ];

  const resourcesItems = [
    {
      name: 'resources.rewards',
      onPress: localStore.toggleUniswapWidget,
    },
    {
      name: 'resources.tokens',
      onPress: localStore.toggleUniswapWidget,
    },
    {
      name: 'resources.earnings',
      onPress: localStore.toggleUniswapWidget,
    },
    {
      name: 'resources.analytics',
      onPress: localStore.toggleUniswapWidget,
    },
  ];

  const unlockItems = [
    {
      name: 'unlock.mindsPlus',
      onPress: localStore.toggleUniswapWidget,
    },
    {
      name: 'unlock.pro',
      onPress: localStore.toggleUniswapWidget,
    },
  ];

  const titleStyle = [
    styles.title,
    theme.colorPrimaryText,
    theme.marginTop5x,
    theme.paddingLeft5x,
  ];

  return (
    <>
      <ModalScreen
        source={require('../assets/withdrawalbg.jpg')}
        title={i18n.t('earnScreen.title')}>
        <Text style={titleStyle}>{i18n.t('earnScreen.increase')}</Text>
        {earnItems.map((item) => (
          <EarnItem content={item} />
        ))}
        <Text style={[titleStyle, theme.paddingTop2x]}>
          {i18n.t('earnScreen.resources.title')}
        </Text>
        {resourcesItems.map((item) => (
          <EarnItem content={item} />
        ))}
        <Text style={[titleStyle, theme.paddingTop2x]}>
          {i18n.t('earnScreen.unlock.title')}
        </Text>
        {unlockItems.map((item) => (
          <EarnItem content={item} />
        ))}
      </ModalScreen>
      <UniswapWidget
        isVisible={localStore.showUniswapWidget}
        action={'add'}
        onCloseButtonPress={localStore.toggleUniswapWidget}
        tokenAddress={localStore.tokenAddress}
      />
    </>
  );
});

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontWeight: '700',
  },
  textItem: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});
