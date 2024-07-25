import React, { PureComponent } from 'react';

import Activity from '../activity/Activity';
import type ActivityModel from '../ActivityModel';

/**
 * Boosted Item for carousel
 */
export default class BoostItem extends PureComponent<{
  entity: ActivityModel;
  navigation: any;
}> {
  /**
   * height after render
   */
  height = 0;

  /**
   * On layout
   */
  _onLayout = event => {
    if (!this.height) {
      this.height = event.nativeEvent.layout.height;
    }
  };

  /**
   * Render
   */
  render() {
    return (
      <Activity
        onLayout={this._onLayout}
        entity={this.props.entity}
        navigation={this.props.navigation}
      />
    );
  }
}
