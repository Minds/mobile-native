import React, {
  Component,
  Fragment
} from 'react';

import {
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  UIManager,
  StyleSheet,
  Platform,
} from 'react-native';

import {
  observer, inject,
} from 'mobx-react'

import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { CommonStyle as CS } from '../styles/Common';
import TagOptinDrawer from '../common/components/TagOptinDrawer';
import NsfwToggle from '../common/components/nsfw/NsfwToggle';
import autobind from '../common/helpers/autobind';
import testID from '../common/helpers/testID';

import { GOOGLE_PLAY_STORE } from '../config/Config';
import i18n from '../common/services/i18n.service';
import settingsStore from '../settings/SettingsStore';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Newsfeed filters
 */
@inject('hashtag')
@observer
export default class NewsfeedFilters extends Component {

  sizeY = 60;

  /**
   * Set menu reference
   */
  setMenuRef = (r) => this._menu = r;

  /**
   * Set tag drawer ref
   */
  setTagDrawerRef = (r) => this._drawer = r ||  null;

  /**
   * Show period menu
   */
  showMenu = () => {
    this._menu.show();
  }

  setPeriod12 = () => {
    this.props.store.setPeriod('12h');
    this._menu.hide();
  }
  setPeriod24 = () => {
    this.props.store.setPeriod('24h');
    this._menu.hide();
  }
  setPeriod7 = () => {
    this.props.store.setPeriod('7d');
    this._menu.hide();
  }
  setPeriod30 = () => {
    this.props.store.setPeriod('30d');
    this._menu.hide();
  }
  setPeriod1 = () => {
    this.props.store.setPeriod('1y');
    this._menu.hide();
  }

  showDrawer = () => {
    this._drawer.showModal(this.sizeY);
  }

  @autobind
  setNsfw(value) {
    this.props.store.setNsfw(value);
  }

  /**
   * Component will react (mobx)
   */
  // componentWillReact() {
  //   // animate next layout change
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  // }

  /**
   * Render
   */
  render() {
    const store = this.props.store;
    const hashActive = !this.props.hashtag.all || this.props.hashtag.hashtag;
    const disableHotLatest = store.type === 'channels' || store.type === 'groups';

    const themed = ThemedStyles.style;

    return (
      <View style={CS.rowJustifyStart}>
        <TouchableHighlight
          style={[CS.padding, CS.paddingLeft2x, CS.paddingRight2x, hashActive ? CS.backgroundPrimary : CS.backgroundLight, {borderBottomRightRadius:25, borderTopRightRadius:25}]}
          onPress={this.showDrawer}
          underlayColor='#fff'
          {...testID('Filter hashtags selector button')}
        >
          <View style={[CS.rowJustifyStart, CS.centered]}>
            <IconMC
              name="pound"
              style={[CS.centered, hashActive ? CS.colorWhite : CS.colorGreyed, {paddingTop:2}]}
              size={ 20 }
            />
            {this.props.hashtag.hashtag ? <Text style={[CS.colorWhite, CS.fontM]}>{this.props.hashtag.hashtag}</Text> : null}
          </View>
        </TouchableHighlight>
        <View style={[CS.rowJustifySpaceEvenly, CS.flexContainer]}>
          <TouchableHighlight
            style={[CS.padding]}
            onPress={ () => store.setFilter('hot') }
            disabled={disableHotLatest}
            underlayColor='#fff'
            {...testID('Filter hot button')}
          >
            <View style={[CS.rowJustifyCenter, CS.centered]}>
              <Icon
                name="whatshot"
                style={[CS.centered, store.filter == 'hot' ? themed.colorLink : (disableHotLatest ? CS.colorGreyed : null), {paddingTop:2}  ]}
                size={ 22 }
              />
              {!this.props.hashtag.hashtag ? <Text style={[CS.fontM, store.filter == 'hot' ? themed.colorLink : (disableHotLatest ? CS.colorGreyed : themed.colorIcon), CS.paddingLeft]}>{i18n.t('newsfeedFilters.hot')}</Text> : null}
            </View>
          </TouchableHighlight>
          <View style={CS.rowJustifyCenter}>
            <TouchableHighlight style={[CS.padding]} onPress={ () => store.setFilter('top') } underlayColor='#fff' {...testID('Filter top button')}>
              <View style={[CS.rowJustifyCenter, CS.centered]}>
                <Icon
                  name="trending-up"
                  style={[CS.centered, store.filter == 'top' ? themed.colorLink : themed.colorIcon, {paddingTop:2}  ]}
                  size={ 22 }
                />
                {!this.props.hashtag.hashtag ? <Text style={[CS.fontM, store.filter == 'top' ? themed.colorLink : themed.colorIcon, CS.paddingLeft]}>{i18n.t('newsfeedFilters.top')}</Text> : null}
              </View>
            </TouchableHighlight>
            {store.filter == 'top' &&
              <Menu
                ref={this.setMenuRef}
                button={
                  <TouchableHighlight style={[CS.padding]} onPress={this.showMenu} >
                    <View style={[CS.rowJustifyCenter, CS.centered]}>
                      <Text style={[CS.fontM, store.filter == 'top' ? themed.colorLink : themed.colorIcon, CS.paddingLeft, CS.paddingRight]}>{store.period}</Text>
                      <IonIcon
                        name="ios-arrow-down"
                        style={[CS.centered, store.filter == 'top' ? themed.colorLink : themed.colorIcon, {paddingTop:2}  ]}
                        size={ 22 }
                      />
                    </View>
                  </TouchableHighlight>
                }
              >
                <MenuItem onPress={this.setPeriod12}>{i18n.t('newsfeedFilters.topPeriod12')}</MenuItem>
                <MenuItem onPress={this.setPeriod24}>{i18n.t('newsfeedFilters.topPeriod24')}</MenuItem>
                <MenuItem onPress={this.setPeriod7}>{i18n.t('newsfeedFilters.topPeriod7')}</MenuItem>
                <MenuItem onPress={this.setPeriod30}>{i18n.t('newsfeedFilters.topPeriod30')}</MenuItem>
                {/* <MenuItem onPress={this.setPeriod1}>{i18n.t('newsfeedFilters.topPeriod1')}</MenuItem>  */}
              </Menu>
            }
          </View>
          <TouchableHighlight
            style={[CS.padding]}
            onPress={ () => store.setFilter('latest') }
            disabled={disableHotLatest}
            underlayColor='#fff'
            {...testID('Filter latest button')}
          >
            <View style={[CS.rowJustifyCenter, CS.centered]}>
              <Icon
                name="timelapse"
                style={[CS.centered, store.filter == 'latest' ? themed.colorLink : (disableHotLatest ? CS.colorGreyed : themed.colorIcon), {paddingTop:2} ]}
                size={ 22 }
              />
              {!this.props.hashtag.hashtag ? <Text style={[CS.fontM, store.filter == 'latest' ? themed.colorLink : (disableHotLatest ? CS.colorGreyed : themed.colorIcon), CS.paddingLeft]}>{i18n.t('newsfeedFilters.latest')}</Text> : null}
            </View>
          </TouchableHighlight>
        </View>
        {(!GOOGLE_PLAY_STORE && Platform.OS !== 'ios') && <View style={[CS.padding, CS.paddingLeft2x, CS.paddingRight2x]}>
          <NsfwToggle
            hideLabel={true}
            value={store.nsfw}
            onChange={this.setNsfw}
          />
        </View>}
        <TagOptinDrawer ref={this.setTagDrawerRef} onChange={this.props.onTagsChange} onSelectOne={this.props.onSelectOne}/>
      </View>
    );
  }
}
