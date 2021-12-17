import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
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
  withSpring,
} from 'react-native-reanimated';
import UserModel from '~/channel/UserModel';
import Tags from '~/common/components/Tags';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';
import ChannelAutoCompleteList from '~/common/components/ChannelAutoCompleteList/ChannelAutoCompleteList';

const { width, height } = Dimensions.get('window');

const useAutoComplete = ({
  text,
  selection,
  textHeight,
  scrollOffset = 0,
  onScrollToOffset,
  onTextChange,
  onSelectionChange,
  onTextInputFocus,
}) => {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const keyboard = useKeyboard();

  useEffect(() => {
    const substr = text.substr(0, selection.start) || '';

    /**
     * Distance from top within which we don't have to move the scroll position.
     * in other words, this distance from top is enough to show the popup.
     * this depends on the device obviously.
     **/
    const threshold = (height - keyboard.keyboardHeight) / 3;

    const lastItem = substr
      .replace(/\n/g, ' ') // replace with space
      .split(' ')
      .reverse()[0];
    const query = lastItem.substring(1);

    if (lastItem && (lastItem[0] === '@' || lastItem[0] === '#') && query) {
      setVisible(true);

      if (textHeight - scrollOffset > threshold) {
        onScrollToOffset?.(textHeight - 29);
      }
      setQuery(query);
    } else {
      setVisible(false);
      setQuery('');
    }
  }, [
    keyboard.keyboardHeight,
    onScrollToOffset,
    scrollOffset,
    selection,
    text,
    textHeight,
  ]);

  const [autoCompleteLoaded, setAutoCompleteLoaded] = useState(false);
  const handleAutoCompleteUsersLoaded = useCallback(
    (users: UserModel[]) => setAutoCompleteLoaded(Boolean(users.length)),
    [],
  );
  const handleAutoCompleteSelect = useCallback(
    (user: UserModel) => {
      let endword = [''],
        matchText = text.substr(0, selection.end);

      // search end of word
      if (text.length > selection.end) {
        endword = text.substr(selection.end).match(/^([a-zA-Z0-9])+\b/);
        if (endword) {
          matchText += endword[0];
        } else {
          endword = [''];
        }
      }

      // the rest of the text
      const preText = matchText.replace(
        /\@[a-zA-Z0-9]+$/,
        '@' + user.username + ' ',
      );
      const postText = text.substr(selection.end + 1 + endword[0].length);
      onTextChange(preText + postText);

      onSelectionChange({
        start: preText.length,
        end: preText.length,
      });
      InteractionManager.runAfterInteractions(() => {
        onTextInputFocus();
      });
    },
    [text, selection, onTextChange, onSelectionChange, onTextInputFocus],
  );

  return {
    visible: visible && autoCompleteLoaded,
    query,
    handleAutoCompleteSelect,
    handleAutoCompleteUsersLoaded,
  };
};

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
  const {
    visible: autoCompleteVisible,
    query,
    handleAutoCompleteUsersLoaded,
    handleAutoCompleteSelect,
  } = useAutoComplete({
    textHeight: store.textHeight,
    scrollOffset,
    selection: store.selection,
    onSelectionChange: selection => store.setSelection(selection),
    text: store.text,
    onTextChange: text => store.setText(text),
    onTextInputFocus: () => inputRef.current?.focus(),
    onScrollToOffset: offset =>
      scrollViewRef.current?.scrollTo({
        y: offset,
      }),
  });
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
  /**
   * animated style for the popover appearing and disappearing functionality
   **/
  const autoCompletePopupAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: withSpring(
            autoCompleteVisible ? store.textHeight + 100 - scrollOffset : 1000,
            {
              mass: 0.3,
            },
          ),
        },
      ],
    }),
    [store.textHeight, autoCompleteVisible, scrollOffset],
  );
  /**
   * Used to add spacing on the bottom of scrollview when the Autocomplete popup is visible
   **/
  const spacerAnimatedStyle = useAnimatedStyle(
    () => ({
      // TODO: why 320 and 75, make it dynamic
      height: withSpring(autoCompleteVisible ? 320 : 75, {
        mass: 0.5,
      }),
    }),
    [autoCompleteVisible],
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
        showsVerticalScrollIndicator={false}
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
                  selection={store.selection}
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
        <Animated.View style={spacerAnimatedStyle} />
      </ScrollView>

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

      {/**
       * Autocomplete popup
       **/}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, autoCompletePopupAnimatedStyle]}>
        <ChannelAutoCompleteList
          query={query}
          onChannels={handleAutoCompleteUsersLoaded}
          onSelect={handleAutoCompleteSelect}
        />
      </Animated.View>
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
