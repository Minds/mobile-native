import React, { Fragment, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useSafeArea } from 'react-native-safe-area-context';
import HeaderComponent from '../../../common/components/HeaderComponent';
import UserNamesComponent from '../../../common/components/UserNamesComponent';
import LabeledComponent from '../../../common/components/LabeledComponent';
import StripeCardSelector from '../../methods/StripeCardSelector';
import Switch from 'react-native-switch-pro';
import Colors from '../../../styles/Colors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import Button from '../../../common/components/Button';
import WireService from '../../WireService';
import i18n from '../../../common/services/i18n.service';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import { UserError } from '../../../common/UserError';

const tabList = [
  {
    name: 'tokens',
    label: 'Tokens',
  },
  {
    name: 'usd',
    label: 'USD',
  },
];

type payMethod = 'tokens' | 'usd';
type JoinMembershipScreenRouteProp = RouteProp<
  AppStackParamList,
  'JoinMembershipScreen'
>;
type JoinMembershipScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'JoinMembershipScreen'
>;

type PropsType = {
  route: JoinMembershipScreenRouteProp;
  navigation: JoinMembershipScreenNavigationProp;
};

const createJoinMembershipStore = () => {
  const store = {
    card: '' as any,
    payMethod: 'usd' as payMethod,
    loading: false,
    setLoading(loading) {
      this.loading = loading;
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
  /**
   * TODO
   * Get amounts
   * (new) Disable switch if tokens not valid payment
   * show input if tokens is selected payment
   */
  const { wire } = useLegacyStores();
  const store = useLocalStore(createJoinMembershipStore);
  const { support_tier, entity, onComplete } = route.params;

  const owner = entity.ownerObj;

  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;
  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];

  const complete = useCallback(() => {
    store.setLoading(false);
    onComplete();
    navigation.goBack();
  }, [navigation, onComplete, store]);

  const payWithUsd = useCallback(async () => {
    try {
      if (support_tier.usd === '0') {
        complete();
      }
      wire.setAmount(parseFloat(support_tier.usd));
      wire.setCurrency('usd');
      wire.setOwner(owner);
      wire.setRecurring(support_tier.public);
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
  }, [support_tier, store, complete, wire, owner]);

  const payWithTokens = useCallback(async () => {
    try {
      if (support_tier.tokens === '0') {
        complete();
      }
      wire.setAmount(parseFloat(support_tier.tokens));
      wire.setCurrency('tokens');
      wire.setOwner(owner);
      wire.setRecurring(support_tier.public);
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
  }, [support_tier, complete, wire, owner, store]);

  const confirmSend = useCallback(async () => {
    store.setLoading(true);
    if (store.payMethod === 'usd') {
      if (!support_tier.has_usd) {
        store.setLoading(false);
        Alert.alert(i18n.t('sorry'), "It doesn't accept USD");
      } else {
        payWithUsd();
      }
    }
    if (store.payMethod === 'tokens') {
      if (!support_tier.has_tokens) {
        store.setLoading(false);
        Alert.alert(i18n.t('sorry'), "It doesn't accept Tokens");
      } else {
        payWithTokens();
      }
    }
  }, [support_tier, store, payWithTokens, payWithUsd]);

  let costText;
  const costTextStyle = [
    styles.costText,
    theme.fontL,
    theme.colorSecondaryText,
  ];
  if (store.payMethod === 'usd') {
    if (support_tier.has_usd) {
      costText = (
        <Text style={costTextStyle}>
          <Text style={theme.colorPrimaryText}>{`$${support_tier.usd} `}</Text>
          per month
        </Text>
      );
    } else {
      costText = <Text style={costTextStyle}>Doesn't accept USD</Text>;
    }
  }

  if (store.payMethod === 'tokens') {
    if (support_tier.has_usd) {
      costText = (
        <Text style={costTextStyle}>
          <Text
            style={
              theme.colorPrimaryText
            }>{`${support_tier.tokens} Tokens `}</Text>
          per month
        </Text>
      );
    } else {
      costText = <Text style={costTextStyle}>Doesn't accept Tokens</Text>;
    }
  }

  const payText = support_tier.public ? 'Become a Member' : 'Pay Custom Tier';

  return (
    <Fragment>
      <ScrollView
        keyboardShouldPersistTaps={true}
        contentContainerStyle={cleanTop}>
        <View style={styles.container}>
          <HeaderComponent user={owner} />
          <UserNamesComponent user={owner} />
        </View>
        <View style={[theme.rowJustifyStart, theme.paddingLeft4x]}>
          <Text style={switchTextStyle}>{'USD'}</Text>
          <Switch
            value={store.payMethod === 'tokens'}
            onSyncPress={store.setPayMethod}
            circleColorActive={Colors.switchBackgroun}
            circleColorInactive={Colors.switchBackgroun}
            backgroundActive={Colors.switchCircle}
            backgroundInactive={Colors.switchCircle}
            style={theme.marginHorizontal2x}
          />
          <Text style={switchTextStyle}>{'Tokens'}</Text>
        </View>
        <View style={theme.padding4x}>
          <Text
            style={[
              styles.tierName,
              theme.fontXL,
              theme.colorPrimaryText,
              theme.marginBottom2x,
            ]}>{`${
            support_tier.name.charAt(0).toUpperCase() +
            support_tier.name.slice(1)
          } Tier`}</Text>
          {costText}
        </View>
        {store.payMethod === 'usd' && support_tier.has_usd && (
          <LabeledComponent
            label="Select Card"
            wrapperStyle={[theme.marginBottom4x, theme.paddingLeft4x]}>
            <ScrollView
              contentContainerStyle={[
                theme.paddingLeft2x,
                theme.paddingRight2x,
                theme.columnAlignCenter,
                theme.alignCenter,
                theme.paddingTop2x,
              ]}>
              <StripeCardSelector onCardSelected={store.setCard} />
            </ScrollView>
          </LabeledComponent>
        )}
        <View style={[theme.padding2x, theme.borderTop, theme.borderPrimary]}>
          <Button
            onPress={confirmSend}
            text={payText}
            containerStyle={[theme.paddingVertical2x, styles.buttonRight]}
            loading={store.loading}
          />
        </View>
      </ScrollView>
    </Fragment>
  );
});

const styles = StyleSheet.create({
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
    fontSize: 15,
  },
  tierName: {
    fontFamily: 'Roboto-Bold',
    letterSpacing: 0,
  },
  costText: {
    fontFamily: 'Roboto-Medium',
    letterSpacing: 0,
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
});

export default JoinMembershipScreen;
