import React from 'react';
import { observer } from 'mobx-react-lite';

import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import sessionService from '~/common/services/session.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import { TENANT } from '~/config/Config';

/**
 * Email Verify Notice
 */
function EmailVerifyNotice({ name }: NoticeProps) {
  const user = useCurrentUser();

  if (!inFeedNoticesService.visible(name) || user?.email_confirmed) {
    return null;
  }
  return (
    <InFeedNotice
      name={name}
      title={i18nService.t('onboarding.verifyEmailAddress')}
      description={i18nService.t('inFeedNotices.verifyEmailDescription', {
        TENANT,
      })}
      btnText={i18nService.t('inFeedNotices.verifyEmail')}
      iconName="warning"
      onPress={sessionService.getUser().confirmEmailCode}
    />
  );
}

export default observer(EmailVerifyNotice);
