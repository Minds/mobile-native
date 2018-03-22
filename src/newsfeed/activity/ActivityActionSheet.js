import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  Button,
  StyleSheet,
  Modal,
  Alert,

} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import shareService from '../../share/ShareService';
import { toggleUserBlock } from '../NewsfeedService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actionsheet';
import { MINDS_URI } from '../../config/Config';
/**
 * Activity Actions
 */
const title = 'Actions';

@inject("user")
@inject("newsfeed", "navigatorStore")
export default class ActivityActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      reportModalVisible: false,
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

      options.push( 'Delete' );

      if (!this.props.entity.mature) {
        options.push( 'Set explicit' );
      } else {
        options.push( 'Remove explicit' );
      }

    } else {

      if (this.props.user.isAdmin()) {
        options.push( 'Delete' );

        if (!this.props.entity.mature) {
          options.push( 'Set explicit' );
        } else {
          options.push( 'Remove explicit' );
        }
      }

      if (this.state && this.state.userBlocked) {
        options.push( 'Unblock user' );
      } else {
        options.push( 'Block user' );
      }

      options.push( 'Report' );
    }

    if(this.props.user && this.props.user.isAdmin()){

      if (!this.props.entity.monetized) {
        options.push( 'Monetize' );
      } else {
        options.push( 'Un-monetize' );
      }

    }

    options.push( 'Share' );

    if (!this.props.entity['is:muted']) {
      options.push( 'Mute notifications' );
    } else {
      options.push( 'Unmute notifications' );
    }


    return options;

  }

  deleteEntity() {
    this.props.newsfeed.list.deleteEntity(this.props.entity.guid).then( (result) => {
      this.setState({
        options: this.getOptions(),
      });

      Alert.alert(
        'Success',
        'Entity removed succesfully',
        [
          {text: 'OK', onPress: () => {}},
        ],
        { cancelable: false }
      )

      if(this.props.navigatorStore.currentScreen == 'Activity' ){
        this.props.navigation.goBack();
      }
    });
  }

  makeAction(option) {
    switch (option) {
      case 'Edit':
        this.props.toggleEdit(true);
        break;
      case 'Delete':
        Alert.alert(
          'Delete',
          "Are you sure? There's no UNDO",
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.deleteEntity()},
          ],
          { cancelable: false }
        )
        break;
      case 'Set explicit':
        this.props.newsfeed.list.newsfeedToggleExplicit(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Remove explicit':
        this.props.newsfeed.list.newsfeedToggleExplicit(this.props.entity.guid).then( (result) => {
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
        this.props.newsfeed.list.newsfeedToggleMute(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Unmute notifications':
        this.props.newsfeed.list.newsfeedToggleMute(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Monetize':
        this.props.newsfeed.list.toggleMonetization(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Un-monetize':
        this.props.newsfeed.list.toggleMonetization(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case 'Share':
        shareService.share(this.props.entity.text, MINDS_URI + 'newsfeed/' + this.props.entity.guid);
        break;
      case 'Report':
        this.props.navigation.navigate('Report', { entity: this.props.entity });
        break;
    }


  }

  /**
   * Close report modal
   */
  closeReport = () => {
    this.setState({ reportModalVisible: false });
  }

  /**
   * Render Header
   */
  render() {


    return (
      <View style={styles.wrapper}>
        <Icon
          name="more-vert"
          onPress={() => this.showActionSheet()}
          size={26}
          style={styles.icon}
          />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={this.getOptions()}
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
  icon: {
    color: '#888',
  },
  iconclose: {
    flex:1,
  },
  modal: {
    flex: 1,
    paddingTop: 4,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  }
});