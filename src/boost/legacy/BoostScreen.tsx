import { RouteProp } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import useWalletConnect from '../../blockchain/v2/walletconnect/useWalletConnect';
import ModalScreen from '../../common/components/ModalScreen';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import { IS_IOS } from '../../config/Config';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostTab from './BoostTab';
import createBoostStore from './createBoostStore';

type BoostTabType = 'cash' | 'tokens';

type BoostScreenRouteProp = RouteProp<RootStackParamList, 'BoostScreen'>;

type BoostScreenProps = {
  route: BoostScreenRouteProp;
};

const BoostScreen = observer(({ route }: BoostScreenProps) => {
  const { entity, boostType } = route.params || {};
  const theme = ThemedStyles.style;
  const wallet = useStores().wallet;
  const wc = useWalletConnect();
  const localStore = useLocalStore(createBoostStore, {
    wc,
    wallet: wallet.wallet,
    entity: entity,
    boostType,
  });

  const tabs: Array<TabType<BoostTabType>> = [
    { id: 'cash', title: i18n.t('wallet.cash') },
    { id: 'tokens', title: i18n.t('tokens') },
  ];

  const titleMapping = {
    channel: i18n.t('boosts.boostChannel'),
    post: i18n.t('boosts.boostPost'),
    offer: i18n.t('boosts.boostOffer'),
  };

  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);

  return (
    <ModalScreen
      title={titleMapping[boostType]}
      source={require('../../assets/boostBG.png')}
      testID="BoostScreen">
      <BoostNote />
      <DismissKeyboard>
        {!IS_IOS && (
          <View style={theme.marginTop2x}>
            <TopbarTabbar
              tabs={tabs}
              onChange={localStore.setPayment}
              current={localStore.payment}
            />
          </View>
        )}

        <BoostTab localStore={localStore} />
      </DismissKeyboard>
    </ModalScreen>
  );
});

export default BoostScreen;

import Link from '~/common/components/Link';
import MText from '~/common/components/MText';
import openUrlService from '~/common/services/open-url.service';
import { Icon } from '~/common/ui';

function BoostNote() {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Icon name="info-circle" color="PrimaryText" size={32} />
        <MText style={styles.h3}>{i18n.t('boosts.boostChangingTitle')}</MText>
      </View>
      <MText style={styles.p}>
        {i18n.t('boosts.boostChangingText')}
        <Link
          onPress={() =>
            openUrlService.openLinkInInAppBrowser(
              'https://www.minds.com/info/blog/bid-farewell-the-boost-backlog-1445548466339057665',
            )
          }>
          {i18n.t('boosts.boostChangingLink')}
        </Link>
      </MText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  title: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    paddingLeft: 16,
  },
  p: {
    fontSize: 13,
    lineHeight: 16,
  },
});
