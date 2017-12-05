import React, { 
    Component 
} from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    View,
    FlatList,
    ListView
} from 'react-native';

import {
  NavigationActions
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import session from './../common/services/session.service';

export default class MoreScreen extends Component<{}> {

  state = {
    activities: [],
    refreshing: false
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="menu" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <View>
        <Button
          onPress={() => this.onPressLogout()}
          title="Logout"
          color="rgba(0,0,0, 0.5)"
        />
      </View>
    );
  }

  onPressLogout() {
    session.clear();
    const loginAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    })

    this.props.navigation.dispatch(loginAction);
  }

  componentDidMount() {
  }


}

const styles = StyleSheet.create({
	listView: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  }
});