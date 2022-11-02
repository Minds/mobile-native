import { observer } from 'mobx-react';
import React from 'react';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import { B1 } from '../../../common/ui';
import useStripeConnect from './useStripeConnect';

// TODO: show Update Your Details if experiment active => https://gitlab.com/minds/front/-/merge_requests/2095/diffs#4e532d4a1a8dd6851e1b77c29f9de2ad6a48c9fa_47_50

const StripeConnectButton = () => {
  const {
    account,
    loading,
    restricted,
    restrictedReason,
    openStripe,
    createAccount,
  } = useStripeConnect();
  let restrictedTitle = '';
  let restrictedDescription = '';

  if (restricted) {
    if (restrictedReason && restriectedMapping[restrictedReason]) {
      restrictedTitle = restriectedMapping[restrictedReason].title;
      restrictedDescription = restriectedMapping[restrictedReason].description;
    } else {
      restrictedTitle = restriectedMapping.other.title;
      restrictedDescription = restriectedMapping.other.description;
    }
  }

  return (
    <>
      {!!restricted && (
        <>
          <B1 color="danger">{restrictedTitle}</B1>
          <B1>{restrictedDescription}</B1>
        </>
      )}
      <Button
        action
        loading={loading}
        onPress={account ? openStripe : createAccount}
        text={
          account ? i18n.t('wallet.usd.complete') : i18n.t('wallet.usd.add')
        }
      />
    </>
  );
};

const restriectedMapping: {
  [k: string]: { title: string; description: string };
} = {
  // Admins suspended
  platform_paused: {
    title: i18n.t('wallet.usd.restrictedReasons.platform_paused.title'),
    description: i18n.t(
      'wallet.usd.restrictedReasons.platform_paused.description',
    ),
  },
  // Requirements past due
  'requirements.past_due': {
    title: i18n.t('wallet.usd.restrictedReasons.requirements.past_due.title'),
    description: i18n.t(
      'wallet.usd.restrictedReasons.requirements.past_due.title',
    ),
  },
  // Requirements pending verification
  'requirements.pending_verification': {
    title: i18n.t(
      'wallet.usd.restrictedReasons.requirements.pending_verification.title',
    ),
    description: i18n.t(
      'wallet.usd.restrictedReasons.requirements.pending_verification.description',
    ),
  },
  // Requirements pending verification
  under_review: {
    title: i18n.t('wallet.usd.restrictedReasons.under_review.title'),
    description: i18n.t(
      'wallet.usd.restrictedReasons.under_review.description',
    ),
  },
  // Other reason
  other: {
    title: i18n.t('wallet.usd.restrictedReasons.other.title'),
    description: i18n.t('wallet.usd.restrictedReasons.other.description'),
  },
};

export default observer(StripeConnectButton);
