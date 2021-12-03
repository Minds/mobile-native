import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import i18n from '../services/i18n.service';
import ThemedStyles, { useStyle } from '~/styles/ThemedStyles';
import { BottomSheetButton, BottomSheetModal } from './bottom-sheet';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import { UIUnitType } from '~/styles/Tokens';
import ModernDatePicker from '@manishoo/react-native-modern-datepicker';
import { Calendar } from 'react-native-calendars';
import MText from '~/common/components/MText';
import { useDimensions } from '@react-native-community/hooks';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import moment from 'moment';

type PropsType = {
  hideTitle?: boolean;
  noHorizontal?: boolean;
  spacing?: UIUnitType;
  date?: Date | null;
  maximumDate?: Date;
  minimumDate?: Date;
  onDateSelected(date: Date): void;
  containerStyle?: ViewStyle | ViewStyle[];
};

const DateTimePicker = observer(
  forwardRef((props: PropsType, ref) => {
    const bottomSheetRef = React.useRef<BottomSheetModalType>(null);
    const timePickerRef = React.useRef<any>(null);
    const width = useDimensions().window.width;
    const theme = React.useMemo(
      () => ({
        backgroundColor: ThemedStyles.getColor('PrimaryBackgroundHighlight'),
        calendarBackground: ThemedStyles.getColor('PrimaryBackgroundHighlight'),
        dayTextColor: ThemedStyles.getColor('PrimaryText'),
        textSectionTitleDisabledColor: ThemedStyles.getColor('TertiaryText'),
        textDisabledColor: ThemedStyles.getColor('TertiaryText'),
        textSectionTitleColor: ThemedStyles.getColor('SecondaryText'),
        indicatorColor: ThemedStyles.getColor('Link'),
        dotColor: ThemedStyles.getColor('Link'),
        selectedDayBackgroundColor: ThemedStyles.getColor('Link'),
        selectedDayTextColor: ThemedStyles.getColor(
          'PrimaryText',
          ThemedStyles.theme ? 0 : 1,
        ),
        monthTextColor: ThemedStyles.getColor('PrimaryText'),
        todayTextColor: ThemedStyles.getColor('Link'),
        arrowColor: ThemedStyles.getColor('Link'),
      }),
      [],
    );
    const timePickerOptions = useMemo(
      () => ({
        backgroundColor: ThemedStyles.getColor('PrimaryBackgroundHighlight'),
        textHeaderColor: ThemedStyles.getColor('PrimaryText'),
        textDefaultColor: ThemedStyles.getColor('PrimaryText'),
        selectedTextColor: ThemedStyles.getColor('PrimaryText'),
        mainColor: ThemedStyles.getColor('Link'),
        textSecondaryColor: ThemedStyles.getColor('SecondaryText'),
        borderColor: 'rgba(122, 146, 165, 0.1)',
      }),
      [],
    );
    const localStore = useLocalStore(
      (p: PropsType) => ({
        selectedDate: p.date,
        pickerState: 'date',
        get textDate() {
          console.log('p.date', p.date);
          if (!p.date) return '';

          const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
          return new Date(Number(p.date) - tzoffset)
            .toISOString()
            .substring(0, 10);
        },
        setPickerState(state: 'time' | 'date') {
          this.pickerState = state;
        },
        openPicker() {
          bottomSheetRef.current?.present();
        },
        closePicker() {
          bottomSheetRef.current?.close();
        },
        setDate(calendarDate) {
          localStore.selectedDate = new Date(calendarDate.dateString);
          this.pickerState = 'time';
        },
        setRawDate(date) {
          localStore.selectedDate = date;
        },
        onConfirm() {
          const date = timePickerRef.current?.getTime();
          if (date) {
            const [hour, minute] = date.split(':');
            localStore.selectedDate?.setHours(hour);
            localStore.selectedDate?.setMinutes(minute);
          }

          if (p && p.onDateSelected && localStore.selectedDate) {
            p.onDateSelected(localStore.selectedDate);
          }

          bottomSheetRef.current?.dismiss();
        },
        onBack() {
          this.pickerState = 'date';
        },
      }),
      props,
    );

    useImperativeHandle(ref, () => ({
      show: () => {
        localStore.openPicker();
      },
    }));

    React.useEffect(() => {
      if (props.date && props.date !== localStore.selectedDate) {
        localStore.setRawDate(props.date);
      }
    }, [localStore, props.date]);

    const timePickerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withTiming(localStore.pickerState === 'time' ? 1 : 0, {
            duration: 300,
          }),
        },
      ],
    }));
    const calendarAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withTiming(localStore.pickerState === 'time' ? 0 : 1, {
            duration: 300,
          }),
        },
      ],
    }));
    const bottomSheetButtonAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: withTiming(localStore.pickerState === 'time' ? 0 : 500, {
            duration: 300,
          }),
        },
      ],
    }));
    const viewStyle = useStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      width,
    });

    return (
      <BottomSheetModal ref={bottomSheetRef} enableDismissOnClose>
        <View style={styles.container}>
          <Animated.View style={[calendarAnimatedStyle, viewStyle]}>
            <Calendar
              current={localStore.textDate}
              maxDate={props.maximumDate}
              minDate={props.minimumDate}
              markedDates={{
                [localStore.textDate]: {
                  selected: true,
                },
              }}
              onDayPress={localStore.setDate}
              theme={theme}
            />
          </Animated.View>

          <Animated.View style={[timePickerAnimatedStyle, viewStyle]}>
            <ModernDatePicker
              ref={timePickerRef}
              mode="time"
              confirmButtonVisible={false}
              options={timePickerOptions}
              minuteInterval={5}
            />
            <MText style={styles.timePickerTitle}>
              {moment(localStore.selectedDate).format('MMMM Do')}
            </MText>
            <MText style={backButtonStyle} onPress={localStore.onBack}>
              Back
            </MText>
          </Animated.View>
        </View>

        <Animated.View style={bottomSheetButtonAnimatedStyle}>
          <BottomSheetButton
            text={i18n.t('done')}
            onPress={localStore.onConfirm}
          />
        </Animated.View>
      </BottomSheetModal>
    );
  }),
);

const styles = ThemedStyles.create({
  container: {
    height: 400,
  },
  timePickerTitle: {
    position: 'absolute',
    top: 16,
    fontSize: 18,
    alignSelf: 'center',
  },
});

const backButtonStyle = ThemedStyles.combine('colorLink', 'fontL', {
  position: 'absolute',
  left: 16,
  top: 16,
});

export default DateTimePicker;
