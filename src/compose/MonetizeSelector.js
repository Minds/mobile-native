import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import TopBar from './TopBar';
import i18n from '../common/services/i18n.service';
import NavigationService from '../navigation/NavigationService';
import { TextInput } from 'react-native-gesture-handler';

/**
 * NSFW selector
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;

  const localStore = useLocalStore(() => ({
    show: false,
    showInput() {
      this.show = true;
    },
    get tokens() {
      return store.wire_threshold ? store.wire_threshold.min : 0;
    },
  }));

  const onNopaywall = useCallback(() => {
    store.setTokenThreshold(0);
  }, [store]);

  const inputRef = useRef();

  const isActive = Boolean(
    store.wire_threshold && store.wire_threshold.min > 0,
  );

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText={i18n.t('monetize')}
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <Text
        style={[
          theme.paddingVertical6x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.paywallDescription')}
      </Text>
      <TouchableOpacity
        style={[styles.optsRow, theme.borderPrimary]}
        onPress={onNopaywall}>
        <Text style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('capture.noPaywall')}
        </Text>
        {!isActive && (
          <MIcon name="check" size={23} style={theme.colorPrimaryText} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optsRow, theme.borderPrimary]}
        onPress={localStore.showInput}>
        <Text style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('capture.paywall')}
        </Text>
        {isActive && (
          <MIcon name="check" size={23} style={theme.colorPrimaryText} />
        )}
      </TouchableOpacity>
      {(localStore.show || isActive) && (
        <>
          <Text
            style={[
              theme.fontM,
              theme.colorSecondaryText,
              theme.marginTop5x,
              theme.paddingHorizontal3x,
              theme.marginBottom2x,
            ]}>
            {i18n.t('capture.paywallLabel', { currency: 'Tokens' })}
          </Text>
          <TextInput
            ref={inputRef}
            style={[theme.colorPrimaryText, theme.borderPrimary, styles.input]}
            keyboardType="numeric"
            onChangeText={store.setTokenThreshold}
            textAlignVertical="top"
            value={localStore.tokens.toString()}
            autoCapitalize="none"
            multiline={false}
            autoCorrect={false}
            selectTextOnFocus={true}
            underlineColorAndroid="transparent"
            testID="TokenInput"
          />
          {/* <Text
            style={[
              theme.fontM,
              theme.colorSecondaryText,
              theme.marginTop5x,
              theme.paddingHorizontal3x,
              theme.marginBottom2x,
            ]}>
            {i18n.t('capture.paywallLabel', { currency: 'USD' })}
          </Text>
          <TextInput
            style={[theme.colorPrimaryText, theme.borderPrimary, styles.input]}
            keyboardType="numeric"
            onChangeText={localStore.setText}
            textAlignVertical="top"
            value={localStore.text}
            autoCapitalize="none"
            multiline={false}
            autoCorrect={false}
            selectTextOnFocus={true}
            underlineColorAndroid="transparent"
            testID="TokenInput"
          /> */}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingTop: 13,
    paddingBottom: 13,
    textAlignVertical: 'center',
    fontSize: 17,
    height: 46,
  },
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 55,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
