import { useGetSiteMembershipQuery } from '~/graphql/api';
import { BottomSheetButton, pushBottomSheet } from '../components/bottom-sheet';
import { H3 } from '../ui';
import CenteredLoading from '../components/CenteredLoading';
import sp from '~/services/serviceProvider';

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
      <BottomSheetButton text={sp.i18n.t('dismiss')} onPress={modal.close} />
    </>
  );
};

const GenericMembershipModalContent = ({ modal }) => (
  <>
    <H3 horizontal="XL" vertical="XL" align="center" font="regular">
      Only members can access this post
    </H3>
    <BottomSheetButton text={sp.i18n.t('dismiss')} onPress={modal.close} />
  </>
);
