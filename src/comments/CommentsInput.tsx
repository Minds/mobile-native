import React, { PureComponent, useState, useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';

import { View, TextInput, Image, TouchableOpacity } from 'react-native';
import ActivityModel from '../newsfeed/ActivityModel';
import ThemedStyles from '../styles/ThemedStyles';
import { useLegacyStores } from '../common/hooks/use-stores';
import { Icon } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import i18n from '../common/services/i18n.service';
import type CommentsStore from './CommentsStore';
import CommentsStoreV2 from './CommentsStoreV2';
import useRichEmbedStore from '../common/stores/useRichEmbedStore';
import CaptureMetaPreview from '../capture/CaptureMetaPreview';
import useAttachmentStore from '../common/stores/useAttachmentStore';
import attachmentService from '../common/services/attachment.service';
import CapturePreview from '../capture/CapturePreview';
import ImagePreview from '../compose/ImagePreview';

type Props = {
  entity: ActivityModel;
  onPosted: Function;
};

export const CommentsInput = observer((props: Props) => {
  const { user } = useLegacyStores();
  const store = useLocalStore(CommentsStoreV2);
  const richEmbedStore = useRichEmbedStore();
  const attachmentStore = useAttachmentStore();

  useEffect(() => {
    richEmbedStore.check(store.input);
  }, [store.input]);

  useEffect(() => {
    store.setRichEmbedMeta(richEmbedStore.meta);
  }, [richEmbedStore.meta]);

  useEffect(() => {
    store.setAttachmentGuid(attachmentStore.guid);
  }, [attachmentStore.guid]);

  let actionAttachmentSheetRef: ActionSheet;

  const onSubmit = (e) => {
    const comment = store.post(props.entity);
    props.onPosted(comment);
  };

  const avatarImg =
    user.me && user.me.getAvatarSource ? user.me.getAvatarSource() : {};

  /**
   * Show attachment
   */
  const showAttachment = (): any =>
    actionAttachmentSheetRef && actionAttachmentSheetRef.show();

  /**
   * Select media source
   */
  const selectMediaSource = (opt: number) => {
    switch (opt) {
      case 1:
        attachmentService.gallery().then((media) => {
          attachmentStore.attachMedia(media);
        });
        //store.gallery(actionSheetRef);
        break;
      case 2:
        attachmentService.photo().then((media) => {
          attachmentStore.attachMedia(media);
        });
        break;
      case 3:
        attachmentService.video().then((media) => {
          attachmentStore.attachMedia(media);
        });
        break;
    }
  };

  /**
   * Input
   */
  const Input = () => {
    return (
      <TextInput
        style={[
          ThemedStyles.style.flexColumn,
          ThemedStyles.style.centered,
          ThemedStyles.style.paddingHorizontal3x,
          ThemedStyles.style.paddingBottom,
          ThemedStyles.style.colorPrimaryText,
          { fontSize: 14 },
        ]}
        editable={true}
        multiline={true}
        numberOfLines={4}
        placeholder="Write your comment..."
        value={store.input}
        onChangeText={store.setInput}
        clearButtonMode="always"
      />
    );
  };

  /**
   * Attachment Button
   */
  const AttachmentButton = () => {
    return (
      <TouchableOpacity
        onPress={showAttachment}
        style={ThemedStyles.style.paddingRight2x}
        testID="CommentAttachment">
        <Icon
          type="material-community"
          name="image-outline"
          size={24}
          color={ThemedStyles.getColor('icon')}
        />
      </TouchableOpacity>
    );
  };

  /**
   * Submit button
   */
  const SubmitButton = () => {
    if (store.input.length === 0) {
      return undefined;
    }
    return (
      <TouchableOpacity
        onPress={onSubmit}
        style={ThemedStyles.style.paddingRight2x}
        testID="PostCommentButton">
        <Icon
          type="ionicon"
          name="md-send"
          size={24}
          color={ThemedStyles.getColor('icon_active')}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View
        style={[
          ThemedStyles.style.rowJustifyCenter,
          ThemedStyles.style.centered,
          ThemedStyles.style.paddingHorizontal2x,
        ]}>
        <Image
          source={avatarImg}
          style={[
            {
              height: 36,
              width: 36,
              borderRadius: 18,
            },
            ThemedStyles.style.borderHair,
            ThemedStyles.style.borderPrimary,
          ]}
        />
        <View
          style={[
            ThemedStyles.style.flexContainer,
            ThemedStyles.style.rowJustifyStart,
            ThemedStyles.style.marginLeft2x,
            ThemedStyles.style.paddingVertical,
            { borderRadius: 2, minHeight: 36, borderColor: '#aaa' },
            ThemedStyles.style.borderHair,
          ]}>
          {Input()}
          {AttachmentButton()}
          {SubmitButton()}
        </View>
      </View>

      <ActionSheet
        ref={(ref) => (actionAttachmentSheetRef = ref)}
        options={[
          i18n.t('cancel'),
          i18n.t('capture.gallery'),
          i18n.t('capture.photo'),
          i18n.t('capture.video'),
        ]}
        onPress={selectMediaSource}
        cancelButtonIndex={0}
      />

      {attachmentStore.hasAttachment && (
        <View
          style={[
            {
              height: 200,
              flexDirection: 'row',
              alignItems: 'stretch',
              position: 'relative',
            },
            ThemedStyles.style.marginTop3x,
          ]}>
          <CapturePreview
            // @ts-ignore
            uri={attachmentStore.uri}
            type={attachmentStore.type}
          />
          <TouchableOpacity
            style={[
              { position: 'absolute', right: 0, top: 0 },
              ThemedStyles.style.paddingRight2x,
            ]}>
            <Icon
              type="ionicon"
              name="md-close"
              size={36}
              color="#FFFFFF"
              onPress={attachmentStore.delete}
            />
          </TouchableOpacity>
        </View>
      )}
      {(richEmbedStore.meta || richEmbedStore.metaInProgress) && (
        <CaptureMetaPreview
          //@ts-ignore
          meta={richEmbedStore.meta}
          inProgress={richEmbedStore.metaInProgress}
          onRemove={richEmbedStore.clear}
        />
      )}
    </View>
  );
});

export default CommentsInput;
