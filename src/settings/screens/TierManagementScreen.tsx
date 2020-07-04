import React, { useCallback, useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import MenuSubtitleWithButton from '../../common/components/menus/MenuSubtitleWithButton';
import i18n from '../../common/services/i18n.service';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { SupportTiersType } from '../../wire/WireTypes';
import MenuItem from '../../common/components/menus/MenuItem';
import { TierStoreType } from '../../compose/monetize/MembershipMonetizeScreeen';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import supportTiersService from '../../common/services/support-tiers.service';
import CenteredLoading from '../../common/components/CenteredLoading';

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
      containerStyle={[theme.paddingHorizontal4x, theme.marginBottom4x]}
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
  useForSelection: boolean,
  tierStore: TierStoreType,
  navigation: any,
) => {
  const theme = ThemedStyles.style;
  const checkIcon = (
    <MIcon name="check" size={23} style={theme.colorSecondaryText} />
  );
  const transparentCheckIcon = (
    <MIcon name="check" size={23} style={theme.colorTransparent} />
  );
  if (tiers.length > 0) {
    return tiers.map((tier) => (
      <MenuItem
        item={{
          onPress: useForSelection
            ? () => tierStore.setSelectedTier(tier)
            : () => navToTierScreen(navigation, tier),
          title: (
            <View
              style={[
                theme.rowJustifySpaceBetween,
                theme.paddingTop3x,
                theme.paddingBottom3x,
              ]}>
              <Text style={theme.colorPrimaryText}>{tier.description}</Text>
              <Text
                style={theme.colorSecondaryText}>{`$${tier.usd}+ / mth`}</Text>
            </View>
          ),
          icon: !useForSelection
            ? undefined
            : tier === tierStore.selectedTier
            ? checkIcon
            : transparentCheckIcon,
        }}
        containerItemStyle={theme.backgroundPrimary}
      />
    ));
  } else {
    return (
      <Text style={[theme.fontL, theme.colorSecondaryText]}>
        {i18n.t('settings.noTiers')}
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
      this.loaded = true;
    },
  };
  return store;
};

const TierManagementScreen = observer(
  ({ route, navigation, tierStore }: PropsType) => {
    const localStore = useLocalStore(createTierManagementStore);

    const useForSelection: boolean = !!route.params.useForSelection;

    const renderTiersCallBack = useCallback(() => {
      return renderTiers(
        localStore.support_tiers,
        useForSelection,
        tierStore,
        navigation,
      );
    }, [useForSelection, tierStore, navigation, localStore]);

    useEffect(() => {
      const getTiers = async () => {
        const support_tiers = await supportTiersService.getAllFromUser();
        if (support_tiers) {
          localStore.setSupportTIers(support_tiers);
        }
      };

      getTiers();
    }, [localStore]);

    if (!localStore.loaded) {
      return <CenteredLoading />;
    }

    return (
      <ScrollView>
        <Header
          labelText={i18n.t('monetize.membershipMonetize.label')}
          onLinkPress={() => navToTierScreen(navigation)}
        />
        {renderTiersCallBack()}
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
