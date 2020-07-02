import React, { useEffect } from 'react';
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
import SaveButton from './SaveButton';

const bannerAspectRatio = 1.7;

const createPlusStore = () => {
  const store = {
    loaded: false,
    method: 'usd' as 'usd' | 'tokens',
    card: '' as any,
    settings: false as boolean | any,
    selectedOption: false as boolean | object,
    init() {
      this.getSettings();
      this.loaded = true;
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
    setSelectedOption(option: object) {
      this.selectedOption = option;
    },
  };
  return store;
};

type PlusStoreType = ReturnType<typeof createPlusStore>;

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
          onPress: () => localStore.setSelectedOption(options[0]),
          title: `Annually   ${options[0]} / month`,
          icon:
            localStore.selectedOption === options[0] ? checkIcon : undefined,
          noIcon: localStore.selectedOption !== options[0],
        }}
      />
      <MenuItem
        item={{
          onPress: () => localStore.setSelectedOption(options[1]),
          title: `Monthly   ${options[1]} / month`,
          icon:
            localStore.selectedOption === options[1] ? checkIcon : undefined,
          noIcon: localStore.selectedOption !== options[1],
        }}
      />
    </View>
  );
});

type PropsType = {
  navigation: any;
};

const PlusScreen = observer(({ navigation }: PropsType) => {
  const localStore = useLocalStore(createPlusStore);
  const theme = ThemedStyles.style;
  const insets = useSafeArea();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;

  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];

  navigation.setOptions({
    headerRight: () => <SaveButton onPress={() => {}} text={'Upgrade'} />,
  });

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
          backgroundActive={Colors.switchBackgroun}
          backgroundInactive={Colors.switchBackgroun}
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
});
