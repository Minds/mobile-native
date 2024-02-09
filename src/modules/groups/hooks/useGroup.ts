import { useMemo } from 'react';
import GroupModel from '~/groups/GroupModel';
import useApiQuery from '~/services/hooks/useApiQuery';

type GroupResponse = {
  status: 'success' | 'error';
  group: GroupModel;
};

/**
 * Hook that returns a group by guid
 * it can receive an optional group object that will by updated asynchronously
 */
export function useGroup({
  guid,
  group,
}: {
  guid?: string;
  group?: GroupModel;
}) {
  const id = guid || group?.guid;
  const { data, error, isFetching, refetch } = useApiQuery<GroupResponse>(
    ['group', id],
    'api/v1/groups/group/' + id,
  );

  const dataGroup = useMemo(() => {
    if (data) {
      if (group) {
        group.update(data.group);
        return group;
      }
      return GroupModel.checkOrCreate(data.group);
    } else {
      return group || null;
    }
  }, [data, group]);

  return { group: dataGroup, error, isFetching, refetch };
}
