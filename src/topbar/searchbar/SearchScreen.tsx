import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useLegacyStores, useStores } from '~/common/hooks/use-stores';
import SearchResultComponent from './SearchResultComponent';
import TextInput from '~/common/components/TextInput';
import { Button, IconButton, Icon } from '~ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

const SearchScreen = withErrorBoundaryScreen(
  observer(() => {
    const theme = sp.styles.style;
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

    const i18n = sp.i18n;

    return (
      <KeyboardAvoidingView
        behavior="padding"
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
              placeholderTextColor={sp.styles.getColor('SecondaryText')}
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
          <View>
            <Button
              mode="flat"
              size="tiny"
              type="base"
              onPress={handleCancelNav}>
              {i18n.t('cancel')}
            </Button>
          </View>
        </View>
        <SearchResultComponent
          navigation={navigation}
          localStore={localStore}
        />
      </KeyboardAvoidingView>
    );
  }),
  'SearchScreen',
);

const styles = sp.styles.create({
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
      justifyContent: 'center',
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
    fontFamily: 'Roboto_400Regular',
  },
  cancel: ['marginLeft4x'],
});

export default SearchScreen;
