import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useWindowDimensions } from 'react-native';

import { showNotification } from 'AppMessages';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetButton } from '~/common/components/bottom-sheet';
import CenteredLoading from '~/common/components/CenteredLoading';
import { Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import FadeView from '../FadeView';
import MText from '../MText';
import QuestionSlider from './QuestionSlider';
import { useAnswers } from './useAnswers';
import { IQuestion } from './useQuestions';
import { TENANT } from '~/config/Config';

type PropsType = {
  onSubmit: () => void;
  questions?: IQuestion[];
  loading: boolean;
};

const gradients: any = ['bottom'];

const Questions = observer(({ onSubmit, ...props }: PropsType) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const { answer, loading: answering } = useAnswers(questions);
  const height = useWindowDimensions().height;
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
    showNotification(
      i18n.t('socialCompass.thanks', { TENANT }),
      'success',
      3000,
    );
    onSubmit();
  }, [answer, onSubmit]);
  // #endregion

  if (props.loading && !questions.length) {
    return <CenteredLoading />;
  }

  return (
    <>
      <FadeView
        fades={gradients}
        fadeLength={100}
        backgroundColor={ThemedStyles.getColor('PrimaryBackgroundHighlight')}>
        <BottomSheetScrollView style={containerHeight}>
          <Spacer horizontal="M" bottom="XL">
            <MText style={styles.desc}>
              {i18n.t('socialCompass.questionsDesc')}
            </MText>
            {questions.map(question => (
              <QuestionSlider
                key={question.questionId}
                question={question}
                onAnswer={onAnswer(question.questionId)}
              />
            ))}
          </Spacer>
        </BottomSheetScrollView>
      </FadeView>
      <BottomSheetButton
        loading={answering}
        action
        text={i18n.t('save')}
        onPress={_onSubmit}
      />
    </>
  );
});

const styles = ThemedStyles.create({
  container: ['paddingVertical2x'],
  desc: ['colorSecondaryText', 'marginBottom5x', 'textCenter'],
});

export default Questions;
