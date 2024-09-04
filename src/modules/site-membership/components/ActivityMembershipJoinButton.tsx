import React from 'react';
import { Linking } from 'react-native';

import i18nService from '~/common/services/i18n.service';
import { showUpgradeModal } from '~/common/services/upgrade-modal.service';
import { Button } from '~/common/ui';
import { TENANT_IS_NON_PROFIT } from '~/config/Config';
import { useGetSiteMembershipForActivityQuery } from '~/graphql/api';

export const ActivityMembershipJoinButton = ({
  activityGuid,
  title,
}: {
  activityGuid: string;
  title?: string;
}) => {
  const query = useGetSiteMembershipForActivityQuery(
    { activityGuid, externalOnly: true },
    {
      enabled: false,
    },
  );

  const handlePress = React.useCallback(async () => {
    try {
      let membership;

      if (!TENANT_IS_NON_PROFIT) {
        showUpgradeModal();
        return;
      }

      // If the data is already cached, use it
      if (query.isSuccess && query.data) {
        membership = query.data.lowestPriceSiteMembershipForActivity;
      } else {
        const result = await query.refetch();
        membership = result.data?.lowestPriceSiteMembershipForActivity;
      }

      if (membership?.purchaseUrl) {
        Linking.openURL(membership.purchaseUrl);
      } else {
        showUpgradeModal();
      }
    } catch (error) {
      console.error('Error fetching membership data:', error);
      showUpgradeModal();
    }
  }, [query]);

  return (
    <Button
      stretch
      mode="solid"
      horizontal="XL"
      vertical="L"
      type="action"
      spinner={query.isFetching}
      loading={query.isFetching}
      // disabled={query.isFetching}
      onPress={handlePress}>
      {title || i18nService.t('membership.join')}
    </Button>
  );
};
