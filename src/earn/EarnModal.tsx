import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import UniswapWidget from '../common/components/uniswap-widget/UniswapWidget';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import mindsConfigService from '../common/services/minds-config.service';
import { observer, useLocalStore } from 'mobx-react';
import createLocalStore from './createLocalStore';
import ModalScreen from '../common/components/ModalScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ONCHAIN_ENABLED, LIQUIDITY_ENABLED } from '../config/Config';
import MText from '../common/components/MText';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { useIsFeatureOn } from 'ExperimentsProvider';

// const linkTo = (dest: string) =>
//   Linking.openURL(`https://www.minds.com/${dest}`);

const onComplete = () => true;

interface ResourceType {
  onPress: () => void;
  name:
    | 'resources.rewards'
    | 'resources.tokens'
    | 'resources.earnings'
    | 'resources.analytics'
    | 'unlock.mindsPlus'
    | 'unlock.pro';
}

interface ContentType {
  name: 'create' | 'refer' | 'pool' | 'transfer';
  onPress: () => void;
  icon: string;
}

const EarnItem = ({ content }: { content: ContentType }) => {
  const theme = ThemedStyles.style;

  return (
    <TouchableOpacity
      style={[
        theme.rowJustifySpaceBetween,
        theme.paddingLeft5x,
        theme.paddingRight5x,
        theme.marginTop5x,
      ]}
      onPress={content.onPress}>
      <View style={[theme.rowJustifyStart, theme.alignCenter]}>
        <Icon
          name={content.icon}
          color={ThemedStyles.getColor('PrimaryText')}
          size={20}
          style={[theme.centered, theme.marginRight3x]}
        />
        <MText style={[theme.fontL, theme.colorPrimaryText, theme.bold]}>
          {i18n.t(`earnScreen.${content.name}.title`)}
        </MText>
      </View>
      <Icon
        name={'chevron-right'}
        color={ThemedStyles.getColor('SecondaryText')}
        size={24}
      />
    </TouchableOpacity>
  );
};

const ResourceItem = ({ content }: { content: ResourceType }) => {
  const theme = ThemedStyles.style;

  return (
    <TouchableOpacity
      style={[
        theme.rowJustifySpaceBetween,
        theme.paddingLeft5x,
        theme.paddingRight5x,
        theme.marginTop5x,
      ]}
      onPress={content.onPress}>
      <MText style={[theme.fontL, theme.colorSecondaryText, theme.fontMedium]}>
        {i18n.t(`earnScreen.${content.name}`)}
      </MText>
      <Icon
        name={'chevron-right'}
        color={ThemedStyles.getColor('SecondaryText')}
        size={24}
      />
    </TouchableOpacity>
  );
};

export default withErrorBoundaryScreen(
  observer(function ({ navigation }) {
    const theme = ThemedStyles.style;
    const localStore = useLocalStore(createLocalStore);
    const IOS_IAP_ENABLED = useIsFeatureOn('mob-4990-iap-subscription-ios');

    useEffect(() => {
      const settings = mindsConfigService.getSettings();
      localStore.setTokenAddress(settings.blockchain.token.address);
    }, [localStore]);

    const navTo = (screen: string, options = {}) =>
      navigation.navigate(screen, options);

    const openWithdrawal = () => navigation.navigate('WalletWithdrawal');

    const affiliatesEnabled = useIsFeatureOn('epic-304-affiliates');

    const earnItems: ContentType[] = [
      {
        name: 'create',
        icon: 'plus-box',
        onPress: () => navTo('Compose', { mode: 'text', start: true }),
      },
      {
        name: 'refer',
        icon: 'account-multiple',
        onPress: () =>
          affiliatesEnabled ? navTo('AffiliateProgram') : navTo('Referrals'),
      },
    ];

    if (LIQUIDITY_ENABLED) {
      earnItems.unshift({
        name: 'pool',
        icon: 'plus-circle-outline',
        onPress: localStore.toggleUniswapWidget,
      });
    }

    if (ONCHAIN_ENABLED) {
      earnItems.push({
        name: 'transfer',
        icon: 'swap-horizontal',
        onPress: openWithdrawal,
      });
    }

    const resourcesItems: ResourceType[] = [
      // {
      //   name: 'resources.rewards',
      //   onPress: () => linkTo('rewards'),
      // },
      // {
      //   name: 'resources.tokens',
      //   onPress: () => linkTo('token'),
      // },
      {
        name: 'resources.earnings',
        onPress: () => navTo('Wallet'),
      },
      {
        name: 'resources.analytics',
        onPress: () => navTo('Analytics'),
      },
    ];

    const unlockItems: ResourceType[] = [
      {
        name: 'unlock.mindsPlus',
        onPress: () => navTo('UpgradeScreen', { onComplete, pro: false }),
      },
      {
        name: 'unlock.pro',
        onPress: () => navTo('UpgradeScreen', { onComplete, pro: true }),
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
          <MText style={titleStyle}>{i18n.t('earnScreen.increase')}</MText>
          {earnItems.map(item => (
            <EarnItem key={item.name} content={item} />
          ))}
          <MText style={[titleStyle, theme.paddingTop2x]}>
            {i18n.t('earnScreen.resources.title')}
          </MText>
          {resourcesItems.map(item => (
            <ResourceItem key={item.name} content={item} />
          ))}
          {IOS_IAP_ENABLED && (
            <>
              <MText style={[titleStyle, theme.paddingTop2x]}>
                {i18n.t('earnScreen.unlock.title')}
              </MText>
              {unlockItems.map(item => (
                <ResourceItem key={item.name} content={item} />
              ))}
            </>
          )}
        </ModalScreen>
        <UniswapWidget
          isVisible={localStore.showUniswapWidget}
          action={'add'}
          onCloseButtonPress={localStore.toggleUniswapWidget}
          tokenAddress={localStore.tokenAddress}
        />
      </>
    );
  }),
  'EarnModal',
);

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
