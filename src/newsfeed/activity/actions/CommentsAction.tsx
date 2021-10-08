import React, { useCallback } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { Icon } from '~ui/icons';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import { useRoute } from '@react-navigation/native';
import { ActivityRouteProp } from '../../ActivityScreen';
import { actionsContainerStyle } from './styles';
import PressableScale from '~/common/components/PressableScale';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(PressableScale);

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
const CommentsAction = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
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
    <TouchableOpacityCustom onPress={openComments} testID={props.testID}>
      <View style={actionsContainerStyle}>
        <Icon
          style={[theme.colorIcon, theme.marginRight]}
          size="small"
          color="SecondaryText"
          name={icon}
        />
        {!props.hideCount && <Counter count={props.entity['comments:count']} />}
      </View>
    </TouchableOpacityCustom>
  );
});

export default CommentsAction;
