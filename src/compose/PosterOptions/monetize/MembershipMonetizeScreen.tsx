import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';

import Wrapper from './common/Wrapper';
import type { SupportTiersType } from '~/wire/WireTypes';
import TierManagementScreen from '~/common/components/tier-management/TierManagementScreen';
import CenteredLoading from '~/common/components/CenteredLoading';
import MText from '~/common/components/MText';
import { useComposeContext } from '~/compose/useComposeStore';
import { PosterStackScreenProps } from '~/compose/PosterOptions/PosterStackNavigator';
import sp from '~/services/serviceProvider';

type PropsType = PosterStackScreenProps<'MembershipMonetize'>;

const createMembershipMonetizeStore = () => {
  const supportTiersService = sp.resolve('supportTiers');
  const store = {
    loaded: false,
    supportTiers: [] as SupportTiersType[],
    selectedTier: {} as SupportTiersType,
    setSelectedTier(tier: SupportTiersType) {
      this.selectedTier = tier;
    },
    init(wire_threshold) {
      this.getSupportTiers(wire_threshold);
    },
    async getSupportTiers(wire_threshold) {
      this.supportTiers = (await supportTiersService.getAllFromUser()) || [];
      this.checkForSelected(wire_threshold);
    },
    checkForSelected(wire_threshold) {
      if (wire_threshold && wire_threshold.support_tier) {
        const urn = wire_threshold.support_tier.urn;
        const found = this.supportTiers.find(
          support_tier => support_tier.urn === urn,
        );
        if (found) {
          this.selectedTier = found;
        }
      }
      this.loaded = true;
    },
  };
  return store;
};

export type TierStoreType = ReturnType<typeof createMembershipMonetizeStore>;

const MembershipMonetizeScreen = observer(
  ({ route, navigation }: PropsType) => {
    const store = useComposeContext();
    const theme = sp.styles.style;

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

    const title = [styles.title, theme.colorPrimaryText, theme.paddingTop3x];
    const i18n = sp.i18n;
    return (
      <Wrapper
        store={store}
        doneText={i18n.t('save')}
        onPressRight={save}
        hideDone={!localStore.selectedTier.urn}>
        {localStore.loaded ? (
          <>
            <View style={[theme.paddingTop3x, theme.paddingHorizontal3x]}>
              <MText style={title}>{i18n.t('monetize.subScreensTitle')}</MText>
              <MText style={descriptionTextStyle}>
                {i18n.t('monetize.membershipMonetize.description')}
              </MText>
              {localStore.supportTiers.length === 0 && (
                <>
                  <MText style={title}>
                    {i18n.t('monetize.membershipMonetize.noTiers')}
                  </MText>
                  <MText style={descriptionTextStyle}>
                    {i18n.t('monetize.membershipMonetize.tiersDescription')}
                  </MText>
                </>
              )}
            </View>
            <TierManagementScreen
              route={route}
              navigation={navigation}
              tierStore={localStore}
            />
          </>
        ) : (
          <CenteredLoading />
        )}
      </Wrapper>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 17,
  },
  buttonLeft: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
});

export default MembershipMonetizeScreen;
