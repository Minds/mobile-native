import React, { PureComponent } from 'react';

import ActivityModel from '../../../newsfeed/ActivityModel';
import { actionsContainerStyle } from './styles';
import { IconButtonNext } from '~/common/ui';
import { hasVariation } from '../../../../ExperimentsProvider';

type PropsType = {
  navigation: any;
  entity: ActivityModel;
};

/**
 * Boost Action Component
 */
export default class BoostAction extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    return (
      <IconButtonNext
        testID="Boost"
        style={actionsContainerStyle}
        scale
        name="boost"
        size="small"
        fill
        onPress={this.openBoost}
      />
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    if (hasVariation('mob-4638-boost-v2')) {
      this.props.navigation.push('BoostScreenV2', {
        entity: this.props.entity,
      });
    } else {
      this.props.navigation.push('BoostScreen', {
        entity: this.props.entity,
      });
    }
  };
}
