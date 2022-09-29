import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import { SectionTitle, RadioButton } from '~/common/components/bottom-sheet';
import { Spacer } from '~ui';
import BaseFeedFilter from '~/common/components/feed-filters/BaseFeedFilter';
import i18nService from '~/common/services/i18n.service';

export type SupermindFilterType = 'pending' | 'accepted' | 'expired' | 'failed';

type PropsType = {
  hideLabel?: boolean;
  onFilterChange: (value: SupermindFilterType) => void;
  value: SupermindFilterType;
  containerStyles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

/**
 * Supermind Feed Filter selector
 */
const SupermindConsoleFeedFilter = ({
  onFilterChange,
  value,
  ...otherProps
}: PropsType) => {
  const { dismiss } = useBottomSheetModal();

  const onChange = v => {
    onFilterChange(v);
    dismiss();
  };

  return (
    <BaseFeedFilter
      label={i18nService.t(`supermind.filter.${value}`)}
      {...otherProps}>
      <SectionTitle>Filter Supermind Offers</SectionTitle>
      <RadioButton
        testID="PendingRadio"
        title="Pending"
        onPress={() => onChange('pending')}
        selected={value === 'pending'}
      />
      <RadioButton
        title="Accepted"
        testID="AcceptedRadio"
        onPress={() => onChange('accepted')}
        selected={value === 'accepted'}
      />
      <RadioButton
        title="Expired"
        testID="ExpiredRadio"
        onPress={() => onChange('expired')}
        selected={value === 'expired'}
      />
      <RadioButton
        title="Failed"
        testID="FailedRadio"
        onPress={() => onChange('failed')}
        selected={value === 'failed'}
      />
      <Spacer top="L" />
    </BaseFeedFilter>
  );
};

export default observer(SupermindConsoleFeedFilter);
