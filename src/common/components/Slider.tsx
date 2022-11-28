import React from 'react';
import { View } from 'react-native';
import { Slider as ValueSlider } from 'react-native-elements';
import MText from '~/common/components/MText';
import ThemedStyles from '~/styles/ThemedStyles';

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
};

const Slider = ({ onAnswer, ...props }: PropsType) => {
  return (
    <View style={styles.container}>
      {!!props.title && <MText style={styles.title}>{props.title}</MText>}
      <ValueSlider
        value={
          typeof props.currentValue === 'number'
            ? props.currentValue
            : props.defaultValue
        }
        // onSlidingComplete={onAnswer}
        onValueChange={onAnswer}
        thumbTintColor={ThemedStyles.getColor('Link')}
        minimumValue={props.minimumRangeValue || 0}
        allowTouchTrack={false}
        step={props.stepSize}
        trackStyle={trackStyle}
        maximumValue={props.maximumRangeValue || 100}
        thumbTouchSize={THUMB_TOUCH_SIZE}
        maximumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
        minimumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
      />
      <View style={styles.textContainer} pointerEvents="none">
        <MText style={styles.text}>{props.minimumStepLabel}</MText>
        <MText style={styles.text}>{props.maximumStepLabel}</MText>
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

const trackStyle = { height: 1 };

export default Slider;
