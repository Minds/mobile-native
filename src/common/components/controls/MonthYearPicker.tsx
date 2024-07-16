import moment from 'moment';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { View } from 'react-native';
import ModernDatePicker from 'react-native-modern-datepicker';
import {
  BottomSheetButton,
  BottomSheetModal,
  BottomSheetModalHandle,
} from '../bottom-sheet';
import Delayed from '../Delayed';
import useModernTheme from './useModernTheme';
import sp from '~/services/serviceProvider';

export type MonthYearPickerHandle = {
  show: () => void;
  dismiss: () => void;
};

export type MonthYearPickerProps = {
  onChange: (date: Date) => void;
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
};

const MonthYearPicker: ForwardRefRenderFunction<
  MonthYearPickerHandle,
  MonthYearPickerProps
> = ({ value, onChange, minimumDate, maximumDate }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModalHandle>(null);
  const theme = useModernTheme();

  const onMonthYearChange = useCallback(
    selectedDate => {
      const date = new Date();
      const [year, month] = selectedDate.split(' ');
      date.setFullYear(year);
      date.setMonth(month - 1);
      onChange(date);
    },
    [onChange],
  );

  const onClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: () => bottomSheetRef.current?.present(),
      dismiss: () => bottomSheetRef.current?.dismiss(),
    }),
    [bottomSheetRef],
  );

  return (
    <BottomSheetModal ref={bottomSheetRef}>
      <View style={fixedHeightStyle}>
        <Delayed delay={0}>
          <ModernDatePicker
            options={theme}
            mode="monthYear"
            selected={value}
            selectorStartingYear={1900}
            selectorEndingYear={2100}
            minimumDate={moment(minimumDate).format('YYYY-MM-DD')}
            maximumDate={moment(maximumDate).format('YYYY-MM-DD')}
            onMonthYearChange={onMonthYearChange}
          />
        </Delayed>
      </View>

      <BottomSheetButton text={sp.i18n.t('close')} onPress={onClose} />
    </BottomSheetModal>
  );
};

const fixedHeightStyle = { height: 400 };

export default forwardRef(MonthYearPicker);
