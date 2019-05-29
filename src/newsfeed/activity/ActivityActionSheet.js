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

import translationService from '../../common/services/translation.service';
import { isFollowing } from '../../newsfeed/NewsfeedService';
import shareService from '../../share/ShareService';
import { toggleUserBlock } from '../NewsfeedService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actionsheet';
import { MINDS_URI } from '../../config/Config';
import testID from '../../common/helpers/testID';
import i18n from '../../common/services/i18n.service';

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
      reportModalVisible: false,
      userBlocked: false
    }

    this.handleSelection = this.handleSelection.bind(this);
  }

  async showActionSheet() {
    if (this.props.entity['is:following'] === undefined) {
      this.props.entity['is:following'] = await isFollowing(this.props.entity.guid);
    }

    this.setState({
      options: this.getOptions()
    });
    this.ActionSheet.show();
  }

  handleSelection(i) {
    this.makeAction(this.state.options[i]);
  }

  getOptions() {
    let options = [ i18n.t('cancel') ];
    if (this.props.entity.isOwner()) {
      options.push( i18n.t('edit') );

      options.push( i18n.t('delete') );

      if (!this.props.entity.mature) {
        options.push( i18n.t('setExplicit') );
      } else {
        options.push( i18n.t('removeExplicit') );
      }
      if (!this.props.entity.dontPin) {
        if (!this.props.entity.pinned) {
          options.push( i18n.t('pin') );
        } else {
          options.push( i18n.t('unpin') );
        }
      }

    } else {

      if (this.props.user.isAdmin()) {
        options.push( i18n.t('delete') );

        if (!this.props.entity.mature) {
          options.push( i18n.t('setExplicit') );
        } else {
          options.push( i18n.t('removeExplicit') );
        }
      }

      if (this.state && this.state.userBlocked) {
        options.push( i18n.t('channel.unblock') );
      } else {
        options.push( i18n.t('channel.block') );
      }

      if (translationService.isTranslatable(this.props.entity)) {
        options.push( i18n.t('translate.translate') );
      }

      options.push( i18n.t('report') );
    }

    options.push( i18n.t('share') );

    if (!this.props.entity['is:following']) {
      options.push( i18n.t('follow') );
    } else {
      options.push( i18n.t('unfollow') );
    }


    return options;

  }

  deleteEntity() {
    this.props.newsfeed.list.deleteEntity(this.props.entity.guid).then( (result) => {
      this.setState({
        options: this.getOptions(),
      });

      Alert.alert(
        i18n.t('success'),
        i18n.t('newsfeed.successRemoving'),
        [
          {text: i18n.t('ok'), onPress: () => {}},
        ],
        { cancelable: false }
      )

      if (this.props.navigation.state.routeName == 'Activity'){
        this.props.navigation.goBack();
      }
    });
  }

  makeAction(option) {
    switch (option) {
      case i18n.t('translate.translate'):
        if (this.props.onTranslate) this.props.onTranslate();
        break;
      case i18n.t('edit'):
        this.props.toggleEdit(true);
        break;
      case i18n.t('delete'):
        Alert.alert(
          i18n.t('delete'),
          i18n.t('confirmNoUndo'),
          [
            {text: i18n.t('cancel'), style: 'cancel'},
            {text: i18n.t('ok'), onPress: () => this.deleteEntity()},
          ],
          { cancelable: false }
        )
        break;
      case i18n.t('setExplicit'):
      case i18n.t('removeExplicit'):
        this.props.newsfeed.list.newsfeedToggleExplicit(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      case i18n.t('channel.block'):
        toggleUserBlock(this.props.entity.ownerObj.guid, !this.state.userBlocked).then( (result) => {
          this.setState({
            userBlocked:true,
            options: this.getOptions(),
          });
        });
        break;
      case i18n.t('channel.unblock'):
        toggleUserBlock(this.props.entity.ownerObj.guid, !this.state.userBlocked).then( (result) => {
          this.setState({
            userBlocked:false,
            options: this.getOptions(),
          });
        });
        break;
      case i18n.t('follow'):
      case i18n.t('unfollow'):
        this.props.newsfeed.list.newsfeedToogleFollow(this.props.entity.guid).then( (result) => {
          this.setState({
            options: this.getOptions(),
          });
        });
        break;
      // case 'Monetize':
      // case 'Un-monetize':
      //   this.props.newsfeed.list.toggleMonetization(this.props.entity.guid).then( (result) => {
      //     this.setState({
      //       options: this.getOptions(),
      //     });
      //   });
      //   break;
      case i18n.t('share'):
        shareService.share(this.props.entity.text, MINDS_URI + 'newsfeed/' + this.props.entity.guid);
        break;
      case i18n.t('pin'):
      case i18n.t('unpin'):
        this.props.entity.togglePin();
        break;
      case i18n.t('report'):
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
          {...testID('Activity Menu button')}
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