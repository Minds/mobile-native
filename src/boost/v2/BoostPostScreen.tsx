import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import { useStores } from '../../common/hooks/use-stores';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostHeader from './BoostHeader';
import createBoostStore from './createBoostStore';
import NewsfeedBoostTab from './NewsfeedBoostTab';
import OfferBoostTab from './OfferBoostTab';

type BoostTabType = 'newsfeed' | 'offer';

const tabs: Array<TabType<BoostTabType>> = [
  { id: 'newsfeed', title: i18n.t('boosts.tabNewsfeed') },
  { id: 'offer', title: i18n.t('boosts.tabOffers') },
];

const BoostPostScreen = observer(() => {
  const theme = ThemedStyles.style;
  const [tab, setTab] = useState<BoostTabType>('newsfeed');
  const wallet = useStores().wallet;
  const localStore = useLocalStore(createBoostStore, {
    wallet: wallet.wallet,
  });
  useEffect(() => {
    wallet.loadOffchainAndReceiver();
  }, [wallet]);
  const renderTab = () => {
    switch (tab) {
      case 'newsfeed':
        return <NewsfeedBoostTab localStore={localStore} />;

      case 'offer':
        return <OfferBoostTab localStore={localStore} />;
    }
  };
  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <BoostHeader title={i18n.t('boosts.boostPost')} />
      <View style={theme.marginTop7x}>
        <TopbarTabbar tabs={tabs} onChange={setTab} current={tab} />
      </View>
      {renderTab()}
    </View>
  );
});

export default BoostPostScreen;
