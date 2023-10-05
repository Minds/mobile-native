import React, { PureComponent } from 'react';

import {
  Platform,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';

import Icon from '@expo/vector-icons/Ionicons';
import ThemedStyles from '../../styles/ThemedStyles';
import TextInput from './TextInput';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface Props {
  placeholder: string;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: (text) => void;
  containerStyle: StyleProp<ViewStyle>;
  iconRight: IconName | null;
  iconRightOnPress: Function;
}

/**
 * Search Component
 */
export default class SearchView extends PureComponent<Props> {
  /**
   * Default props
   */
  static defaultProps = {
    containerStyle: null,
  };

  containerStyle: any;

  constructor(props: Props) {
    super(props);

    this.containerStyle = [styles.container, props.containerStyle];
  }

  /**
   * Render
   */
  render() {
    const { iconRight, iconRightOnPress, ...attributes } = this.props;

    let rIcon = this.getRightIcon(iconRight, iconRightOnPress);

    return (
      <View style={this.containerStyle}>
        <Icon size={22} style={iconStyle} name={'md-search'} />
        {
          <TextInput
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            selectTextOnFocus={true}
            placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
            {...attributes}
            underlineColorAndroid={'transparent'}
            style={[styles.input, ThemedStyles.style.colorPrimaryText]}
            testID="MessengerContactText"
          />
        }
        {rIcon}
      </View>
    );
  }

  /**
   * Get right icon or null
   */
  getRightIcon(iconRight: IconName | null, iconRightOnPress) {
    if (iconRight) {
      if (typeof iconRight === 'string') {
        if (iconRightOnPress) {
          return (
            <TouchableOpacity
              style={styles.iconRight}
              onPress={iconRightOnPress}>
              <Icon
                size={18}
                name={iconRight}
                style={ThemedStyles.style.colorSecondaryText}
              />
            </TouchableOpacity>
          );
        } else {
          return <Icon size={18} style={styles.iconRight} name={iconRight} />;
        }
      }
      return iconRight;
    }
    return null;
  }
}

const styles = ThemedStyles.create({
  container: [
    'bgSecondaryBackground',
    {
      borderBottomColor: '#000',
      borderTopColor: '#000',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 50,
      height: 45,
      padding: 6,
      marginHorizontal: 5,
    },
  ],
  iconRight: [
    'colorSecondaryText',
    {
      right: 0,
      paddingRight: 12,
      marginLeft: 10,
    },
  ],
  icon: {
    marginLeft: 10,
  },
  input: {
    paddingLeft: 5,
    paddingRight: 19,
    marginLeft: 8,
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 42,
    ...Platform.select({
      ios: {
        height: 38,
      },
      android: {
        borderWidth: 0,
      },
    }),
  },
});

const iconStyle = ThemedStyles.combine(styles.icon, 'colorIcon');
