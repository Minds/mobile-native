import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment-timezone';

type PropsType = {
  minimumDate: Date;
  maximumDate: Date;
  containerStyle: any;
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
    },
  }));

  return (
    <View style={[theme.rowJustifySpaceBetween, props.containerStyle]}>
      <View>
        <Text style={[styles.label, theme.colorSecondaryText]}>Month</Text>
        <Text style={[theme.fontLM]}>
          {moment(localStore.date).format('MM-YYYY')}
        </Text>
      </View>
      <Icon
        name="calendar"
        size={24}
        color={ThemedStyles.getColor('secondary_text')}
        onPress={localStore.openPicker}
        style={theme.centered}
      />
      {localStore.showPicker && (
        <MonthPicker
          onChange={localStore.onValueChange}
          value={localStore.date}
          minimumDate={new Date()}
          maximumDate={new Date(2025, 5)}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default MonthPickerInput;
