import { useEffect, useState } from 'react';
import entitiesService from '~/common/services/entities.service';
import GroupModel from '~/groups/GroupModel';

export function useGroup({
  guid,
  group,
}: {
  guid?: string;
  group?: GroupModel;
}) {
  const [Group, setGroup] = useState<GroupModel | undefined>(group);

  useEffect(() => {
    if (!group && guid) {
      fetchAndUpdateGroup(guid, group).then(fetchedGroup =>
        setGroup(fetchedGroup),
      );
    }
  }, [group, guid]);

  return Group;
}

const fetchAndUpdateGroup = async (guid: string, defaultGroup?: GroupModel) => {
  const group = await entitiesService.single(
    `urn:group:${guid}`,
    defaultGroup ? GroupModel.checkOrCreate(defaultGroup) : null,
  );
  return (group as GroupModel) || null;
};
