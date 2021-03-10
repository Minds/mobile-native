import React, { useCallback, useEffect } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import sessionService from '../../common/services/session.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserError } from '../../common/UserError';
import { showNotification } from '../../../AppMessages';
import settingsService from '../SettingsService';
import apiService from '../../common/services/api.service';
import CenteredLoading from '../../common/components/CenteredLoading';

/****** Boost Settings *****
 *  disabled_boost === true => viewBoostedContent = false
 *  boost_autorotate === true => boostAutoRotation = true
 *  boost_rating === 1 => openContent = false
 *  boost_rating === 2 => openContent = true
 *  liquidity_spot_opt_out === 0 => liquiditySpot = true
 */

const BoostSettingsScreen = observer(() => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();
  const insets = useSafeAreaInsets();
  const cleanTop = { marginTop: insets.top };

  const localStore = useLocalStore(() => ({
    loading: true,
    viewBoostedContent: false,
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

      this.loading = false;
    },
    setViewBoostedContent(val: boolean) {
      this.viewBoostedContent = val;
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
    async showBoost(): Promise<void> {
      if (user.plus) {
        try {
          await apiService.delete('api/v1/plus/boost');
          showNotification(i18n.t('settings.saved'), 'info');
        } catch (e) {
          console.error(e);
        }
      }
    },
    async hideBoost(): Promise<void> {
      if (user.plus) {
        try {
          await apiService.put('api/v1/plus/boost');
          showNotification(i18n.t('settings.saved'), 'info');
        } catch (e) {
          console.error(e);
        }
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

  const items = [
    {
      id: 'viewBoostedContent',
      isSelected: () => localStore.viewBoostedContent,
      onPress: (val: boolean) => localStore.setViewBoostedContent(val),
      browserOnly: false,
      mindsPlus: true,
      tooltip: {
        height: 75,
        width: 200,
      },
      disabled: !user.pro,
    },
    {
      id: 'boostAutoRotation',
      isSelected: () => localStore.boostAutoRotation,
      onPress: (val: boolean) => localStore.setBoostAutoRotation(val),
      browserOnly: true,
      mindsPlus: false,
      tooltip: {
        height: 75,
        width: 200,
      },
    },
    {
      id: 'openContent',
      isSelected: () => localStore.openContent,
      onPress: (val: boolean) => localStore.setOpenContent(val),
      browserOnly: false,
      mindsPlus: false,
      tooltip: {
        height: 100,
        width: 230,
      },
    },
    {
      id: 'liquiditySpot',
      isSelected: () => localStore.liquiditySpot,
      onPress: (val: boolean) => localStore.setLiquiditySpot(val),
      browserOnly: true,
      mindsPlus: false,
      tooltip: {
        height: 100,
        width: 230,
      },
      enable: 'optIn',
      disable: 'optOut',
    },
  ];

  const checked = (
    <Icon
      name="check"
      size={16}
      color={ThemedStyles.getColor('secondary_text')}
    />
  );

  const buttonStyles = [
    theme.rowJustifySpaceBetween,
    theme.paddingVertical3x,
    theme.borderBottom,
    theme.borderPrimary,
    theme.paddingHorizontal4x,
    theme.backgroundPrimary,
  ];

  const browserOnly = (
    <Text style={[theme.colorSecondaryText, styles.smallText]}>
      ({i18n.t('browserOnly')})
    </Text>
  );
  const mindsPlusOnly = (
    <Text style={[theme.colorSecondaryText, styles.smallText]}>
      ({i18n.t('mindsPlusFeature')})
    </Text>
  );

  return (
    <ScrollView
      style={[theme.backgroundSecondary, theme.fullHeight, theme.paddingTop4x]}>
      <Text
        style={[
          theme.colorSecondaryText,
          theme.marginBottom6x,
          theme.paddingLeft4x,
          styles.lineHeight,
        ]}>
        {`${i18n.t('settings.boost.description')}\n${i18n.t(
          'settings.boost.learn',
        )} `}
        <Text
          style={theme.colorLink}
          onPress={() => Linking.openURL('https://www.minds.com/boost')}>
          Boost
        </Text>
      </Text>
      {items.map((item) => {
        return (
          <View style={theme.marginBottom7x}>
            <View
              style={[
                theme.rowJustifyStart,
                theme.marginBottom2x,
                theme.paddingLeft4x,
              ]}>
              <Text style={[styles.text, theme.colorTertiaryText]}>
                {i18n.t(`settings.boost.${item.id}`).toUpperCase()}
              </Text>
              <Tooltip
                skipAndroidStatusBar={true}
                withOverlay={false}
                containerStyle={theme.borderRadius}
                width={item.tooltip.width}
                height={item.tooltip.height}
                backgroundColor={ThemedStyles.getColor('link')}
                popover={
                  <Text style={theme.colorWhite}>
                    {i18n.t(`settings.boost.${item.id}Tooltip`)}
                  </Text>
                }>
                <Icon
                  name="information-variant"
                  size={15}
                  color={ThemedStyles.getColor('tertiary_text')}
                />
              </Tooltip>
              {item.browserOnly && browserOnly}
              {item.mindsPlus && mindsPlusOnly}
            </View>
            <TouchableOpacity
              style={[
                buttonStyles,
                theme.borderTop,
                item.disabled ? theme.backgroundSecondary : {},
              ]}
              onPress={item.disabled ? () => false : () => item.onPress(true)}>
              <Text
                style={[
                  theme.fontL,
                  item.disabled
                    ? theme.colorSecondaryText
                    : theme.colorPrimaryText,
                ]}>
                {i18n.t(`settings.boost.${item.enable || 'enable'}`)}
              </Text>
              {item.isSelected() && checked}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                buttonStyles,
                item.disabled ? theme.backgroundSecondary : {},
              ]}
              onPress={item.disabled ? () => false : () => item.onPress(false)}>
              <Text
                style={[
                  theme.fontL,
                  item.disabled
                    ? theme.colorSecondaryText
                    : theme.colorPrimaryText,
                ]}>
                {i18n.t(`settings.boost.${item.disable || 'disable'}`)}
              </Text>
              {!item.isSelected() && checked}
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
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
