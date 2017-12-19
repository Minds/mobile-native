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

import { toggleUserBlock } from '../NewsfeedService';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
/**
 * Activity Actions
 */
const title = 'Actions';

@inject("user")
@inject("newsfeed")
@observer
export default class ActivityActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      userBlocked: false,
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
    if (this.props.user.me.guid == this.props.entity.ownerObj.guid) {
      options.push( 'Edit' );

      /*Admin check */
      options.push( 'Delete' );

      if (this.props.entity.comments_disabled) {
        options.push( 'Enable Comments' );
      } else {
        options.push( 'Disable Comments' );
      }

      /*Admin check */
      if (!this.props.entity.mature) {
        options.push( 'Set explicit' );
      } else {
        options.push( 'Remove explicit' );
      }

    } else {
      
      if(!this.props.entity.ownerObj.subscribed) {
        options.push( 'Subscribe' );
      } else {
        options.push( 'Unsubscribe' );
      }

      if (this.state && this.state.userBlocked) {
        options.push( 'Unblock user' );
      } else {
        options.push( 'Block user' );
      }

      options.push( 'Report' );
    }
    
    /* Admin check */
    if (!this.props.entity.featured) {
      options.push( 'Feature' );
    } else {
      options.push( 'Un-feature' );
    }

    /* Admin check */
    if (!this.props.entity.monetized) {
      options.push( 'Monetize' );
    } else {
      options.push( 'Un-monetize' );
    }

    options.push( 'Share' );
    options.push( 'Translate' );

  
    if (!this.props.entity['is:muted']) {
      options.push( 'Mute notifications' );
    } else {
      options.push( 'Unmute notifications' );
    }


    return options;

  }

  makeAction(option) {
    switch (option) {
      case 'Edit':
        
        break;
      case 'Set explicit':
        this.props.newsfeed.newsfeedToggleExplicit(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Remove explicit':
        this.props.newsfeed.newsfeedToggleExplicit(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Block user':
        toggleUserBlock(this.props.entity.ownerObj.guid, !this.state.userBlocked).then( (result) => {
          this.setState({
            userBlocked:true,
            options: this.getOptions(),
          });
        });
        break;
      case 'Unblock user':
        toggleUserBlock(this.props.entity.ownerObj.guid, !this.state.userBlocked).then( (result) => {
          this.setState({
            userBlocked:false,
            options: this.getOptions(),
          });
        });
        break;
      case 'Mute notifications':
        this.props.newsfeed.newsfeedToggleMute(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Unmute notifications':
        this.props.newsfeed.newsfeedToggleMute(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Share':
        break;
      case 'Translate':
        break;
      case 'Report':
        break;
      case 'Enable Comments':
        this.props.newsfeed.toggleCommentsAction(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Disable Comments':
        this.props.newsfeed.toggleCommentsAction(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Subscribe':
        this.props.newsfeed.newsfeedToggleSubscription(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Unsubscribe':
        this.props.newsfeed.newsfeedToggleSubscription(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
    }

    
  }
  
  /**
   * Render Header
   */
  render() {


    return (
      <View style={styles.wrapper}>
        <Icon name="ios-arrow-down" onPress={() => this.showActionSheet()} size={20} />
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
    flex:1,
    alignSelf: 'center'
  },
  iconclose: {
    flex:1,
  }
});