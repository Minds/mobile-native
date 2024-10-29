import React, { FC, useCallback, useEffect, useRef } from 'react';
import type { TextInput as TextInputType } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import { StackScreenProps } from '@react-navigation/stack';

import MIcon from '@expo/vector-icons/MaterialCommunityIcons';

import Wrapper from './common/Wrapper';
import CenteredLoading from '../../../common/components/CenteredLoading';
import { SupportTiersType } from '../../../wire/WireTypes';
import TextInput from '../../../common/components/TextInput';
import MText from '../../../common/components/MText';
import { PosterStackParamList } from '~/compose/PosterOptions/PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';
import Switch from '~/common/components/controls/Switch';
import sp from '~/services/serviceProvider';

interface PropsType
  extends FC,
    StackScreenProps<PosterStackParamList, 'CustomMonetize'> {}

const CustomMonetizeScreen = observer(({}: PropsType) => {
  const theme = sp.styles.style;
  const store = useComposeContext();
  const i18n = sp.i18n;
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

  const inputRef = useRef<TextInputType>(null);

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
      <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
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
          onPress={localStore.showInput}>
          <MText style={[theme.flexContainer, theme.fontL]}>
            {i18n.t('capture.noPaywall')}
          </MText>
          {!localStore.show && (
            <MIcon name="check" size={23} style={theme.colorPrimaryText} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optsRow, theme.bcolorPrimaryBorder]}
          onPress={localStore.showInput}>
          <MText style={[theme.flexContainer, theme.fontL]}>
            {i18n.t('capture.paywall')}
          </MText>
          {localStore.show && (
            <MIcon name="check" size={23} style={theme.colorPrimaryText} />
          )}
        </TouchableOpacity>
        {localStore.show && (
          <>
            <MText style={labelStyle}>
              {i18n.t('monetize.customMonetize.usd')}
            </MText>
            <TextInput
              ref={inputRef}
              style={[
                theme.colorPrimaryText,
                theme.bcolorPrimaryBorder,
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
                <MText style={labelStyle}>
                  {i18n.t('monetize.customMonetize.hasTokens')}
                </MText>
                <Switch
                  value={localStore.has_usd}
                  onChange={localStore.setHasUsd}
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
