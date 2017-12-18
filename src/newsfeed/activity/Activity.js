import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import ExplicitImage from '../../common/components/explicit/ExplicitImage'
import ExplicitText from '../../common/components/explicit/ExplicitText'
import OwnerBlock from './OwnerBlock';
import Actions from './Actions';
import FastImage from 'react-native-fast-image';

export default class Activity extends Component {

  navToActivity = () => {
    this.props.navigation.navigate('Activity', {entity: this.props.entity});
  }

  navToImage = () => {
    this.props.navigation.navigate('ViewImage', {source: {uri: this.props.entity.custom_data[0].src}});
  }

  render() {

    let media;

    switch (this.props.entity.custom_type) {
      case "batch":
        let source = {
          uri: this.props.entity.custom_data[0].src
        }
        media = (
          <TouchableOpacity onPress={this.navToImage} style={styles.imageContainer}>
            <ExplicitImage source={ source } entity={this.props.entity} style={styles.image}/>
          </TouchableOpacity>
        )
        break;
    }

    if (this.props.entity.perma_url) {
      let source = {
        uri: this.props.entity.thumbnail_src
      }
      media = (
        <View style={styles.imageContainer}>
          <ExplicitImage source={ source } entity={this.props.entity} style={styles.image}/>
          <View style={ { padding: 8 }}>
            <Text style={styles.title}>{this.props.entity.title}</Text>
            <Text style={styles.timestamp}>{this.props.entity.perma_url}</Text>
          </View>
        </View>
      )
    }

    return (
        <View style={styles.container}>
          <OwnerBlock entity={this.props.entity} newsfeed={this.props.newsfeed} navigation={this.props.navigation}>
            <TouchableOpacity onPress={this.navToActivity}>
              <Text style={styles.timestamp}>{this.formatDate(this.props.entity.time_created)}</Text>
            </TouchableOpacity>
          </OwnerBlock>
          <View style={styles.message}>
            <ExplicitText entity={this.props.entity}  navigation={this.props.navigation}/>
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
                <Activity hideTabs={true}  newsfeed={this.props.newsfeed} entity={this.props.entity.remind_object} navigation={this.props.navigation} />
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
    flex:1,
    paddingLeft: 16,
  }
});