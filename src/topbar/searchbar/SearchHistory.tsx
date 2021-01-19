import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { useDimensions, useKeyboard } from '@react-native-community/hooks';
import { SearchResultStoreType } from './createSearchResultStore';

type PropsType = {
  localStore: SearchResultStoreType;
  renderItem: (item, index) => Element | null;
};

export function useKeyboardHeight() {
  const keyboard = useKeyboard();
  const window = useDimensions().window;
  const isLarge = window.height > 700;

  return {
    height: keyboard.keyboardShown
      ? keyboard.keyboardHeight + window.height * (isLarge ? 0.1 : 0.01)
      : '90%',
  };
}

const SearchHistory = ({ localStore, renderItem }: PropsType) => {
  const theme = ThemedStyles.style;
  const scrollHeight = useKeyboardHeight();
  const textStyle = [theme.subTitleText, theme.colorSecondaryText, theme.fontM];
  const { user } = useLegacyStores();
  const clearSearchHistory = async () => {
    user.searchBarClearHistory();
    localStore.setHistory([]);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[scrollHeight, theme.paddingBottom]}>
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
