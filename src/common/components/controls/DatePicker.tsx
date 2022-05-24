import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { Keyboard, ViewStyle } from 'react-native';
import i18n from '../../services/i18n.service';
import { B1, B2, Column, Icon, PressableLine, Row } from '~ui';
import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { UIUnitType } from '~/styles/Tokens';
import useModernTheme from './useModernTheme';

type PropsType = {
  hideTitle?: boolean;
  noHorizontal?: boolean;
  spacing?: UIUnitType;
  date?: Date | null;
  maximumDate?: Date;
  minimumDate?: Date;
  onConfirm(date: Date): void;
  containerStyle?: ViewStyle | ViewStyle[];
};

const DatePicker = observer((props: PropsType) => {
  const ref = React.useRef<BottomSheetModalType>(null);
  const todaysDate = new Date().toISOString().substring(0, 10);
  const theme = useModernTheme();

  const localStore = useLocalStore(
    (p: PropsType) => ({
      selectedDate: p.date,
      get textDate() {
        return localStore.selectedDate
          ? localStore.selectedDate.toISOString().substring(0, 10)
          : '';
      },
      openPicker() {
        // we dismiss the keyboard in case it is open
        Keyboard.dismiss();
        ref.current?.present();
      },
      closePicker() {
        ref.current?.close();
      },
      setDate(calendarDate) {
        localStore.selectedDate = new Date(calendarDate.dateString);
      },
      setRawDate(date) {
        localStore.selectedDate = date;
      },
      onConfirm() {
        ref.current?.dismiss();
      },
      send() {
        if (p && p.onConfirm && localStore.selectedDate) {
          p.onConfirm(localStore.selectedDate);
        }
      },
    }),
    props,
  );

  React.useEffect(() => {
    if (props.date && props.date !== localStore.selectedDate) {
      localStore.setRawDate(props.date);
    }
  }, [localStore, props.date]);

  const shownDate = !localStore.selectedDate
    ? ''
    : todaysDate === localStore.textDate
    ? i18n.t('wallet.today')
    : i18n.date(localStore.selectedDate, 'date', 'UTC');

  const space = props.spacing || 'L';

  return (
    <PressableLine onPress={localStore.openPicker} style={props.containerStyle}>
      <Row flex>
        <Row
          flex
          space={!props.noHorizontal ? space : undefined}
          vertical={props.noHorizontal ? space : undefined}>
          <Column stretch>
            {!props.hideTitle && (
              <B2 color="secondary">{i18n.t('wallet.date')}</B2>
            )}
            <B1 font="medium">{shownDate}</B1>
          </Column>
          <Row align="centerBoth">
            <Icon name="calendar" size="small" />
          </Row>
        </Row>
      </Row>
      <BottomSheetModal ref={ref} onDismiss={localStore.send}>
        <Calendar
          current={localStore.textDate}
          maxDate={props.maximumDate}
          minDate={props.minimumDate}
          markedDates={{
            [localStore.textDate]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
          onDayPress={localStore.setDate}
          theme={theme}
        />
        <BottomSheetButton
          text={i18n.t('done')}
          onPress={localStore.onConfirm}
        />
      </BottomSheetModal>
    </PressableLine>
  );
});

export default DatePicker;
