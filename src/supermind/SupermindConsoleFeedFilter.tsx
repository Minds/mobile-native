import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import { SectionTitle, RadioButton } from '~/common/components/bottom-sheet';
import { Spacer } from '~ui';
import BaseFeedFilter from '~/common/components/feed-filters/BaseFeedFilter';
import sp from '~/services/serviceProvider';

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

  const i18n = sp.i18n;

  return (
    <BaseFeedFilter label={i18n.t(`supermind.filter.${value}`)} {...otherProps}>
      <SectionTitle>{i18n.t('supermind.filterTitle')}</SectionTitle>
      {Object.keys(filters).map((key, index) => (
        <RadioButton
          key={index}
          testID={`${key}Radio`}
          title={i18n.t(`supermind.filter.${key as SupermindFilterType}`)}
          onPress={() => onChange(key)}
          selected={value === key}
        />
      ))}
      <Spacer top="L" />
    </BaseFeedFilter>
  );
};

export default observer(SupermindConsoleFeedFilter);
