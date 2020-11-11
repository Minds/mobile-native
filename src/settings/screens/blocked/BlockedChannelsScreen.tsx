import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import UserModel from '../../../channel/UserModel';
import FeedList from '../../../common/components/FeedList';
import ThemedStyles from '../../../styles/ThemedStyles';
import createBlockedChannelsStore from './createBlockedChannelsStore';
import DiscoveryUser from '../../../discovery/DiscoveryUserNew';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import blockListService from '../../../common/services/block-list.service';
import apiService from '../../../common/services/api.service';

const BlockedChannelsScreen = observer((props) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createBlockedChannelsStore);

  const unblock = useCallback(
    async (guid: string) => {
      await blockListService.remove(guid);
      await apiService.delete(`api/v1/block/${guid}`);
      localStore.loadList(true);
    },
    [localStore],
  );

  const onRefresh = useCallback(() => {
    localStore.loadList(true);
  }, [localStore]);

  useEffect(() => {
    localStore.loadList();
  });

  const renderActivity = (row: { index: number; item: UserModel }) => {
    row.item = UserModel.checkOrCreate(row.item);
    return (
      <View style={[theme.rowJustifySpaceBetween, theme.paddingRight2x]}>
        <DiscoveryUser
          row={row}
          key={row.item.guid}
          //@ts-ignore
          testID={`blockedChannel${row.index}`}
          subscribe={false}
        />
        <Button
          text={i18n.t('unblock')}
          onPress={() => unblock(row.item.guid)}
        />
      </View>
    );
  };

  return (
    <View style={theme.flexContainer}>
      <FeedList
        feedStore={localStore.feedStore}
        renderActivity={renderActivity}
        navigation={props.navigation}
        emptyMessage={
          <View style={[theme.centered, theme.marginTop4x]}>
            <Text>{i18n.t('settings.noBlockedChannels')}</Text>
          </View>
        }
        style={[theme.backgroundPrimary, theme.flexContainer]}
        onRefresh={onRefresh}
      />
    </View>
  );
});

export default BlockedChannelsScreen;
