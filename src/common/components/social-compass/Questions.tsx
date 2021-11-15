import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { BottomSheetButton } from '~/common/components/bottom-sheet';
import CenteredLoading from '~/common/components/CenteredLoading';
import { Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import QuestionSlider from './QuestionSlider';
import { useAnswers } from './useAnswers';
import { IQuestion, useQuestions } from './useQuestions';

type PropsType = {
  onSubmit: () => void;
};

const Questions = observer(({ onSubmit }: PropsType) => {
  const { result, loading } = useQuestions();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const { answer, loading: answering } = useAnswers(questions);
  const height = useDimensions().window.height;

  // #region effects
  useEffect(() => {
    if (result?.questions.length && !questions.length) {
      setQuestions(result?.questions);
    }
  }, [questions.length, result]);
  // #endregion

  // #region methods
  const onAnswer = useCallback(
    questionId => value => {
      setQuestions(
        questions.map(question => {
          if (question.questionId === questionId) {
            return {
              ...question,
              currentValue: value,
            };
          }

          return question;
        }),
      );
    },
    [questions],
  );

  const _onSubmit = useCallback(async () => {
    await answer();
    onSubmit();
  }, [answer, onSubmit]);
  // #endregion

  if (loading && !questions.length) {
    return <CenteredLoading />;
  }

  return (
    <>
      <ScrollView style={{ height: height * 0.7 }}>
        <Spacer horizontal="M">
          <Text style={styles.desc}>{i18n.t('discovery.questionsDesc')}</Text>
          {questions.map(question => (
            <QuestionSlider
              question={question}
              onAnswer={onAnswer(question.questionId)}
            />
          ))}
        </Spacer>
      </ScrollView>
      <BottomSheetButton
        loading={answering}
        action
        text="Continue"
        onPress={_onSubmit}
      />
    </>
  );
});

const styles = ThemedStyles.create({
  container: ['paddingVertical2x'],
  desc: ['colorSecondaryText', 'marginBottom5x'],
});

export default Questions;
