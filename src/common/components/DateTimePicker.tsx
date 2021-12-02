import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { View, ViewStyle } from 'react-native';
import i18n from '../services/i18n.service';
import ThemedStyles from '~/styles/ThemedStyles';
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
    const localStore = useLocalStore(
      (p: PropsType) => ({
        selectedDate: p.date,
        pickerState: 'date',
        get textDate() {
          return p.date ? p.date.toISOString().substring(0, 10) : '';
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

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withTiming(localStore.pickerState === 'time' ? 1 : 0, {
            duration: 300,
          }),
        },
      ],
    }));
    const animatedStyle2 = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withTiming(localStore.pickerState === 'time' ? 0 : 1, {
            duration: 300,
          }),
        },
      ],
    }));
    const animatedStyle3 = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: withTiming(localStore.pickerState === 'time' ? 0 : 500, {
            duration: 300,
          }),
        },
      ],
    }));

    return (
      <BottomSheetModal ref={bottomSheetRef}>
        <View
          style={{
            height: 400,
          }}>
          <Animated.View
            style={[
              animatedStyle2,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                width,
              },
            ]}>
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

          <Animated.View
            style={[
              animatedStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                width,
              },
            ]}>
            <ModernDatePicker
              ref={timePickerRef}
              mode="time"
              confirmButtonVisible={false}
              options={{
                backgroundColor: ThemedStyles.getColor(
                  'PrimaryBackgroundHighlight',
                ),
                textHeaderColor: ThemedStyles.getColor('PrimaryText'),
                textDefaultColor: ThemedStyles.getColor('PrimaryText'),
                selectedTextColor: ThemedStyles.getColor('PrimaryText'),
                mainColor: ThemedStyles.getColor('Link'),
                textSecondaryColor: ThemedStyles.getColor('SecondaryText'),
                borderColor: 'rgba(122, 146, 165, 0.1)',
              }}
              minuteInterval={5}
            />
            <MText
              style={{
                position: 'absolute',
                top: 16,
                fontSize: 18,
                alignSelf: 'center',
              }}>
              {moment(localStore.selectedDate).format('MMMM Do')}
            </MText>
            <MText
              style={backButtonStyle}
              onPress={() => localStore.setPickerState('date')}>
              Back
            </MText>
          </Animated.View>
        </View>

        <Animated.View style={[animatedStyle3]}>
          <BottomSheetButton
            text={i18n.t('done')}
            onPress={() => localStore.onConfirm()}
          />
        </Animated.View>
      </BottomSheetModal>
    );
  }),
);

const backButtonStyle = ThemedStyles.combine('colorLink', 'fontL', {
  position: 'absolute',
  left: 16,
  top: 16,
});

export default DateTimePicker;
