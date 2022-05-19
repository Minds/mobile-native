import { observer, useLocalStore } from 'mobx-react';
import moment from 'moment-timezone';
import React, { useRef } from 'react';
import { B1, B2, Column, HairlineRow, Icon, PressableLine, Row } from '~ui';
import MonthPicker, { MonthPickerHandle } from './controls/MonthPicker';

type PropsType = {
  minimumDate: Date;
  maximumDate: Date;
  containerStyle?: any;
  onConfirm(date: Date): void;
};

const MonthPickerInput = observer((props: PropsType) => {
  const monthPickerRef = useRef<MonthPickerHandle>(null);
  const localStore = useLocalStore(() => ({
    date: new Date(),
    setDate(date: Date) {
      this.date = date;
    },
    openPicker() {
      monthPickerRef.current?.show();
    },
    closePicker() {
      monthPickerRef.current?.dismiss();
    },
    onValueChange(newDate: Date) {
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
      <MonthPicker
        ref={monthPickerRef}
        onChange={localStore.onValueChange}
        value={localStore.date}
        minimumDate={props.minimumDate}
        maximumDate={props.maximumDate}
      />
    </>
  );
});

export default MonthPickerInput;
