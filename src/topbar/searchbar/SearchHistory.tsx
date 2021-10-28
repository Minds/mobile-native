import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { View, ScrollView, StyleSheet } from 'react-native';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { useKeyboard } from '@react-native-community/hooks';
import { SearchResultStoreType } from './createSearchResultStore';
import MText from '../../common/components/MText';

type PropsType = {
  localStore: SearchResultStoreType;
  renderItem: (item, index) => Element | null;
};

const SearchHistory = ({ localStore, renderItem }: PropsType) => {
  const theme = ThemedStyles.style;
  const titleStyle = [
    theme.subTitleText,
    theme.colorSecondaryText,
    theme.fontM,
  ];
  const buttonStyle = [theme.colorSecondaryText, theme.fontM];
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[scrollHeight, theme.paddingTop4x]}>
      <View style={[styles.row, theme.marginBottom3x]}>
        <MText style={titleStyle}>{i18n.t('searchBar.searchHistory')}</MText>
        <MText style={buttonStyle} onPress={clearSearchHistory}>
          {i18n.t('searchBar.clear')}
        </MText>
      </View>
      {localStore.history.length > 0 &&
        localStore.history
          .filter(item => typeof item === 'string')
          .map((item, index) => {
            return renderItem(item, index);
          })}
      {localStore.history.length > 0 &&
        localStore.history
          .filter(item => typeof item !== 'string')
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
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});
