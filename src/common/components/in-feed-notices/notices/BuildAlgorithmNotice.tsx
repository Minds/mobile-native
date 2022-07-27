import { observer } from 'mobx-react-lite';
import React from 'react';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { BottomSheetModal } from '~/common/components/bottom-sheet';
import InFeedNotice from './BaseNotice';
import Questions from '../../social-compass/Questions';
import { useQuestions } from '../../social-compass/useQuestions';

/**
 * Build Your Algorithm Notice
 */
function BuildAlgorithm() {
  const ref = React.useRef<any>();
  const { result: questionsResult, loading } = useQuestions();
  if (!inFeedNoticesService.visible('build-your-algorithm')) {
    return null;
  }
  return (
    <>
      <BottomSheetModal
        ref={ref}
        title={i18nService.t('socialCompass.promptTitle')}>
        <Questions
          questions={questionsResult?.questions}
          loading={loading}
          onSubmit={inFeedNoticesService.load}
        />
      </BottomSheetModal>
      <InFeedNotice
        title={i18nService.t('socialCompass.promptTitle')}
        description={i18nService.t('socialCompass.promptDesc')}
        btnText={i18nService.t('socialCompass.callToAction')}
        iconName="info-outline"
        onPress={ref.current?.present}
        onClose={() => inFeedNoticesService.dismiss('build-your-algorithm')}
      />
    </>
  );
}

export default observer(BuildAlgorithm);
