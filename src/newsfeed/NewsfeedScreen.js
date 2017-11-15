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

import { 
  getFeed
} from './NewsfeedService';

import Activity from './activity/Activity';

export default class NewsfeedScreen extends Component<{}> {

  state = {
    entities: [],
    offset: '',
    refreshing: false
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.entities}
        renderItem={this.renderActivity}
        keyExtractor={item => item.guid}
        onRefresh={() => this.refresh()}
        refreshing={this.state.refreshing}
        onEndReached={() => this.loadFeed()}
        onEndThreshold={0.3}
        style={styles.listView}
      />
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps == this.props && nextState == this.state)
      return false;
    return true;
  }

  loadFeed() {
    getFeed(this.state.offset)
      .then((feed) => {
        this.setState({
          entities: [... this.state.entities, ...feed.entities],
          offset: feed.offset,
          loaded: true,
          refreshing: false
        });
      })
      .catch(err => {
        console.log('error');
      })
  }

  refresh() {
    this.setState({ refreshing: true })

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000)
  }

  renderActivity(row) {
    const entity = row.item;
    return (
      <View>
        <Activity entity={entity} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
	listView: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  }
});