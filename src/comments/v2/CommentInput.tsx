import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SoftInputMode from 'react-native-set-soft-input-mode';

import KeyboardSpacingView from '../../common/components/KeyboardSpacingView';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer } from 'mobx-react';
import type CommentsStore from './CommentsStore';
import { action, observable } from 'mobx';
import MediaPreview from './MediaPreview';
import MetaPreview from '../../compose/MetaPreview';
import GroupModel from '../../groups/GroupModel';
import CommentInputBottomMenu from './CommentInputBottomMenu';
import preventDoubleTap from '../../common/components/PreventDoubleTap';
import { DotIndicator } from 'react-native-reanimated-indicators';
import { CHAR_LIMIT } from '../../config/Config';

const { height } = Dimensions.get('window');

class StoreProvider {
  @observable.ref store: CommentsStore | null = null;
  @action
  setStore = (s: CommentsStore) => (this.store = s);
}
const storeProvider = new StoreProvider();

const Touchable = preventDoubleTap(TouchableOpacity);

export const CommentInputContext = React.createContext(storeProvider);

/**
 * Floating Input component
 */
const CommentInput = observer(() => {
  const theme = ThemedStyles.style;
  const ref = React.useRef<TextInput>(null);
  const provider = React.useContext(CommentInputContext);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      SoftInputMode.set(SoftInputMode.ADJUST_RESIZE);
      return () => SoftInputMode.set(SoftInputMode.ADJUST_PAN);
    }
  }, []);

  const afterSelected = () => setTimeout(() => ref.current?.focus(), 400);
  const beforeSelect = () => ref.current?.blur();

  if (!provider.store || !provider.store.showInput) {
    return null;
  }

  const placeHolder =
    provider.store.entity instanceof GroupModel
      ? i18n.t('messenger.typeYourMessage')
      : i18n.t('activity.typeComment');

  const inputMaxHeight = {
    maxHeight:
      height * 0.4 - (provider.store.parent || provider.store.edit ? 50 : 0),
  };

  return (
    <KeyboardSpacingView
      noInset={true}
      style={StyleSheet.absoluteFill}
      enabled={Platform.OS === 'ios'}
      pointerEvents="box-none">
      <View style={[theme.justifyEnd, theme.flexContainer]}>
        <View style={theme.flexContainer}>
          <Touchable
            style={[
              theme.flexContainer,
              theme.backgroundBlack,
              theme.opacity50,
            ]}
            activeOpacity={0.5}
            onPress={() => provider.store?.setShowInput(false)}
          />
          <MediaPreview attachment={provider.store.attachment} />
          {provider.store.embed.meta && (
            <MetaPreview
              meta={provider.store.embed.meta}
              onRemove={provider.store.embed.clearRichEmbed}
              containerStyle={styles.meta}
            />
          )}
        </View>
        <View style={[theme.backgroundPrimary, styles.inputContainer]}>
          {(provider.store.parent || provider.store.edit) && (
            <View
              style={[
                theme.borderBottomHair,
                theme.borderPrimary,
                theme.paddingBottom2x,
                theme.paddingHorizontal4x,
                theme.marginBottom2x,
              ]}>
              <Text style={theme.colorSecondaryText}>
                {provider.store.edit
                  ? i18n.t('edit')
                  : i18n.t('activity.replyTo', {
                      user: provider.store.parent?.ownerObj.username,
                    })}
              </Text>
            </View>
          )}

          <View
            style={[
              theme.rowJustifyStart,
              theme.alignEnd,
              theme.paddingHorizontal4x,
            ]}>
            <TextInput
              ref={ref}
              autoFocus={true}
              multiline={true}
              editable={!provider.store.saving}
              scrollEnabled={true}
              placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
              placeholder={placeHolder}
              underlineColorAndroid="transparent"
              onChangeText={provider.store.setText}
              value={provider.store.text}
              maxLength={CHAR_LIMIT}
              // onBlur={() => provider.store?.setShowInput(false)}
              style={[
                theme.fullWidth,
                theme.colorPrimaryText,
                theme.fontL,
                styles.input,
                inputMaxHeight,
              ]}
            />
            {!provider.store.saving ? (
              <View>
                <View
                  style={[
                    theme.rowJustifySpaceBetween,
                    styles.sendIconCont,
                    theme.alignCenter,
                  ]}>
                  <Touchable
                    onPress={provider.store.post}
                    style={theme.paddingRight2x}
                    testID="PostCommentButton">
                    <Icon
                      name="md-send"
                      size={18}
                      style={theme.colorSecondaryText}
                    />
                  </Touchable>
                  {!provider.store.edit && (
                    <CommentInputBottomMenu
                      store={provider.store}
                      containerStyle={styles.sendIconCont}
                      afterSelected={afterSelected}
                      beforeSelect={beforeSelect}
                    />
                  )}
                </View>
                <Text style={[theme.fontXS, theme.colorSecondaryText]}>
                  {provider.store.text.length} / {CHAR_LIMIT}
                </Text>
              </View>
            ) : (
              <DotIndicator
                containerStyle={[theme.alignSelfCenter, theme.justifyEnd]}
                color={ThemedStyles.getColor('primary_text')}
                scaleEnabled={true}
              />
            )}
          </View>
        </View>
      </View>
    </KeyboardSpacingView>
  );
});

export default CommentInput;

const styles = StyleSheet.create({
  meta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 16,
  },
  preview: {
    minHeight: 80,
    margin: 10,
  },
  sendIconCont: {
    paddingBottom: Platform.select({
      android: 13,
      ios: 8,
    }),
  },
  input: {
    minHeight: 35,
    flex: 1,
    lineHeight: 22,
  },
  inputContainer: {
    shadowColor: 'black',
    maxHeight: height * 0.4,
    width: '100%',
    borderColor: 'transparent',
    ...Platform.select({
      android: { paddingTop: 7, paddingBottom: 9 },
      ios: { paddingTop: 10, paddingBottom: 12 },
    }),
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 16,
  },
});
