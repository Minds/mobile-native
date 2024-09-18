import { useNavigation } from '@react-navigation/native';
import Divider from '~/common/components/Divider';
import AnimatedHeight from '~/common/components/animations/AnimatedHeight';
import useApiFetch from '~/common/hooks/useApiFetch';
import { Button, H4, Spacer } from '~/common/ui';
import GroupModel from '../GroupModel';
import GroupsListItem from '../GroupsListItem';
import sp from '~/services/serviceProvider';

export default function GroupMemberships() {
  const navigation = useNavigation();
  const { memberships } = useGroupMemberships();

  if (!memberships?.length) {
    return null;
  }
  const i18nService = sp.i18n;
  return (
    <AnimatedHeight>
      <H4 horizontal="L" vertical="L">
        {i18nService.t('groups.manage')}
      </H4>
      {memberships?.map(group => (
        <GroupsListItem key={group.guid} group={group} />
      ))}
      <Button
        horizontal="L"
        top="L"
        onPress={() => navigation.navigate('GroupsManage')}>
        {i18nService.t('seeMore')}
      </Button>
      <Spacer top="L" />
      <Divider />
    </AnimatedHeight>
  );
}

function useGroupMemberships() {
  const { result, ...rest } = useApiFetch<
    GroupMembershipsResponse,
    GroupMembershipsParams
  >('api/v1/groups/member', {
    params: {
      limit: 3,
      offset: 0,
      membership_level: 2,
      membership_level_gte: true,
    },
  });

  return {
    memberships: result?.groups?.slice(0, 3),
    ...rest,
  };
}

interface GroupMembershipsResponse {
  groups: GroupModel[];
  'load-next': 1;
  status: 'success' | string;
}

interface GroupMembershipsParams {
  limit: number;
  offset: number;
  membership_level: 1 | 2;
  membership_level_gte: boolean;
}
