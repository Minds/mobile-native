import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { View } from 'react-native';
import i18n from '../../services/i18n.service';
import ThemedStyles, { useStyle } from '~/styles/ThemedStyles';
import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import ModernDatePicker from 'react-native-modern-datepicker';
import { Calendar } from 'react-native-calendars';
import MText from '~/common/components/MText';
import { useDimensions } from '@react-native-community/hooks';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import moment from 'moment';
import useModernTheme from './useModernTheme';

type PropsType = {
  date?: Date | null;
  maximumDate?: Date;
  minimumDate?: Date;
  onDateSelected(date: Date): void;
};

const DateTimePicker = observer(
  forwardRef((props: PropsType, ref) => {
    const bottomSheetRef = React.useRef<BottomSheetModalType>(null);
    const timePickerRef = React.useRef<any>(null);
    const width = useDimensions().window.width;
    const theme = useModernTheme();

    const localStore = useLocalStore(
      (p: PropsType) => ({
        selectedDate: p.date,
        pickerState: 'date',
        get textDate() {
          if (!p.date) return '';

          return moment(p.date).format('YYYY-MM-DD');
        },
        setPickerState(state: 'time' | 'date') {
          this.pickerState = state;
        },
        openPicker() {
          bottomSheetRef.current?.present();
        },
        setDate(calendarDate) {
          localStore.selectedDate = moment(calendarDate.dateString).toDate();
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
          this.pickerState = 'date';
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
              current={localStore.textDate}
              confirmButtonVisible={false}
              options={theme}
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
