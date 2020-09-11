import React, { Component, useCallback, useEffect } from 'react';

import { observer } from 'mobx-react';

import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import { useRoute } from '@react-navigation/native';
import { ActivityRouteProp } from '../../ActivityScreen';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel | BlogModel;
  testID?: string;
  navigation: any;
  onPressComment?: () => void;
};

/**
 * Comments Action Component
 */
const CommentsAction = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const icon = props.entity.allow_comments
    ? 'chat-bubble'
    : 'speaker-notes-off';

  const route: ActivityRouteProp = useRoute();

  const openComments = useCallback(() => {
    if (props.onPressComment) {
      props.onPressComment();
      return;
    }
    const cantOpen =
      !props.entity.allow_comments && props.entity['comments:count'] === 0;

    if ((route && route.name === 'Activity') || cantOpen) {
      return;
    }
    if (props.entity.subtype && props.entity.subtype === 'blog') {
      props.navigation.push('BlogView', {
        blog: props.entity,
        scrollToBottom: true,
      });
    } else {
      props.navigation.push('Activity', {
        entity: props.entity,
        scrollToBottom: true,
      });
    }
  }, [props, route]);

  useEffect(() => {
    if (route && route.params?.focusedUrn) {
      setTimeout(() => {
        openComments();
      }, 100);
    }
  }, [openComments, route]);

  return (
    <TouchableOpacityCustom
      style={[
        theme.rowJustifyCenter,
        theme.paddingHorizontal3x,
        theme.paddingVertical4x,
        theme.alignCenter,
      ]}
      onPress={openComments}
      testID={props.testID}>
      <Icon
        style={[theme.colorIcon, theme.marginRight]}
        name={icon}
        size={21}
      />
      <Counter count={props.entity['comments:count']} />
    </TouchableOpacityCustom>
  );
});

export default CommentsAction;
