import React from 'react';
import { View } from 'react-native';
import { Slider as ValueSlider } from 'react-native-elements';
import MText from '~/common/components/MText';
import ThemedStyles from '~/styles/ThemedStyles';

import i18n from '../../services/i18n.service';
import { IQuestion } from './useQuestions';

const THUMB_TOUCH_SIZE = {
  width: 80,
  height: 80,
};

type PropsType = {
  question: IQuestion;
  onAnswer: (number) => void;
};

const QuestionSlider = ({ question, onAnswer }: PropsType) => {
  return (
    <View style={styles.container}>
      <MText style={styles.title}>
        {i18n.tf(
          `discovery.customizeQuestions.${question.questionId}.title`,
          question.questionText,
        )}
      </MText>
      <ValueSlider
        value={
          typeof question.currentValue === 'number'
            ? question.currentValue
            : question.defaultValue
        }
        onSlidingComplete={onAnswer}
        thumbTintColor={ThemedStyles.getColor('Link')}
        minimumValue={question.minimumRangeValue || 0}
        allowTouchTrack={false}
        step={question.stepSize}
        trackStyle={trackStyle}
        maximumValue={question.maximumRangeValue || 100}
        thumbTouchSize={THUMB_TOUCH_SIZE}
        maximumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
        minimumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
      />
      <View style={styles.textContainer} pointerEvents="none">
        <MText style={styles.text}>
          {i18n.tf(
            `discovery.customizeQuestions.${question.questionId}.leftText`,
            question.minimumStepLabel,
          )}
        </MText>
        <MText style={styles.text}>
          {i18n.tf(
            `discovery.customizeQuestions.${question.questionId}.rightText`,
            question.maximumStepLabel,
          )}
        </MText>
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

const trackStyle = ThemedStyles.combine({ height: 1 });

export default QuestionSlider;
