//@ts-nocheck
import ThumbUpAction from './ThumbUpAction';

/**
 * Thumb Down Action Component
 */
export default class ThumbDownAction extends ThumbUpAction {
  direction: 'up' | 'down' = 'down';
  iconName = 'thumb-down';

  get voted() {
    return this.props.entity.votedDown;
  }
}
