import React from 'react';
import i18n from '~/common/services/i18n.service';
import { RadioButton } from '../bottom-sheet';
import DateRangePicker, { DateRangePickerPropsType } from './DateRangePicker';

type PropsType = {
  filtered: boolean;
  clear?: () => void;
} & Omit<DateRangePickerPropsType, 'inputComponent'>;

export default function DateRangeFilter(props: PropsType) {
  const { filtered, ...rest } = props;

  const Component = React.useCallback(
    ({ text }) => (
      <RadioButton
        selected={filtered}
        title={i18n.t('range', { range: ': ' + text })}
      />
    ),
    [filtered],
  );
  return (
    <>
      <RadioButton
        selected={!filtered}
        title={i18n.t('discovery.filters.all')}
        onPress={props.clear}
      />
      <DateRangePicker {...rest} inputComponent={Component} />
    </>
  );
}
