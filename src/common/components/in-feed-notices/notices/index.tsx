import React from 'react';
import BuildAlgorithmNotice from './BuildAlgorithmNotice';
import EmailVerifyNotice from './EmailVerifyNotice';
import InviteFriendsNotice from './InviteFriendsNotice';
import PendingSupermindNotice from './PendingSupermindNotice';
import SetupChannelNotice from './SetupChannelNotice';
import TagsNotice from './TagsNotice';
import VerifyUniquenessNotice from './VerifyUniquenessNotice';

export const noticeMapper = {
  'supermind-pending': <PendingSupermindNotice />,
  'verify-email': <EmailVerifyNotice />,
  'build-your-algorithm': <BuildAlgorithmNotice />,
  'update-tags': <TagsNotice />,
  'setup-channel': <SetupChannelNotice />,
  'verify-uniqueness': <VerifyUniquenessNotice />,
  'invite-friends': <InviteFriendsNotice />,
};

export type NoticeName = keyof typeof noticeMapper;