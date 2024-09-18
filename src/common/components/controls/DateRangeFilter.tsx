import React from 'react';
import { RadioButton } from '../bottom-sheet';
import DateRangePicker, { DateRangePickerPropsType } from './DateRangePicker';
import sp from '~/services/serviceProvider';

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
        title={sp.i18n.t('range', { range: ': ' + text })}
      />
    ),
    [filtered],
  );
  return (
    <>
      <RadioButton
        selected={!filtered}
        title={sp.i18n.t('discovery.filters.all')}
        onPress={props.clear}
      />
      <DateRangePicker {...rest} inputComponent={Component} />
    </>
  );
}
