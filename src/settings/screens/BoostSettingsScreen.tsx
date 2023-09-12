import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import sessionService from '../../common/services/session.service';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserError } from '../../common/UserError';
import { showNotification } from '../../../AppMessages';
import settingsService from '../SettingsService';
import CenteredLoading from '../../common/components/CenteredLoading';
import MText from '../../common/components/MText';
import MenuItemOption from '../../common/components/menus/MenuItemOption';

/****** Boost Settings *****
 *  disabled_boost === true => viewBoostedContent = false
 *  boost_autorotate === true => boostAutoRotation = true
 *  boost_rating === 1 => openContent = false
 *  boost_rating === 2 => openContent = true
 *  liquidity_spot_opt_out === 0 => liquiditySpot = true
 */

type BoostChannelType = 'controversial' | 'safe' | 'disable';
type ItemType = {
  id:
    | 'viewBoostedContent'
    | 'showBoostChannel'
    | 'boostAutoRotation'
    | 'openContent'
    | 'liquiditySpot';
  tooltip: { width: number; height: number };
  options: Array<
    [BoostChannelType | 'enable' | 'disable' | 'optIn' | 'optOut', any]
  >;
  [propName: string]: any;
};

export enum BoostPartnerSuitability {
  DISABLED = 1,
  SAFE = 2,
  CONTROVERSIAL = 3,
}

const BoostSettingsScreen = observer(() => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();

  const localStore = useLocalStore(() => ({
    loading: true,
    viewBoostedContent: false,
    showBoostChannel: BoostPartnerSuitability.CONTROVERSIAL,
    boostAutoRotation: false,
    openContent: false,
    liquiditySpot: false,
    async loadSettings() {
      const settings = await settingsService.getSettings();
      this.setSettings(settings);
    },
    setSettings(settings: any) {
      this.viewBoostedContent = !settings.channel.disabled_boost;
      this.boostAutoRotation = Boolean(settings.channel.boost_autorotate);
      this.openContent = settings.channel.boost_rating === 2;
      this.liquiditySpot = !settings.channel.liquidity_spot_opt_out;
      this.showBoostChannel = settings.channel.boost_partner_suitability || 3;
      this.loading = false;
    },
    setViewBoostedContent(val: boolean) {
      this.viewBoostedContent = val;
      user.toggleDisabledBoost(!val);
      val ? this.showBoost() : this.hideBoost();
    },
    setOpenContent(val: boolean) {
      this.openContent = val;
      this.save({ boost_rating: val ? 2 : 1 });
    },
    setBoostAutoRotation(val: boolean) {
      this.boostAutoRotation = val;
      this.save({ boost_autorotate: val });
    },
    setLiquiditySpot(val: boolean) {
      this.liquiditySpot = val;
      this.save({ liquidity_spot_opt_out: val ? 0 : 1 });

      user.setLiquiditySpotOptOut(val ? false : true);
    },
    setShowBoostChannel(value: BoostPartnerSuitability) {
      this.showBoostChannel = value;
      this.save({ boost_partner_suitability: value });
    },
    async showBoost(): Promise<void> {
      try {
        await settingsService.showBoosts();
        showNotification(i18n.t('settings.saved'), 'info');
      } catch (e) {
        showNotification(i18n.t('errorMessage'));
        console.error(e);
      }
    },
    async hideBoost(): Promise<void> {
      try {
        await settingsService.hideBoosts();
        showNotification(i18n.t('settings.saved'), 'info');
      } catch (e) {
        showNotification(i18n.t('errorMessage'));
        console.error(e);
      }
    },
    async save(params) {
      try {
        await settingsService.submitSettings(params);
        showNotification(i18n.t('settings.saved'), 'info');
      } catch (err) {
        throw new UserError(err, 'danger');
      }
    },
  }));

  useEffect(() => {
    localStore.loadSettings();
  }, [localStore]);

  if (localStore.loading) {
    return <CenteredLoading />;
  }

  const items: Array<ItemType> = [
    {
      id: 'viewBoostedContent',
      isSelected: value => localStore.viewBoostedContent === value,
      onPress: (val: boolean) => localStore.setViewBoostedContent(val),
      browserOnly: false,
      mindsPlus: true,
      tooltip: {
        height: 75,
        width: 200,
      },
      options: [
        ['enable', true],
        ['disable', false],
      ],
      disabled: !user.plus,
    },
    {
      id: 'showBoostChannel',
      isSelected: value => localStore.showBoostChannel === value,
      onPress: (val: BoostPartnerSuitability) =>
        localStore.setShowBoostChannel(val),
      browserOnly: false,
      mindsPlus: false,
      tooltip: {
        height: 75,
        width: 220,
      },
      options: [
        ['controversial', BoostPartnerSuitability.CONTROVERSIAL],
        ['safe', BoostPartnerSuitability.SAFE],
        ['disable', BoostPartnerSuitability.DISABLED],
      ],
    },
    {
      id: 'boostAutoRotation',
      isSelected: value => localStore.boostAutoRotation === value,
      onPress: (val: boolean) => localStore.setBoostAutoRotation(val),
      browserOnly: true,
      mindsPlus: false,
      tooltip: {
        height: 75,
        width: 200,
      },
      options: [
        ['enable', true],
        ['disable', false],
      ],
      disabled: false,
    },
    {
      id: 'openContent',
      isSelected: value => localStore.openContent === value,
      onPress: (val: boolean) => localStore.setOpenContent(val),
      browserOnly: false,
      mindsPlus: false,
      tooltip: {
        height: 100,
        width: 230,
      },
      options: [
        ['enable', true],
        ['disable', false],
      ],
      disabled: false,
    },
    {
      id: 'liquiditySpot',
      isSelected: value => localStore.liquiditySpot === value,
      onPress: (val: boolean) => localStore.setLiquiditySpot(val),
      browserOnly: true,
      mindsPlus: false,
      tooltip: {
        height: 100,
        width: 230,
      },
      options: [
        ['optIn', true],
        ['optOut', false],
      ],
      disabled: false,
    },
  ];

  return (
    <ScrollView style={[theme.fullHeight, theme.paddingTop4x]}>
      <MText
        style={[
          theme.colorSecondaryText,
          theme.marginBottom6x,
          theme.paddingLeft4x,
          styles.lineHeight,
        ]}>
        {i18n.t('settings.boost.description')}
        {/* <MText
          style={theme.colorLink}
          onPress={() => Linking.openURL('https://www.minds.com/boost')}>
          Boost
        </MText> */}
      </MText>
      {items.map(item => (
        <Item item={item} key={item.id} />
      ))}
    </ScrollView>
  );
});

const Item = observer(({ item }: { item: ItemType }) => {
  const theme = ThemedStyles.style;
  return (
    <View style={theme.marginBottom7x}>
      <View
        style={[
          theme.rowJustifyStart,
          theme.marginBottom2x,
          theme.paddingLeft4x,
        ]}>
        <MText style={[styles.text, theme.colorTertiaryText]}>
          {i18n.t(`settings.boost.${item.id}`).toUpperCase()}
        </MText>
        <Tooltip
          skipAndroidStatusBar={true}
          withOverlay={false}
          containerStyle={theme.borderRadius}
          width={item.tooltip.width}
          height={item.tooltip.height}
          backgroundColor={ThemedStyles.getColor('Link')}
          popover={
            <MText style={theme.colorWhite}>
              {i18n.t(`settings.boost.${item.id}Tooltip`)}
            </MText>
          }>
          <Icon
            name="information-variant"
            size={15}
            color={ThemedStyles.getColor('TertiaryText')}
          />
        </Tooltip>
        {item.browserOnly && (
          <MText style={[theme.colorSecondaryText, styles.smallText]}>
            ({i18n.t('browserOnly')})
          </MText>
        )}
        {item.mindsPlus && (
          <MText style={[theme.colorSecondaryText, styles.smallText]}>
            ({i18n.t('mindsPlusFeature')})
          </MText>
        )}
      </View>
      {item.options.map(([name, value]) => (
        <MenuItemOption
          key={name}
          title={i18n.t(`settings.boost.${name}`)}
          onPress={item.disabled ? undefined : () => item.onPress(value)}
          selected={item.isSelected(value)}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  smallText: {
    fontSize: 12,
    marginLeft: 5,
    paddingTop: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
  lineHeight: {
    lineHeight: 35,
  },
});

export default BoostSettingsScreen;
