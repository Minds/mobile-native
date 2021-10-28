import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
import { UNIT } from '~styles/Tokens';

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

  const handleClearInput = () => {
    inputRef.current?.clear();
    localStore.input('');
  };

  const handleCancel = () => {
    localStore.input('');
    navigation.goBack();
  };

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
        <View
          style={[
            theme.rowJustifyStart,
            theme.paddingLeft4x,
            styles.inputContainer,
          ]}>
          <Icon name="search" spacingRight="2x" />
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
            returnKeyType="search"
          />
          {localStore.searchText ? (
            <IconButton
              onPress={handleClearInput}
              name="close-circle"
              size="tiny"
              spacingRight="2x"
              spacingLeft="1x"
            />
          ) : null}
        </View>
        <TouchableWithoutFeedback style={styles.cancel} onPress={handleCancel}>
          <MText style={[theme.colorSecondaryText, theme.fontM]}>
            {i18n.t('cancel')}
          </MText>
        </TouchableWithoutFeedback>
      </View>

      <SearchResultComponent navigation={navigation} localStore={localStore} />
    </KeyboardSpacingView>
  );
});

const styles = StyleSheet.create({
  height: {
    height: 200,
  },
  body: {
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  cancel: {
    marginRight: UNIT.M,
    marginLeft: UNIT.XS,
    padding: UNIT.S,
  },
});

export default SearchScreen;
