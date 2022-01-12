import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import { Icon } from '~ui/icons';
import ThemedStyles, {
  useMemoStyle,
  useStyle,
} from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import MetaPreview from '../MetaPreview';
import TitleInput from '../TitleInput';
import NavigationService from '../../navigation/NavigationService';
import RemindPreview from '../RemindPreview';
import PosterOptions from '../PosterOptions/PosterOptions';
import TopBar from '../TopBar';
import { ScrollView } from 'react-native-gesture-handler';
import BottomBar from '../ComposeBottomBar';
import MediaPreview from '../MediaPreview';
import KeyboardSpacingView from '../../common/components/KeyboardSpacingView';
import SoftInputMode from 'react-native-set-soft-input-mode';
import TextInput from '../../common/components/TextInput';
import BottomSheet from '../../common/components/bottom-sheet/BottomSheetModal';
import BottomSheetButton from '../../common/components/bottom-sheet/BottomSheetButton';
import sessionService from '~/common/services/session.service';
import FastImage from 'react-native-fast-image';
import { useBackHandler, useKeyboard } from '@react-native-community/hooks';
import useComposeStore from '../useComposeStore';
import { useFocusEffect } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Tags from '~/common/components/Tags';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';
import AutoComplete from '~/common/components/AutoComplete/AutoComplete';

const { width } = Dimensions.get('window');

/**
 * Compose Screen
 * @param {Object} props
 */
export default observer(function ComposeScreen(props) {
  // #region states & variables
  const store = useComposeStore(props);
  const localStore = useLocalStore(() => ({
    height: 50, // input height
    onSizeChange(e) {
      // adding 30 to prevent textinput flickering after a new line.
      // but we should have a logic for this number, maybe the height of the header?
      localStore.height = e.nativeEvent.contentSize.height + 30;
    },
  }));
  const theme = ThemedStyles.style;
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<RNTextInput>(null);
  const optionsRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const setScrollOffsetDebounced = useDebouncedCallback(
    setScrollOffset,
    200,
    [],
  );
  const showEmbed = store.embed.hasRichEmbed && store.embed.meta;
  const fontSize =
    store.attachment.hasAttachment || store.text.length > 85
      ? theme.fontXL
      : theme.fontXXL;
  const textStyle = useMemoStyle(
    [
      styles.input,
      Platform.OS === 'ios'
        ? fontSize
        : [fontSize, { height: localStore.height }],
    ],
    [fontSize, localStore.height],
  );
  const placeholder = store.attachment.hasAttachment
    ? i18n.t('description')
    : i18n.t('capture.placeholder');
  const showBottomBar = !optionsRef.current || !optionsRef.current.opened;
  const channel = sessionService.getUser();
  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};
  const keyboard = useKeyboard();
  const [autoCompleteVisible, setAutoCompleteVisible] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  /**
   * animated style for the popover appearing and disappearing functionality
   **/
  const autoCompletePopupAnimatedStyle = useAnimatedStyle(
    () => ({
      height: withTiming(
        autoCompleteVisible
          ? (scrollViewHeight -
              (keyboard.keyboardShown ? keyboard.keyboardHeight : 0)) /
              2
          : 0,
      ),
    }),
    [autoCompleteVisible, scrollViewHeight, keyboard],
  );
  // #endregion

  // #region methods
  /**
   * On post press
   */
  const onPost = useCallback(async () => {
    if (store.attachment.uploading) {
      return;
    }
    const isEdit = store.isEdit;
    const entity = await store.submit();

    if (entity) {
      store.onPost(entity, isEdit);
    }
  }, [store]);

  const discard = useCallback(() => {
    store.clear();
    NavigationService.goBack();
  }, [store]);

  // On press back
  const showConfirm = React.useCallback(() => {
    confirmRef.current?.present();
  }, []);

  const onPressBack = useCallback(() => {
    if (store.attachment.hasAttachment || store.embed.hasRichEmbed) {
      Keyboard.dismiss();

      showConfirm();
    } else {
      discard();
    }
  }, [discard, store, showConfirm]);

  const closeConfirm = React.useCallback(() => {
    confirmRef.current?.dismiss();
  }, []);

  const handleHashtagPress = useCallback(() => {
    optionsRef.current.navigateTo('TagSelector');
  }, []);

  const handleMoneyPress = useCallback(() => {
    optionsRef.current.navigateTo('MonetizeSelector');
  }, []);

  const handleOptionsPress = useCallback(() => {
    Keyboard.dismiss();
    optionsRef.current.show();
  }, []);

  const onScrollHandler = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) =>
      setScrollOffsetDebounced(e.nativeEvent.contentOffset.y),
    [],
  );

  const onAutoCompleteShown = useCallback(
    (visible: boolean) => {
      setAutoCompleteVisible(visible);
      if (visible) {
        setTimeout(() => {
          InteractionManager.runAfterInteractions(() =>
            scrollViewRef.current?.scrollTo(store.textHeight + 35),
          );
        }, 350);
      }
    },
    [store.textHeight],
  );
  // #endregion

  // #region effects
  useFocusEffect(store.onScreenFocused);

  useBackHandler(
    useCallback(() => {
      onPressBack();
      return true;
    }, [onPressBack]),
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      SoftInputMode.set(SoftInputMode.ADJUST_RESIZE);
      return () => SoftInputMode.set(SoftInputMode.ADJUST_PAN);
    }
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    });
  }, [inputRef]);
  // #endregion

  // #region renders
  const rightButton = store.isEdit ? (
    i18n.t('save')
  ) : (
    <Icon
      name="send"
      size={25}
      disabled={!store.isValid}
      color={store.isValid ? 'Link' : 'Icon'}
      style={store.attachment.uploading ? theme.opacity25 : null}
    />
  );
  // #endregion
  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        containerStyle={theme.paddingLeft}
        rightText={rightButton}
        onPressRight={onPost}
        onPressBack={onPressBack}
        store={store}
      />

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode={'none'}
        onLayout={e =>
          scrollViewHeight
            ? null
            : setScrollViewHeight(e.nativeEvent.layout.height)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
        onScroll={onScrollHandler}>
        <View style={theme.rowJustifyStart}>
          <View style={useStyle('paddingHorizontal2x', 'paddingTop')}>
            <FastImage source={avatar} style={styles.wrappedAvatar} />
          </View>
          <View style={useStyle('flexContainer', 'marginRight2x')}>
            {!store.noText && (
              <>
                {store.attachment.hasAttachment && <TitleInput store={store} />}
                <TextInput
                  onSelectionChange={store.selectionChanged}
                  style={textStyle}
                  onContentSizeChange={localStore.onSizeChange}
                  ref={inputRef}
                  scrollEnabled={false}
                  placeholder={placeholder}
                  placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
                  onChangeText={store.setText}
                  textAlignVertical="top"
                  multiline={true}
                  selectTextOnFocus={false}
                  autoCorrect={false}
                  autoComplete={'off'}
                  spellCheck={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid="transparent"
                  testID="PostInput">
                  <Tags navigation={props.navigation} selectable={true}>
                    {store.text}
                  </Tags>
                </TextInput>
              </>
            )}
            <MediaPreview store={store} />
            {store.isRemind && <RemindPreview entity={store.entity} />}
            {
              // @ts-ignore
              store.isEdit && store.entity?.remind_object && (
                // @ts-ignore
                <RemindPreview entity={store.entity.remind_object} />
              )
            }
            {showEmbed && (
              <MetaPreview
                meta={store.embed.meta}
                onRemove={store.embed.clearRichEmbed}
                isEdit={store.isEdit}
              />
            )}
          </View>
        </View>
        {/*<Animated.View style={spacerAnimatedStyle} />*/}
      </ScrollView>

      {/**
       * Autocomplete popup
       **/}
      <Animated.View style={autoCompletePopupAnimatedStyle}>
        <AutoComplete
          textHeight={store.textHeight}
          scrollOffset={scrollOffset}
          selection={store.selection}
          onSelectionChange={selection => {
            store.setSelection(selection);
            setTimeout(() => {
              inputRef.current?.setNativeProps({
                selection: {
                  start: selection.start,
                  end: selection.end,
                },
              });
            });
          }}
          text={store.text}
          onTextChange={text => store.setText(text)}
          onTextInputFocus={() => inputRef.current?.focus()}
          onScrollToOffset={offset =>
            scrollViewRef.current?.scrollTo({
              y: offset,
            })
          }
          onVisible={onAutoCompleteShown}
        />
      </Animated.View>

      {showBottomBar && (
        <KeyboardSpacingView
          enabled={Platform.OS === 'ios'}
          noInset
          style={styles.bottomBarContainer}>
          <BottomBar
            store={store}
            onHashtag={handleHashtagPress}
            onMoney={handleMoneyPress}
            onOptions={handleOptionsPress}
          />
        </KeyboardSpacingView>
      )}

      <PosterOptions ref={optionsRef} store={store} />

      <BottomSheet
        ref={confirmRef}
        title={i18n.t('capture.discardPost')}
        detail={i18n.t('capture.discardPostDescription')}>
        <BottomSheetButton
          text={i18n.t('capture.yesDiscard')}
          onPress={discard}
          action
        />
        <BottomSheetButton
          text={i18n.t('capture.keepEditing')}
          onPress={closeConfirm}
        />
      </BottomSheet>
    </SafeAreaView>
  );
});

const styles = ThemedStyles.create({
  bottomBarContainer: [
    'borderTopHair',
    'bcolorPrimaryBorder',
    'bgPrimaryBackground',
    {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.0,
    },
  ],
  input: [
    'fullWidth',
    'colorPrimaryText',
    {
      textAlignVertical: 'top',
      paddingTop: 8,
    },
  ],
  remindPreview: {
    marginHorizontal: 10,
    width: width - 20,
    height: width / 3,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: [
    'flexContainer',
    'bgPrimaryBackground',
    {
      flex: 1,
      paddingBottom: 0,
      marginBottom: 0,
    },
  ],
  wrappedAvatar: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
});
