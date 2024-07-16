import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import FeedList from '~/common/components/FeedList';

import createBlockedChannelsStore from './createBlockedChannelsStore';
import BlockedChannel, { Row } from './BlockedChannel';
import MText from '~/common/components/MText';
import { Screen } from '~/common/ui';
import sp from '~/services/serviceProvider';

const BlockedChannelsScreen = observer(props => {
  const theme = sp.styles.style;
  const localStore = useLocalStore(createBlockedChannelsStore);

  const renderRow = useCallback(
    (row: Row) => <BlockedChannel row={row} localStore={localStore} />,
    [localStore],
  );

  const onRefresh = useCallback(() => {
    return localStore.loadList(true);
  }, [localStore]);

  useEffect(() => {
    localStore.loadList();
  });

  return (
    <Screen>
      <FeedList
        feedStore={localStore.feedStore}
        renderActivity={renderRow}
        navigation={props.navigation}
        emptyMessage={
          <View style={[theme.centered, theme.marginTop4x]}>
            <MText>{sp.i18n.t('settings.noBlockedChannels')}</MText>
          </View>
        }
        style={[theme.bgPrimaryBackground, theme.flexContainer]}
        onRefresh={onRefresh}
      />
    </Screen>
  );
});

export default BlockedChannelsScreen;
