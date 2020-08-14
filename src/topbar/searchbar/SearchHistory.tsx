import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { useKeyboard } from '@react-native-community/hooks';
import { SearchResultStoreType } from './createSearchResultStore';

type PropsType = {
  localStore: SearchResultStoreType;
  renderItem: (item, index) => Element | null;
};

const SearchHistory = ({ localStore, renderItem }: PropsType) => {
  const theme = ThemedStyles.style;
  const textStyle = [theme.subTitleText, theme.colorSecondaryText, theme.fontM];
  const { user } = useLegacyStores();
  const keyboard = useKeyboard();

  const clearSearchHistory = async () => {
    user.searchBarClearHistory();
    localStore.setHistory([]);
  };

  const scrollHeight = {
    height: keyboard.keyboardShown ? keyboard.keyboardHeight : '90%',
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={scrollHeight}>
      <View style={[styles.row, theme.marginBottom3x]}>
        <Text style={textStyle}>{i18n.t('searchBar.searchHistory')}</Text>
        <Text style={textStyle} onPress={clearSearchHistory}>
          {i18n.t('searchBar.clear')}
        </Text>
      </View>
      {localStore.history.length > 0 &&
        localStore.history
          .filter((item) => typeof item === 'string')
          .map((item, index) => {
            return renderItem(item, index);
          })}
      {localStore.history.length > 0 &&
        localStore.history
          .filter((item) => typeof item !== 'string')
          .map((item, index) => {
            return renderItem(item, index);
          })}
    </ScrollView>
  );
};

export default SearchHistory;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
