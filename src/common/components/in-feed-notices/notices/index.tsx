import React from 'react';
import BuildAlgorithmNotice from './BuildAlgorithmNotice';
import EmailVerifyNotice from './EmailVerifyNotice';
import PendingSupermindNotice from './PendingSupermindNotice';
import SetupChannelNotice from './SetupChannelNotice';
import TagsNotice from './TagsNotice';
import VerifyUniquenessNotice from './VerifyUniquenessNotice';
import PlusUpgradeNotice from './PlusUpgradeNotice';
import BoostPartnerNotice from './BoostPartnerNotice';
import BoostChannelNotice from './BoostChannelNotice';

export const noticeMapper = {
  'supermind-pending': PendingSupermindNotice,
  'verify-email': EmailVerifyNotice,
  'build-your-algorithm': BuildAlgorithmNotice,
  'update-tags': TagsNotice,
  'setup-channel': SetupChannelNotice,
  'verify-uniqueness': VerifyUniquenessNotice,
  'plus-upgrade': PlusUpgradeNotice,
  'boost-partners': BoostPartnerNotice,
  'boost-channel': BoostChannelNotice,
  'code-push': undefined,
  'in-app-verification-prompt': undefined,
};

export const getNotice = (name: NoticeName): JSX.Element => {
  const Component = noticeMapper[name];
  return Component ? <Component name={name} /> : <></>;
};

export type NoticeName = keyof typeof noticeMapper;

export type NoticeProps = {
  name: NoticeName;
};
