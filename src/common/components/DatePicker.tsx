import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { ViewStyle } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import i18n from '../services/i18n.service';
import { Icon, B1, B2, Row, Column, PressableLine, HairlineRow } from '~ui';

type PropsType = {
  date?: Date;
  maximumDate?: Date;
  onConfirm(date: Date): void;
  containerStyle?: ViewStyle | ViewStyle[];
};

const DatePicker = observer((props: PropsType) => {
  const localStore = useLocalStore(() => ({
    selectedDate: props.date || new Date(),
    isVisible: false,
    openPicker() {
      this.isVisible = true;
    },
    closePicker() {
      this.isVisible = false;
    },
    onConfirm(date: Date) {
      this.selectedDate = date;
      props.onConfirm(date);
      this.isVisible = false;
    },
  }));

  const shownDate =
    new Date().toDateString() === localStore.selectedDate.toDateString()
      ? i18n.t('wallet.today')
      : i18n.l('date.formats.small', localStore.selectedDate);

  return (
    <PressableLine
      onPress={localStore.openPicker}
      containerStyle={props.containerStyle}>
      <HairlineRow flex>
        <Row flex space="L">
          <Column stretch>
            <B2 color="secondary">{i18n.t('wallet.date')}</B2>
            <B1 font="medium">{shownDate}</B1>
          </Column>
          <Row align="centerBoth">
            <Icon name="calendar" size="small" />
          </Row>
          <DateTimePicker
            isVisible={localStore.isVisible}
            onConfirm={localStore.onConfirm}
            date={props.date}
            maximumDate={props.maximumDate}
            onCancel={localStore.closePicker}
            mode="date"
            display="spinner"
          />
        </Row>
      </HairlineRow>
    </PressableLine>
  );
});

export default DatePicker;
