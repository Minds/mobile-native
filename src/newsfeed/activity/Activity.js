import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import OwnerBlock from './OwnerBlock';
import Actions from './Actions';


export default class Activity extends Component {

  state = {

  };

  render() {

    let media;

    switch (this.props.entity.custom_type) {
      case "batch":
        let source = {
          uri: this.props.entity.custom_data[0].src
        }
        media = (
          <View style={styles.imageContainer}>
            <Image source={ source } style={styles.image} resizeMode="cover"/>
          </View>
        )
        break;
    }

    if (this.props.entity.perma_url) {
      let source = {
        uri: this.props.entity.thumbnail_src
      }
      media = (
        <View style={styles.imageContainer}>
          <Image source={ source } style={styles.image} resizeMode="cover"/>
          <View style={ { padding: 8 }}>
            <Text style={styles.title}>{this.props.entity.title}</Text>
            <Text style={styles.timestamp}>{this.props.entity.perma_url}</Text>
          </View>
        </View>
      )
    }

    return (
        <View style={styles.container}>
          <OwnerBlock entity={this.props.entity.ownerObj} navigation={this.props.navigation}>
            <Text style={styles.timestamp}>{this.formatDate(this.props.entity.time_created)}</Text>
          </OwnerBlock>
          <View style={styles.message}>
            <Text>{this.props.entity.message}</Text>
          </View>
          { this.showRemind() }
          { media }
          { this.showActions() }
        </View>

    );
  }

  showRemind() {
    if (this.props.entity.remind_object) {
      return (<View style={styles.remind}>
                <Activity hideTabs={true} entity={this.props.entity.remind_object} navigation={this.props.navigation} />
              </View>);
    }
  }

  showActions() {
    if(!this.props.hideTabs) {
      return <Actions entity={this.props.entity} navigation={this.props.navigation}></Actions>
    }
  }

  formatDate(timestamp) {
    const t = new Date(timestamp * 1000);
    return t.toDateString();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps == this.props && nextState == this.state)
      return false;
    return true;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  message: {
    padding: 8
  },
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
    height: 200,
  },
  image: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',

  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  remind: {
    paddingLeft: 16,
  }
});