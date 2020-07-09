import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  ScrollView,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useSafeArea } from 'react-native-safe-area-context';
import Switch from 'react-native-switch-pro';
import i18n from '../services/i18n.service';
import LabeledComponent from './LabeledComponent';
import StripeCardSelector from '../../wire/methods/StripeCardSelector';
import MindsService from '../../common/services/minds.service';
import CenteredLoading from './CenteredLoading';
import MenuItem from './menus/MenuItem';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import { useLegacyStores } from '../hooks/use-stores';
import { UserError } from '../UserError';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import Button from './Button';
import mindsService from '../services/minds.service';

const bannerAspectRatio = 1.7;

const createPlusStore = () => {
  const store = {
    loaded: false,
    loading: false,
    method: 'usd' as 'usd' | 'tokens',
    card: '' as any,
    settings: false as boolean | any,
    selectedOption: false as boolean | any,
    monthly: false,
    init() {
      this.getSettings();
      this.loaded = true;
    },
    setMonthly(monthly: boolean) {
      this.monthly = monthly;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    async getSettings() {
      this.settings = (await MindsService.getSettings()).upgrades.plus;
    },
    setMethod() {
      this.method = this.method === 'usd' ? 'tokens' : 'usd';
    },
    setCard(card: any) {
      this.card = card;
    },
    setSettings(settings) {
      this.settings = settings;
    },
    setSelectedOption(option: any) {
      this.selectedOption = option;
    },
  };
  return store;
};

type PlusStoreType = ReturnType<typeof createPlusStore>;

type payMethod = 'tokens' | 'usd';

type PlusScreenRouteProp = RouteProp<AppStackParamList, 'PlusScreen'>;
type PlusScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'PlusScreen'
>;

type PropsType = {
  route: PlusScreenRouteProp;
  navigation: PlusScreenNavigationProp;
};

type PropsOptionType = {
  options: any[];
  localStore: PlusStoreType;
};

const Options = observer(({ options, localStore }: PropsOptionType) => {
  const theme = ThemedStyles.style;
  const checkIcon = (
    <MIcon name="check" size={23} style={theme.colorPrimaryText} />
  );
  return (
    <View>
      <MenuItem
        item={{
          onPress: () => {
            localStore.setSelectedOption(options[0]);
            localStore.setMonthly(false);
          },
          title: `Annually   ${options[0]}`,
          icon:
            localStore.selectedOption === options[0] ? checkIcon : undefined,
          noIcon: localStore.selectedOption !== options[0],
        }}
      />
      <MenuItem
        item={{
          onPress: () => {
            localStore.setSelectedOption(options[1]);
            localStore.setMonthly(true);
          },
          title: `Monthly   ${options[1]} / month`,
          icon:
            localStore.selectedOption === options[1] ? checkIcon : undefined,
          noIcon: localStore.selectedOption !== options[1],
        }}
      />
    </View>
  );
});

const PlusScreen = observer(({ navigation, route }: PropsType) => {
  const localStore = useLocalStore(createPlusStore);
  const theme = ThemedStyles.style;
  const insets = useSafeArea();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;
  const { wire } = useLegacyStores();
  const { onComplete } = route.params;
  const owner = mindsService.settings.plus.handler;

  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];

  const complete = useCallback(() => {
    localStore.setLoading(false);
    onComplete();
    navigation.goBack();
  }, [navigation, onComplete, localStore]);

  const payWithUsd = useCallback(async () => {
    try {
      if (localStore.selectedOption === '0') {
        complete();
      }
      wire.setAmount(parseFloat(localStore.selectedOption));
      wire.setCurrency('usd');
      wire.setOwner(owner);
      wire.setRecurring(localStore.monthly);
      wire.setPaymentMethodId(localStore.card.id);
      const done = await wire.send();

      if (!done) {
        throw new UserError(i18n.t('boosts.errorPayment'));
      }

      complete();
    } catch (err) {
      console.log('payWithUsd err', err);
    } finally {
      localStore.setLoading(false);
    }
  }, [localStore, complete, wire, owner]);

  const payWithTokens = useCallback(async () => {
    try {
      if (localStore.selectedOption === '0') {
        complete();
      }
      wire.setAmount(parseFloat(localStore.selectedOption));
      wire.setCurrency('tokens');
      wire.setOwner(owner);
      wire.setRecurring(localStore.monthly);
      const done = await wire.send();
      if (!done) {
        throw new UserError(i18n.t('boosts.errorPayment'));
      }

      complete();
    } catch (err) {
      console.log('payWithTokens err', err);
    } finally {
      localStore.setLoading(false);
    }
  }, [complete, wire, owner, localStore]);

  const confirmSend = useCallback(async () => {
    localStore.setLoading(true);
    if (localStore.method === 'usd') {
      payWithUsd();
    }
    if (localStore.method === 'tokens') {
      payWithTokens();
    }
  }, [localStore, payWithTokens, payWithUsd]);

  useEffect(() => {
    if (!localStore.loaded) {
      localStore.init();
    }
  }, [localStore]);

  if (localStore.settings === false) {
    return <CenteredLoading />;
  }

  return (
    <ScrollView style={[styles.container, cleanTop]}>
      <ImageBackground
        style={styles.banner}
        source={require('../../assets/plus-image.png')}
        resizeMode="cover">
        <View style={styles.textContainer}>
          <Text style={styles.minds}>Minds</Text>
          <Text style={styles.title}>Unlock the power of Minds</Text>
          <Text style={styles.text}>
            Support Minds and unlock features such as earning revenue for your
            content, hiding ads, accessing exclusive content, receiving a badge
            and verifying your channel.
          </Text>
        </View>
      </ImageBackground>
      <View
        style={[
          theme.rowJustifyStart,
          theme.padding4x,
          theme.borderPrimary,
          theme.borderTopHair,
          theme.borderBottomHair,
        ]}>
        <Text style={switchTextStyle}>{i18n.t('usd')}</Text>
        <Switch
          value={localStore.method === 'tokens'}
          onSyncPress={localStore.setMethod}
          circleColorActive={Colors.switchCircle}
          circleColorInactive={Colors.switchCircle}
          backgroundActive={Colors.switchBackground}
          backgroundInactive={Colors.switchBackground}
          style={theme.marginHorizontal2x}
        />
        <Text style={switchTextStyle}>{i18n.t('tokens')}</Text>
      </View>
      {localStore.method === 'usd' && (
        <Options
          localStore={localStore}
          options={[
            localStore.settings.yearly.usd,
            localStore.settings.monthly.usd,
          ]}
        />
      )}
      {localStore.method === 'tokens' && (
        <Options
          localStore={localStore}
          options={[
            localStore.settings.yearly.tokens,
            localStore.settings.monthly.tokens,
          ]}
        />
      )}
      {localStore.method === 'usd' && (
        <LabeledComponent
          label="SELECT CARD"
          wrapperStyle={[theme.marginVertical4x, theme.paddingHorizontal4x]}>
          <ScrollView
            contentContainerStyle={[
              theme.paddingLeft2x,
              theme.paddingRight2x,
              theme.columnAlignCenter,
              theme.alignCenter,
              theme.paddingTop2x,
            ]}>
            <StripeCardSelector onCardSelected={localStore.setCard} />
          </ScrollView>
        </LabeledComponent>
      )}
      <View style={[theme.padding2x, theme.borderTop, theme.borderPrimary]}>
        <Button
          onPress={confirmSend}
          text={'Upgrade to Plus'}
          containerStyle={[theme.paddingVertical2x, styles.buttonRight]}
          loading={localStore.loading}
        />
      </View>
    </ScrollView>
  );
});

export default PlusScreen;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  minds: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Roboto-Black',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  text: {
    color: '#AEB0B8',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginTop: 15,
  },
  container: {
    marginBottom: 10,
  },
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
  },
  switchText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
  buttonRight: {
    alignSelf: 'flex-end',
  },
});
