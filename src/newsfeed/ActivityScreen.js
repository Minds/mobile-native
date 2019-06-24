import React, { Component } from 'react';

import {
  View,
  Text
} from 'react-native';
import { observer } from 'mobx-react/native'
import FastImage from 'react-native-fast-image';

import NewsfeedStore from "./NewsfeedStore";
import { getSingle } from './NewsfeedService';
import { CommonStyle as CS } from '../styles/Common';
import CommentList from '../comments/CommentList';
import Activity from '../newsfeed/activity/Activity';
import ActivityModel from '../newsfeed/ActivityModel';
import { ComponentsStyle } from '../styles/Components';
import SingleEntityStore from '../common/stores/SingleEntityStore';
import CenteredLoading from '../common/components/CenteredLoading';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';

/**
 * Activity screen
 */
@observer
export default class ActivityScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('entity', {ownerObj:{name:''}}).ownerObj.name
    };
  };

  entityStore = new SingleEntityStore();

  state = {
    error: null
  };

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    const params = props.navigation.state.params;

    this.comments = commentsStoreProvider.get();

    if (params.entity && (params.entity.guid || params.entity.entity_guid)) {
      this.entityStore.setEntity(ActivityModel.checkOrCreate(params.entity));

      const entity = this.entityStore.entity;

      if (entity._list && entity._list.metadataServie) {
        entity._list.metadataServie.pushSource('single');
      }
    }
  }

  /**
   * Component did mount
   */
  async componentDidMount() {
    const params = this.props.navigation.state.params;

    if (!this.entityStore.entity || params.hydrate) {
      try {
        const resp = await getSingle(params.guid || params.entity.guid || params.entity.entity_guid);

        // if it has a list asigned we set it to the new entity
        if (this.entityStore.entity) {
          this.entityStore.entity.update(resp.activity);
        } else {
          this.entityStore.setEntity(ActivityModel.checkOrCreate(resp.activity));
        }
      } catch (e) {
        this.setState({error: true});
        logService.exception('[ActivityScreen]',e);
        //console.error('Cannot hydrate activity', e);
      }
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    const entity = this.entityStore.entity;

    if (entity._list && entity._list.metadataServie) {
      entity._list.metadataServie.popSource();
    }
  }

  /**
   * Get header
   */
  getHeader() {
    return this.entityStore.entity ?
      <Activity
        ref={o => this.activity = o}
        entity={ this.entityStore.entity }
        navigation={ this.props.navigation }
        autoHeight={false}
      /> : null;
  }

  /**
   * On comment input focus
   */
  onFocus = () => {
    this.activity.pauseVideo();
  }

  /**
   * Render
   */
  render() {
    if (!this.entityStore.entity && !this.state.error) return <CenteredLoading />;
    return (
      <View style={[CS.flexContainer, CS.backgroundWhite]}>
        {
          !this.state.error ?
            <CommentList
              header={this.getHeader()}
              entity={this.entityStore.entity}
              store={this.comments}
              navigation={this.props.navigation}
              onInputFocus={this.onFocus}
            />
          :
            <View style={CS.flexColumnCentered}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={ComponentsStyle.logo}
                source={require('../assets/logos/logo.png')}
              />
              <Text style={[CS.fontL, CS.colorDanger]}>{i18n.t('activity.error')}</Text>
              <Text style={[CS.fontM]}>{i18n.t('activity.tryAgain')}</Text>
            </View>
        }
      </View>
    );
  }
}