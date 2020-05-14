import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';

import { CommonStyle as CS } from '../styles/Common';
import CommentList from '../comments/CommentList';
import Activity from '../newsfeed/activity/Activity';
import ActivityModel from '../newsfeed/ActivityModel';
import { ComponentsStyle } from '../styles/Components';
import SingleEntityStore from '../common/stores/SingleEntityStore';
import CenteredLoading from '../common/components/CenteredLoading';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import i18n from '../common/services/i18n.service';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import { FLAG_VIEW } from '../common/Permissions';
import type CommentsStore from '../comments/CommentsStore';

type PropsType = {
  route: any;
  navigation: any;
};

/**
 * Activity screen
 */
@observer
class ActivityScreen extends Component<PropsType> {
  comments: CommentsStore;
  activity: Activity | null = null;

  /**
   * Store
   */
  entityStore: SingleEntityStore<ActivityModel> = new SingleEntityStore();

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.comments = commentsStoreProvider.get();

    this.loadEntity();
  }

  /**
   * Load entity
   */
  async loadEntity() {
    const params = this.props.route.params;

    if (params.entity && (params.entity.guid || params.entity.entity_guid)) {
      const urn =
        'urn:entity:' + (params.entity.guid || params.entity.entity_guid);

      const entity = ActivityModel.checkOrCreate(params.entity);

      if (!entity.can(FLAG_VIEW, true)) {
        this.props.navigation.goBack();
        return;
      }

      this.entityStore.loadEntity(urn, entity, true);

      // change metadata source
      if (params.entity._list && params.entity._list.metadataService) {
        params.entity._list.metadataService.pushSource('single');
      }
    } else {
      const urn = 'urn:entity:' + params.guid;
      await this.entityStore.loadEntity(urn);

      if (!this.entityStore.entity?.can(FLAG_VIEW, true)) {
        this.props.navigation.goBack();
        return;
      }
    }

    if (params.entity && params.entity._list) {
      // this second condition it's for legacy boost feed
      if (params.entity._list instanceof OffsetFeedListStore) {
        params.entity._list.addViewed(params.entity);
      } else {
        params.entity._list.viewed.addViewed(
          params.entity,
          params.entity._list.metadataService,
        );
      }
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    const entity = this.entityStore.entity;

    if (entity && entity._list && entity._list.metadataService) {
      entity._list.metadataService.popSource();
    }
  }

  /**
   * Get header
   */
  getHeader() {
    return this.entityStore.entity ? (
      <Activity
        ref={this.setRef}
        entity={this.entityStore.entity}
        navigation={this.props.navigation}
        autoHeight={false}
        showCommentsOutlet={false}
      />
    ) : null;
  }

  /**
   * Set ref
   * @param {NodeRef}
   */
  setRef = (o) => (this.activity = o);

  /**
   * On comment input focus
   */
  onFocus = () => {
    this.activity?.pauseVideo();
  };

  /**
   * Render
   */
  render() {
    if (!this.entityStore.entity && !this.entityStore.errorLoading) {
      return <CenteredLoading />;
    }

    if (!this.entityStore.entity?.can(FLAG_VIEW, true)) {
      this.props.navigation.goBack();
      return null;
    }

    return (
      <View style={[CS.flexContainer]}>
        {!this.entityStore.errorLoading ? (
          //@ts-ignore user store is injected
          <CommentList
            header={this.getHeader()}
            entity={this.entityStore.entity}
            store={this.comments}
            navigation={this.props.navigation}
            onInputFocus={this.onFocus}
            route={this.props.route}
          />
        ) : (
          <View style={CS.flexColumnCentered}>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              style={ComponentsStyle.logo}
              source={require('../assets/logos/logo.png')}
            />
            <Text style={[CS.fontL, CS.colorDanger]}>
              {i18n.t('activity.error')}
            </Text>
            <Text style={[CS.fontM]}>{i18n.t('activity.tryAgain')}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default ActivityScreen;
