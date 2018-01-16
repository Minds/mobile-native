import React, {
  PureComponent
} from 'react';

import { View } from 'react-native';

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
  _onLayout = (event) => {
    if (!this.height) {
      this.height = event.nativeEvent.layout.height;
    }
  }

  /**
   * Render
   */
  render() {
    return (
      <View onLayout={this._onLayout}>
        <Activity
          entity={this.props.entity}
          navigation={this.props.navigation}
          disableProgress={true}
        />
      </View>
    )
  }
}
