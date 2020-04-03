//@ts-nocheck
import React, {
  PureComponent
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image
} from 'react-native';

import Modal from 'react-native-modal';

import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import Touchable from '../Touchable';

import UserTypeaheadService from './UserTypeaheadService';

import debounce from '../../helpers/debounce';
import channelAvatarUrl from '../../helpers/channel-avatar-url';
import colors from '../../../styles/Colors';
import abbrev from '../../helpers/abbrev';
import logService from '../../services/log.service';
import i18nService from '../../services/i18n.service';

export default class UserTypeahead extends PureComponent {
  textInput = void 0;

  state = {
    query: '',
    text: '',
    users: []
  };

  styles = StyleSheet.create({
    itemView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10
    },
    itemAvatar: {
      borderWidth: 1,
      borderColor: '#999',
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 10
    },
    itemUsername: {
      fontSize: 16,
      flexGrow: 1
    },
    itemIconTextView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemIcon: {
      marginLeft: 10
    },
    itemIconText: {
      marginLeft: 10,
      fontSize: 14
    },
    itemIconWithText: {
      marginLeft: 5
    },

    headerView: {
      marginTop: 10,
      marginBottom: 10,
      paddingBottom: 5,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.greyed,
    },
    headerIcon: {
      marginRight: 10
    },
    headerTextInput: {
      flexGrow: 1,
      borderColor: '#000',
      fontSize: 16
    },

    emptyView: {
      paddingTop: 10
    },
    emptyText: {
      textAlign: 'center',
      color: '#999',
      fontSize: 12
    }
  });

  setText = (text, inmediate = false) => {
    this.setState({text})
    if (inmediate) {
      this._query(text);
    } else {
      this.query(text);
    }
  };

  query = debounce(async query => {
    this._query(query)
  }, 300);

  _query = async(query) => {
    try {
      this.setState({ query, users: await UserTypeaheadService.search(query) });
    } catch (e) {
      logService.exception(e);
      // TODO: Show error
    }
  }

  onSelect = item => {
    this.props.onSelect(item);
  };

  onModalShow = () => {
    if (this.props.value) {
      this.setText(this.props.value, true);
    }
    setTimeout(() => {
      if (this.textInput) {
        this.textInput.focus();
      }
    }, 50);
  };

  onModalHide = () => {
    this.setState({
      query: '',
      text: '',
      users: []
    });
  };

  HeaderPartial = () => {
    return (
      <View style={this.styles.headerView}>
        <Icon name="md-search" size={24} color={colors.greyed} style={this.styles.headerIcon} />

        <TextInput
          style={this.styles.headerTextInput}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={this.setText}
          returnKeyType="search"
          ref={textInput => this.textInput = textInput}
          value={this.state.text}
        />

        <Touchable onPress={this.props.onClose}>
          <Icon name="md-close" size={32} color={colors.greyed} style={this.styles.headerIcon} />
        </Touchable>
      </View>
    );
  };

  ItemPartial = ({ item }) => {
    if (!item) {
      return null;
    }

    return (
      <Touchable onPress={() => this.onSelect(item)}>
        <View style={this.styles.itemView}>
          <Image source={{ uri: channelAvatarUrl(item) }} style={this.styles.itemAvatar} />
          <Text style={this.styles.itemUsername}>@{item.username}</Text>

          {!!item.eth_wallet && <MdIcon name="check-circle" size={20} color="#000" style={this.styles.itemIcon} />}
          {!!item.rewards && <MdIcon name="donut-large" size={20} color="#000" style={this.styles.itemIcon} />}

          {!!item.subscribers_count && [
            <Text style={this.styles.itemIconText}>{abbrev(item.subscribers_count || 0)}</Text>,
            <Icon name="md-people" size={16} color="#000" style={this.styles.itemIconWithText} />
          ]}

          {!!item.impressions && [
            <Text style={this.styles.itemIconText}>{abbrev(item.impressions || 0)}</Text>,
            <Icon name="md-eye" size={16} color="#000" style={this.styles.itemIconWithText}  />
          ]}
        </View>
      </Touchable>
    );
  };

  keyExtractor = item => item.guid;

  EmptyPartial = () => {
    return (
      <View style={this.styles.emptyView}>
        <Text style={this.styles.emptyText}>{
          !this.state.query ?
            i18nService.t('userTypeAhead.placeholder') :
            i18nService.t('userTypeAhead.noResults', {query: this.state.query})
        }</Text>
      </View>
    )
  };

  render() {
    const header = this.HeaderPartial();
    return (
      <Modal
        isVisible={this.props.isModalVisible}
        backdropColor="white"
        backdropOpacity={ 1 }
        onModalShow={this.onModalShow}
        onModalHide={this.onModalHide}
      >
        <FlatList
          keyboardShouldPersistTaps='always'
          data={this.state.users}
          ListHeaderComponent={header}
          ListEmptyComponent={this.EmptyPartial}
          renderItem={this.ItemPartial}
          keyExtractor={this.keyExtractor}
        />
        {/* TODO: Fix double tapping needed to select an item when a TextInput is active */}
      </Modal>
    );
  }
}

