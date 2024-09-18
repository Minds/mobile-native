import React, { useCallback } from 'react';
import ChannelListItem from '~/common/components/ChannelListItem';
import UserModel from '~/channel/UserModel';
import Button from '~/common/components/Button';
import { BlockedChannelsStore } from './createBlockedChannelsStore';
import sp from '~/services/serviceProvider';

export type Row = {
  index: number;
  item: UserModel;
  target: string;
};

type PropsType = {
  row: Row;
  localStore: BlockedChannelsStore;
};

const BlockedChannel = ({ row, localStore }: PropsType) => {
  const user = UserModel.checkOrCreate(row.item);

  const unblock = useCallback(
    async (guid: string) => {
      await sp.resolve('blockList').remove(guid);
      await sp.api.delete(`api/v1/block/${guid}`);
      localStore.loadList(true);
    },
    [localStore],
  );

  return (
    <ChannelListItem
      channel={user}
      key={user.guid}
      //@ts-ignore
      testID={`blockedChannel${row.index}`}
      renderRight={() => (
        <Button
          text={sp.i18n.t('unblock')}
          onPress={() => unblock(user.guid)}
        />
      )}
    />
  );
};

export default BlockedChannel;
