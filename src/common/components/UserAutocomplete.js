import React, { PureComponent } from 'react';

import {
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar
} from 'react-native';
import KeyboardAccessory from './KeyboardAccessory';
import { Icon } from 'react-native-elements'

import { ComponentsStyle } from '../../styles/Components';
import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import debounce from '../helpers/debounce';
import UserTypeahead from './user-typeahead/UserTypeahead';
import userTypeaheadService from './user-typeahead/UserTypeaheadService';
import logService from '../services/log.service';


/**
 * User autocomplete component
 */
export default class UserAutocomplete extends PureComponent {

  state = {
    isSearchingTag: false,
    users: [],
    tag: '',
    text: '',
    search: false,
    selection: {
      start:0,
      end:0
    }
  };

  /**
   * Debounced search
   */
  query = debounce(async query => {
    try {
      const users = await userTypeaheadService.search(query, 6);
      this.setState({ search: false, users });
    } catch (e) {
      logService.exception(e);
      // TODO: Show error
    }
  }, 300);

  /**
   * Get derived state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    state = {};

    if (nextProps.text != prevState.text || nextProps.selection.end != prevState.selection.end)  {
      if (nextProps.selection.start == nextProps.selection.end) {
        state.tag = UserAutocomplete.parseTag(nextProps.text, nextProps.selection);
        state.search = true;
      } else {
        state.tag = '';
      }
      state.text = nextProps.text;
      state.selection = nextProps.selection;
    }

    if (state.tag === null && prevState.users.length) {
      state.users = [];
    }

    return state;
  }

  /**
   * component did update
   * @param {object} prevProps
   * @param {object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.tag && this.state.search) {
      this.query(this.state.tag);
    }
  }

  /**
   * Render users
   */
  renderUsers() {
    const users = this.state.users ? this.state.users.map((user, i) => {
      return <View style={style.tags} key={i}>
        <Text onPress={() => this.selectTag(user)}>@{user.username}</Text>
      </View>
    }): null;

    if (!users) return null;

    return (
      <ScrollView horizontal={true} keyboardShouldPersistTaps='always' style={{marginRight: 40}}>
        {users}
      </ScrollView>
    )
  }

  /**
   * Show full screen search
   */
  showSearch = () => {
    this.setState({isSearchingTag: true});
  }

  /**
   * On full search select
   */
  searchSelect = (user) => {
    this.close();
    this.selectTag(user);
  }

  /**
   * Close selector
   */
  close = () => {
    this.setState({ isSearchingTag: false});
  }

  /**
   * search a tag on the cursor position
   * @param {string} text
   * @param {obejct} selection
   */
  static parseTag(text, selection) {

    let matchText = text.substr(0, selection.end);

    // search end of word
    if (text.length > selection.end) {
      endword = text.substr(selection.end).match(/^([a-zA-Z0-9])+\b/);
      if (endword) matchText += endword[0];
    }

    const isTag = matchText.match(/\@[a-zA-Z0-9]{2,}$/);

    if (isTag) {
      return isTag[0];
    } else {
      return null;
    }
  }

  /**
   * Replace the partial tag with the selected
   * returns the full text
   */
  selectTag = (user) => {
    let endword=[''], matchText = this.state.text.substr(0, this.state.selection.end);

    // search end of word
    if (this.state.text.length > this.props.selection.end) {
      endword = this.state.text.substr(this.state.selection.end).match(/^([a-zA-Z0-9])+\b/);
      if (endword) {
        matchText += endword[0];
      } else {
        endword = [''];
      }
    }

    // the rest of the text
    const postText = this.state.text.substr(this.state.selection.end+1+endword[0].length);

    this.props.onSelect(matchText.replace(/\@[a-zA-Z0-9]+$/, '@'+user.username+' '+postText));
  }

  /**
   * Render
   */
  render() {

    if (!this.state.tag) return null;

    const users = this.renderUsers();

    return (
      <KeyboardAccessory
        backgroundColor='rgba(180, 180, 180, 0.8)'
        show={this.state.tag}
        noFloat={this.props.noFloat}
      >
        <UserTypeahead
          isModalVisible={this.state.isSearchingTag}
          onSelect={this.searchSelect}
          onClose={this.close}
          value={ this.state.tag }
        />
        { this.state.tag && <View style={style.searchBar}>
          {users}
          <Icon
            containerStyle={style.searchIcon}
            name='search'
            color='white'
            size={30}
            onPress={this.showSearch} />
        </View>}
      </KeyboardAccessory>
    )
  }
}

const style = StyleSheet.create({
  searchIcon: {
    position: 'absolute',
    right:5,
    top:5
  },
  searchBar: {
    flexDirection: 'row',
    height: 40,
    marginTop: 2,
    marginBottom: 2
  },
  tags: {
    margin: 2,
    padding: 9,
    backgroundColor: '#efefef',
    borderRadius:18
  }
});