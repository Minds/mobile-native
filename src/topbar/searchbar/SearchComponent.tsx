import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableHighlight,
  Text,
} from 'react-native';
import i18n from '../../common/services/i18n.service';
// import TextInput from '../common/components/TextInput';
import SearchResult from './SearchResultComponent';

import Modal from 'react-native-modal';
import ThemedStyles from '../../styles/ThemedStyles';
import { useLegacyStores, useStores } from '../../common/hooks/use-stores';
import { IS_FROM_STORE } from '../../config/Config';
import DisabledStoreFeature from '../../common/components/DisabledStoreFeature';

interface Props {
  navigation: any;
}

const SearchComponent = observer((props: Props) => {
  const theme = ThemedStyles.style;
  const { user } = useLegacyStores();
  const localStore = useStores().searchBar;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    localStore.init(user);
  });

  /**
   * On modal show focus input
   */
  const onModalShow = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const border = {
    borderBottomColor: ThemedStyles.getColor('primary_border'),
    borderBottomWidth: 1,
  };

  return (
    <TouchableHighlight
      style={theme.flexContainer}
      onPress={!user.searching ? user.toggleSearching : () => {}}
      underlayColor="transparent">
      <View>
        <Text
          style={[
            theme.fontL,
            theme.colorSecondaryText,
            theme.paddingLeft3x,
            theme.fullWidth,
            theme.paddingVertical2x,
          ]}>
          {i18n.t('searchBar.title')}
        </Text>
        <Modal
          isVisible={user.searching}
          backdropColor="#000000"
          backdropOpacity={0.5}
          useNativeDriver={true}
          onBackdropPress={user.toggleSearching}
          animationInTiming={100}
          onBackButtonPress={user.toggleSearching}
          onModalShow={onModalShow}
          animationOutTiming={100}
          animationOut="fadeOut"
          animationIn="fadeIn"
          style={styles.modal}>
          <SafeAreaView style={theme.backgroundPrimary}>
            <View style={[styles.body, border]}>
              <View
                style={[
                  styles.header,
                  Platform.OS === 'android'
                    ? theme.marginBottom
                    : theme.marginBottom3x,
                  Platform.OS === 'android'
                    ? theme.marginTop3x
                    : theme.marginTop5x,
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
                    placeholderTextColor={ThemedStyles.getColor(
                      'secondary_text',
                    )}
                    onChangeText={(search) => localStore.input(search)}
                    value={localStore.searchText}
                    testID="searchInput"
                    style={[styles.textInput, theme.colorPrimaryText]}
                    selectTextOnFocus={true}
                    onSubmitEditing={() => localStore.searchDiscovery()}
                  />
                </View>
                <Icon
                  onPress={user.toggleSearching}
                  name="close"
                  size={18}
                  style={[
                    styles.button,
                    theme.colorIcon,
                    Platform.OS === 'android' ? theme.centered : null,
                  ]}
                />
              </View>
              {IS_FROM_STORE ? (
                <DisabledStoreFeature
                  style={[styles.height, theme.backgroundPrimary]}
                />
              ) : (
                <SearchResult
                  navigation={props.navigation}
                  localStore={localStore}
                />
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </TouchableHighlight>
  );
});

export default SearchComponent;

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
