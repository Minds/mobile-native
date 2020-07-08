import React, { useCallback, useRef, useEffect } from 'react';
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
import Wrapper from './common/Wrapper';
import CenteredLoading from '../../common/components/CenteredLoading';
import { SupportTiersType } from '../../wire/WireTypes';

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
    usd: '0',
    has_usd: true,
    has_tokens: true,
    loading: false,
    init(support_tier: SupportTiersType) {
      this.usd = support_tier.usd;
      this.has_tokens = support_tier.has_tokens;
      this.has_usd = support_tier.has_usd;
      this.show = true;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
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
      this.show = !this.show;
    },
  }));

  const inputRef = useRef<TextInput>(null);

  const save = useCallback(async () => {
    try {
      localStore.setLoading(true);
      await store.saveCustomMonetize(
        localStore.usd,
        localStore.has_usd,
        localStore.has_tokens,
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      localStore.setLoading(false);
    }
  }, [store, localStore]);

  useEffect(() => {
    if (store.wire_threshold && store.wire_threshold.support_tier) {
      const support_tier: SupportTiersType = store.wire_threshold.support_tier;
      if (!support_tier.public) {
        localStore.init(support_tier);
      }
    }
  }, [store, localStore]);

  const labelStyle = [
    theme.fontM,
    theme.colorSecondaryText,
    theme.marginTop5x,
    theme.paddingHorizontal3x,
    theme.marginBottom2x,
  ];

  if (localStore.loading) {
    return <CenteredLoading />;
  }

  return (
    <Wrapper store={store} hideDone={!localStore.show} onPressRight={save}>
      <View style={[theme.flexContainer, theme.backgroundPrimary]}>
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
          onPress={localStore.showInput}>
          <Text style={[theme.flexContainer, theme.fontL]}>
            {i18n.t('capture.noPaywall')}
          </Text>
          {!localStore.show && (
            <MIcon name="check" size={23} style={theme.colorPrimaryText} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optsRow, theme.borderPrimary]}
          onPress={localStore.showInput}>
          <Text style={[theme.flexContainer, theme.fontL]}>
            {i18n.t('capture.paywall')}
          </Text>
          {localStore.show && (
            <MIcon name="check" size={23} style={theme.colorPrimaryText} />
          )}
        </TouchableOpacity>
        {localStore.show && (
          <>
            <Text style={labelStyle}>
              {i18n.t('monetize.customMonetize.usd')}
            </Text>
            <TextInput
              ref={inputRef}
              style={[
                theme.colorPrimaryText,
                theme.borderPrimary,
                styles.input,
              ]}
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

            <View style={theme.rowJustifySpaceBetween}>
              <View style={theme.flexColumnCentered}>
                <Text style={labelStyle}>
                  {i18n.t('monetize.customMonetize.hasUsd')}
                </Text>
                <Switch
                  value={localStore.has_tokens}
                  onSyncPress={localStore.setHasTokens}
                />
              </View>
              <View style={theme.flexColumnCentered}>
                <Text style={labelStyle}>
                  {i18n.t('monetize.customMonetize.hasTokens')}
                </Text>
                <Switch
                  value={localStore.has_usd}
                  onSyncPress={localStore.setHasUsd}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </Wrapper>
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
