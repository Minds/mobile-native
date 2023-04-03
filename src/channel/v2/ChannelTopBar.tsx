import React, { useCallback, useMemo, useRef } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ThemedStyles, { useMemoStyle, useStyle } from '~/styles/ThemedStyles';
import { Icon } from 'react-native-elements';
import type { ChannelStoreType } from './createChannelStore';
import ChannelButtons from './ChannelButtons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';
import { styles as headerStyles } from '~/topbar/Topbar';
import SmallCircleButton from '~/common/components/SmallCircleButton';
import Animated, {
  EasingNode,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MText from '~/common/components/MText';

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
    const cleanTop = insets.top ? { paddingTop: insets.top } : null;
    const hiddenChannelButtons = useRef([
      'edit',
      'join',
      'subscribe',
      'boost',
      'supermind',
    ]).current;
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
      'paddingBottom',
      cleanTop!,
    );
    const topBarInnerWrapperStyle = useMemoStyle(
      [
        'positionAbsolute',
        {
          opacity: 0.8,
          backgroundColor:
            backgroundColor || theme.bgPrimaryBackground.backgroundColor,
          paddingLeft: 70,
          paddingRight: Platform.select({
            ios: 50,
            android: 100,
          }),
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
          easing: EasingNode.bezier(0.16, 0.4, 0.3, 1) as any, //TODO: fix type once https://github.com/software-mansion/react-native-reanimated/pull/3012 is released
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
              resizeMode="cover"
            />
          )}
          <SafeAreaView style={styles.nameWrapper}>
            <MText style={nameStyles} numberOfLines={1}>
              {store?.channel?.name}
            </MText>
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
            iconSize={25}
            store={store}
            onEditPress={() => navigation.push('ChannelEdit', { store: store })}
            onSearchChannelPressed={onSearchChannelPressed}
            notShow={hiddenChannelButtons}
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
    textAlign: 'center',
    marginRight: 5,
    bottom: 2, // minor alignment of text
  },
  nameWrapper: ['rowJustifyStart', 'flexContainer', 'alignCenter'],
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
