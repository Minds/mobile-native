import React, { useCallback, useMemo, useRef } from 'react';
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ThemedStyles, { useMemoStyle, useStyle } from '~/styles/ThemedStyles';
import { Icon } from 'react-native-elements';
import type { ChannelStoreType } from './createChannelStore';
import ChannelButtons, { ButtonsType } from './ChannelButtons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';
import { styles as headerStyles } from '~/topbar/Topbar';
import SmallCircleButton from '~/common/components/SmallCircleButton';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MText from '~/common/components/MText';
import { Image } from 'expo-image';
import { isLight } from './ChannelScreen';
import Subscribe from './buttons/Subscribe';
import { Spacer } from '~/common/ui';

const BLURRED_BANNER_BACKGROUND = true;

const tinycolor = require('tinycolor2');

type PropsType = {
  navigation: any;
  store?: ChannelStoreType;
  hideButtons?: boolean;
  hideInput?: boolean;
  /**
   * should the topbar have a background?
   **/
  withBg?: boolean;
  /**
   * background color of the topbar
   **/
  backgroundColor?: string;
  /**
   * the color of the readable material on the topbar
   **/
  textColor?: string;
  /**
   * onPress of the topbar
   **/
  onPress?: () => void;
};

const hiddenChannelButtons: ButtonsType[] = [
  'edit',
  'join',
  'subscribe',
  'wire',
  'boost',
  'supermind',
];
const hiddenChannelButtonsWithWire = hiddenChannelButtons.filter(
  p => p !== 'wire',
);

/**
 * Channel Top Bar
 **/
const ChannelTopBar = observer(
  ({
    navigation,
    store,
    hideButtons,
    hideInput,
    backgroundColor,
    textColor,
    withBg,
    onPress,
  }: PropsType) => {
    // =====================| STATES & VARIABLES |=====================>
    const theme = ThemedStyles.style;
    const insets = useSafeAreaInsets();
    const isBgLight = !!backgroundColor && isLight(backgroundColor);
    const cleanTop = insets.top ? { paddingTop: insets.top } : null;
    /**
     * shows and hides the background with animation based
     * on the {withBg} prop
     **/
    const backgroundOpacityAnimatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(withBg ? 1 : 0, {
        duration: 300,
      }),
    }));
    /**
     * search input position offset. The initial value is negative
     * because the searchInput is initially hidden
     **/
    const searchInputPositionOffset = useSharedValue(-200);
    const searchInputAnimatedStyle = useAnimatedStyle(() => ({
      top: searchInputPositionOffset.value,
    }));
    const nameStyles = useMemoStyle(
      [styles.name, { color: textColor }],
      [textColor],
    );
    const containerStyle = useStyle(
      'rowJustifyStart',
      headerStyles.shadow,
      'rowJustifySpaceBetween',
      'alignCenter',
      'paddingLeft2x',
      cleanTop!,
    );
    const topBarInnerWrapperStyle = useMemoStyle(
      [
        'positionAbsolute',
        {
          opacity: 1,
          backgroundColor:
            backgroundColor || theme.bgPrimaryBackground.backgroundColor,
          paddingLeft: 70,
          paddingRight: 60,
        },
        backgroundOpacityAnimatedStyle,
      ],
      [backgroundColor, backgroundOpacityAnimatedStyle],
    );
    const textInputRef = useRef<TextInput | null>(null);

    // =====================| METHODS |=====================>
    /**
     * shows or hides the search input with animation while handling its focus
     **/
    const toggleSearchInput = (on: boolean) => {
      searchInputPositionOffset.value = withTiming(
        on
          ? Platform.select({ ios: insets.top + 4, android: 8, default: 0 })
          : -200,
        {
          duration: 500,
          easing: Easing.bezier(0.16, 0.4, 0.3, 1) as any, //TODO: fix type once https://github.com/software-mansion/react-native-reanimated/pull/3012 is released
        },
      );
      if (on) {
        textInputRef.current?.focus();
      } else {
        textInputRef.current?.blur();
      }
    };

    /**
     * clear the search input and hide it when the
     * close button on the search input is pressed
     **/
    const onSearchClosePressed = useCallback(() => {
      toggleSearchInput(false);
      store?.clearSearch();
    }, []);

    /**
     * called when search channel option from
     * more menu is pressed
     **/
    const onSearchChannelPressed = useCallback(
      () => toggleSearchInput(true),
      [],
    );

    // =====================| RENDER |=====================>
    const searchInput = useMemo(
      () => (
        <>
          <TextInput
            placeholder="Search Channel"
            ref={ref => (textInputRef.current = ref)}
            style={[
              styles.searchInput,
              Platform.OS === 'ios' && { padding: 15 },
            ]}
            placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
            value={store?.channelSearch}
            onChangeText={store?.setChannelSearch}
            returnKeyType={'search'}
            onSubmitEditing={store?.filterChannelFeed}
          />
          <Icon
            reverse
            name={'close'}
            type={'material-community'}
            color={ThemedStyles.getColor('PrimaryBackground')}
            reverseColor={theme.colorIcon.color}
            // reverseColor={props.reverseColor || ThemedStyles.getColor('PrimaryText')}
            size={20}
            onPress={onSearchClosePressed}
            containerStyle={styles.searchInputIconContainerStyle}
          />
        </>
      ),
      [store?.channelSearch],
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={containerStyle}>
        <Animated.View style={topBarInnerWrapperStyle}>
          {BLURRED_BANNER_BACKGROUND && (
            <Image
              blurRadius={90}
              style={theme.positionAbsolute}
              source={store?.channel?.getBannerSource()!}
              contentFit="cover"
            />
          )}
          <SafeAreaView style={styles.nameWrapper}>
            <MText style={nameStyles} numberOfLines={1}>
              {store?.channel?.name}
            </MText>
            {!!store?.channel &&
              !store.channel?.subscribed &&
              !store.channel.isOwner() && (
                <Spacer left="S">
                  <Subscribe
                    channel={store?.channel}
                    shouldUpdateFeed={false}
                    buttonProps={{
                      lightContent: isBgLight,
                      darkContent: !isBgLight,
                      mode: 'solid',
                    }}
                  />
                </Spacer>
              )}
          </SafeAreaView>
        </Animated.View>
        <SmallCircleButton
          name="chevron-left"
          raised={!withBg}
          style={theme.colorIcon}
          onPress={navigation.goBack}
          color={
            withBg
              ? tinycolor(backgroundColor).setAlpha(0.15).toRgbString()
              : tinycolor(ThemedStyles.getColor('PrimaryBackground'))
                  .setAlpha(0.75)
                  .toRgbString()
          }
          iconStyle={styles.iconStyle}
          reverseColor={withBg ? textColor : undefined}
        />
        {store && !hideButtons && (
          <ChannelButtons
            store={store}
            onEditPress={() => navigation.push('ChannelEdit', { store: store })}
            onSearchChannelPressed={onSearchChannelPressed}
            notShow={
              store.channel?.subscribed
                ? hiddenChannelButtonsWithWire
                : hiddenChannelButtons
            }
            containerStyle={theme.centered}
            iconsStyle={styles.channelButtonsIconsStyle}
            raisedIcons={!withBg}
            iconColor={
              withBg
                ? tinycolor(backgroundColor).setAlpha(0.15).toRgbString()
                : tinycolor(ThemedStyles.getColor('PrimaryBackground'))
                    .setAlpha(0.75)
                    .toRgbString()
            }
            iconReverseColor={withBg ? textColor : undefined}
          />
        )}
        {store && !hideInput && (
          <Animated.View
            style={[
              { position: 'absolute', left: 65, right: 65, elevation: 5 },
              searchInputAnimatedStyle,
            ]}>
            {searchInput}
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  },
);

export default ChannelTopBar;

const styles = ThemedStyles.create({
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    bottom: 2, // minor alignment of text
    flex: 1,
  },
  nameWrapper: ['rowJustifySpaceBetween', 'flexContainer', 'alignCenter'],
  searchInput: [
    'fontL',
    'colorSecondaryText',
    'paddingLeft3x',
    'bgPrimaryBackground',
    'borderRadius20x',
    'borderHair',
    'bcolorPrimaryBorder',
  ],
  searchInputIconContainerStyle: [
    'colorIcon',
    'positionAbsoluteTopRight',
    Platform.OS === 'android' ? { top: -4.5 } : { top: -4.5 },
  ],
  channelButtonsIconsStyle: ['paddingLeft4x', 'colorSecondaryText'],
  iconStyle: { fontSize: 25 },
});
