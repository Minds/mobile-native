import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View, StyleSheet, ScrollView, Text, Platform } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useSafeArea } from 'react-native-safe-area-context';
import HeaderComponent from '../../../common/components/HeaderComponent';
import UserNamesComponent from '../../../common/components/UserNamesComponent';
import capitalize from '../../../common/helpers/capitalize';
import StripeCardSelector from '../../methods/v2/StripeCardSelector';
import Switch from 'react-native-switch-pro';
import Colors from '../../../styles/Colors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import { UserError } from '../../../common/UserError';
import supportTiersService from '../../../common/services/support-tiers.service';
import type { SupportTiersType } from '../../../wire/WireTypes';
import UserModel from '../../../channel/UserModel';
import { DotIndicator } from 'react-native-reanimated-indicators';
import Selector from '../../../common/components/Selector';
import MenuItem, {
  MenuItemItem,
} from '../../../common/components/menus/MenuItem';
import { showNotification } from '../../../../AppMessages';

const isIos = Platform.OS === 'ios';

type payMethod = 'tokens' | 'usd';
type JoinMembershipScreenRouteProp = RouteProp<
  RootStackParamList,
  'JoinMembershipScreen'
>;
type JoinMembershipScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'JoinMembershipScreen'
>;

type PropsType = {
  route: JoinMembershipScreenRouteProp;
  navigation: JoinMembershipScreenNavigationProp;
  tiers?: Array<SupportTiersType>;
};

const selectValueExtractor = (item) => item.name;
const selectIdExtractor = (item) => item.urn;

const createJoinMembershipStore = ({ tiers }) => {
  console.log(tiers);
  const store = {
    user: null as UserModel | null,
    card: '' as any,
    currentTier: tiers ? tiers[0] : (null as SupportTiersType | null),
    list: (tiers || []) as Array<SupportTiersType>,
    payMethod: 'tokens' as payMethod,
    loading: false,
    loadingData: tiers ? false : true,
    get currentItem(): MenuItemItem {
      return {
        title: this.currentTier ? capitalize(this.currentTier.name) : '',
        icon: { name: 'chevron-down', type: 'material-community' },
      };
    },
    setUser(user: UserModel) {
      this.user = user;
    },
    setCurrent(tier: SupportTiersType, isInitial = false) {
      this.currentTier = tier;
      if (isInitial) {
        this.payMethod = !isIos && tier.has_usd ? 'usd' : 'tokens';
      }
    },
    async loadList() {
      if (!this.user) {
        return;
      }
      this.setLoadingData(true);
      try {
        const response = await supportTiersService.getAllFromGuid(this.user.guid);
        this.list = response as Array<SupportTiersType>;

        if (!this.currentTier && this.list[0]) {
          this.setCurrent(this.list[0], true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setLoadingData(false);
      }
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setLoadingData(loading: boolean) {
      this.loadingData = loading;
    },
    setPayMethod() {
      this.payMethod = this.payMethod === 'usd' ? 'tokens' : 'usd';
    },
    setCard(card: any) {
      this.card = card;
    },
  };

  return store;
};

const JoinMembershipScreen = observer(({ route, navigation }: PropsType) => {
  const tiers = route.params ? route.params.tiers : undefined;
  /**
   * TODO
   * Get amounts
   * (new) Disable switch if tokens not valid payment
   * show input if tokens is selected payment
   */
  const { wire } = useLegacyStores();
  const store = useLocalStore(createJoinMembershipStore, { tiers });
  const selectorRef = useRef<Selector>(null);

  const { onComplete } = route.params;

  useEffect(() => {
    const { entity, user } = route.params;

    if (entity) {
      const support_tier: SupportTiersType | null =
        entity.wire_threshold && 'support_tier' in entity.wire_threshold
          ? entity.wire_threshold.support_tier
          : null;
      if (support_tier) {
        store.setCurrent(support_tier, true);
      }
      store.setUser(entity.ownerObj);
    } else if (user) {
      store.setUser(user);
    }
    // load tiers if they are not in params
    if (!tiers || tiers.length === 0) {
      store.loadList();
    }
  }, [route.params, store, tiers]);

  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const cleanTop = { marginTop: insets.top + (isIos ? 60 : 50) };
  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];

  const complete = useCallback(() => {
    store.setLoading(false);
    onComplete();
    navigation.goBack();
  }, [navigation, onComplete, store]);

  const openSelector = useCallback(() => {
    if (store.currentTier) {
      selectorRef.current?.show(store.currentTier.urn);
    }
  }, [store]);

  const payWithUsd = useCallback(async () => {
    if (!store.currentTier) {
      return;
    }
    try {
      if (store.currentTier.usd === '0') {
        complete();
      }
      wire.setAmount(parseFloat(store.currentTier.usd));
      wire.setCurrency('usd');
      wire.setOwner(store.user);
      wire.setRecurring(store.currentTier.public);
      wire.setPaymentMethodId(store.card.id);
      const done = await wire.send();

      if (!done) {
        throw new UserError(i18n.t('boosts.errorPayment'));
      }

      complete();
    } catch (err) {
      console.log('payWithUsd err', err);
    } finally {
      store.setLoading(false);
    }
  }, [store, complete, wire]);

  const payWithTokens = useCallback(async () => {
    if (!store.currentTier) {
      return;
    }
    try {
      if (store.currentTier.tokens === '0') {
        complete();
      }
      wire.setAmount(parseFloat(store.currentTier.tokens));
      wire.setCurrency('tokens');
      wire.setOwner(store.user);
      wire.setRecurring(store.currentTier.public);
      const done = await wire.send();
      if (!done) {
        throw new UserError(i18n.t('boosts.errorPayment'));
      }

      complete();
    } catch (err) {
      console.log('payWithTokens err', err);
    } finally {
      store.setLoading(false);
    }
  }, [complete, wire, store]);

  const confirmSend = useCallback(async () => {
    if (!store.currentTier) {
      return;
    }
    store.setLoading(true);
    if (store.payMethod === 'usd') {
      if (!store.currentTier.has_usd) {
        store.setLoading(false);
        showNotification(i18n.t('membership.noUSD'));
      } else {
        payWithUsd();
      }
    }
    if (store.payMethod === 'tokens') {
      if (!store.currentTier.has_tokens) {
        store.setLoading(false);
        showNotification(i18n.t('membership.noTokens'));
      } else {
        payWithTokens();
      }
    }
  }, [store, payWithTokens, payWithUsd]);

  let costText;
  const costTextStyle = [
    theme.fontXL,
    theme.colorSecondaryText,
    theme.fontMedium,
    theme.marginTop6x,
  ];
  if (store.payMethod === 'usd') {
    if (store.currentTier?.has_usd) {
      costText = (
        <Text style={costTextStyle}>
          <Text
            style={theme.colorPrimaryText}>{`$${store.currentTier.usd} `}</Text>
          per month
        </Text>
      );
    } else {
      costText = <Text style={costTextStyle}>Doesn't accept USD</Text>;
    }
  }

  if (store.payMethod === 'tokens') {
    if (store.currentTier?.has_tokens) {
      costText = (
        <Text style={costTextStyle}>
          <Text
            style={
              theme.colorPrimaryText
            }>{`${store.currentTier.tokens} Tokens `}</Text>
          per month
        </Text>
      );
    } else {
      costText = <Text style={costTextStyle}>Doesn't accept Tokens</Text>;
    }
  }

  const payText = store.currentTier?.public
    ? i18n.t('membership.join')
    : i18n.t('membership.pay');

  const item = store.currentItem;
  item.onPress = openSelector;

  return (
    <View
      style={[cleanTop, styles.contentContainer, theme.backgroundSecondary]}>
      {!!store.user && (
        <>
          <HeaderComponent user={store.user} />
          <UserNamesComponent user={store.user} />
        </>
      )}
      {!store.loadingData ? (
        <ScrollView keyboardShouldPersistTaps={true}>
          {!isIos && (
            <View
              style={[
                theme.rowJustifyCenter,
                theme.paddingHorizontal4x,
                theme.alignCenter,
              ]}>
              <Text style={[styles.joinTitle, theme.colorPrimaryText]}>
                Join a membership
              </Text>
              <View style={theme.flexContainer} />
              <Text style={switchTextStyle}>USD</Text>
              <Switch
                value={store.payMethod === 'tokens'}
                onSyncPress={store.setPayMethod}
                circleColorActive={Colors.switchCircle}
                circleColorInactive={Colors.switchCircle}
                backgroundActive={Colors.switchBackground}
                backgroundInactive={Colors.switchBackground}
                style={theme.marginHorizontal2x}
              />
              <Text style={switchTextStyle}>{'Tokens'}</Text>
            </View>
          )}
          <View style={theme.paddingTop4x}>
            {!!store.currentTier && <MenuItem item={store.currentItem} />}
          </View>
          <View style={theme.paddingHorizontal4x}>
            {!!store.currentTier?.description && (
              <View
                style={[
                  styles.description,
                  theme.marginTop6x,
                  theme.paddingLeft2x,
                  theme.borderBackgroundTertiary,
                ]}>
                <Text style={[theme.fontXL, theme.colorPrimaryText]}>
                  {store.currentTier?.description}
                </Text>
              </View>
            )}
            {costText}
          </View>
          {store.payMethod === 'usd' &&
            store.currentTier &&
            store.currentTier.has_usd && (
              <View style={theme.marginTop6x}>
                <StripeCardSelector onCardSelected={store.setCard} />
              </View>
            )}
          <View style={[theme.padding4x, theme.marginTop2x]}>
            <View
              style={[
                store.currentTier?.subscription_urn
                  ? theme.rowJustifySpaceBetween
                  : theme.rowJustifyEnd,
                theme.alignCenter,
              ]}>
              {!!store.currentTier?.subscription_urn && (
                <Text style={[theme.fontL, theme.colorAlert]}>
                  {i18n.t('membership.alreadyMember')}
                </Text>
              )}
              <Button
                onPress={confirmSend}
                text={payText}
                containerStyle={[
                  theme.paddingVertical2x,
                  store.currentTier?.subscription_urn ? styles.disabled : null,
                ]}
                textStyle={[theme.fontMedium, theme.fontL]}
                loading={store.loading}
                disabled={!!store.currentTier?.subscription_urn}
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        <DotIndicator
          color={ThemedStyles.getColor('tertiary_text')}
          dotSize={10}
        />
      )}
      <Selector
        ref={selectorRef}
        onItemSelect={store.setCurrent}
        title={''}
        data={store.list}
        valueExtractor={selectValueExtractor}
        keyExtractor={selectIdExtractor}
        textStyle={theme.fontXXL}
        backdropOpacity={0.9}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  joinTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    borderLeftWidth: 5,
  },
  contentContainer: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  backIcon: {
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  container: {
    marginBottom: 10,
  },
  switchText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  costText: {
    fontFamily: 'Roboto-Medium',
    letterSpacing: 0,
  },
});

export default JoinMembershipScreen;
