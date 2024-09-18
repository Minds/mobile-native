import React from 'react';
import {
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  useGetSiteMembershipForActivityQuery,
  useGetSiteMembershipQuery,
} from '~/graphql/api';
import { BottomSheetButton, pushBottomSheet } from '../components/bottom-sheet';
import { H3 } from '../ui';
import CenteredLoading from '../components/CenteredLoading';
import sp from '~/services/serviceProvider';
import { TENANT_IS_NON_PROFIT } from '~/config/Config';
import { Linking } from 'react-native';

type Membership = {
  membershipGuid: string;
  membershipName: string;
  membershipDescription?: string | null;
  membershipPriceInCents: number;
  priceCurrency: string;
  isExternal: boolean;
  purchaseUrl?: string | null;
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
  membershipPricingModel: SiteMembershipPricingModelEnum;
};

/**
 * Display the upgrade modal
 * @param id - The membership id, if it is not provided, a generic message will be displayed
 * @returns
 */
export function showUpgradeModal(id?: string) {
  return pushBottomSheet({
    safe: true,
    component: id
      ? ref => <MemberShipModalContent id={id} modal={ref} />
      : ref => <GenericMembershipModalContent modal={ref} />,
  });
}

export function showUpgradeModalForEntity(guid: string) {
  return pushBottomSheet({
    safe: true,
    component: TENANT_IS_NON_PROFIT
      ? ref => (
          <ActivityMemberShipModalContent activityGuid={guid} modal={ref} />
        )
      : ref => <GenericMembershipModalContent modal={ref} />,
  });
}

/**
 * Membership for a given membership id
 */
const MemberShipModalContent = ({ modal, id }) => {
  const query = useGetSiteMembershipQuery(
    { membershipGuid: id },
    {
      staleTime: 300000, // 5 minutes
      cacheTime: 3600000, // 1 hour
    },
  );

  if (query.isLoading) {
    return <CenteredLoading />;
  }

  const membership = query.data?.siteMembership;

  return <MembershipDetails membership={membership} onPress={modal.close} />;
};

/**
 * Membership for a given activity
 */
const ActivityMemberShipModalContent = ({ modal, activityGuid }) => {
  const query = useGetSiteMembershipForActivityQuery({
    activityGuid,
    externalOnly: true,
  });

  const membership = query.data?.lowestPriceSiteMembershipForActivity;

  if (query.isLoading || !membership) {
    return <CenteredLoading />;
  }

  return <MembershipDetails membership={membership} onPress={modal.close} />;
};

const GenericMembershipModalContent = ({ modal }) => (
  <>
    <H3 horizontal="XL" vertical="XL" align="center" font="regular">
      Only members can access this post
    </H3>
    <BottomSheetButton text={sp.i18n.t('dismiss')} onPress={modal.close} />
  </>
);

const MembershipDetails = ({
  membership,
  onPress,
}: {
  membership?: Membership;
  onPress: () => void;
}) => {
  return (
    <>
      <H3 horizontal="XL" vertical="XL" align="center" font="regular">
        Only <H3 font="bold">{membership?.membershipName}</H3> members can
        access this
      </H3>
      {TENANT_IS_NON_PROFIT &&
      membership?.isExternal && // for now we allow only external memberships
      membership?.purchaseUrl ? (
        <MembershipJoinButton membership={membership} onPress={onPress} />
      ) : (
        <BottomSheetButton text={sp.i18n.t('dismiss')} onPress={onPress} />
      )}
    </>
  );
};

export const MembershipJoinButton = ({
  onPress,
  membership,
}: {
  onPress?: () => void;
  membership: Membership;
}) => {
  if (!membership) {
    return null;
  }
  return (
    <BottomSheetButton
      text={sp.i18n.t('membership.join')}
      onPress={() => {
        onPress?.();
        handleExternalMembership(membership);
      }}
    />
  );
};

export const handleExternalMembership = (membership: Membership) => {
  if (membership.isExternal && membership.purchaseUrl) {
    Linking.openURL(membership.purchaseUrl);
  }
};
