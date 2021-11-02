import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { IconButton, Icon } from '~ui/icons';
import i18n from '../../common/services/i18n.service';
import { useLegacyStores, useStores } from '../../common/hooks/use-stores';
import { useNavigation } from '@react-navigation/core';
import SearchResultComponent from './SearchResultComponent';
import { observer } from 'mobx-react';
import KeyboardSpacingView from '../../common/components/KeyboardSpacingView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextInput from '../../common/components/TextInput';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import MText from '~/common/components/MText';

const SearchScreen = observer(() => {
  const theme = ThemedStyles.style;
  const { user } = useLegacyStores();
  const localStore = useStores().searchBar;
  const inputRef = useRef<TextInputType>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const paddingTop = { paddingTop: insets.top };
  const paddingBottom = { paddingBottom: insets.bottom };

  useEffect(() => {
    localStore.init(user);

    // #3522 autofocus wasn't working
    const timeout = setTimeout(() => inputRef.current?.focus(), 300);
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localStore, user]);

  useEffect(() => {
    localStore.input('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearInput = () => {
    // inputRef.current?.clear();
    localStore.input('');
  };

  const handleCancelNav = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    localStore.searchDiscovery();
  };

  return (
    <KeyboardSpacingView
      style={[
        StyleSheet.absoluteFill,
        theme.bgPrimaryBackground,
        paddingTop,
        paddingBottom,
      ]}>
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Icon name="search" right="S" />
          <TextInput
            ref={inputRef}
            placeholder={i18n.t('discovery.search')}
            placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
            onChangeText={localStore.input}
            value={localStore.searchText}
            testID="searchInput"
            style={[styles.textInput, theme.colorPrimaryText]}
            selectTextOnFocus={true}
            onSubmitEditing={handleSubmit}
            autoFocus
            returnKeyType="search"
          />
          {localStore.searchText ? (
            <IconButton
              onPress={handleClearInput}
              name="close-circle"
              size="tiny"
              left="XS"
            />
          ) : null}
        </View>
        <TouchableWithoutFeedback
          style={styles.cancel}
          onPress={handleCancelNav}>
          <MText style={[theme.colorSecondaryText, theme.fontM]}>
            {i18n.t('cancel')}
          </MText>
        </TouchableWithoutFeedback>
      </View>
      <SearchResultComponent navigation={navigation} localStore={localStore} />
    </KeyboardSpacingView>
  );
});

const styles = ThemedStyles.create({
  height: {
    height: 200,
  },
  body: {
    minHeight: 0,
  },
  header: [
    'paddingTop4x',
    'paddingBottom3x',
    'borderBottomHair',
    'bcolorPrimaryBorder',
    'paddingRight4x',
    {
      flexDirection: 'row',
      alignItems: 'center',
    },
  ],
  inputContainer: [
    'rowJustifyStart',
    'paddingLeft4x',
    {
      flex: 1,
      alignItems: 'center',
    },
  ],
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  cancel: ['marginLeft4x'],
});

export default SearchScreen;
