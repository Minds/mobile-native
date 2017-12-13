import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements'
import AutoHeightWebView from '../common/components/AutoHeightWebView';
/**
 * Blog View Screen
 */
export default class BlogsViewScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  /**
   * Render
   */
  render() {
    const blog = this.props.navigation.state.params.blog;
    const image = { uri: blog.thumbnail_src };
    return (
      <ScrollView style={styles.screen}>
        <FastImage source={image} resizeMode={FastImage.resizeMode.cover} style={styles.image} />
        <Text style={styles.title}>{blog.title}</Text>
        <View style={styles.description}>
          <AutoHeightWebView html={blog.description}/>
        </View>
        <Icon color="white" containerStyle={styles.header} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
      </ScrollView>
    )
  }
}

/**
 * Styles
 */
const styles = {
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  description: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  screen: {
    backgroundColor: '#FFF'
  },
  image: {
    height: 200
  },
  title: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 22,
    color: 'black'
  },
}