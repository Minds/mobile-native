import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { useKeyboard } from '@react-native-community/hooks';
import { observer, useLocalStore } from 'mobx-react';
import * as Progress from 'react-native-progress';
import IonIcon from 'react-native-vector-icons/Ionicons';

import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import MetaPreview from './MetaPreview';
import ImagePreview from './ImagePreview';
import TitleInput from './TitleInput';
import MindsVideo from '../media/MindsVideo';
import NavigationService from '../navigation/NavigationService';
import RemindPreview from './RemindPreview';
import PosterOptions from './PosterOptions';
import TopBar from './TopBar';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

/**
 * Poster Screen
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const keyboard = useKeyboard();
  const inputRef = useRef(null);
  const isImage =
    props.store.mediaToConfirm &&
    props.store.mediaToConfirm.type.startsWith('image');

  // On post press
  const onPost = useCallback(async () => {
    const isEdit = props.store.isEdit;
    const entity = await (props.store.isRemind
      ? props.store.remind()
      : props.store.submit());

    if (entity) {
      props.onPost(entity, isEdit);
    }
  }, [props]);

  // On press back
  const onPressBack = useCallback(() => {
    if (props.store.isRemind || props.store.isEdit) {
      props.store.clear();
      NavigationService.goBack();
    } else {
      props.store.setModePhoto();
    }
  }, [props.store]);

  const localStore = useLocalStore(() => ({
    height: 42, // input height
    onSizeChange(e) {
      localStore.height = e.nativeEvent.contentSize.height * 1.1;
    },
  }));

  const videoPreviewStyle = {
    height: keyboard.keyboardShown ? width / 2.5 : width,
    width: width,
    maxHeight: Math.round(height / 2) - 30,
    padding: keyboard.keyboardShown ? 5 : 0,
  };

  const imagePreviewStyle = {
    maxHeight: Math.round(height / 2) - 30,
    padding: keyboard.keyboardShown ? 5 : 0,
  };

  const previewRatio = keyboard.keyboardShown ? 2.5 : 1;
  const showEmbed = props.store.embed.hasRichEmbed && props.store.embed.meta;

  const fontSize =
    props.store.attachment.hasAttachment || props.store.text.length > 85
      ? theme.fontXL
      : theme.fontXXL;

  const placeholder = props.store.attachment.hasAttachment
    ? i18n.t('description')
    : i18n.t('capture.placeholder');

  const rightButton = props.store.attachment.uploading
    ? undefined
    : props.store.isRemind
    ? i18n.t('capture.remind')
    : props.store.isEdit
    ? i18n.t('save')
    : i18n.t('capture.post');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'height' : null}>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.bodyContainer}>
        <TopBar
          rightText={rightButton}
          onPressRight={onPost}
          onPressBack={onPressBack}
          store={props.store}
        />
        {props.store.attachment.hasAttachment && (
          <>
            {isImage ? (
              <View style={imagePreviewStyle}>
                {!props.store.isEdit && (
                  <TouchableOpacity
                    onPress={() =>
                      props.store.attachment.cancelOrDelete(!props.store.isEdit)
                    }
                    style={[styles.removeMedia, theme.backgroundSecondary]}>
                    <IonIcon
                      name="ios-close"
                      size={28}
                      style={(styles.icon, theme.colorPrimaryText)}
                    />
                  </TouchableOpacity>
                )}
                <ImagePreview
                  image={props.store.mediaToConfirm}
                  minRatio={previewRatio}
                  style={imagePreviewStyle}
                />
              </View>
            ) : (
              <View style={videoPreviewStyle}>
                <TouchableOpacity
                  onPress={props.store.attachment.cancelOrDelete}
                  style={[styles.removeMedia, theme.backgroundSecondary]}>
                  <IonIcon
                    name="ios-close"
                    size={28}
                    style={(styles.icon, theme.colorPrimaryText)}
                  />
                </TouchableOpacity>
                <MindsVideo
                  video={props.store.mediaToConfirm}
                  resizeMode={keyboard.keyboardShown ? 'cover' : 'contain'}
                />
              </View>
            )}
            {props.store.attachment.uploading && (
              <Progress.Bar
                progress={props.store.attachment.progress}
                width={width}
                color={ThemedStyles.getColor('green')}
                borderWidth={0}
                borderRadius={0}
                useNativeDriver={true}
              />
            )}
            <TitleInput store={props.store} />
          </>
        )}
        <TextInput
          style={[
            theme.fullWidth,
            theme.colorPrimaryText,
            fontSize,
            theme.paddingHorizontal4x,
            styles.input,
            { height: localStore.height },
          ]}
          onContentSizeChange={localStore.onSizeChange}
          ref={inputRef}
          scrollEnabled={false}
          placeholder={placeholder}
          placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
          onChangeText={props.store.setText}
          textAlignVertical="top"
          value={props.store.text}
          multiline={true}
          selectTextOnFocus={false}
          underlineColorAndroid="transparent"
          testID="PostInput"
        />
        {props.store.isRemind && <RemindPreview entity={props.store.entity} />}
        {showEmbed && (
          <MetaPreview
            meta={props.store.embed.meta}
            onRemove={props.store.embed.clearRichEmbed}
            isEdit={props.store.isEdit}
          />
        )}
      </ScrollView>
      <PosterOptions store={props.store} />
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
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
  backIcon: {
    shadowOpacity: 2,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  postButton: {
    textAlign: 'right',
    textAlignVertical: 'center',
    fontSize: 20,
    paddingRight: 20,
  },
  container: {
    flex: 1,
    paddingBottom: 0,
    marginBottom: 0,
  },
  bodyContainer: {
    minHeight: '100%',
    paddingBottom: 100,
  },
  icon: {
    color: '#FFFFFF',
  },
  removeMedia: {
    zIndex: 10000,
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.65,
  },
});
