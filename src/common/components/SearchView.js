import React, {
  PureComponent
} from 'react';

import {
  TextInput,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Search Component
 */
export default class SearchView extends PureComponent {

  /**
   * Default props
   */
  static defaultProps = {
    containerStyle: null
  };

  /**
   * Render
   */
  render() {
    const {
      iconRight,
      iconRightOnPress,
      right,
      containerStyle,
      ...attributes
    } = this.props;

    let rIcon = this.getRightIcon(iconRight, iconRightOnPress);

    return (
      <View style={[styles.container, containerStyle]}>
        <Icon size={22} style={styles.icon} name={'md-search'} color={'#444'} />
        <TextInput
          onFocus={ this.props.onFocus }
          onBlur={ this.props.onBlur }
          {...attributes}
          underlineColorAndroid={
            'transparent'
          }
          style={styles.input}
        />
        {rIcon}
      </View>
    );
  }

  /**
   * Get right icon or null
   * @param {string} iconRight
   * @param {function} iconRightOnPress
   */
  getRightIcon(iconRight, iconRightOnPress) {
    if (iconRight) {
      if (typeof iconRight === 'string' || iconRight instanceof String) {
        if (iconRightOnPress) {
          return (
            <TouchableOpacity style={[styles.icon, styles.iconRight]} onPress={iconRightOnPress}>
              <Icon size={18} name={iconRight} color={'#444'} />
            </TouchableOpacity>
          )
        } else {
          return <Icon size={18} style={[styles.icon, styles.iconRight]} name={iconRight} color={'#444'} />
        }
      }
      return iconRight;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000',
    borderTopColor: '#000',
    backgroundColor: '#FFF',
    justifyContent:'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 50,
    height:45,
    padding: 6,
    marginHorizontal: 5
  },
  iconRight: {
    right:0,
    paddingRight: 12,
  },
  icon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    paddingLeft: 10,
    top: 12
  },
  input: {
    paddingLeft: 30,
    paddingRight: 19,
    marginLeft: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#444',
    height: 42,
    ...Platform.select({
      ios: {
        height: 38,
      },
      android: {
        borderWidth: 0,
      },
    }),
  }
});