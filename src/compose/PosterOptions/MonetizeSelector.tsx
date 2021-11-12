import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import TextInput from '../../common/components/TextInput';
import MText from '../../common/components/MText';

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

  const inputRef = useRef<any>();

  const isActive = Boolean(
    store.wire_threshold && store.wire_threshold.min > 0,
  );

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText={i18n.t('monetize.title')}
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        backIconName="chevron-left"
        backIconSize="large"
        store={store}
      />
      <MText
        style={[
          theme.paddingVertical6x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.paywallDescription')}
      </MText>
      <TouchableOpacity
        style={[styles.optsRow, theme.bcolorPrimaryBorder]}
        onPress={onNopaywall}>
        <MText style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('capture.noPaywall')}
        </MText>
        {!isActive && (
          <MIcon name="check" size={23} style={theme.colorPrimaryText} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optsRow, theme.bcolorPrimaryBorder]}
        onPress={localStore.showInput}>
        <MText style={[theme.flexContainer, theme.fontL]}>
          {i18n.t('capture.paywall')}
        </MText>
        {isActive && (
          <MIcon name="check" size={23} style={theme.colorPrimaryText} />
        )}
      </TouchableOpacity>
      {(localStore.show || isActive) && (
        <>
          <MText
            style={[
              theme.fontM,
              theme.colorSecondaryText,
              theme.marginTop5x,
              theme.paddingHorizontal3x,
              theme.marginBottom2x,
            ]}>
            {i18n.t('capture.paywallLabel', { currency: 'Tokens' })}
          </MText>
          <TextInput
            ref={inputRef}
            style={[
              theme.colorPrimaryText,
              theme.bcolorPrimaryBorder,
              styles.input,
            ]}
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
          {/* <MText
            style={[
              theme.fontM,
              theme.colorSecondaryText,
              theme.marginTop5x,
              theme.paddingHorizontal3x,
              theme.marginBottom2x,
            ]}>
            {i18n.t('capture.paywallLabel', { currency: 'USD' })}
          </MText>
          <TextInput
            style={[theme.colorPrimaryText, theme.bcolorPrimaryBorder, styles.input]}
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
