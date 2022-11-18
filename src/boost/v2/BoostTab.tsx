import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import StripeCardSelector from '../../common/components/stripe-card-selector/StripeCardSelector';
import i18n from '../../common/services/i18n.service';
import { B1 } from '../../common/ui';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostButton from './BoostButton';
import BoostInput from './BoostInput';
import type { BoostStoreType, BoostType } from './createBoostStore';
import TokenSelector from './TokenSelector';

type BoostTabProps = {
  localStore: BoostStoreType;
};

const BoostTab = ({ localStore }: BoostTabProps) => {
  const theme = ThemedStyles.style;
  const mapping: Record<BoostType, { title: string; description: string }> = {
    post: {
      title: 'Newsfeed',
      description: i18n.t('boosts.feedsDescription'),
    },
    channel: {
      title: 'Channel',
      description: i18n.t('boosts.feedsDescription'),
    },
    offer: {
      title: 'Offer',
      description: i18n.t('boosts.feedsDescription'),
    },
  };

  return (
    <View style={[theme.flexContainer, theme.marginTop5x]}>
      <View style={theme.marginBottom4x}>
        <B1 horizontal="L" bottom="S" color="secondary">
          {mapping[localStore.boostType].title}
        </B1>
        <B1 horizontal="L" bottom="XL">
          {mapping[localStore.boostType].description}
        </B1>
        <BoostInput localStore={localStore} />
        {localStore.payment === 'cash' ? (
          <StripeCardSelector
            selectedCardId={localStore.selectedCardId}
            onCardSelected={card => localStore.setSelectedCardId(card.id)}
          />
        ) : (
          <TokenSelector localStore={localStore} />
        )}
      </View>
      <BoostButton localStore={localStore} />
    </View>
  );
};

export default observer(BoostTab);
