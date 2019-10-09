import React, {
  Component
} from 'react';

import {
  Text,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {
  observer,
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonStyle as CS } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import testID from '../../../common/helpers/testID';
import i18n from '../../../common/services/i18n.service';
import logService from '../../../common/services/log.service';
import { FLAG_VOTE } from '../../../common/Permissions';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Thumb Up Action Component
 */
export default
@observer
class ThumbUpAction extends Component {

  /**
   * Default Props
   */
  static defaultProps = {
    size: 20,
  };

  /**
   * Thumb direction
   */
  direction = 'up';

  /**
   * Action Icon
   */
  iconName = 'thumb-up';

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    const count = entity[`thumbs:${this.direction}:count`];

    const canVote = entity.can(FLAG_VOTE);

    const color = canVote ? (this.voted ? CS.colorPrimary : CS.colorAction) : CS.colorLightGreyed;

    return (
      <TouchableOpacityCustom
        style={[CS.flexContainer, CS.centered, this.props.orientation == 'column' ? CS.columnAlignCenter : CS.rowJustifyCenter ]}
        onPress={this.toggleThumb}
        {...testID(`Thumb ${this.direction} activity button`)}
      >
        <Icon style={[color, CS.marginRight]} name={this.iconName} size={this.props.size} />
        <Counter size={this.props.size * 0.70} count={count} orientation={this.props.orientation} {...testID(`Thumb ${this.direction} count`)}/>
      </TouchableOpacityCustom>
    );
  }

  get voted() {
    return this.props.entity.votedUp;
  }

  /**
   * Toggle thumb
   */
  toggleThumb = async () => {

    if (!this.props.entity.can(FLAG_VOTE, true)) return;

    try {
      await this.props.entity.toggleVote(this.direction);
    } catch (err) {
      logService.exception(`[Thumb${this.direction}Action]`, err)
      Alert.alert(
        i18n.t('sorry'),
        i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
        [
          {text: i18n.t('ok'), onPress: () => {}},
        ],
        { cancelable: false }
      );
    }

  }
}
