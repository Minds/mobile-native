import React, {Component} from 'react';

import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import { CommonStyle as CS } from '../styles/Common';

export default class TabIcon extends Component {
  render() {
    const {name, size, color} = this.props;
    let icon;
    switch (name) {
      case 'plus':
        return (
          <EvilIcons
            name={name}
            style={color ? {color: color} : CS.colorIcon}
            size={size ? size : 24}
          />
        )
      case 'home':
        return (
          <Entypo
            name={name}
            style={color ? {color: color} : CS.colorIcon}
            size={size ? size : 24}
          />
        )
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
          <Fontisto
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
