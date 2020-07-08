import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Wrapper from './common/Wrapper';
import type { SupportTiersType } from '../../wire/WireTypes';
import TierManagementScreen from '../../settings/screens/TierManagementScreen';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import supportTiersService from '../../common/services/support-tiers.service';

type MembershipMonetizeScreenRouteProp = RouteProp<
  AppStackParamList,
  'MembershipMonetize'
>;
type MembershipMonetizeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MembershipMonetize'
>;

type PropsType = {
  route: MembershipMonetizeScreenRouteProp;
  navigation: MembershipMonetizeScreenNavigationProp;
};

const createMembershipMonetizeStore = () => {
  const store = {
    loaded: false,
    supportTiers: [] as SupportTiersType[],
    selectedTier: {} as SupportTiersType,
    setSelectedTier(tier: SupportTiersType) {
      this.selectedTier = tier;
    },
    init(wire_threshold) {
      this.getSupportTiers(wire_threshold);
      this.loaded = true;
    },
    async getSupportTiers(wire_threshold) {
      this.supportTiers = (await supportTiersService.getAllFromUser()) || [];
      if (wire_threshold && wire_threshold.support_tier) {
        const urn = wire_threshold.support_tier.urn;
        const found = this.supportTiers.find(
          (support_tier) => support_tier.urn === urn,
        );
        if (found) {
          this.selectedTier = found;
        }
      }
    },
  };
  return store;
};

export type TierStoreType = ReturnType<typeof createMembershipMonetizeStore>;

const MembershipMonetizeScreeen = observer(
  ({ route, navigation }: PropsType) => {
    const store = route.params.store;
    const theme = ThemedStyles.style;

    const descriptionTextStyle = [
      theme.colorSecondaryText,
      theme.fontL,
      theme.paddingVertical2x,
    ];

    const localStore = useLocalStore(createMembershipMonetizeStore);

    const save = useCallback(() => {
      store.saveMembsershipMonetize(localStore.selectedTier);
    }, [store, localStore]);

    useEffect(() => {
      if (!localStore.loaded) {
        localStore.init(store.wire_threshold);
      }
    }, [localStore, store]);

    return (
      <Wrapper store={store} doneText={i18n.t('save')} onPressRight={save}>
        <View style={[theme.paddingTop6x, theme.paddingHorizontal3x]}>
          <Text style={[styles.title, theme.colorPrimaryText]}>
            {i18n.t('monetize.subScreensTitle')}
          </Text>
          <Text style={descriptionTextStyle}>
            {i18n.t('monetize.membershipMonetize.description')}
          </Text>
          {localStore.supportTiers.length === 0 && (
            <>
              <Text style={[styles.title, theme.colorPrimaryText]}>
                {i18n.t('monetize.membershipMonetize.noTiers')}
              </Text>
              <Text style={descriptionTextStyle}>
                {i18n.t('monetize.membershipMonetize.tiersDescription')}
              </Text>
            </>
          )}
        </View>
        <TierManagementScreen
          route={route}
          navigation={navigation}
          tierStore={localStore}
        />
      </Wrapper>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
  buttonLeft: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
});

export default MembershipMonetizeScreeen;
