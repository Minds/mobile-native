import React, { PureComponent } from 'react';

import ActivityModel from '../../../newsfeed/ActivityModel';
import { actionsContainerStyle } from './styles';
import { IconButtonNext } from '~/common/ui';
import PermissionsService from '~/common/services/permissions.service';
import ThemedStyles from '~/styles/ThemedStyles';

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
    const canBoost = PermissionsService.canBoost();
    return (
      <IconButtonNext
        testID="Boost"
        style={
          canBoost
            ? actionsContainerStyle
            : [actionsContainerStyle, ThemedStyles.style.opacity50]
        }
        scale
        name="boost"
        size="small"
        disabled={!canBoost}
        fill
        onPress={this.openBoost}
      />
    );
  }

  /**
   * Open boost screen
   */
  openBoost = () => {
    this.props.navigation.push('BoostScreenV2', {
      entity: this.props.entity,
    });
  };
}
