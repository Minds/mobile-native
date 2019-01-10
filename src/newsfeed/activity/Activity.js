import React, {
  Component
} from 'react';

import {observer} from "mobx-react/native";

import {
  MINDS_URI,
  MINDS_CDN_URI
} from '../../config/Config';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Linking
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import AutoHeightFastImage from '../../common/components/AutoHeightFastImage';

import ExplicitText from '../../common/components/explicit/ExplicitText'
import OwnerBlock from './OwnerBlock';
import RemindOwnerBlock from './RemindOwnerBlock';
import Actions from './Actions';
import formatDate from '../../common/helpers/date';
import domain from '../../common/helpers/domain';
import ActivityActionSheet from './ActivityActionSheet';
import ActivityEditor from './ActivityEditor';
import ActivityMetrics from './metrics/ActivityMetrics';
import MediaView from '../../common/components/MediaView';
import Translate from '../../common/components/Translate';
import ExplicitOverlay from '../../common/components/explicit/ExplicitOverlay';
import Lock from '../../wire/lock/Lock';
import { CommonStyle } from '../../styles/Common';
import Pinned from '../../common/components/Pinned';

/**
 * Activity
 */
@observer
export default class Activity extends Component {

  state = {
    editing: false
  }
  /**
   * Nav to activity full screen
   */
  navToActivity = () => {
    const navOpts = { entity: this.props.entity, store: this.props.newsfeed };

    if (this.props.entity.remind_object || this.props.hydrateOnNav) {
      navOpts.hydrate = true;
    }

    this.props.navigation.push('Activity', navOpts);
  };

  /**
   * Nav to full image with zoom
   */
  navToImage = () => {
    // if is a rich embed should load link
    if (this.props.entity.perma_url) {
      this.openLink();
    } else {
      this.props.navigation.push('ViewImage', { source: this.source });
    }
  }

  /**
   * Open a link
   */
  openLink = () => {
    Linking.openURL(this.props.entity.perma_url);
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const hasText = !!entity.text;
    const lock = entity.paywall ? <Lock entity={entity} navigation={this.props.navigation}/> : null;

    const message = this.state.editing ?
      (
        //Passing the store in newsfeed (could be channel also)
        <ActivityEditor entity={entity} toggleEdit={this.toggleEdit} newsfeed={this.props.newsfeed} />
      ):(
        <View style={hasText ? styles.messageContainer : styles.emptyMessage}>
          {hasText ? <ExplicitText entity={entity} navigation={this.props.navigation} style={styles.message} /> : null}
          {hasText ? <Translate ref={r => this.translate=r} entity={entity} style={styles.message}/> : null}
        </View>
      );

    const show_overlay = (this.props.entity.mature && !entity.is_parent_mature) && !(this.props.entity.mature && entity.is_parent_mature);
    const overlay = (show_overlay) ? <ExplicitOverlay
        entity={this.props.entity}
        style={styles.absolute}
      /> : null;


    return (
        <View style={styles.container} onLayout={this.props.onLayout}>
          <Pinned entity={this.props.entity}/>
          { this.showOwner() }
          <View>
            { lock }
            { message }
            { this.showRemind() }
            <MediaView
              ref={o => {this.mediaView = o}}
              entity={ entity }
              navigation={this.props.navigation}
              style={ styles.media }
              newsfeed={this.props.newsfeed}
              autoHeight={ this.props.autoHeight }
              />
            { overlay }
          </View>
          { this.showActions() }
          { this.props.isLast ? <View style={styles.activitySpacer}></View> : null}
          { !this.props.hideTabs && <ActivityMetrics entity={this.props.entity}/> }
        </View>
    );
  }

  /**
   * Pause video if exist
   */
  pauseVideo() {
    this.mediaView.pauseVideo();
  }

  toggleEdit = (value) => {
    this.setState({ editing: value });
  }

  /**
   * Show group
   */
  showContainer() {
    if(!this.props.entity.containerObj)
      return null;

    return (
      <View>
        <Text onPress={this.navToGroup} style={styles.groupNameLabel}>{this.props.entity.containerObj.name}</Text>
      </View>
    );
  }

  /**
   * Show translation
   */
  showTranslate = async () => {
    if (this.translate) {
      const lang = await this.translate.show();
      if (this.remind && lang) this.remind.showTranslate();
    } else {
      if (this.remind) this.remind.showTranslate();
    }
  }

  /**
   * Show Owner
   */
  showOwner() {
    if (!this.props.entity.remind_object) {
      const rightToolbar = (
        <View style={styles.rightToolbar}>
          <ActivityActionSheet
            newsfeed={this.props.newsfeed}
            toggleEdit={this.toggleEdit}
            entity={this.props.entity}
            navigation={this.props.navigation}
            onTranslate={this.showTranslate}
          />
       </View>
      )
      return (
        <OwnerBlock
          entity={this.props.entity}
          navigation={this.props.navigation}
          rightToolbar={this.props.hideTabs ? null : rightToolbar}
          >
          <TouchableOpacity onPress={() => this.navToActivity()} style={{ flexDirection: 'row' }}>
            <Text style={[styles.timestamp, CommonStyle.paddingRight]}>{
              formatDate(this.props.entity.time_created)
            }</Text>
            { this.props.entity.boosted &&
              <View style={styles.boostTagContainer}>
                <Icon name="md-trending-up" style={styles.boostTagIcon}/>
                <Text style={styles.boostTagLabel}>BOOSTED</Text>
              </View>
            }
            { !!this.props.entity.edited &&
              <View style={styles.boostTagContainer}>
                <Text style={styles.boostTagLabel}>· EDITED</Text>
              </View>
            }
          </TouchableOpacity>
        </OwnerBlock>
      );
    } else {
      return  (
        <View>
          <RemindOwnerBlock
            entity={this.props.entity}
            newsfeed={this.props.newsfeed}
            navigation={this.props.navigation}
            />
          <View style={styles.rightToolbar}>
            <ActivityActionSheet
              newsfeed={this.props.newsfeed}
              toggleEdit={this.toggleEdit}
              entity={this.props.entity}
              navigation={this.props.navigation}
              onTranslate={this.showTranslate}
            />
          </View>
        </View>
      );

    }
  }

  /**
   * Show remind activity
   */
  showRemind() {
    const remind_object = this.props.entity.remind_object;
    if (remind_object) {
      if (this.props.entity.mature) {
        remind_object.is_parent_mature = true;
      }
      return (
        <View style={styles.remind}>
          <Activity
            ref={r => this.remind=r}
            hideTabs={true}
            newsfeed={this.props.newsfeed}
            entity={remind_object}
            navigation={this.props.navigation}
            hydrateOnNav={true}
            />
        </View>
      );
    }
  }

  /**
   * Show actions
   */
  showActions() {
    if (!this.props.hideTabs) {
      return <Actions
                entity={this.props.entity}
                navigation={this.props.navigation}
                />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
  },
  messageContainer: {
    padding: 8,
  },
  message: {
    fontFamily: 'Roboto',
  },
  emptyMessage: {
    padding: 0
  },
  media: {
    //flex: 1,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  remind: {
  //  flex:1,
  },
  rightToolbar: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 20
  },
  boostTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostTagIcon: {
    color: '#777',
  },
  boostTagLabel: {
    color: '#777',
    fontWeight: '200',
    marginLeft: 2,
    fontSize:10,
  },
  activitySpacer: {
    flex:1,
    height: 70
  }
});
