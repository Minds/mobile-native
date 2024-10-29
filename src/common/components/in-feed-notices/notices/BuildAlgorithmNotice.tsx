import { observer } from 'mobx-react-lite';
import React from 'react';
import { BottomSheetModal } from '~/common/components/bottom-sheet';
import InFeedNotice from './BaseNotice';
import Questions from '../../social-compass/Questions';
import { useQuestions } from '../../social-compass/useQuestions';
import { NoticeProps } from '.';
import sp from '~/services/serviceProvider';

/**
 * Build Your Algorithm Notice
 */
function BuildAlgorithm({ name }: NoticeProps) {
  const ref = React.useRef<any>();
  const { result: questionsResult, loading } = useQuestions();
  const inFeedNoticesService = sp.resolve('inFeedNotices');
  const i18n = sp.i18n;
  if (!inFeedNoticesService.visible(name)) {
    return null;
  }

  const onSubmit = () => {
    ref.current.dismiss();
    inFeedNoticesService.load();
  };

  return (
    <>
      <BottomSheetModal ref={ref} title={i18n.t('socialCompass.promptTitle')}>
        <Questions
          questions={questionsResult?.questions}
          loading={loading}
          onSubmit={onSubmit}
        />
      </BottomSheetModal>
      <InFeedNotice
        name={name}
        title={i18n.t('socialCompass.promptTitle')}
        description={i18n.t('socialCompass.promptDesc')}
        btnText={i18n.t('socialCompass.callToAction')}
        iconName="info-outline"
        onPress={ref.current?.present}
      />
    </>
  );
}

export default observer(BuildAlgorithm);
