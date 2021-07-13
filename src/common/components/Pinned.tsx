import React, { Component } from 'react';
import { observer } from 'mobx-react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import type ActivityModel from '../../newsfeed/ActivityModel';
import ThemedStyles from '../../styles/ThemedStyles';

// types
type PropsType = {
  entity: ActivityModel;
};

/**
 * Pinned icon
 */
@observer
export default class Pinned extends Component<PropsType> {
  /**
   * Render
   */
  render() {
    if (!this.props.entity.pinned) return null;
    return <IconMaterial name="turned-in" size={25} style={pinnedStyle} />;
  }
}

const pinnedStyle = ThemedStyles.combine(
  {
    position: 'absolute',
    right: 10,
    top: -5,
  },
  'colorIcon',
);
