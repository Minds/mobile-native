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

import Icon from 'react-native-vector-icons/Ionicons';

export default class MessengerScreen extends Component<{}> {

  state = {
    messages: [],
    refreshing: false
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-chatbubbles" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.messages}
        renderItem={this.renderMessages}
        keyExtractor={item => item.guid}
        onRefresh={() => this.refresh()}
        refreshing={this.state.refreshing}
        style={styles.listView}
      />
    );
  }

  componentDidMount() {
  }

  refresh() {
    this.setState({ refreshing: true })

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000)
  }

  renderMessage(row) {
    return (
      <View>
        <Text>New message</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
	listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  }
});