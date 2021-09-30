import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedStyles from '~styles/ThemedStyles';
import { Icon } from '~ui/icons';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment-timezone';
import MText from './MText';

type PropsType = {
  minimumDate: Date;
  maximumDate: Date;
  containerStyle?: any;
  onConfirm(date: Date): void;
};

const MonthPickerInput = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
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
      <TouchableOpacity
        style={[theme.rowJustifySpaceBetween, props.containerStyle]}
        onPress={localStore.openPicker}
      >
        <View>
          <MText style={[styles.label, theme.colorSecondaryText]}>Month</MText>
          <MText style={[theme.fontLM, theme.fontMedium]}>
            {moment(localStore.date).format('MM-YYYY')}
          </MText>
        </View>
        <Icon name="calendar" size="small" style={theme.centered} />
      </TouchableOpacity>
      {localStore.showPicker && (
        <MonthPicker
          onChange={localStore.onValueChange}
          value={localStore.date}
          minimumDate={props.minimumDate}
          maximumDate={props.maximumDate}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default MonthPickerInput;
