import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import MenuSubtitle from '../../common/components/menus/MenuSubtitleWithButton';
import { useLegacyStores } from '../../common/hooks/use-stores';
import Button from '../../common/components/Button';
import Wrapper from './common/Wrapper';
import openUrlService from '../../common/services/open-url.service';
import { MINDS_PRO } from '../../config/Config';
import WireService from '../../wire/WireService';
import type { SupportTiersType } from '../../wire/WireTypes';
import TierManagementScreen from '../../settings/screens/TierManagementScreen';

type PropsType = {
  route: any;
  navigation: any;
};

const createMembershipMonetizeStore = () => {
  const store = {
    loaded: false,
    supportTiers: [] as SupportTiersType[],
    selectedTier: {} as SupportTiersType,
    setSelectedTier(tier: SupportTiersType) {
      this.selectedTier = tier;
    },
    init(guid: string) {
      this.getSupportTiers(guid);
      this.loaded = true;
    },
    async getSupportTiers(guid: string) {
      this.supportTiers = await WireService.getSupportTiers(guid);
    },
  };
  return store;
};

export type TierStoreType = ReturnType<typeof createMembershipMonetizeStore>;

const MembershipMonetizeScreeen = observer(
  ({ route, navigation }: PropsType) => {
    const { user } = useLegacyStores();
    const store = route.params.store;
    const theme = ThemedStyles.style;

    const descriptionTextStyle = [
      theme.colorSecondaryText,
      theme.fontL,
      theme.paddingVertical2x,
    ];

    const localStore = useLocalStore(createMembershipMonetizeStore);

    useEffect(() => {
      if (!localStore.loaded) {
        localStore.init(user.me.guid);
      }
    }, [localStore, user]);

    if (localStore.supportTiers.length === 0) {
      return (
        <Wrapper store={store} hideDone={true}>
          <View style={[theme.paddingVertical6x, theme.paddingHorizontal3x]}>
            <Text style={[styles.title, theme.colorPrimaryText]}>
              {i18n.t('monetize.subScreensTitle')}
            </Text>
            <Text style={descriptionTextStyle}>
              {i18n.t('monetize.membershipMonetize.description')}
            </Text>
            <Text style={[styles.title, theme.colorPrimaryText]}>
              {i18n.t('monetize.membershipMonetize.noTiers')}
            </Text>
            <Text style={descriptionTextStyle}>
              {i18n.t('monetize.membershipMonetize.tiersDescription')}
            </Text>
            <Button
              text={i18n.t('monetize.membershipMonetize.setup')}
              textStyle={[styles.title]}
              onPress={() => openUrlService.open(MINDS_PRO)}
            />
          </View>
        </Wrapper>
      );
    }

    return (
      <Wrapper store={store} doneText={i18n.t('save')}>
        <View style={[theme.paddingVertical6x, theme.paddingHorizontal3x]}>
          <Text style={[styles.title, theme.colorPrimaryText]}>
            {i18n.t('monetize.subScreensTitle')}
          </Text>
          <Text style={descriptionTextStyle}>
            {i18n.t('monetize.membershipMonetize.description')}
          </Text>
          <MenuSubtitle
            labelText={i18n.t('monetize.membershipMonetize.label')}
            linkText={''}
            onLinkPress={() => true}
          />
          <TierManagementScreen
            route={route}
            navigation={navigation}
            tierStore={localStore}
          />
        </View>
      </Wrapper>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
});

export default MembershipMonetizeScreeen;
