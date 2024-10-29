import React from 'react';
import { View, ScrollView } from 'react-native';
import { useKeyboard } from '@react-native-community/hooks';

import { useLegacyStores } from '~/common/hooks/use-stores';
import { SearchResultStoreType } from './createSearchResultStore';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  localStore: SearchResultStoreType;
  renderItem: (item, index) => React.ReactNode | null;
};

const SearchHistory = ({ localStore, renderItem }: PropsType) => {
  const theme = sp.styles.style;
  const titleStyle = [
    theme.subTitleText,
    theme.colorSecondaryText,
    theme.fontM,
  ];
  const buttonStyle = [theme.colorSecondaryText, theme.fontS];
  const { user } = useLegacyStores();
  const keyboard = useKeyboard();

  const clearSearchHistory = async () => {
    user.searchBarClearHistory();
    localStore.setHistory([]);
  };

  const scrollHeight = {
    height: keyboard.keyboardShown ? keyboard.keyboardHeight : '90%',
  };

  const i18n = sp.i18n;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[scrollHeight, theme.paddingTop4x]}>
      <View style={[styles.header, theme.marginBottom3x]}>
        <MText style={titleStyle}>{i18n.t('searchBar.searchHistory')}</MText>
        <MText style={buttonStyle} onPress={clearSearchHistory}>
          {i18n.t('searchBar.clear')}
        </MText>
      </View>
      <View style={styles.section}>
        {localStore.history.length > 0 &&
          localStore.history
            .filter(item => typeof item === 'string')
            .map((item, index) => {
              return renderItem(item, index);
            })}
      </View>
      <View>
        {localStore.history.length > 0 &&
          localStore.history
            .filter(item => typeof item !== 'string')
            .map((item, index) => {
              return renderItem(item, index);
            })}
      </View>
    </ScrollView>
  );
};

export default SearchHistory;

const styles = sp.styles.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  section: ['marginBottom2x'],
});
