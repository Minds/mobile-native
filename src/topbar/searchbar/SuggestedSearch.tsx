import React from 'react';
import { View, ScrollView } from 'react-native';
import CenteredLoading from '../../common/components/CenteredLoading';
import ThemedStyles from '../../styles/ThemedStyles';
import FindInDiscoveryButton from './FindInDiscoveryButton';
import { observer } from 'mobx-react';
import { SearchResultStoreType } from './createSearchResultStore';

type PropsType = {
  localStore: SearchResultStoreType;
  renderUser: (item, index) => Element;
};

const SuggestedSearch = observer(({ localStore, renderUser }: PropsType) => {
  const theme = ThemedStyles.style;

  if (localStore.suggested.length === 0) {
    if (localStore.loading) {
      return <CenteredLoading />;
    } else {
      return (
        <View style={theme.flexContainerStretch}>
          <FindInDiscoveryButton localStore={localStore} />
        </View>
      );
    }
  } else {
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <FindInDiscoveryButton localStore={localStore} />
        {localStore.suggested.map(renderUser)}
      </ScrollView>
    );
  }
});

export default SuggestedSearch;
