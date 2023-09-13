import moment from 'moment';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { InteractionManager, Keyboard, View, ViewStyle } from 'react-native';
import ModernDatePicker from 'react-native-modern-datepicker';
import i18n from '~/common/services/i18n.service';
import { UIUnitType } from '~/styles/Tokens';
import { B1, B2, Column, Icon, PressableLine, Row } from '~ui';
import {
  BottomSheetButton,
  BottomSheetModal,
  BottomSheetModalHandle,
} from '../bottom-sheet';
import useModernTheme from './useModernTheme';

export type DatePickerInputHandle = {
  show: () => void;
  dismiss: () => void;
};

export type DatePickerInputProps = {
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle | ViewStyle[];
  noHorizontal?: boolean;
  spacing?: UIUnitType;

  hideTitle?: boolean;
  date?: Date | null;
  onConfirm(date: Date): void;
};

const DatePickerInput: ForwardRefRenderFunction<
  DatePickerInputHandle,
  DatePickerInputProps
> = (
  {
    date: value,
    onConfirm: onChange,
    minimumDate = moment().subtract({ years: 150 }),
    maximumDate = moment(),
    ...props
  },
  ref,
) => {
  const bottomSheetRef = useRef<BottomSheetModalHandle>(null);
  const theme = useModernTheme();
  const todaysDate = new Date().toISOString().substring(0, 10);
  const space = props.spacing || 'L';
  const dateText = value ? value.toISOString().substring(0, 10) : '';
  const shownDate = !value
    ? ''
    : todaysDate === dateText
    ? i18n.t('wallet.today')
    : i18n.date(value, 'date', 'UTC');

  const show = useCallback(() => {
    // if the keyboard is shown dismiss it
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  const onDateChange = useCallback(
    selectedDate => {
      onChange(moment(selectedDate, 'YYYY/MM/DD').utc(true).toDate());
      InteractionManager.runAfterInteractions(() => {
        dismiss();
      });
    },
    [onChange, dismiss],
  );

  useImperativeHandle(
    ref,
    () => ({
      show,
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <PressableLine onPress={show} style={props.containerStyle}>
      <Row flex>
        <Row
          flex
          space={!props.noHorizontal ? space : undefined}
          vertical={props.noHorizontal ? space : undefined}>
          <Column stretch>
            {!props.hideTitle && (
              <B2 color="secondary">{i18n.t('wallet.date')}</B2>
            )}
            <B1 font="medium">{shownDate}</B1>
          </Column>
          <Row align="centerBoth">
            <Icon name="calendar" size="small" />
          </Row>
        </Row>
      </Row>
      <BottomSheetModal ref={bottomSheetRef}>
        <View style={fixedHeightStyle}>
          <ModernDatePicker
            options={theme}
            mode="calendar"
            selected={moment(value).format('YYYY-MM-DD')}
            current={moment(value).format('YYYY-MM-DD')}
            minimumDate={moment(minimumDate).format('YYYY-MM-DD')}
            maximumDate={moment(maximumDate).format('YYYY-MM-DD')}
            onDateChange={onDateChange}
          />
        </View>

        <BottomSheetButton text={i18n.t('close')} onPress={dismiss} />
      </BottomSheetModal>
    </PressableLine>
  );
};

const fixedHeightStyle = { height: 400 };

export default forwardRef(DatePickerInput);
