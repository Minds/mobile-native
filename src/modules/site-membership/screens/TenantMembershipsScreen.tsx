import React from 'react';
import CenteredLoading from '~/common/components/CenteredLoading';
import currency from '~/common/helpers/currency';
import { handleExternalMembership } from '~/common/services/upgrade-modal.service';
import {
  B1,
  B2,
  Button,
  H1,
  H3,
  Screen,
  ScreenSection,
  Spacer,
} from '~/common/ui';
import { TENANT } from '~/config/Config';
import {
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  useGetSiteMembershipsAndSubscriptionsQuery,
} from '~/graphql/api';
import sp from '~/services/serviceProvider';

export default function TenantMembershipsScreen() {
  const query = useGetSiteMembershipsAndSubscriptionsQuery(undefined, {
    cacheTime: Infinity,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  return (
    <Screen scroll>
      <ScreenSection top="XXL" bottom="XXL">
        <H1 align="center">Unleash the full {TENANT} experience</H1>
      </ScreenSection>
      {query.isLoading ? (
        <CenteredLoading />
      ) : (
        query.data?.siteMemberships.map(membership => (
          <MembershipCard
            key={membership.membershipGuid}
            membership={membership}
          />
        ))
      )}
    </Screen>
  );
}

const MembershipCard = ({
  membership,
}: {
  membership: {
    membershipName: string;
    membershipPriceInCents: number;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipDescription?: string | null;
    membershipGuid: string;
    priceCurrency: string;
    isExternal: boolean;
  };
}) => {
  return (
    <Spacer containerStyle={styles.cardContainer}>
      <H3 style={styles.spaceBottom}>{membership.membershipName}</H3>
      <B1 font="bold" style={styles.spaceBottom}>
        {currency(membership.membershipPriceInCents / 100, 'usd', 'prefix')}{' '}
        <B1 font="regular">
          /{' '}
          {membership.membershipPricingModel ===
          SiteMembershipPricingModelEnum.OneTime
            ? 'One-time payment'
            : membership.membershipBillingPeriod ===
              SiteMembershipBillingPeriodEnum.Monthly
            ? 'month'
            : 'year'}
        </B1>
      </B1>
      {Boolean(membership.membershipDescription) && (
        <B1 align="center">{membership.membershipDescription}</B1>
      )}
      {membership.isExternal ? (
        <Button
          type="action"
          top="XXXL"
          bottom="M"
          align="center"
          onPress={() => {
            handleExternalMembership(membership);
          }}>
          {sp.i18n.t('membership.join')}
        </Button>
      ) : (
        <B2 align="center" vertical="XL" font="medium">
          Not available on mobile
        </B2>
      )}
    </Spacer>
  );
};

const styles = sp.styles.create({
  spaceBottom: ['marginBottom2x'],
  cardContainer: [
    'border2x',
    'bcolorPrimaryBorder',
    'borderRadius10x',
    'flexContainer',
    'paddingHorizontal3x',
    'paddingVertical3x',
    'marginVertical2x',
    'marginHorizontal3x',
    'alignCenter',
  ],
});
