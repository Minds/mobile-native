import React, { useEffect, useState } from 'react';
import MText from '~/common/components/MText';
import storageService from '~/common/services/storage.service';
import { Column, IconButtonNext } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { BottomSheetModal } from '../../components/bottom-sheet';
import Button from '../../components/Button';
import i18n from '../../services/i18n.service';
import Questions from './Questions';

type PropsType = {};

const SOCIAL_COMPASS_QUESTIONNAIRE_DISMISSED_KEY =
  'social-compass-questionnaire:dismissed';

const Customize = ({}: PropsType) => {
  const ref = React.useRef<any>();
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

  useEffect(() => {
    storageService
      .getItem(SOCIAL_COMPASS_QUESTIONNAIRE_DISMISSED_KEY)
      .then(_dismissed => setDismissed(Boolean(_dismissed)));
  }, []);

  if (dismissed === true) {
    return null;
  }

  return (
    <Column vertical="L" horizontal="L">
      <Column align="center" vertical="XL">
        <MText style={styles.title}>{i18n.t('discovery.customizeTitle')}</MText>
        <MText style={styles.desc}>{i18n.t('discovery.customizeDesc')}</MText>
        <Button
          text={i18n.t('discovery.customize')}
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
      <BottomSheetModal ref={ref} title={'Content preferences'}>
        <Questions onSubmit={dismiss} />
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

export default Customize;
