import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetButton } from '~/common/components/bottom-sheet';
import CenteredLoading from '~/common/components/CenteredLoading';
import { Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import MText from '../MText';
import QuestionSlider from './QuestionSlider';
import { useAnswers } from './useAnswers';
import { IQuestion } from './useQuestions';

type PropsType = {
  onSubmit: () => void;
  questions?: IQuestion[];
  loading: boolean;
};

const Questions = observer(({ onSubmit, ...props }: PropsType) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const { answer, loading: answering } = useAnswers(questions);
  const height = useDimensions().window.height;
  const containerHeight = useMemo(() => ({ height: height * 0.7 }), [height]);

  // #region effects
  useEffect(() => {
    if (props.questions?.length && !questions.length) {
      setQuestions(props.questions);
    }
  }, [questions.length, props.questions]);
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

  if (props.loading && !questions.length) {
    return <CenteredLoading />;
  }

  return (
    <>
      <BottomSheetScrollView style={containerHeight}>
        <Spacer horizontal="M">
          <MText style={styles.desc}>
            {i18n.t('socialCompass.questionsDesc')}
          </MText>
          {questions.map(question => (
            <QuestionSlider
              question={question}
              onAnswer={onAnswer(question.questionId)}
            />
          ))}
        </Spacer>
      </BottomSheetScrollView>
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
