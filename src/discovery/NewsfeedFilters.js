import React, {
  Component,
  Fragment
} from 'react';

import {
  Text,
  View,
  LayoutAnimation,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import {
  observer, inject,
} from 'mobx-react/native'

import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { CommonStyle as CS } from '../styles/Common';
import TagOptinDrawer from '../common/components/TagOptinDrawer';
import NsfwToggle from '../common/components/nsfw/NsfwToggle';
import autobind from '../common/helpers/autobind';

import { GOOGLE_PLAY_STORE } from '../config/Config';

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
  setTagDrawerRef = (r) => this._drawer = r ? r.wrappedInstance : null;

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
  componentWillReact() {
    // animate next layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  /**
   * Render
   */
  render() {
    const store = this.props.store;
    const hashActive = !this.props.hashtag.all || this.props.hashtag.hashtag;
    return (
      <View style={CS.rowJustifyStart}>
        <TouchableHighlight style={[CS.padding, CS.paddingLeft2x, CS.paddingRight2x, hashActive ? CS.backgroundPrimary : CS.backgroundLight, {borderBottomRightRadius:25, borderTopRightRadius:25}]} onPress={this.showDrawer} underlayColor='#fff'>
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
          <TouchableHighlight style={[CS.padding]} onPress={ () => store.setFilter('hot') } underlayColor='#fff'>
            <View style={[CS.rowJustifyCenter, CS.centered]}>
              <Icon
                name="whatshot"
                style={[CS.centered, store.filter == 'hot' ? CS.colorPrimary : null, {paddingTop:2}  ]}
                size={ 22 }
              />
              {!this.props.hashtag.hashtag ? <Text style={[CS.fontM, store.filter == 'hot' ? CS.colorPrimary : CS.colorDark, CS.paddingLeft]}>Hot</Text> : null}
            </View>
          </TouchableHighlight>
          <View style={CS.rowJustifyCenter}>
            <TouchableHighlight style={[CS.padding]} onPress={ () => store.setFilter('top') } underlayColor='#fff'>
              <View style={[CS.rowJustifyCenter, CS.centered]}>
                <Icon
                  name="trending-up"
                  style={[CS.centered, store.filter == 'top' ? CS.colorPrimary : null, {paddingTop:2}  ]}
                  size={ 22 }
                />
                {!this.props.hashtag.hashtag ? <Text style={[CS.fontM, store.filter == 'top' ? CS.colorPrimary : CS.colorDark, CS.paddingLeft]}>Top</Text> : null}
              </View>
            </TouchableHighlight>
            {store.filter == 'top' &&
              <Menu
                ref={this.setMenuRef}
                button={
                  <TouchableHighlight style={[CS.padding]} onPress={this.showMenu} >
                    <View style={[CS.rowJustifyCenter, CS.centered]}>
                      <Text style={[CS.fontM, store.filter == 'top' ? CS.colorPrimary : CS.colorDark, CS.paddingLeft, CS.paddingRight]}>{store.period}</Text>
                      <IonIcon
                        name="ios-arrow-down"
                        style={[CS.centered, store.filter == 'top' ? CS.colorPrimary : null, {paddingTop:2}  ]}
                        size={ 22 }
                      />
                    </View>
                  </TouchableHighlight>
                }
              >
                <MenuItem onPress={this.setPeriod12}>12 hours</MenuItem>
                <MenuItem onPress={this.setPeriod24}>24 hours</MenuItem>
                <MenuItem onPress={this.setPeriod7}>7 days</MenuItem>
                <MenuItem onPress={this.setPeriod30}>30 days</MenuItem>
                <MenuItem onPress={this.setPeriod1}>1 year</MenuItem>
              </Menu>
            }
          </View>
          <TouchableHighlight style={[CS.padding]} onPress={ () => store.setFilter('latest') } underlayColor='#fff'>
            <View style={[CS.rowJustifyCenter, CS.centered]}>
              <Icon
                name="timelapse"
                style={[CS.centered, store.filter == 'latest' ? CS.colorPrimary : null, {paddingTop:2} ]}
                size={ 22 }
              />
              {!this.props.hashtag.hashtag ? <Text style={[CS.fontM, store.filter == 'latest' ? CS.colorPrimary : CS.colorDark, CS.paddingLeft]}>Latest</Text> : null}
            </View>
          </TouchableHighlight>
        </View>
        {!GOOGLE_PLAY_STORE && <View style={[CS.padding, CS.paddingLeft2x, CS.paddingRight2x]}>
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
