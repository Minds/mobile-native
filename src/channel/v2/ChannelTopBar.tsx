import React, { useCallback, useMemo, useRef } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import ThemedStyles, {
  useMemoStyle,
  useStyle,
} from '../../styles/ThemedStyles';
import { Icon } from 'react-native-elements';
import type { ChannelStoreType } from './createChannelStore';
import ChannelButtons from './ChannelButtons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';
import { styles as headerStyles } from '../../topbar/Topbar';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  }: PropsType) => {
    // =====================| STATES & VARIABLES |=====================>
    const theme = ThemedStyles.style;
    const insets = useSafeAreaInsets();
    const cleanTop = insets.top ? { paddingTop: insets.top } : null;
    const hiddenChannelButtons = useRef(['edit', 'join', 'subscribe', 'boost'])
      .current;
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
      headerStyles.container,
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
          paddingTop: 16,
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
          ? Platform.select({ ios: insets.top, android: 8, default: 0 })
          : -200,
        {
          duration: 500,
          easing: Easing.bezier(0.16, 0.4, 0.3, 1),
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
      store?.setChannelSearch('');
    }, []);

    /**
     * called when edit button is pressed
     **/
    const onEditPress = useCallback(
      () => navigation.push('EditChannelScreen', { store: store }),
      [],
    );

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
              Platform.OS === 'ios' && { padding: 20 },
            ]}
            placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
            value={store?.channelSearch}
            onChangeText={store?.setChannelSearch}
            returnKeyType={'search'}
            onSubmitEditing={store?.searchInChannel}
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
      [],
    );

    return (
      <View style={containerStyle}>
        <Animated.View style={topBarInnerWrapperStyle}>
          {BLURRED_BANNER_BACKGROUND && (
            <Image
              blurRadius={100}
              style={theme.positionAbsolute}
              source={store?.channel?.getBannerSource()!}
              resizeMode="cover"
            />
          )}
          <SafeAreaView style={styles.nameWrapper}>
            <Text style={nameStyles} numberOfLines={1}>
              {store?.channel?.name}
            </Text>
            {/*{store?.channel && (
              <ChannelBadges
                channel={store?.channel}
                size={20}
                iconStyle={theme.colorLink}
              />
            )}*/}
          </SafeAreaView>
        </Animated.View>
        <SmallCircleButton
          name="chevron-left"
          style={theme.colorIcon}
          onPress={navigation.goBack}
          color={
            withBg
              ? tinycolor(backgroundColor).setAlpha(0.5).toRgbString()
              : undefined
          }
          reverseColor={withBg ? textColor : undefined}
        />
        {store && !hideButtons && (
          <ChannelButtons
            iconSize={25}
            store={store}
            onEditPress={onEditPress}
            onSearchChannelPressed={onSearchChannelPressed}
            notShow={hiddenChannelButtons}
            containerStyle={theme.centered}
            iconsStyle={styles.channelButtonsIconsStyle}
            iconColor={
              withBg
                ? tinycolor(backgroundColor).setAlpha(0.5).toRgbString()
                : undefined
            }
            iconReverseColor={withBg ? textColor : undefined}
          />
        )}
        {store && !hideInput && (
          <Animated.View
            style={[
              { position: 'absolute', left: 65, right: 65 },
              searchInputAnimatedStyle,
            ]}>
            {searchInput}
          </Animated.View>
        )}
      </View>
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
  },
  nameWrapper: [
    'rowJustifyStart',
    'flexContainer',
    'alignEnd',
    'marginBottom5x',
  ],
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
    Platform.OS === 'android' ? { top: -4.5 } : {},
  ],
  channelButtonsIconsStyle: ['paddingLeft4x', 'colorSecondaryText'],
});
