import React, { useCallback } from 'react';
import ChannelListItem from '~/common/components/ChannelListItem';
import UserModel from '../../../channel/UserModel';
import Button from '../../../common/components/Button';
import apiService from '../../../common/services/api.service';
import blockListService from '../../../common/services/block-list.service';
import i18n from '../../../common/services/i18n.service';
import { BlockedChannelsStore } from './createBlockedChannelsStore';

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
      await blockListService.remove(guid);
      await apiService.delete(`api/v1/block/${guid}`);
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
        <Button text={i18n.t('unblock')} onPress={() => unblock(user.guid)} />
      )}
    />
  );
};

export default BlockedChannel;
