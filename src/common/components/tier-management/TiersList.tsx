import { observer } from 'mobx-react';
import React from 'react';
import { TierStoreType } from '~/compose/PosterOptions/monetize/MembershipMonetizeScreen';
import { SupportTiersType } from '~/wire/WireTypes';
import MenuItem from '../menus/MenuItem';

import { navToTierScreen } from './TierManagementScreen';
import Empty from '~/common/components/Empty';
import { Button } from '~ui';
import sp from '~/services/serviceProvider';

type PropsType = {
  tiers: SupportTiersType[];
  useForSelection: boolean;
  tierStore: TierStoreType | undefined;
  tierManagementStore: any;
  navigation: any;
  onLinkPress: () => void;
};

const TiersList = observer(
  ({
    tiers,
    useForSelection,
    tierStore,
    tierManagementStore,
    navigation,
    onLinkPress,
  }: PropsType) => {
    const theme = sp.styles.style;
    const i18n = sp.i18n;
    if (!tiers || tiers.length === 0) {
      return (
        <Empty
          title={i18n.t('settings.noTiersTitle')}
          subtitle={i18n.t('settings.noTiersSubTitle')}>
          <Button
            onPress={onLinkPress}
            mode="outline"
            type="action"
            size="large"
            align="center">
            {i18n.t('settings.addFirstTier')}
          </Button>
        </Empty>
      );
    }

    return (
      <>
        {tiers.map(tier => (
          <MenuItem
            key={tier.guid}
            title={tier.name}
            label={`$${tier.usd}+ / mth`}
            onPress={
              useForSelection && tierStore
                ? () => tierStore.setSelectedTier(tier)
                : () => navToTierScreen(navigation, tier, tierManagementStore)
            }
            icon={useForSelection ? 'check' : undefined}
            iconColor={
              useForSelection && tier !== tierStore?.selectedTier
                ? 'PrimaryBackground'
                : undefined
            }
            containerItemStyle={theme.bgPrimaryBackground}
          />
        ))}
      </>
    );
  },
);

export default TiersList;
