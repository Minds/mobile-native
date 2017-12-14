import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  Button,
  StyleSheet
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import channelService from './ChannelService';
import { MINDS_URI } from '../config/Config';
import ActionSheet from 'react-native-actionsheet';

/**
 * Channel Actions
 */
const title = 'Actions'

@observer
export default class ChannelActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      options: this.getOptions(),
    }

    this.handleSelection = this.handleSelection.bind(this);
  }

  showActionSheet() {
    this.state = {
      options: this.getOptions(),
    }
    this.ActionSheet.show();
  }

  handleSelection(i) {
    this.makeAction(this.state.options[i]);
  }

  getOptions() {
    let options = [ 'Cancel' ];
    if(!!this.props.channel.channel.subscribed){
      options.push( 'Unsubscribe' );
    }

    if(!this.props.channel.channel.blocked){
      options.push( 'Block' );
    }

    if(!!this.props.channel.channel.blocked){
      options.push( 'Un-Block' );
    }

    options.push( 'Report' );

    return options;

  }

  makeAction(option) {
    switch (option) {
      case 'Unsubscribe':
        this.props.channel.subscribe().then( (result) => {
          this.setState({
            options: this.getOptions(),
          })
        });
        break;
      case 'Block':
        this.props.channel.toggleBlock().then( (result) => {
          this.setState({
            options: this.getOptions(),
          })
        });
        break;
      case 'Un-Block':
        this.props.channel.toggleBlock().then( (result) => {
          this.setState({
            options: this.getOptions(),
          })
        });
        break;
    }

    
  }
  
  /**
   * Render Header
   */
  render() {

    const channel = this.props.channel.channel;

    return (
      <View>
        <Icon name="md-settings" onPress={() => this.showActionSheet()} size={20} />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={this.state.options}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
	wrapper: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  iconclose: {
    flex:1,
  }
});