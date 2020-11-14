import React, { useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Keyboard,
  Text,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';

import IonIcon from 'react-native-vector-icons/Ionicons';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import MetaPreview from './MetaPreview';
import TitleInput from './TitleInput';
import NavigationService from '../navigation/NavigationService';
import RemindPreview from './RemindPreview';
import PosterOptions from './PosterOptions';
import TopBar from './TopBar';
import { ScrollView } from 'react-native-gesture-handler';
import BottomBar from './BottomBar';
import MediaPreview from './MediaPreview';
import discardMessage from './discardMessage';
import Tags from '../common/components/Tags';

const { width } = Dimensions.get('window');

/**
 * Poster Screen
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  // On post press
  const onPost = useCallback(async () => {
    if (props.store.attachment.uploading) {
      return;
    }
    const isEdit = props.store.isEdit;
    const entity = await (props.store.isRemind
      ? props.store.remind()
      : props.store.submit());

    if (entity) {
      props.store.onPost(entity, isEdit);
    }
  }, [props.store]);

  // On press back
  const onPressBack = useCallback(() => {
    const discard = () => {
      if (props.store.isRemind || props.store.isEdit) {
        props.store.clear();
        NavigationService.goBack();
      } else {
        props.store.setModePhoto();
      }
    };
    if (
      props.store.text ||
      props.store.attachment.hasAttachment ||
      props.store.embed.hasRichEmbed
    ) {
      Keyboard.dismiss();
      discardMessage(discard);
    } else {
      discard();
    }
  }, [props.store]);

  const localStore = useLocalStore(() => ({
    height: 42, // input height
    onSizeChange(e) {
      localStore.height = e.nativeEvent.contentSize.height * 1.15;
    },
  }));

  const showEmbed = props.store.embed.hasRichEmbed && props.store.embed.meta;

  const fontSize =
    props.store.attachment.hasAttachment || props.store.text.length > 85
      ? theme.fontXL
      : theme.fontXXL;

  const placeholder = props.store.attachment.hasAttachment
    ? i18n.t('description')
    : i18n.t('capture.placeholder');

  const rightButton = props.store.isEdit ? (
    i18n.t('save')
  ) : (
    <IonIcon
      name="send"
      size={27}
      style={[
        theme.colorPrimaryText,
        props.store.attachment.uploading ? theme.opacity25 : null,
      ]}
    />
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.bodyContainer}>
        <TopBar
          containerStyle={theme.paddingLeft}
          backIconSize={45}
          rightText={rightButton}
          onPressRight={onPost}
          onPressBack={onPressBack}
          store={props.store}
        />
        {!props.store.noText && (
          <>
            {props.store.attachment.hasAttachment && (
              <TitleInput store={props.store} />
            )}
            <TextInput
              style={[
                theme.fullWidth,
                theme.colorPrimaryText,
                fontSize,
                theme.paddingHorizontal4x,
                theme.marginTop4x,
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
              multiline={true}
              selectTextOnFocus={false}
              underlineColorAndroid="transparent"
              testID="PostInput">
              <Tags>{props.store.text}</Tags>
            </TextInput>
          </>
        )}
        <MediaPreview store={props.store} />
        {props.store.isRemind && <RemindPreview entity={props.store.entity} />}
        {props.store.isEdit && props.store.entity.remind_object && (
          <RemindPreview entity={props.store.entity.remind_object} />
        )}
        {showEmbed && (
          <MetaPreview
            meta={props.store.embed.meta}
            onRemove={props.store.embed.clearRichEmbed}
            isEdit={props.store.isEdit}
          />
        )}
      </ScrollView>
      <PosterOptions ref={optionsRef} store={props.store} />
      <KeyboardAccessoryView
        hideBorder={true}
        animateOn="all"
        alwaysVisible
        style={[theme.backgroundPrimary, styles.bottomBarContainer]}
        avoidKeyboard>
        <BottomBar
          store={props.store}
          onOptions={() => {
            Keyboard.dismiss();
            optionsRef.current.show();
          }}
        />
      </KeyboardAccessoryView>
    </View>
  );
});

const styles = StyleSheet.create({
  bottomBarContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.0,
    elevation: 12,
  },
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
    paddingBottom: 75,
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
