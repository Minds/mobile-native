import React, { PureComponent } from 'react';

import Activity from '../activity/Activity';

/**
 * Boosted Item for carousel
 */
export default class BoostItem extends PureComponent {
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
        disableProgress={true}
      />
    );
  }
}
