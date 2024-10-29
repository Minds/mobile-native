import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { ViewStyle } from 'react-native';
import moment from 'moment';

import { PressableLine } from '~ui';

import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { UIUnitType } from '~/styles/Tokens';
import useModernTheme from './useModernTheme';
import sp from '~/services/serviceProvider';

export type DateRangePickerPropsType = {
  spacing?: UIUnitType;
  startDate?: Date | null;
  endDate?: Date | null;
  maximumDate?: Date;
  minimumDate?: Date;
  onConfirm(startDate: Date, endDate: Date): void;
  containerStyle?: ViewStyle | ViewStyle[];
  inputComponent: ({ text }) => JSX.Element;
};

function generateDateRange(startDate, endDate) {
  const dates: Array<any> = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

/**
 * Date range picker component
 */
const DateRangePicker = observer((props: DateRangePickerPropsType) => {
  const ref = React.useRef<BottomSheetModalType>(null);
  const todaysDate = new Date().toISOString().substring(0, 10);
  const theme = useModernTheme();

  // Store --------------------------------------------------
  const localStore = useLocalStore(
    (p: DateRangePickerPropsType) => ({
      settingStart: true,
      startDate: p.startDate,
      endDate: p.endDate,
      confirmedText: '',
      get marks() {
        const color = sp.styles.getColor('Link');
        if (localStore.startDate && localStore.endDate) {
          const range = generateDateRange(
            localStore.startDate,
            localStore.endDate,
          );
          const marks = {};
          range.forEach((date, index) => {
            marks[date.toISOString().substring(0, 10)] = {
              startingDay: index === 0,
              endingDay: index === range.length - 1,
              textColor: 'white',
              color,
            };
          });
          return marks;
        }
        return localStore.textStartDate
          ? {
              [localStore.textStartDate]: {
                startingDay: true,
                endingDay: true,
                disableTouchEvent: true,
                color,
              },
            }
          : undefined;
      },
      get textStartDate() {
        return localStore.startDate
          ? localStore.startDate.toISOString().substring(0, 10)
          : '';
      },
      get textEndDate() {
        return localStore.endDate
          ? localStore.endDate.toISOString().substring(0, 10)
          : '';
      },
      openPicker() {
        ref.current?.present();
      },
      closePicker() {
        ref.current?.close();
      },
      setDate(calendarDate) {
        if (localStore.settingStart) {
          localStore.setStartDate(calendarDate);
        } else {
          localStore.setEndDate(calendarDate);
        }
        localStore.settingStart = !localStore.settingStart;
      },
      setStartDate(calendarDate) {
        localStore.startDate = new Date(calendarDate.dateString);
        if (localStore.endDate && localStore.endDate < localStore.startDate) {
          localStore.endDate = null;
        }
      },
      setRawStartDate(date) {
        localStore.startDate = date;
      },
      setEndDate(calendarDate) {
        localStore.endDate = new Date(calendarDate.dateString);
        if (localStore.startDate && localStore.startDate > localStore.endDate) {
          localStore.startDate = null;
        }
      },
      setRawEndDate(date) {
        localStore.endDate = date;
      },
      onConfirm() {
        ref.current?.dismiss();
      },
      updateConfirmedText() {
        const shownStartDate = !localStore.startDate
          ? ''
          : todaysDate === localStore.textStartDate
          ? sp.i18n.t('wallet.today')
          : sp.i18n.date(localStore.startDate, 'date', 'UTC');

        const shownEndDate = !localStore.endDate
          ? ''
          : todaysDate === localStore.textEndDate
          ? sp.i18n.t('wallet.today')
          : sp.i18n.date(localStore.endDate, 'date', 'UTC');
        localStore.confirmedText = shownStartDate + ' - ' + shownEndDate;
      },
      send() {
        if (p && localStore.startDate && localStore.endDate) {
          p.onConfirm(localStore.startDate, localStore.endDate);

          localStore.updateConfirmedText();
        }
      },
    }),
    props,
  );

  // Effects ------------------------------------------------
  React.useEffect(() => {
    if (props.startDate && props.startDate !== localStore.startDate) {
      localStore.setRawStartDate(props.startDate);
    }
    if (props.endDate && props.endDate !== localStore.endDate) {
      localStore.setRawEndDate(props.endDate);
    }
  }, [localStore, props.endDate, props.startDate]);

  React.useEffect(() => {
    if (localStore.startDate && localStore.endDate) {
      localStore.updateConfirmedText();
    }
  }, [localStore]);

  const maxDate = props.maximumDate
    ? moment(props.maximumDate).format('YYYY-MM-DD')
    : undefined;
  const minDate = props.minimumDate
    ? moment(props.minimumDate).format('YYYY-MM-DD')
    : undefined;

  const currentDate = localStore.endDate || localStore.startDate;

  const currentDateString = currentDate
    ? moment(currentDate).format('YYYY-MM-DD')
    : undefined;

  // Render -------------------------------------------------
  return (
    <PressableLine onPress={localStore.openPicker} style={props.containerStyle}>
      {<props.inputComponent text={localStore.confirmedText} />}
      <BottomSheetModal ref={ref} onDismiss={localStore.send}>
        <Calendar
          current={currentDateString}
          maxDate={maxDate}
          minDate={minDate}
          markedDates={localStore.marks}
          markingType={'period'}
          onDayPress={localStore.setDate}
          theme={theme}
        />
        <BottomSheetButton
          text={sp.i18n.t('done')}
          onPress={localStore.onConfirm}
        />
      </BottomSheetModal>
    </PressableLine>
  );
});

export default DateRangePicker;
