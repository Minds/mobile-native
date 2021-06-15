import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores, useStores } from '../../common/hooks/use-stores';
import { useNavigation } from '@react-navigation/core';
import DisabledStoreFeature from '../../common/components/DisabledStoreFeature';
import SearchResultComponent from './SearchResultComponent';
import { GOOGLE_PLAY_STORE } from '../../config/Config';
import { observer } from 'mobx-react';
import KeyboardSpacingView from '../../common/components/KeyboardSpacingView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchScreen = observer(() => {
  const theme = ThemedStyles.style;
  const { user } = useLegacyStores();
  const localStore = useStores().searchBar;
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const paddingTop = { paddingTop: insets.top };
  const paddingBottom = { paddingBottom: insets.bottom };
  useEffect(() => {
    localStore.init(user);
  });
  return (
    <KeyboardSpacingView
      style={[
        StyleSheet.absoluteFill,
        theme.bgPrimaryBackground,
        paddingTop,
        paddingBottom,
      ]}>
      <View
        style={[
          styles.header,
          Platform.OS === 'android' ? theme.marginBottom : theme.marginBottom3x,
          theme.marginTop3x,
        ]}>
        <View style={[theme.rowJustifyStart, theme.paddingLeft3x]}>
          <Icon
            name="search"
            size={25}
            style={[
              theme.colorIcon,
              theme.marginRight2x,
              Platform.OS === 'android' ? theme.centered : null,
            ]}
          />
          <TextInput
            ref={inputRef}
            placeholder={i18n.t('discovery.search')}
            placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
            onChangeText={localStore.input}
            value={localStore.searchText}
            testID="searchInput"
            style={[styles.textInput, theme.colorPrimaryText]}
            selectTextOnFocus={true}
            onSubmitEditing={() => localStore.searchDiscovery()}
            autoFocus
          />
        </View>
        <Icon
          onPress={navigation.goBack}
          name="close"
          size={18}
          style={[
            styles.button,
            theme.colorIcon,
            Platform.OS === 'android' ? theme.centered : null,
          ]}
        />
      </View>
      {GOOGLE_PLAY_STORE ? (
        <DisabledStoreFeature
          style={[styles.height, theme.bgPrimaryBackground]}
        />
      ) : (
        <SearchResultComponent
          navigation={navigation}
          localStore={localStore}
        />
      )}
    </KeyboardSpacingView>
  );
});

const styles = StyleSheet.create({
  height: {
    height: 200,
  },
  button: {
    paddingHorizontal: 10,
  },
  body: {
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
  },
  textInput: {
    width: '80%',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
});

export default SearchScreen;
