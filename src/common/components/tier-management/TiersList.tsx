import { observer } from 'mobx-react';
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { TierStoreType } from '../../../compose/monetize/MembershipMonetizeScreeen';
import { SupportTiersType } from '../../../wire/WireTypes';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuItem from '../menus/MenuItem';
import i18n from '../../services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { navToTierScreen } from './TierManagementScreen';
import Button from '../../../common/components/Button';

type PropsType = {
  tiers: SupportTiersType[];
  useForSelection: boolean;
  tierStore: TierStoreType | undefined;
  navigation: any;
  onLinkPress: () => void;
};

const TiersList = observer(
  ({
    tiers,
    useForSelection,
    tierStore,
    navigation,
    onLinkPress,
  }: PropsType) => {
    const theme = ThemedStyles.style;
    const checkIcon = (
      <MIcon name="check" size={23} style={theme.colorSecondaryText} />
    );
    const transparentCheckIcon = (
      <MIcon name="check" size={23} style={theme.colorTransparent} />
    );

    if (!tiers || tiers.length === 0) {
      return (
        <View style={[theme.centered, style.emptyContainer]}>
          <Image
            style={style.image}
            source={require('../../../assets/images/emptyTiers.png')}
          />

          <Text style={style.header}>{i18n.t('settings.noTiersTitle')}</Text>
          <Text style={[theme.colorSecondaryText, style.subTitle]}>
            {i18n.t('settings.noTiersSubTitle')}
          </Text>

          <Button
            onPress={onLinkPress}
            text={i18n.t('settings.addFirstTier')}
            large
            action
          />
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
        {tiers.map(tier => (
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
            containerItemStyle={theme.bgPrimaryBackground}
          />
        ))}
      </>
    );
  },
);

const style = StyleSheet.create({
  emptyContainer: {
    paddingTop: 45,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 5,
    fontSize: 22,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 16,
    paddingBottom: 28,
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    textAlign: 'center',
  },
  image: {
    width: 176,
    height: 122,
  },
});

export default TiersList;
