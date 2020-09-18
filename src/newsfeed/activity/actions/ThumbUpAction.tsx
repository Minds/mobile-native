import React, { useCallback } from 'react';
import { observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonStyle as CS } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import testID from '../../../common/helpers/testID';
import { FLAG_VOTE } from '../../../common/Permissions';
import remoteAction from '../../../common/RemoteAction';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';
import { Platform, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

// prevent double tap in touchable
const CustomRNGHTouchable = withPreventDoubleTap(RNGHTouchableOpacity);
const CustomRNTouchable = withPreventDoubleTap(RNTouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  size?: number;
  orientation?: 'column' | 'row';
  voted?: boolean;
  direction?: 'up' | 'down';
  iconName?: string;
};

const ThumbUpAction = observer(
  ({
    size = 21,
    orientation = 'row',
    entity,
    voted,
    direction = 'up',
    iconName = 'thumb-up',
  }: PropsType) => {
    const route = useRoute();
    const theme = ThemedStyles.style;

    const count = entity[`thumbs:${direction}:count`];

    const canVote = entity.can(FLAG_VOTE);

    const _voted = voted !== undefined ? voted : entity.votedUp;

    const color = canVote
      ? _voted
        ? theme.colorIconActive
        : theme.colorIcon
      : CS.colorLightGreyed;

    /**
     * Toggle thumb
     */
    const toggleThumb = useCallback(async () => {
      if (!entity.can(FLAG_VOTE, true)) {
        return;
      }

      remoteAction(() => {
        return entity.toggleVote(direction);
      });
    }, [entity, direction]);

    const Touchable =
      Platform.OS === 'android' && route.name === 'Activity'
        ? CustomRNGHTouchable
        : CustomRNTouchable;

    return (
      <Touchable
        style={[
          theme.rowJustifyCenter,
          theme.paddingHorizontal3x,
          theme.paddingVertical4x,
          theme.alignCenter,
        ]}
        onPress={toggleThumb}
        {...testID(`Thumb ${direction} activity button`)}>
        <Icon style={[color, theme.marginRight]} name={iconName} size={size} />
        {count ? (
          <Counter
            // size={this.props.size * 0.7}
            count={count}
            testID={`Thumb ${direction} count`}
          />
        ) : undefined}
      </Touchable>
    );
  },
);

export default ThumbUpAction;
