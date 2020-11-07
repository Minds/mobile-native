import { observer } from 'mobx-react';
import React from 'react';
import { Text, View } from 'react-native';
import { TierStoreType } from '../../../compose/monetize/MembershipMonetizeScreeen';
import { SupportTiersType } from '../../../wire/WireTypes';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuItem from '../menus/MenuItem';
import i18n from '../../services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { navToTierScreen } from './TierManagementScreen';

type PropsType = {
  tiers: SupportTiersType[];
  useForSelection: boolean;
  tierStore: TierStoreType | undefined;
  navigation: any;
};

const TiersList = observer(
  ({ tiers, useForSelection, tierStore, navigation }: PropsType) => {
    const theme = ThemedStyles.style;
    const checkIcon = (
      <MIcon name="check" size={23} style={theme.colorSecondaryText} />
    );
    const transparentCheckIcon = (
      <MIcon name="check" size={23} style={theme.colorTransparent} />
    );

    if (!tiers || tiers.length === 0) {
      return (
        <View style={[theme.flexContainer, theme.centered]}>
          <Text style={[theme.fontXL, theme.colorTertiaryText]}>
            {i18n.t('settings.noTiers')}
          </Text>
        </View>
      );
    }

    const titleStyle = [
      theme.fullWidth,
      theme.rowJustifySpaceBetween,
      theme.paddingTop3x,
      theme.paddingBottom3x,
      theme.paddingLeft2x,
    ];

    return (
      <>
        {tiers.map((tier) => (
          <MenuItem
            item={{
              onPress:
                useForSelection && tierStore
                  ? () => tierStore.setSelectedTier(tier)
                  : () => navToTierScreen(navigation, tier),
              title: (
                <View style={titleStyle}>
                  <Text style={theme.colorPrimaryText}>{tier.name}</Text>
                  <Text
                    style={
                      theme.colorSecondaryText
                    }>{`$${tier.usd}+ / mth`}</Text>
                </View>
              ),
              icon: !useForSelection
                ? undefined
                : tierStore && tier === tierStore.selectedTier
                ? checkIcon
                : transparentCheckIcon,
            }}
            containerItemStyle={theme.backgroundPrimary}
          />
        ))}
      </>
    );
  },
);

export default TiersList;
