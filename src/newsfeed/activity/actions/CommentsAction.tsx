import React, { useCallback } from 'react';
import { IconButtonNext } from '~ui/icons';
import Counter from './Counter';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import { useRoute } from '@react-navigation/native';
import { ActivityRouteProp } from '../../ActivityScreen';
import { actionsContainerStyle } from './styles';
import withSpacer from '~ui/spacer/withSpacer';

const CounterSpaced = withSpacer(Counter);

type PropsType = {
  entity: ActivityModel | BlogModel;
  testID?: string;
  navigation: any;
  hideCount?: boolean;
  onPressComment?: () => void;
};

/**
 * Comments Action Component
 */
const CommentsAction = (props: PropsType) => {
  const icon = props.entity.allow_comments ? 'chat-solid' : 'chat-off';
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
        open: true,
      });
    } else {
      props.navigation.push('Activity', {
        entity: props.entity,
        scrollToBottom: true,
        open: true,
      });
    }
  }, [props, route]);

  return (
    <IconButtonNext
      style={actionsContainerStyle}
      scale
      name={icon}
      size="small"
      fill
      onPress={openComments}
      testID={props.testID}
      extra={
        !props.hideCount ? (
          <CounterSpaced left="1x" count={props.entity['comments:count']} />
        ) : null
      }
    />
  );
};

export default CommentsAction;
