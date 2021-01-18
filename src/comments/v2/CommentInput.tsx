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
import KeyboardSpacingView from '../../common/components/KeyboardSpacingView';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react';
import type CommentsStore from './CommentsStore';
import { action, observable } from 'mobx';
import MediaPreview from './MediaPreview';
import MetaPreview from '../../compose/MetaPreview';
import GroupModel from '../../groups/GroupModel';
import CommentInputBottomMenu from './CommentInputBottomMenu';

const { height } = Dimensions.get('window');

class StoreProvider {
  @observable.ref store: CommentsStore | null = null;
  @action
  setStore = (s: CommentsStore) => (this.store = s);
}
const storeProvider = new StoreProvider();

export const CommentInputContext = React.createContext(storeProvider);

/**
 * Floating Input component
 */
const CommentInput = observer(() => {
  const theme = ThemedStyles.style;
  const ref = React.useRef<TextInput>(null);
  const provider = React.useContext(CommentInputContext);

  const afterSelected = () => ref.current?.focus();
  const beforeSelect = () => ref.current?.blur();

  if (!provider.store || !provider.store.showInput) {
    return null;
  }

  const placeHolder =
    provider.store.entity instanceof GroupModel
      ? i18n.t('messenger.typeYourMessage')
      : i18n.t('activity.typeComment');

  return (
    <KeyboardSpacingView
      noInset={true}
      style={StyleSheet.absoluteFill}
      enabled={Platform.OS === 'ios'}
      pointerEvents="box-none">
      <View style={[theme.justifyEnd, theme.flexContainer]}>
        <View style={theme.flexContainer}>
          <TouchableOpacity
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
              scrollEnabled={true}
              placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
              placeholder={placeHolder}
              underlineColorAndroid="transparent"
              onChangeText={provider.store.setText}
              value={provider.store.text}
              // onBlur={() => provider.store?.setShowInput(false)}
              style={[
                theme.fullWidth,
                theme.colorPrimaryText,
                theme.fontL,
                styles.input,
              ]}
            />
            <View style={theme.rowJustifyStart}>
              <TouchableOpacity
                onPress={provider.store.post}
                style={styles.sendIconCont}
                testID="PostCommentButton">
                <Icon
                  name="md-send"
                  size={18}
                  style={theme.colorSecondaryText}
                />
              </TouchableOpacity>
              {!provider.store.edit && (
                <CommentInputBottomMenu
                  store={provider.store}
                  afterSelected={afterSelected}
                  beforeSelect={beforeSelect}
                />
              )}
            </View>
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
