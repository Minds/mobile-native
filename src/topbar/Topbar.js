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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  MINDS_URI
} from '../config/Config';


export default class Topbar extends Component<{}> {

  render() { 
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          
          <View style={styles.topbarLeft}>
            <Icon name="bell" size={18} color='#444' onPress={() => this.props.navigation.navigate('Notifications')} style={ styles.button } />
          </View>

          <View style={styles.topbarCenter}>
            <Image source={ { uri: MINDS_URI + 'icon/me' }} style={styles.avatar} />
          </View>

          <View style={styles.topbarRight}>
            <Icon name="bank" size={18} color='#444' style={ styles.button }/>
          </View>

        </View>
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
  container: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  topbar: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    //paddingLeft: 8,
  },
  topbarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topbarRight: {
    //paddingRight: 8,
  },
  button: {
    padding: 8,
  },
  avatar: {
    borderRadius: 16,
    width: 32,
    height: 32,
  },
});