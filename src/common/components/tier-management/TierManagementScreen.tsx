import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import i18n from '../../services/i18n.service';
import { ScrollView } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import { TierStoreType } from '../../../compose/PosterOptions/monetize/MembershipMonetizeScreen';

import supportTiersService from '../../services/support-tiers.service';
import CenteredLoading from '../CenteredLoading';
import createTierManagementStore from './createTierManagementStore';
import TiersList from './TiersList';
import { SupportTiersType } from '../../../wire/WireTypes';
import Header from './Header';
import { withErrorBoundaryScreen } from '../ErrorBoundaryScreen';

export type PaymentType = 'usd' | 'tokens';

type PropsType = {
  route: any;
  navigation: any;
  tierStore?: TierStoreType;
};

export const navToTierScreen = (
  navigation: any,
  tier: SupportTiersType | boolean = false,
  localStore:
    | ReturnType<typeof createTierManagementStore>
    | undefined = undefined,
) => {
  navigation.push('TierScreen', { tier, tierManagementStore: localStore });
};

const TierManagementScreen = observer(
  ({ route, navigation, tierStore }: PropsType) => {
    const localStore = useLocalStore(createTierManagementStore);

    const useForSelection = !!route.params?.useForSelection;

    useEffect(() => {
      const getTiers = async () => {
        const support_tiers = await supportTiersService.getAllFromUser();
        if (support_tiers) {
          localStore.setSupportTIers(support_tiers);
        }
      };
      if (!tierStore) {
        getTiers();
      } else {
        localStore.setSupportTIers(tierStore.supportTiers);
      }
    }, [localStore, tierStore]);

    if (!localStore.loaded) {
      return <CenteredLoading />;
    }

    return (
      <ScrollView
        contentContainerStyle={
          localStore.support_tiers.length === 0
            ? ThemedStyles.style.flexContainer
            : null
        }>
        {localStore.support_tiers.length > 0 && (
          <Header
            labelText={i18n.t('monetize.membershipMonetize.label')}
            onLinkPress={() => navToTierScreen(navigation, false, localStore)}
          />
        )}

        <TiersList
          tiers={localStore.support_tiers}
          useForSelection={useForSelection}
          tierStore={tierStore}
          tierManagementStore={localStore}
          navigation={navigation}
          onLinkPress={() => navToTierScreen(navigation, false, localStore)}
        />
      </ScrollView>
    );
  },
);

export default withErrorBoundaryScreen(
  TierManagementScreen,
  'TierManagementScreen',
);
