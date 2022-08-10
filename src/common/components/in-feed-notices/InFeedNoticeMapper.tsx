import React from 'react';
import EmailVerifyNotice from './notices/EmailVerifyNotice';
import BuildAlgorithmNotice from './notices/BuildAlgorithmNotice';
import TagsNotice from './notices/TagsNotice';
import SetupChannelNotice from './notices/SetupChannelNotice';
import VerifyUniquenessNotice from './notices/VerifyUniquenessNotice';

type PropsType = {
  noticeName: string;
};

/**
 * Renders the InFeedNotice based on the noticeName
 */
export default function InFeedNoticeMapper({ noticeName }: PropsType) {
  switch (noticeName) {
    case 'verify-email':
      return <EmailVerifyNotice />;
    case 'build-your-algorithm':
      return <BuildAlgorithmNotice />;
    case 'update-tags':
      return <TagsNotice />;
    case 'setup-channel':
      return <SetupChannelNotice />;
    case 'verify-uniqueness':
      return <VerifyUniquenessNotice />;
    default:
      return null;
  }
}
