import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { TierStoreType } from '../../../compose/PosterOptions/monetize/MembershipMonetizeScreen';
import { SupportTiersType } from '../../../wire/WireTypes';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuItem from '../menus/MenuItem';
import i18n from '../../services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { navToTierScreen } from './TierManagementScreen';
import Empty from '~/common/components/Empty';
import MText from '../MText';
import { Button } from '~ui';

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
        <Empty
          title={i18n.t('settings.noTiersTitle')}
          subtitle={i18n.t('settings.noTiersSubTitle')}>
          <Button
            onPress={onLinkPress}
            mode="outline"
            type="action"
            size="large"
            align="center">
            {i18n.t('settings.addFirstTier')}
          </Button>
        </Empty>
      );
    }

    return (
      <>
        {tiers.map(tier => (
          <MenuItem
            item={{
              onPress:
                useForSelection && tierStore
                  ? () => tierStore.setSelectedTier(tier)
                  : () => navToTierScreen(navigation, tier),
              title: '',
              content: (
                <View style={styles.titleContainer}>
                  <MText style={styles.title} numberOfLines={1}>
                    {tier.name}
                  </MText>
                  <MText style={styles.price}>{`$${tier.usd}+ / mth`}</MText>
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

const styles = ThemedStyles.create({
  titleContainer: [
    'fullWidth',
    'rowJustifySpaceBetween',
    'alignCenter',
    'paddingVertical5x',
  ],
  title: ['fontL', 'colorPrimaryText'],
  price: ['fontL', 'colorSecondaryText'],
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
  subTitle: [
    'colorSecondaryText',
    'fontL',
    'paddingHorizontal4x',
    'textCenter',
  ],
  image: {
    width: 176,
    height: 122,
  },
});

export default TiersList;
