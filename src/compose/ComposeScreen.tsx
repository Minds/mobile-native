import TurboImage from 'react-native-turbo-image';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/core';
import { observer } from 'mobx-react';
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { StackScreenProps } from '@react-navigation/stack';
import { Row } from '~/common/ui';
import BottomSheetButton from '../common/components/bottom-sheet/BottomSheetButton';
import BottomSheet from '../common/components/bottom-sheet/BottomSheetModal';
import GroupModel from '../groups/GroupModel';
import ActivityModel from '../newsfeed/ActivityModel';
import BottomBar from './ComposeBottomBar';
import ComposeTopBar from './ComposeTopBar';
import { ComposerAutoComplete } from './ComposerAutoComplete';
import { ComposerTextInput } from './ComposerTextInput';
import MediaPreview from './MediaPreview';
import MetaPreview from './MetaPreview';
import PosterBottomSheet from './PosterOptions/PosterBottomSheet';
import RemindPreview from './RemindPreview';
import TitleToggle from './TitleToggle';
import TitleInput from './TitleInput';
import type { ComposeCreateMode } from './createComposeStore';
import useComposeStore, { ComposeContext } from './useComposeStore';
import { ComposerStackParamList } from './ComposeStack';
import ComposeAudienceSelector from './ComposeAudienceSelector';
import { IS_IOS } from '~/config/Config';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

const { width } = Dimensions.get('window');

type ScreenProps = StackScreenProps<ComposerStackParamList, 'Composer'>;

export type ComposeScreenParams = {
  openSupermindModal?: boolean;
  createMode?: ComposeCreateMode;
  isRemind?: boolean;
  entity?: ActivityModel;
  group?: GroupModel;
  parentKey?: string;
  boost?: boolean;
};

/**
 * Compose Screen
 * @param {Object} props
 */
const ComposeScreen: React.FC<ScreenProps> = props => {
  // ### states & variables
  const store = useComposeStore(props);
  const inputRef = useRef<any>(null);
  const isCreateModalOn = true;
  const theme = sp.styles.style;
  const scrollViewRef = useRef<ScrollView>(null);

  const optionsRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);
  const showEmbed = store.embed.hasRichEmbed && store.embed.meta;
  const i18n = sp.i18n;
  const placeholder = store.attachments.hasAttachment
    ? i18n.t('description')
    : i18n.t('capture.placeholder');
  const showBottomBar = !optionsRef.current || !optionsRef.current.opened;
  const channel = sp.session.getUser();
  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  const discard = useCallback(() => {
    store.clear();
    sp.navigation.goBack();
  }, [store]);

  const onPressBack = useCallback(() => {
    if (store.attachments.hasAttachment || store.embed.hasRichEmbed) {
      Keyboard.dismiss();

      // show confirm
      confirmRef.current?.present();
    } else {
      discard();
    }
  }, [discard, store]);

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

  const handleSupermindPress = useCallback(() => {
    Keyboard.dismiss();
    store.openSupermindModal();
  }, [store]);

  const onScrollHandler = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) =>
      store.setScrollOffset(e.nativeEvent.contentOffset.y),
    [store],
  );

  const handleTextInputFocus = useCallback(() => inputRef.current?.focus(), []);
  // #endregion

  // #region effects
  useFocusEffect(store.onScreenFocused);

  const edges: NativeSafeAreaViewProps['edges'] = IS_IOS
    ? ['top']
    : ['top', 'bottom'];

  const autofocus =
    (props.route?.params?.createMode ?? 'post') === 'post' ||
    props.route?.params?.createMode === 'boost';

  useEffect(() => {
    if (autofocus) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (inputRef) {
            inputRef.current?.focus();
          }
        }, 300);
      });
    }
  }, [autofocus]);

  useBackHandler(
    useCallback(() => {
      onPressBack();
      return true;
    }, [onPressBack]),
  );

  /**
   * if there was an attachment we need to show the title input,
   * or if the create mode was on we need to show the audience selector
   */
  const isTopRowVisible = store.attachments.hasAttachment || !store.isEdit;

  return (
    <ComposeContext.Provider value={store}>
      <SafeAreaView style={styles.container} edges={edges}>
        <ComposeTopBar store={store} onPressBack={onPressBack} />
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'none'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollViewContentContainerStyle}
          scrollEventThrottle={64}
          onScroll={onScrollHandler}>
          {isTopRowVisible && (
            <Row left="S" vertical="S" align="centerBetween">
              {isCreateModalOn && !store.isEdit ? (
                <ComposeAudienceSelector store={store} />
              ) : (
                // this is to make sure the title toggle is rendered on the right
                <View />
              )}
              {store.attachments.hasAttachment && <TitleToggle store={store} />}
            </Row>
          )}
          <View style={theme.rowJustifyStart}>
            <View style={useStyle('paddingHorizontal2x', 'paddingTop')}>
              <TurboImage source={avatar} style={styles.wrappedAvatar} />
            </View>
            <View style={useStyle('flexContainer', 'marginRight2x')}>
              {!store.noText && (
                <>
                  {store.isTitleOpen && <TitleInput store={store} />}
                  <ComposerTextInput
                    ref={inputRef}
                    placeholder={placeholder}
                    store={store}
                    navigation={props.navigation}
                  />
                </>
              )}
            </View>
          </View>
          <View style={theme.marginHorizontal2x}>
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
        </ScrollView>
        <ComposerAutoComplete
          store={store}
          handleTextInputFocus={handleTextInputFocus}
          inputRef={inputRef}
          scrollViewRef={scrollViewRef}
        />

        <PosterBottomSheet ref={optionsRef} />

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
      {showBottomBar && (
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.bottomBarContainer}>
          <BottomBar
            store={store}
            onHashtag={handleHashtagPress}
            onMoney={handleMoneyPress}
            onOptions={handleOptionsPress}
            onSupermind={handleSupermindPress}
          />
        </KeyboardAvoidingView>
      )}
    </ComposeContext.Provider>
  );
};

export default observer(ComposeScreen);

const scrollViewContentContainerStyle = { paddingBottom: 35 };

const styles = sp.styles.create({
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
  bodyContainer: {
    paddingBottom: 75,
  },
  wrappedAvatar: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
});
