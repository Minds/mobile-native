import React from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { Slider as ValueSlider } from 'react-native-elements';
import MText from '~/common/components/MText';
import ThemedStyles from '~/styles/ThemedStyles';
import { B2, B3, Row } from '../ui';

const THUMB_TOUCH_SIZE = {
  width: 80,
  height: 80,
};

type PropsType = {
  title?: string;
  stepSize: number;
  defaultValue: number;
  currentValue: number;
  maximumRangeValue: number;
  minimumRangeValue: number;
  minimumStepLabel: string;
  maximumStepLabel: string;
  onAnswer: (number) => void;
  floatingLabel?: boolean;
  steps?: number[];
  formatValue?: (txt: number) => string;
};

const Slider = ({
  onAnswer,
  floatingLabel,
  steps,
  formatValue,
  ...props
}: PropsType) => {
  const value =
    typeof props.currentValue === 'number'
      ? props.currentValue
      : props.defaultValue;
  const completionPercentage =
    value === props.minimumRangeValue
      ? 0
      : (value / (props.maximumRangeValue || 100)) * 93;
  const labelSpacerStyle: StyleProp<ViewStyle> = {
    width: (completionPercentage + '%') as DimensionValue,
    maxWidth: '90%',
    height: 20,
    flexDirection: 'row',
    position: 'relative',
  };
  const formattedValue = formatValue ? formatValue(value) : value;

  const handleValueChange = (newValue: number) => {
    if (steps) {
      onAnswer(findClosest(steps, newValue));
    } else {
      onAnswer(newValue);
    }
  };

  return (
    <View style={styles.container}>
      {!!props.title && <MText style={styles.title}>{props.title}</MText>}
      {floatingLabel && (
        <Row top="S">
          <View style={labelSpacerStyle} />
          <B3 color="secondary" align="center">
            {formattedValue}
          </B3>
        </Row>
      )}

      <ValueSlider
        value={value}
        onValueChange={handleValueChange}
        thumbTintColor={ThemedStyles.getColor('PrimaryText')}
        minimumValue={props.minimumRangeValue || 0}
        allowTouchTrack={false}
        step={props.stepSize}
        maximumValue={props.maximumRangeValue || 100}
        thumbTouchSize={THUMB_TOUCH_SIZE}
        maximumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
        minimumTrackTintColor={ThemedStyles.getColor('Link')}
      />
      <View style={styles.textContainer} pointerEvents="none">
        <B2 color="secondary" font="regular">
          {props.minimumStepLabel}
        </B2>
        <B2 color="secondary" font="regular">
          {props.maximumStepLabel}
        </B2>
      </View>
    </View>
  );
};

const styles = ThemedStyles.create({
  container: ['marginBottom7x'],
  title: ['fontL', 'fontMedium'],
  textContainer: ['rowJustifySpaceBetween'],
  text: [{ fontSize: 13 }, 'fontMedium', 'colorSecondaryText'],
});

export default Slider;

function findClosest(arr: number[], num: number) {
  let minDiff = 1000;
  let ans;
  for (const i in arr) {
    var m = Math.abs(num - arr[i]);
    if (m < minDiff) {
      minDiff = m;
      ans = arr[i];
    }
  }
  return ans;
}
