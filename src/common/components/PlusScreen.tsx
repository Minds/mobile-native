import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Platform,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useSafeArea } from 'react-native-safe-area-context';
import Switch from 'react-native-switch-pro';
import i18n from '../services/i18n.service';
import StripeCardSelector from '../../wire/methods/v2/StripeCardSelector';
import MindsService from '../../common/services/minds.service';
import CenteredLoading from './CenteredLoading';
import MenuItem from './menus/MenuItem';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import { useLegacyStores } from '../hooks/use-stores';
import { UserError } from '../UserError';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import Button from './Button';
import mindsService from '../services/minds.service';
import UserModel from '../../channel/UserModel';
import entitiesService from '../services/entities.service';

const isIos = Platform.OS === 'ios';

const bannerAspectRatio = 1.3;
type payMethod = 'tokens' | 'usd';

const createPlusStore = () => {
  const store = {
    loaded: false,
    loading: false,
    method: 'tokens' as payMethod,
    card: '' as any,
    settings: false as boolean | any,
    selectedOption: false as boolean | any,
    monthly: false,
    owner: {} as UserModel,
    init(pro: boolean = false) {
      this.getSettings(pro);
    },
    setMonthly(monthly: boolean) {
      this.monthly = monthly;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    async getSettings(pro: boolean) {
      // used to get costs for plus
      this.settings = pro
        ? (await MindsService.getSettings()).upgrades.pro
        : (await MindsService.getSettings()).upgrades.plus;

      // used to pay plus by wire
      const handler = pro
        ? mindsService.settings.handlers.pro
        : mindsService.settings.handlers.plus;

      this.owner = (await entitiesService.single(
        `urn:entity:${handler}`,
      )) as UserModel;

      this.loaded = true;
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

type PlusScreenRouteProp = RouteProp<RootStackParamList, 'PlusScreen'>;
type PlusScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
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
          title: `Annually   ${localStore.method === 'usd' ? '$' : ''}${
            options[0]
          } ${localStore.method === 'tokens' ? 'Tokens' : ''}`,
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
          title: `Monthly   ${localStore.method === 'usd' ? '$' : ''}${
            options[1]
          } ${localStore.method === 'tokens' ? 'Tokens' : ''} / month`,
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
  const { wire } = useLegacyStores();
  const { onComplete, pro } = route.params;

  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];

  const complete = useCallback(
    (done: any) => {
      localStore.setLoading(false);
      onComplete(done);
      navigation.goBack();
    },
    [navigation, onComplete, localStore],
  );

  const payWith = useCallback(
    async (currency: payMethod) => {
      try {
        if (localStore.selectedOption === '0') {
          complete(false);
        }
        wire.setAmount(parseFloat(localStore.selectedOption));
        wire.setCurrency(currency);
        wire.setOwner(localStore.owner);
        wire.setRecurring(localStore.monthly);
        if (currency === 'usd') {
          wire.setPaymentMethodId(localStore.card.id);
        }
        const done = await wire.send();
        if (!done) {
          throw new UserError(i18n.t('boosts.errorPayment'));
        }

        complete(done);
      } catch (err) {
        throw new UserError(err.message);
      } finally {
        localStore.setLoading(false);
      }
    },
    [complete, wire, localStore],
  );

  const confirmSend = useCallback(async () => {
    localStore.setLoading(true);
    payWith(localStore.method);
  }, [localStore, payWith]);

  useEffect(() => {
    if (!localStore.loaded) {
      localStore.init(pro);
    }
  }, [localStore, pro]);

  if (localStore.settings === false) {
    return <CenteredLoading />;
  }

  const texts = pro ? 'pro' : 'plus';
  const cleanTop = { marginTop: insets.top + (isIos ? 60 : 50) };

  return (
    <View style={[cleanTop, styles.container, theme.backgroundSecondary]}>
      <ImageBackground
        style={styles.banner}
        source={require('../../assets/plus-image.png')}
        resizeMode="cover">
        <View style={styles.textContainer}>
          <Text style={styles.minds}>
            {i18n.t(`monetize.${texts}`).toUpperCase()}
          </Text>
          <Text style={styles.title}>{i18n.t(`monetize.${texts}Title`)}</Text>
          <Text style={styles.text}>
            {i18n.t(`monetize.${texts}Description`)}
          </Text>
        </View>
      </ImageBackground>
      {!isIos && (
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
      )}
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
        <View style={theme.marginTop6x}>
          <StripeCardSelector onCardSelected={localStore.setCard} />
        </View>
      )}
      {localStore.selectedOption && (
        <View style={[theme.padding2x, theme.borderTop, theme.borderPrimary]}>
          <Button
            onPress={confirmSend}
            text={i18n.t(`monetize.${texts}Join`)}
            containerStyle={[theme.paddingVertical2x, styles.buttonRight]}
            loading={localStore.loading}
            textStyle={[theme.fontMedium, theme.fontL]}
          />
        </View>
      )}
    </View>
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
    paddingBottom: 5,
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
    marginVertical: 15,
  },
  container: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
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
