import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';

type PropsType = {
  date?: Date;
  maximumDate?: Date;
  onConfirm(date: Date): void;
};

const DatePicker = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
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
    <TouchableOpacity
      style={[styles.container, theme.borderPrimary]}
      onPress={localStore.openPicker}>
      <View>
        <Text style={[theme.fontL, theme.colorSecondaryText]}>
          {i18n.t('wallet.date')}
        </Text>
        <Text style={styles.date}>{shownDate}</Text>
      </View>
      <Icon
        name="calendar"
        size={21}
        color={ThemedStyles.getColor('secondary_text')}
        style={theme.centered}
      />
      <DateTimePicker
        isVisible={localStore.isVisible}
        onConfirm={localStore.onConfirm}
        date={props.date}
        maximumDate={props.maximumDate}
        onCancel={localStore.closePicker}
        mode="date"
        display="spinner"
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  date: {
    paddingTop: 1,
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});

export default DatePicker;
