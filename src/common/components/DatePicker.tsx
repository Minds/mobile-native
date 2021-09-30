import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Icon } from '~ui/icons';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import MText from './MText';

type PropsType = {
  date?: Date;
  maximumDate?: Date;
  onConfirm(date: Date): void;
  containerStyle?: ViewStyle | ViewStyle[];
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
      style={[
        styles.container,
        theme.bcolorPrimaryBorder,
        props.containerStyle,
      ]}
      onPress={localStore.openPicker}
    >
      <View>
        <MText style={[theme.fontL, theme.colorSecondaryText]}>
          {i18n.t('wallet.date')}
        </MText>
        <MText style={styles.date}>{shownDate}</MText>
      </View>
      <Icon style={theme.centered} name="calendar" size="small" />
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
