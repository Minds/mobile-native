import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
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

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  size?: number;
  orientation?: 'column' | 'row';
  voted?: boolean;
  direction?: 'up' | 'down';
  iconName?: string;
  TouchableComponent?: any;
};

const ThumbUpAction = observer(
  ({
    size = 21,
    entity,
    voted,
    direction = 'up',
    iconName = 'thumb-up',
    TouchableComponent,
  }: PropsType) => {
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

    const Touchable = TouchableComponent || TouchableOpacityCustom;

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
