//@ts-nocheck
import ThumbUpAction from './ThumbUpAction';

/**
 * Thumb Down Action Component
 */
export default class ThumbDownAction extends ThumbUpAction {
  direction: 'up' | 'down' = 'down';
  filledIcon: string = 'dislike1';
  outlineIcon: string = 'dislike2';

  get voted() {
    return this.props.entity.votedDown;
  }
}
