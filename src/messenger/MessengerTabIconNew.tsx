//@ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

import { observer, inject } from 'mobx-react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../styles/ThemedStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainSwiperParamList } from '../navigation/NavigationTypes';

interface Props {
  navigation: StackNavigationProp<MainSwiperParamList>;
  tintColor?: string;
}

@inject('messengerList')
@observer
export default class MessengerTabIconNew extends Component<Props> {
  /**
   * Navigate to messenger screen
   */
  navToMessenger = () => this.props.navigation.navigate('Messenger');

  /**
   * Render
   */
  render() {
    const tintColor = this.props.tintColor;
    const theme = ThemedStyles.style;
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this.navToMessenger}>
        <View>
          <Icon
            name="chat-bubble-outline"
            size={26}
            style={[styles.button, theme.colorIcon]}
            testID="MessengerButton"
          />
          {this.props.messengerList.unread ? (
            <FAIcon
              name="circle"
              size={10}
              color="rgba(70, 144, 223, 1)"
              style={styles.unread}
            />
          ) : null}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: -2,
    left: 28,
  },
  button: {
    paddingHorizontal: 10,
  },
});
