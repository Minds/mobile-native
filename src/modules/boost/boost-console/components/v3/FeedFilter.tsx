import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { InteractionManager, ViewStyle } from 'react-native';
import { RadioButton } from '~/common/components/bottom-sheet';
import BaseFeedFilter from '~/common/components/feed-filters/BaseFeedFilter';
import { Spacer } from '~/common/ui';
import { useTranslation } from '../../../locales';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';
import { BoostStatus } from '../../types/BoostConsoleBoost';

function FeedFilter({ containerStyles }: { containerStyles: ViewStyle }) {
  const { dismiss } = useBottomSheetModal();
  const { t } = useTranslation();
  const boostConsoleStore = useBoostConsoleStore();

  const textMapping = {
    all: t('All'),
    [BoostStatus.PENDING]: t('Pending'),
    [BoostStatus.APPROVED]: t('Approved'),
    [BoostStatus.COMPLETED]: t('Completed'),
    [BoostStatus.REJECTED]: t('Rejected'),
  };

  const options = React.useMemo(
    () =>
      [
        'all',
        BoostStatus.PENDING,
        BoostStatus.APPROVED,
        BoostStatus.COMPLETED,
        BoostStatus.REJECTED,
      ].map(filter => ({
        title: textMapping[filter],
        onPress: () => {
          dismiss();
          InteractionManager.runAfterInteractions(() => {
            boostConsoleStore.setFeedFilter(filter as 'all' | BoostStatus);
          });
        },
        selected: boostConsoleStore.feedFilter === filter,
      })),
    [dismiss, boostConsoleStore, textMapping],
  );
  return (
    <BaseFeedFilter
      title={t('Boost status')}
      label={textMapping[boostConsoleStore.feedFilter]}
      containerStyles={containerStyles}>
      {options.map((props, i) => (
        <RadioButton {...props} key={i} />
      ))}
      <Spacer top="L" />
    </BaseFeedFilter>
  );
}

export default observer(FeedFilter);
