import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Slider as ValueSlider } from 'react-native-elements';
import MText from '~/common/components/MText';

import { IQuestion } from './useQuestions';
import { IS_IOS } from '~/config/Config';
import sp from '~/services/serviceProvider';

const THUMB_TOUCH_SIZE = {
  width: 80,
  height: 80,
};

type PropsType = {
  question: IQuestion;
  onAnswer: (number) => void;
};

const QuestionSlider = ({ question, onAnswer }: PropsType) => {
  const slider = IS_IOS ? (
    <Slider
      style={styles.barView}
      thumbTintColor={sp.styles.getColor('Link')}
      value={
        typeof question.currentValue === 'number'
          ? question.currentValue
          : question.defaultValue
      }
      onSlidingComplete={onAnswer}
      minimumValue={question.minimumRangeValue || 0}
      step={question.stepSize}
      maximumValue={question.maximumRangeValue || 100}
      maximumTrackTintColor={sp.styles.getColor('PrimaryBorder')}
      minimumTrackTintColor={sp.styles.getColor('PrimaryBorder')}
    />
  ) : (
    <ValueSlider
      value={
        typeof question.currentValue === 'number'
          ? question.currentValue
          : question.defaultValue
      }
      onSlidingComplete={onAnswer}
      thumbTintColor={sp.styles.getColor('Link')}
      minimumValue={question.minimumRangeValue || 0}
      allowTouchTrack={false}
      step={question.stepSize}
      trackStyle={trackStyle}
      maximumValue={question.maximumRangeValue || 100}
      thumbTouchSize={THUMB_TOUCH_SIZE}
      maximumTrackTintColor={sp.styles.getColor('PrimaryBorder')}
      minimumTrackTintColor={sp.styles.getColor('PrimaryBorder')}
    />
  );

  const i18n = sp.i18n;

  return (
    <View style={styles.container}>
      <MText style={styles.title}>
        {i18n.tf(
          `socialCompass.customizeQuestions.${question.questionId}.title`,
          question.questionText,
        )}
      </MText>
      {slider}
      <View style={styles.textContainer} pointerEvents="none">
        <MText style={styles.text}>
          {i18n.tf(
            `socialCompass.customizeQuestions.${question.questionId}.leftText`,
            question.minimumStepLabel,
          )}
        </MText>
        <MText style={styles.text}>
          {i18n.tf(
            `socialCompass.customizeQuestions.${question.questionId}.rightText`,
            question.maximumStepLabel,
          )}
        </MText>
      </View>
    </View>
  );
};

const styles = sp.styles.create({
  container: ['marginBottom7x'],
  title: ['fontL', 'fontMedium'],
  textContainer: ['rowJustifySpaceBetween'],
  text: [{ fontSize: 13 }, 'fontMedium', 'colorSecondaryText'],
});

const trackStyle = { height: 1 };

export default QuestionSlider;
