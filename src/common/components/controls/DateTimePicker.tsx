import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import i18n from '../../services/i18n.service';
import ThemedStyles from '~/styles/ThemedStyles';
import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import ModernDatePicker from 'react-native-modern-datepicker';
import { Calendar } from 'react-native-calendars';
import MText from '~/common/components/MText';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import moment from 'moment';
import useModernTheme from './useModernTheme';
import Delayed from '../Delayed';

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

    const maxDate = props.maximumDate
      ? moment(props.maximumDate).format('YYYY-MM-DD')
      : undefined;
    const minDate = props.minimumDate
      ? moment(props.minimumDate).format('YYYY-MM-DD')
      : undefined;

    return (
      <BottomSheetModal ref={bottomSheetRef} enableDismissOnClose>
        <View style={styles.container}>
          {localStore.pickerState === 'date' ? (
            <Animated.View
              entering={FadeInRight}
              exiting={FadeOutLeft}
              style={ThemedStyles.style.flexContainer}>
              <Calendar
                current={localStore.textDate}
                maxDate={maxDate}
                minDate={minDate}
                markedDates={{
                  [localStore.textDate]: {
                    selected: true,
                  },
                }}
                onDayPress={localStore.setDate}
                theme={theme}
              />
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInRight}
              exiting={FadeOutLeft}
              style={ThemedStyles.style.flexContainer}>
              <Delayed delay={0}>
                <ModernDatePicker
                  ref={timePickerRef}
                  mode="time"
                  current={localStore.textDate}
                  confirmButtonVisible={false}
                  options={theme}
                  minuteInterval={5}
                />
              </Delayed>

              <MText style={styles.timePickerTitle}>
                {moment(localStore.selectedDate).format('MMMM Do')}
              </MText>
              <MText style={backButtonStyle} onPress={localStore.onBack}>
                Back
              </MText>
            </Animated.View>
          )}
        </View>

        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
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
