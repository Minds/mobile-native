import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
// import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment-timezone';
import { Icon, PressableLine, HairlineRow, B1, B2, Column, Row } from '~ui';

type PropsType = {
  minimumDate: Date;
  maximumDate: Date;
  containerStyle?: any;
  onConfirm(date: Date): void;
};

const MonthPickerInput = observer((props: PropsType) => {
  const localStore = useLocalStore(() => ({
    date: new Date(),
    showPicker: false,
    setDate(date: Date) {
      this.date = date;
    },
    openPicker() {
      this.showPicker = true;
    },
    closePicker() {
      this.showPicker = false;
    },
    onValueChange(event, newDate: Date) {
      const selectedDate = newDate || this.date;
      this.closePicker();
      this.setDate(selectedDate);
      props.onConfirm(selectedDate);
    },
  }));

  return (
    <>
      <PressableLine
        onPress={localStore.openPicker}
        containerStyle={props.containerStyle}>
        <HairlineRow flex>
          <Row align="centerStart" flex space="L">
            <Column stretch>
              <B2 color="secondary">Month</B2>
              <B1 font="medium">{moment(localStore.date).format('MM-YYYY')}</B1>
            </Column>
            <Icon name="calendar" size="small" />
          </Row>
        </HairlineRow>
      </PressableLine>
      {/* {localStore.showPicker && (
        <MonthPicker
          onChange={localStore.onValueChange}
          value={localStore.date}
          minimumDate={props.minimumDate}
          maximumDate={props.maximumDate}
        />
      )} */}
    </>
  );
});

export default MonthPickerInput;
