import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import { SectionTitle, RadioButton } from '~/common/components/bottom-sheet';
import { Spacer } from '~ui';
import BaseFeedFilter from '~/common/components/feed-filters/BaseFeedFilter';
import i18nService from '~/common/services/i18n.service';

const filters = {
  all: 'all',
  pending: 'pending',
  accepted: 'accepted',
  revoked: 'revoked',
  declined: 'declined',
  failed: 'failed',
  paymentFailed: 'paymentFailed',
  expired: 'expired',
};

export type SupermindFilterType = keyof typeof filters;

type PropsType = {
  hideLabel?: boolean;
  onFilterChange: (filter: SupermindFilterType) => void;
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

  const onChange = filter => {
    onFilterChange(filter);
    dismiss();
  };

  return (
    <BaseFeedFilter
      label={i18nService.t(`supermind.filter.${value}`)}
      {...otherProps}>
      <SectionTitle>Filter Supermind Offers</SectionTitle>
      {Object.keys(filters).map((key, index) => (
        <RadioButton
          key={index}
          testID={`${key}Radio`}
          title={i18nService.t(
            `supermind.filter.${key as SupermindFilterType}`,
          )}
          onPress={() => onChange('pending')}
          selected={value === key}
        />
      ))}
      <Spacer top="L" />
    </BaseFeedFilter>
  );
};

export default observer(SupermindConsoleFeedFilter);
