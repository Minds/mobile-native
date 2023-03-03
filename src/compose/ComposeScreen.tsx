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
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';

import ThemedStyles, { useStyle } from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import MetaPreview from './MetaPreview';
import TitleInput from './TitleInput';
import NavigationService from '../navigation/NavigationService';
import RemindPreview from './RemindPreview';
import PosterBottomSheet from './PosterOptions/PosterBottomSheet';
import ComposeTopBar from './ComposeTopBar';
import BottomBar from './ComposeBottomBar';
import MediaPreview from './MediaPreview';
import KeyboardSpacingView from '../common/components/keyboard/KeyboardSpacingView';
import BottomSheet from '../common/components/bottom-sheet/BottomSheetModal';
import BottomSheetButton from '../common/components/bottom-sheet/BottomSheetButton';
import sessionService from '~/common/services/session.service';
import useComposeStore, { ComposeContext } from './useComposeStore';
import { ComposerAutoComplete } from './ComposerAutoComplete';
import { ComposerTextInput } from './ComposerTextInput';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation/NavigationTypes';
import ActivityModel from '../newsfeed/ActivityModel';
import GroupModel from '../groups/GroupModel';
import type { ComposeCreateMode } from './createComposeStore';
import TopBar from './TopBar';
import SupermindLabel from '../common/components/supermind/SupermindLabel';
import { IconButtonNext } from '../common/ui';
import { confirm } from '../common/components/Confirm';
import { useIsFeatureOn } from '../../ExperimentsProvider';

const { width } = Dimensions.get('window');

type ScreenProps = StackScreenProps<RootStackParamList, 'Compose'>;
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
export default observer(function ComposeScreen(props: ScreenProps) {
  // ### states & variables
  const store = useComposeStore(props);
  const inputRef = useRef<any>(null);
  const isCreateModalOn = useIsFeatureOn('mob-4596-create-modal');
  const theme = ThemedStyles.style;
  const scrollViewRef = useRef<ScrollView>(null);

  const optionsRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);
  const showEmbed = store.embed.hasRichEmbed && store.embed.meta;

  const placeholder = store.attachments.hasAttachment
    ? i18n.t('description')
    : i18n.t('capture.placeholder');
  const showBottomBar = !optionsRef.current || !optionsRef.current.opened;
  const channel = sessionService.getUser();
  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  // ### methods
  const onPressPost = useCallback(async () => {
    if (store.attachments.uploading) {
      return;
    }
    const { channel: targetChannel, payment_options } =
      store.supermindRequest ?? {};

    if (
      targetChannel?.name &&
      payment_options?.amount &&
      !(await confirm({
        title: i18n.t('supermind.confirmNoRefund.title'),
        description: i18n.t('supermind.confirmNoRefund.offerDescription'),
      }))
    ) {
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

  const autofocus =
    props.route?.params?.createMode === 'post' ||
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

  const rightButton = store.isEdit ? (
    i18n.t('save')
  ) : (
    <IconButtonNext
      name="send"
      size="medium"
      scale
      onPress={onPressPost}
      disabled={!store.isValid}
      color={store.isValid ? 'Link' : 'Icon'}
      style={store.attachments.uploading ? theme.opacity25 : null}
    />
  );

  return (
    <ComposeContext.Provider value={store}>
      <SafeAreaView style={styles.container}>
        {isCreateModalOn ? (
          <ComposeTopBar store={store} onPressBack={onPressBack} />
        ) : (
          <TopBar
            containerStyle={theme.paddingLeft}
            rightText={rightButton}
            leftComponent={
              (store.supermindRequest || store.isSupermindReply) && (
                <SupermindLabel />
              )
            }
            onPressRight={onPressPost}
            onPressBack={onPressBack}
            store={store}
          />
        )}

        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'none'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollViewContentContainerStyle}
          scrollEventThrottle={64}
          onScroll={onScrollHandler}>
          <View style={theme.rowJustifyStart}>
            <View style={useStyle('paddingHorizontal2x', 'paddingTop')}>
              <FastImage source={avatar} style={styles.wrappedAvatar} />
            </View>
            <View style={useStyle('flexContainer', 'marginRight2x')}>
              {!store.noText && (
                <>
                  {store.attachments.hasAttachment && (
                    <TitleInput store={store} />
                  )}
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
        {showBottomBar && (
          <KeyboardSpacingView noInset style={styles.bottomBarContainer}>
            <BottomBar
              store={store}
              onHashtag={handleHashtagPress}
              onMoney={handleMoneyPress}
              onOptions={handleOptionsPress}
              onSupermind={handleSupermindPress}
            />
          </KeyboardSpacingView>
        )}

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
    </ComposeContext.Provider>
  );
});

const scrollViewContentContainerStyle = { paddingBottom: 35 };

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
