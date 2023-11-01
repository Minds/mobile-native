import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Platform, View } from 'react-native';
import ThemedStyles, { useMemoStyle } from '../../../styles/ThemedStyles';
import capitalize from '../../../common/helpers/capitalize';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import i18n from '../../../common/services/i18n.service';
import { UserError } from '../../../common/UserError';
import supportTiersService from '../../../common/services/support-tiers.service';
import type { SupportTiersType } from '../../WireTypes';
import UserModel from '../../../channel/UserModel';
import { Flow } from 'react-native-animated-spinkit';
import Selector from '../../../common/components/SelectorV2';
import MenuItem, {
  MenuItemProps,
} from '../../../common/components/menus/MenuItem';
import { showNotification } from '../../../../AppMessages';
import WireStore from '../../WireStore';
import MText from '../../../common/components/MText';
import { Button } from '~ui';
import Switch from '~/common/components/controls/Switch';
import StripeCardSelector from '../../../common/components/stripe-card-selector/StripeCardSelector';
import { confirm } from '~/common/components/Confirm';
import { IS_FROM_STORE } from '~/config/Config';

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

const selectValueExtractor = item => item.name;
const selectIdExtractor = item => item.urn;

const createJoinMembershipStore = ({ tiers }) => ({
  wire: new WireStore(),
  user: null as UserModel | null,
  card: '' as any,
  currentTier: tiers ? tiers[0] : (null as SupportTiersType | null),
  list: (tiers || []) as Array<SupportTiersType>,
  payMethod: 'tokens' as payMethod,
  loading: false,
  loadingData: !tiers,
  get currentItem(): MenuItemProps {
    return {
      title: this.currentTier ? capitalize(this.currentTier.name) : '',
      icon: 'chevron-down',
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
});

const JoinMembershipScreen = observer(({ route, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];
  const { tiers } = route.params ?? {};
  const selectorRef = useRef<any>(null);
  const { onComplete } = route.params;
  /**
   * TODO
   * Get amounts
   * (new) Disable switch if tokens not valid payment
   * show input if tokens is selected payment
   */
  const store = useLocalStore(createJoinMembershipStore, { tiers });

  const urn = store.currentTier?.subscription_urn;

  const membershipStyle = useMemoStyle(
    [
      urn ? 'rowJustifySpaceBetween' : 'rowJustifyEnd',
      {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    ],
    [urn],
  );

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

  const complete = useCallback(() => {
    store.setLoading(false);
    if (onComplete && typeof onComplete === 'function') {
      onComplete();
    }
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
      store.wire.setAmount(parseFloat(store.currentTier.usd));
      store.wire.setCurrency('usd');
      store.wire.setOwner(store.user);
      store.wire.setRecurring(store.currentTier.public);
      store.wire.setPaymentMethodId(store.card.id);
      const done = await store.wire.send();

      if (!done) {
        throw new UserError(i18n.t('boosts.errorPayment'));
      }

      complete();
    } catch (err) {
      console.log('payWithUsd err', err);
    } finally {
      store.setLoading(false);
    }
  }, [store, complete]);

  const payWithTokens = useCallback(async () => {
    if (!store.currentTier) {
      return;
    }
    try {
      if (store.currentTier.tokens === '0') {
        complete();
      }
      store.wire.setAmount(parseFloat(store.currentTier.tokens));
      store.wire.setCurrency('tokens');
      store.wire.setOwner(store.user);
      store.wire.setRecurring(store.currentTier.public);
      const done = await store.wire.send();
      if (!done) {
        throw new UserError(i18n.t('boosts.errorPayment'));
      }
      setTimeout(complete, 500);
    } catch (err) {
      console.log('payWithTokens err', err);
    } finally {
      store.setLoading(false);
    }
  }, [complete, store]);

  const confirmSend = useCallback(async () => {
    if (!store.currentTier) {
      return;
    }
    if (
      !(await confirm({
        title: i18n.t('supermind.confirmNoRefund.title'),
        description: i18n.t('supermind.confirmNoRefund.description'),
      }))
    ) {
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
  if (store.payMethod === 'usd') {
    if (store.currentTier?.has_usd) {
      costText = (
        <MText style={styles.costTextStyle}>
          <MText
            style={
              theme.colorPrimaryText
            }>{`$${store.currentTier.usd} `}</MText>
          per month
        </MText>
      );
    } else {
      costText = <MText style={styles.costTextStyle}>Doesn't accept USD</MText>;
    }
  }

  if (store.payMethod === 'tokens') {
    if (store.currentTier?.has_tokens) {
      costText = (
        <MText style={styles.costTextStyle}>
          <MText
            style={
              theme.colorPrimaryText
            }>{`${store.currentTier.tokens} Tokens `}</MText>
          per month
        </MText>
      );
    } else {
      costText = (
        <MText style={styles.costTextStyle}>Doesn't accept Tokens</MText>
      );
    }
  }

  const enabled =
    (store.payMethod === 'tokens' && store.currentTier?.has_tokens) ||
    (store.payMethod === 'usd' && store.currentTier?.has_usd);

  const payText = store.currentTier?.public
    ? i18n.t('membership.join')
    : i18n.t('membership.pay');

  const item = store.currentItem;
  item.onPress = openSelector;

  return (
    <View>
      {!store.loadingData ? (
        <>
          {!isIos && (
            <View style={styles.headerContainer}>
              {store.currentTier?.public && (
                <MText style={styles.joinTitle}>Join a membership</MText>
              )}
              <View style={theme.flexContainer} />
              {!IS_FROM_STORE && (
                <>
                  <MText style={switchTextStyle}>USD</MText>
                  <Switch
                    value={store.payMethod === 'tokens'}
                    onChange={store.setPayMethod}
                    style={theme.marginHorizontal2x}
                  />
                  <MText style={switchTextStyle}>{'Tokens'}</MText>
                </>
              )}
            </View>
          )}
          <View style={theme.paddingTop4x}>
            {!!store.currentTier && <MenuItem {...item} />}
          </View>
          <View style={theme.paddingHorizontal4x}>
            {!!store.currentTier?.description && (
              <View style={styles.descriptionWrapper}>
                <MText style={styles.descriptionText}>
                  {store.currentTier?.description}
                </MText>
              </View>
            )}
            {costText}
          </View>
          {!IS_FROM_STORE &&
            store.payMethod === 'usd' &&
            store.currentTier &&
            store.currentTier.has_usd && (
              <View style={styles.stripeCardSelectorWrapper}>
                <StripeCardSelector onCardSelected={store.setCard} />
              </View>
            )}
          <View style={styles.alreadyAMemberWrapper}>
            <View style={membershipStyle}>
              {!!store.currentTier?.subscription_urn && (
                <MText style={styles.alreadyAMemberText}>
                  {i18n.t('membership.alreadyMember')}
                </MText>
              )}
              <Button
                top="L"
                type="action"
                mode="outline"
                onPress={confirmSend}
                disabled={!!store.currentTier?.subscription_urn || !enabled}
                spinner
                loading={store.loading}>
                {payText}
              </Button>
            </View>
          </View>
        </>
      ) : (
        <Flow color={ThemedStyles.getColor('TertiaryText')} />
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

const styles = ThemedStyles.create({
  alreadyAMemberText: ['fontL', 'colorAlert'],
  alreadyAMemberWrapper: ['padding4x', 'marginTop2x'],
  stripeCardSelectorWrapper: ['marginTop6x', 'marginHorizontal3x'],
  headerContainer: [
    'rowJustifyCenter',
    'paddingHorizontal4x',
    'paddingTop4x',
    'alignCenter',
  ],
  costTextStyle: ['fontXL', 'colorSecondaryText', 'fontMedium', 'marginTop6x'],
  joinTitle: [
    'colorPrimaryText',
    {
      fontSize: 20,
      fontWeight: '800',
    },
  ],
  descriptionWrapper: [
    'marginTop6x',
    'paddingLeft2x',
    'bcolorTertiaryBackground',
    {
      borderLeftWidth: 5,
    },
  ],
  descriptionText: ['fontXL', 'colorPrimaryText'],
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
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
  },
  costText: {
    fontFamily: 'Roboto_500Medium',
    letterSpacing: 0,
  },
});

export default JoinMembershipScreen;
