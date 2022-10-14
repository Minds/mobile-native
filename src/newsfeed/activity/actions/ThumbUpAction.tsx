import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { Icon } from '~ui/icons';
// import withClass from '~ui/withClass';
import { UISizing } from '~styles/Tokens';
// import { frameThrower } from '~ui/helpers';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_VOTE } from '../../../common/Permissions';
import remoteAction from '../../../common/RemoteAction';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { actionsContainerStyle, actionsContainerWrapper } from './styles';
import PressableScale from '~/common/components/PressableScale';
import { IconMapNameType } from '~/common/ui/icons/map';
import EntityCounter from './EntityCounter';

// prevent double tap in touchable
const PressableScaleCustom = withPreventDoubleTap(PressableScale);

type PropsType = {
  entity: ActivityModel;
  size: string;
  hideCount?: boolean;
  orientation: 'column' | 'row';
  touchableComponent?: React.ComponentClass;
};

// const AnimatedIcon: any = motify(withClass(Icon))();

const AnimatedThumb = ({
  voted,
  size,
  canVote,
  down,
  name,
}: {
  voted: boolean;
  size: UISizing | string;
  canVote: boolean;
  down: boolean;
  name: IconMapNameType;
}) => {
  // const initialRender = React.useRef(true);
  // TODO: enable animation https://github.com/nandorojo/moti/issues/131
  // const animation = useAnimationState({
  //   from: {
  //     transform: [
  //       // {
  //       //   scale: 1,
  //       // },
  //       // {
  //       //   rotate: '0deg',
  //       // },
  //       {
  //         translateY: 0,
  //       },
  //       {
  //         translateX: 0],
  //       },
  //     ],
  //   },
  //   up: {
  //     transform: [
  //       // {
  //       //   scale: [
  //       //     { value: 1, type: 'timing', duration: 80 },
  //       //     { value: 1.05, type: 'timing', duration: 100 },
  //       //     { value: 1, type: 'spring', delay: 80, stiffness: 600 },
  //       //   ],
  //       // },
  //       // {
  //       //   rotate: [
  //       //     { value: '0deg', type: 'timing', duration: 80 },
  //       //     { value: '-12deg', type: 'timing', duration: 100 },
  //       //     { value: '0deg', type: 'spring', delay: 80, stiffness: 600 },
  //       //   ],
  //       // },
  //       {
  //         translateY: [
  //           { value: 0, type: 'timing', duration: 80 },
  //           { value: down ? 6 : -6, type: 'timing', duration: 100 },
  //           { value: 0, type: 'spring', delay: 80, stiffness: 600 },
  //         ],
  //       },
  //     ],
  //   },
  //   down: {
  //     translateX: [-10, 0],
  //   },
  // });

  // React.useEffect(() => {
  //   if (initialRender.current) {
  //     initialRender.current = false;
  //     return;
  //   }
  //   if (voted) {
  //     frameThrower(10, () => animation.transitionTo('up'));
  //   } else {
  //     frameThrower(20, () => animation.transitionTo('down'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [voted]);

  // const disabled = !canVote;
  // const active = !!(canVote && voted);

  // return (
  //   <AnimatedIcon
  //     active={active}
  //     disabled={disabled}
  //     name={name}
  //     size={size}
  //     // state={animation}
  //   />
  // );
  const disabled = !canVote;
  const active = !!(canVote && voted);

  return <Icon active={active} disabled={disabled} name={name} size={size} />;
};

/**
 * Thumb Up Action Component
 */
@observer
class ThumbUpAction extends Component<PropsType> {
  /**
   * Default Props
   */
  static defaultProps = {
    size: 21,
    orientation: 'row',
  };

  /**
   * Thumb direction
   */
  direction: 'up' | 'down' = 'up';

  /**
   * Action Icon
   */
  iconName: IconMapNameType = 'thumb-up';

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const canVote = entity.can(FLAG_VOTE);
    const Touchable = this.props.touchableComponent || PressableScaleCustom;

    return (
      <Touchable
        style={actionsContainerStyle}
        onPress={this.toggleThumb}
        testID={`Thumb ${this.direction} activity button`}>
        <View style={actionsContainerWrapper}>
          <AnimatedThumb
            canVote={canVote}
            voted={this.voted}
            size={this.props.size}
            name={this.iconName}
            down={this.direction !== 'up'}
          />
          {!this.props.hideCount ? (
            <EntityCounter
              entity={entity}
              countProperty={`thumbs:${this.direction}:count`}
            />
          ) : undefined}
        </View>
      </Touchable>
    );
  }

  get voted() {
    return this.props.entity.votedUp;
  }

  /**
   * Toggle thumb
   */
  toggleThumb = async () => {
    if (!this.props.entity.can(FLAG_VOTE, true)) {
      return;
    }

    remoteAction(() => {
      return this.props.entity.toggleVote(this.direction);
    });
  };
}

export default ThumbUpAction;
