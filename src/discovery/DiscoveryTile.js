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
  MINDS_URI
} from '../config/Config';



export default class DiscoveryTile extends Component<{}> {

  render() {
    return (
      <View style={styles.tile}>
        <Image source={ { uri: MINDS_URI + 'api/v1/archive/thumbnails/' + this.props.entity.guid + '/medium' }} style={styles.tileImage}/>
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps == this.props && nextState == this.state)
      return false;
    return true;
  }


}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 100,
  },
  tileImage: {
    flex: 1,
  },
});