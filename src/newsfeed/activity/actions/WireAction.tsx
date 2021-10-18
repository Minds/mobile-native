import React, { PureComponent } from 'react';
import { IconButtonNext } from '~ui/icons';
import type UserModel from '../../../channel/UserModel';
import { actionsContainerStyle } from './styles';

type PropsType = {
  owner: UserModel;
  navigation: any;
};

/**
 * Wire Action Component
 */
export default class WireAction extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    return (
      <IconButtonNext
        style={actionsContainerStyle}
        scale
        name="money"
        size="small"
        fill
        onPress={this.openWire}
      />
    );
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.owner });
  };
}
