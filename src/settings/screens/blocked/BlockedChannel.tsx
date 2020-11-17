import React, { useCallback } from 'react';
import { View } from 'react-native';
import UserModel from '../../../channel/UserModel';
import Button from '../../../common/components/Button';
import apiService from '../../../common/services/api.service';
import blockListService from '../../../common/services/block-list.service';
import i18n from '../../../common/services/i18n.service';
import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import ThemedStyles from '../../../styles/ThemedStyles';
import { BlockedChannelsStore } from './createBlockedChannelsStore';

export type Row = {
  index: number;
  item: UserModel;
};

type PropsType = {
  row: Row;
  localStore: BlockedChannelsStore;
};

const BlockedChannel = ({ row, localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  row.item = UserModel.checkOrCreate(row.item);

  const unblock = useCallback(
    async (guid: string) => {
      await blockListService.remove(guid);
      await apiService.delete(`api/v1/block/${guid}`);
      localStore.loadList(true);
    },
    [localStore],
  );

  return (
    <View style={[theme.rowJustifySpaceBetween, theme.paddingRight2x]}>
      <DiscoveryUser
        row={row}
        key={row.item.guid}
        //@ts-ignore
        testID={`blockedChannel${row.index}`}
        subscribe={false}
      />
      <Button text={i18n.t('unblock')} onPress={() => unblock(row.item.guid)} />
    </View>
  );
};

export default BlockedChannel;
