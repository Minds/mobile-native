import React, {Component} from 'react';

import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { CommonStyle as CS } from '../styles/Common';

export default class TabIcon extends Component {
  render() {
    const {name, size, color} = this.props;
    let icon;
    switch (name) {
      case 'md-add-circle-outline':
      case 'md-home':
      case 'md-notifications':
      case 'md-menu':
        icon = (
          <IonIcon
            name={name}
            style={color ? {color: color} : CS.colorIcon}
            size={size ? size : 24}
          />
        );
        break;
      case 'hashtag':
        icon = (
          <FAIcon
            name={name}
            style={color ? {color: color} : CS.colorIcon}
            size={size ? size : 24}
          />
        );
        break;
    }
    return icon;
  }
}
