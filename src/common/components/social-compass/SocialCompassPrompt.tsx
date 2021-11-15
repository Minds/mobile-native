import React, { useEffect, useState } from 'react';
import MText from '~/common/components/MText';
import storageService from '~/common/services/storage.service';
import { Column, IconButtonNext } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { BottomSheetModal } from '../../components/bottom-sheet';
import Button from '../../components/Button';
import i18n from '../../services/i18n.service';
import Questions from './Questions';
import { useQuestions } from './useQuestions';

type PropsType = {};

const SOCIAL_COMPASS_QUESTIONNAIRE_DISMISSED_KEY =
  'social-compass-questionnaire:dismissed';

const SocialCompassPrompt = ({}: PropsType) => {
  const ref = React.useRef<any>();
  const { result: questionsResult, loading } = useQuestions();
  const [dismissed, setDismissed] = useState<boolean | undefined>(undefined);

  // #region methods
  const showSheet = React.useCallback(() => {
    ref.current?.present();
  }, []);
  const dismiss = React.useCallback(async () => {
    await storageService.setItem(
      SOCIAL_COMPASS_QUESTIONNAIRE_DISMISSED_KEY,
      true,
    );
    setDismissed(true);
  }, []);
  // #endregion

  // determine whether we've already answered the questions or not
  useEffect(() => {
    if (!questionsResult) {
      return;
    }

    if (questionsResult.answersProvided) {
      setDismissed(true);
    } else {
      storageService
        .getItem(SOCIAL_COMPASS_QUESTIONNAIRE_DISMISSED_KEY)
        .then(_dismissed => setDismissed(Boolean(_dismissed)));
    }
  }, [questionsResult]);

  if (dismissed !== false) {
    return null;
  }

  return (
    <Column vertical="L" horizontal="L">
      <Column align="center" vertical="XL">
        <MText style={styles.title}>
          {i18n.t('socialCompass.promptTitle')}
        </MText>
        <MText style={styles.desc}>{i18n.t('socialCompass.promptDesc')}</MText>
        <Button
          text={i18n.t('socialCompass.callToAction')}
          action
          onPress={showSheet}
          testID="customizeBtn"
        />
      </Column>
      <IconButtonNext
        name="close"
        onPress={dismiss}
        style={ThemedStyles.style.positionAbsoluteTopRight}
      />
      <BottomSheetModal ref={ref} title={i18n.t('socialCompass.callToAction')}>
        <Questions
          questions={questionsResult?.questions}
          loading={loading}
          onSubmit={dismiss}
        />
      </BottomSheetModal>
    </Column>
  );
};

const styles = ThemedStyles.create({
  title: ['colorPrimaryText', 'fontLM', 'fontMedium', 'marginBottom'],
  titleXL: ['colorPrimaryText', 'fontXXL', 'fontMedium', 'marginBottom4x'],
  desc: [
    'colorSecondaryText',
    { fontSize: 15 },
    'marginBottom4x',
    'textCenter',
  ],
});

export default SocialCompassPrompt;
