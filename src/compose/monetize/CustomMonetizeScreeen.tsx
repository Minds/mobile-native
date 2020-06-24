import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import ThemedStyles from '../../styles/ThemedStyles';

import { AppStackParamList } from '../../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { string } from 'react-native-redash';
import Switch from 'react-native-switch-pro';

type CustomMonetizeScreenRouteProp = RouteProp<
  AppStackParamList,
  'CustomMonetize'
>;
type CustomMonetizeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'CustomMonetize'
>;

type PropsType = {
  route: CustomMonetizeScreenRouteProp;
};

const CustomMonetizeScreen = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;

  const localStore = useLocalStore(() => ({
    show: false,
    usd: '',
    has_usd: true,
    has_tokens: true,
    setUsd(usd: string) {
      this.usd = usd;
    },
    setHasUsd(has_usd: boolean) {
      this.has_usd = has_usd;
    },
    setHasTokens(has_tokens: boolean) {
      this.has_tokens = has_tokens;
    },
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

  const inputRef = useRef<TextInput>(null);

  const isActive = Boolean(
    store.wire_threshold && store.wire_threshold.min > 0,
  );

  const save = useCallback(() => {
    store.saveCustomMonetize(
      localStore.usd,
      localStore.has_usd,
      localStore.has_tokens,
    );
  }, [store, localStore]);

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText={i18n.t('monetize.title')}
        rightText={i18n.t('done')}
        onPressRight={save}
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
          <View style={theme.rowJustifySpaceBetween}>
            <Switch
              value={localStore.has_tokens}
              onSyncPress={localStore.setHasTokens}
            />
            <Switch
              value={localStore.has_usd}
              onSyncPress={localStore.setHasUsd}
            />
          </View>
          <TextInput
            ref={inputRef}
            style={[theme.colorPrimaryText, theme.borderPrimary, styles.input]}
            keyboardType="numeric"
            onChangeText={localStore.setUsd}
            textAlignVertical="top"
            value={localStore.usd}
            autoCapitalize="none"
            multiline={false}
            autoCorrect={false}
            selectTextOnFocus={true}
            underlineColorAndroid="transparent"
            testID="TokenInput"
          />
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

export default CustomMonetizeScreen;
