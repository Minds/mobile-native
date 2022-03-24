import React, { useCallback } from 'react';
import { View } from 'react-native';
import DiscoveryUserNew from '../../discovery/DiscoveryUserNew';
import ThemedStyles from '../../styles/ThemedStyles';
import UserModel from '../../channel/UserModel';
import { observer } from 'mobx-react';
import SuggestedSearch from './SuggestedSearch';
import SearchHistory from './SearchHistory';
import MenuItem from '../../common/components/menus/MenuItem';
import { SearchResultStoreType } from './createSearchResultStore';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';

type PropsType = {
  navigation: any;
  localStore: SearchResultStoreType;
};

const SearchResultComponent = observer(
  ({ navigation, localStore }: PropsType) => {
    const renderUser = useCallback(
      (user, index) => {
        return (
          <DiscoveryUserNew
            row={{ item: UserModel.checkOrCreate(user), index }}
            key={user.guid}
            //@ts-ignore
            testID={`suggestedUser${index}`}
            onUserTap={item => {
              localStore.searchBarItemTap(item);
              navigation.goBack();
            }}
            subscribe={false}
            navigation={navigation}
          />
        );
      },
      [localStore, navigation],
    );

    const renderItem = useCallback(
      (item, index) => {
        if (item.user) {
          return renderUser(item.user, index);
        } else {
          if (typeof item === 'string') {
            return (
              <MenuItem
                containerItemStyle={styles.historyItem}
                item={{
                  onPress: () => localStore.setSearchesAndQueryDiscovery(item),
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
      <View style={containerStyle}>
        {localStore.shouldShowSuggested ? (
          <SuggestedSearch localStore={localStore} renderUser={renderUser} />
        ) : (
          <SearchHistory localStore={localStore} renderItem={renderItem} />
        )}
      </View>
    );
  },
);

const containerStyle = ThemedStyles.combine(
  'bgPrimaryBackground',
  'flexContainer',
);

const styles = ThemedStyles.create({
  historyItem: ['bgTransparent', { borderTopWidth: 0 }],
});

export default withErrorBoundary(
  SearchResultComponent,
  'Error displaying results',
);
