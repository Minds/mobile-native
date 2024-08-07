import { useGetSiteMembershipQuery } from '~/graphql/api';
import { BottomSheetButton, pushBottomSheet } from '../components/bottom-sheet';
import { H3 } from '../ui';
import i18nService from './i18n.service';
import CenteredLoading from '../components/CenteredLoading';

export function showUpgradeModal(id: string) {
  return pushBottomSheet({
    safe: true,
    component: ref => <MemberShipModalContent id={id} modal={ref} />,
  });
}

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

  return (
    <>
      <H3 horizontal="XL" vertical="XL" align="center" font="regular">
        Only <H3 font="bold">{query.data?.siteMembership.membershipName}</H3>{' '}
        members can access this feature
      </H3>
      <BottomSheetButton
        text={i18nService.t('dismiss')}
        onPress={modal.close}
      />
    </>
  );
};
