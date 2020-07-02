import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import MenuSubtitleWithButton from '../../common/components/menus/MenuSubtitleWithButton';
import i18n from '../../common/services/i18n.service';
import { StyleSheet, Text, ScrollView } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { SupportTiersType } from '../../wire/WireTypes';
import MenuItem from '../../common/components/menus/MenuItem';
import { TierStoreType } from '../../compose/monetize/MembershipMonetizeScreeen';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import supportTiersService from '../../common/services/support-tiers.service';

export type PaymentType = 'usd' | 'tokens';

type HeaderPropsType = {
  labelText: string;
  onLinkPress: () => void;
};

type PropsType = {
  route: any;
  navigation: any;
  tierStore: TierStoreType;
};

const Header = ({ onLinkPress, labelText }: HeaderPropsType) => {
  const theme = ThemedStyles.style;
  return (
    <MenuSubtitleWithButton
      labelText={labelText}
      labelStyle={[styles.label, theme.colorSecondaryText]}
      linkText={i18n.t('settings.addTier')}
      linkStyle={[styles.link, theme.colorLink]}
      containerStyle={theme.paddingHorizontal4x}
      onLinkPress={onLinkPress}
    />
  );
};

const navToTierScreen = (
  navigation: any,
  tier: SupportTiersType | boolean = false,
) => {
  navigation.push('TierScreen', { tier });
};

const renderTiers = (
  tiers: SupportTiersType[],
  type: PaymentType,
  useForSelection: boolean,
  tierStore: TierStoreType,
  navigation: any,
) => {
  const theme = ThemedStyles.style;
  const checkIcon = (
    <MIcon name="check" size={23} style={theme.colorPrimaryText} />
  );
  if (tiers.length > 0) {
    return tiers.map((tier) => (
      <MenuItem
        item={{
          onPress: useForSelection
            ? () => tierStore.setSelectedTier(tier)
            : () => navToTierScreen(navigation, tier),
          title: tier.description,
          icon:
            useForSelection && tier === tierStore.selectedTier
              ? checkIcon
              : undefined,
          noIcon: useForSelection && tier !== tierStore.selectedTier,
        }}
      />
    ));
  } else {
    return (
      <Text style={[theme.fontL, theme.colorSecondaryText]}>
        {i18n.t(
          type === 'tokens' ? 'settings.noTokenTier' : 'settings.noUsdTier',
        )}
      </Text>
    );
  }
};

const createTierManagementStore = () => {
  const store = {
    loaded: false,
    support_tiers: [] as SupportTiersType[],
    setSupportTIers(support_tiers: SupportTiersType[]) {
      this.support_tiers = support_tiers;
    },
  };
  return store;
};

const TierManagementScreen = observer(
  ({ route, navigation, tierStore }: PropsType) => {
    const { user } = useLegacyStores();
    const money: SupportTiersType[] = user.me.wire_rewards.rewards.money;
    const tokens: SupportTiersType[] = user.me.wire_rewards.rewards.tokens;

    const useForSelection: boolean = !!route.params.useForSelection;

    const renderTiersCallBack = useCallback(
      (tiers: SupportTiersType[], type: PaymentType) => {
        return renderTiers(tiers, type, useForSelection, tierStore, navigation);
      },
      [useForSelection, tierStore, navigation],
    );

    useEffect(() => {
      const getTiers = async () => {
        const support_tiers = await supportTiersService.getAllFromUser();
        //if (support_tiers) {
        console.log('support_tiers', support_tiers);
        //}
      };
      getTiers();
    }, []);

    return (
      <ScrollView>
        <Header
          labelText={i18n.t('settings.tokenTiers')}
          onLinkPress={() => navToTierScreen(navigation)}
        />
        {renderTiersCallBack(tokens, 'tokens')}
        <Header
          labelText={i18n.t('settings.usdTiers')}
          onLinkPress={() => navToTierScreen(navigation)}
        />
        {renderTiersCallBack(money, 'usd')}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    letterSpacing: 0,
  },
  link: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    letterSpacing: 0,
    textDecorationLine: 'none',
  },
});

export default TierManagementScreen;
