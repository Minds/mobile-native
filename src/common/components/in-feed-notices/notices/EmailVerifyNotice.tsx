import React from 'react';
import { observer } from 'mobx-react-lite';

import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import { TENANT } from '~/config/Config';
import serviceProvider from '~/services/serviceProvider';

/**
 * Email Verify Notice
 */
function EmailVerifyNotice({ name }: NoticeProps) {
  const user = useCurrentUser();
  const inFeedNoticesService = serviceProvider.resolve('inFeedNotices');
  const i18n = serviceProvider.i18n;
  if (!inFeedNoticesService.visible(name) || user?.email_confirmed) {
    return null;
  }
  return (
    <InFeedNotice
      name={name}
      title={i18n.t('onboarding.verifyEmailAddress')}
      description={i18n.t('inFeedNotices.verifyEmailDescription', {
        TENANT,
      })}
      btnText={i18n.t('inFeedNotices.verifyEmail')}
      iconName="warning"
      onPress={serviceProvider.session.getUser().confirmEmailCode}
    />
  );
}

export default observer(EmailVerifyNotice);
