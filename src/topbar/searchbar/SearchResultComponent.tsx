import React, { useEffect, useCallback, MutableRefObject } from 'react';

import { View, Text } from 'react-native';
import DiscoveryUserNew from '../../discovery/DiscoveryUserNew';

import ThemedStyles from '../../styles/ThemedStyles';
import UserModel from '../../channel/UserModel';
import { observer } from 'mobx-react';
import SuggestedSearch from './SuggestedSearch';
import SearchHistory from './SearchHistory';
import { SearchResultStoreType } from './createSearchResultStore';
import MenuItem from '../../common/components/menus/MenuItem';

type PropsType = {
  navigation: any;
  ref: MutableRefObject<any>;
  localStore: SearchResultStoreType;
};

const SearchResultComponent = observer(
  ({ navigation, localStore }: PropsType) => {
    const theme = ThemedStyles.style;

    useEffect(() => {
      localStore.init();
    }, [localStore]);

    const renderUser = useCallback(
      (user, index) => {
        return (
          <DiscoveryUserNew
            row={{ item: UserModel.checkOrCreate(user), index }}
            key={user.guid}
            //@ts-ignore
            testID={`suggestedUser${index}`}
            onUserTap={localStore.searchBarItemTap}
            subscribe={false}
            navigation={navigation}
          />
        );
      },
      [localStore, navigation],
    );

    const renderItem = useCallback(
      (item, index) => {
        const theme = ThemedStyles.style;
        if (item.user) {
          return renderUser(item.user, index);
        } else {
          if (typeof item === 'string') {
            return (
              <MenuItem
                containerItemStyle={theme.backgroundTransparent}
                item={{
                  onPress: () => localStore.input(item),
                  title: item,
                }}
              />
            );
          }
        }

        return null;
      },
      [renderUser, localStore],
    );

    if (!localStore.shouldShowSuggested && localStore.history.length === 0) {
      return null;
    }

    // If have something to search, render suggested, else, search history
    return (
      <View style={[theme.backgroundPrimary, theme.padding2x]}>
        {localStore.shouldShowSuggested && (
          <SuggestedSearch localStore={localStore} renderUser={renderUser} />
        )}
        {!localStore.shouldShowSuggested && (
          <SearchHistory localStore={localStore} renderItem={renderItem} />
        )}
      </View>
    );
  },
);

export default SearchResultComponent;
