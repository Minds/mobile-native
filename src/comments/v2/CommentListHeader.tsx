import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import { observer } from 'mobx-react';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';
import ThemedStyles from '../../styles/ThemedStyles';
import Comment from './Comment';
import type CommentsStore from './CommentsStore';
import i18n from '../../common/services/i18n.service';
import { useRoute } from '@react-navigation/native';
import GroupModel from '../../groups/GroupModel';

export default observer(function CommentListHeader(props: {
  store: CommentsStore;
}) {
  const route = useRoute<any>();
  const user = sessionService.getUser();
  const theme = ThemedStyles.style;

  const title =
    route.params && route.params.title
      ? route.params.title
      : i18n.t('comments.comments');

  const placeHolder =
    props.store.entity instanceof GroupModel
      ? 'messenger.typeYourMessage'
      : 'activity.typeComment';

  return (
    <View
      style={[
        theme.borderBottomHair,
        theme.borderPrimary,
        theme.backgroundPrimary,
      ]}>
      {props.store.parent ? (
        <View>
          <TouchableOpacity
            onPress={NavigationService.goBack}
            style={theme.paddingHorizontal2x}>
            <Icon
              name={'arrow-left'}
              size={28}
              style={theme.colorSecondaryText}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.headerCommentContainer,
              theme.borderPrimary,
              theme.backgroundSecondary,
            ]}>
            <Comment
              comment={props.store.parent}
              store={props.store}
              hideReply
            />
          </View>
        </View>
      ) : (
        <Text
          style={[
            theme.fontXL,
            theme.fontMedium,
            theme.paddingLeft3x,
            theme.marginBottom3x,
          ]}>
          {title}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => props.store.setShowInput(true)}
        style={[
          theme.rowJustifyStart,
          theme.borderTopHair,
          theme.borderPrimary,
          theme.paddingTop2x,
          theme.paddingBottom2x,
          theme.alignCenter,
        ]}>
        <FastImage source={user.getAvatarSource()} style={styles.avatar} />
        <Text style={[theme.fontL, theme.colorSecondaryText]}>
          {i18n.t(props.store.parent ? 'activity.typeReply' : placeHolder)}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  headerCommentContainer: {
    marginTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'scroll',
  },
  avatar: {
    height: 37,
    width: 37,
    borderRadius: 18.5,
    marginRight: 15,
    marginLeft: 15,
  },
});
