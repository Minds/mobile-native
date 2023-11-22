//@ts-nocheck
import React, { PureComponent } from 'react';

import { StyleSheet, View, FlatList } from 'react-native';

import Modal from 'react-native-modal';

import Icon from '@expo/vector-icons/Ionicons';
import MdIcon from '@expo/vector-icons/MaterialIcons';

import Touchable from '../Touchable';

import UserTypeaheadService from './UserTypeaheadService';

import debounce from '../../helpers/debounce';
import channelAvatarUrl from '../../helpers/channel-avatar-url';
import abbrev from '../../helpers/abbrev';
import logService from '../../services/log.service';
import i18nService from '../../services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import TextInput from '../TextInput';
import MText from '../MText';
import { Image } from 'expo-image';

/**
 * @deprecated please use ChannelSelectScreen
 */
export default class UserTypeahead extends PureComponent {
  textInput = void 0;

  state = {
    query: '',
    text: '',
    users: [],
  };

  styles = StyleSheet.create({
    itemView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
    },
    itemAvatar: {
      borderWidth: 1,
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    itemUsername: {
      fontSize: 16,
      flexGrow: 1,
    },
    itemIconTextView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemIcon: {
      marginLeft: 10,
    },
    itemIconText: {
      marginLeft: 10,
      fontSize: 14,
    },
    itemIconWithText: {
      marginLeft: 5,
    },

    headerView: {
      marginTop: 10,
      marginBottom: 10,
      paddingBottom: 5,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#222222', // TODO: this is a legacy component, replace this
    },
    headerIcon: {
      marginRight: 10,
    },
    headerTextInput: {
      flexGrow: 1,
      fontSize: 16,
    },

    emptyView: {
      paddingTop: 10,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 12,
    },
  });

  setText = (text, inmediate = false) => {
    this.setState({ text });
    if (inmediate) {
      this._query(text);
    } else {
      this.query(text);
    }
  };

  query = debounce(async query => {
    this._query(query);
  }, 300);

  _query = async query => {
    try {
      this.setState({ query, users: await UserTypeaheadService.search(query) });
    } catch (e) {
      logService.exception(e);
      // TODO: Show error
    }
  };

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
      users: [],
    });
  };

  HeaderPartial = () => {
    return (
      <View style={this.styles.headerView}>
        <Icon
          name="md-search"
          size={24}
          color={'#222222'} // TODO: this is a legacy component, replace this
          style={this.styles.headerIcon}
        />

        <TextInput
          style={[
            this.styles.headerTextInput,
            ThemedStyles.style.colorPrimaryText,
          ]}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={this.setText}
          returnKeyType="search"
          ref={textInput => (this.textInput = textInput)}
          value={this.state.text}
        />

        <Touchable onPress={this.props.onClose}>
          <Icon
            name="md-close"
            size={32}
            color={'#222222'} // TODO: this is a legacy component, replace this
            style={this.styles.headerIcon}
          />
        </Touchable>
      </View>
    );
  };

  ItemPartial = ({ item }) => {
    if (!item) {
      return null;
    }

    const theme = ThemedStyles.style;

    return (
      <Touchable onPress={() => this.onSelect(item)}>
        <View style={this.styles.itemView}>
          <Image
            source={{ uri: channelAvatarUrl(item) }}
            style={this.styles.itemAvatar}
          />
          <MText style={this.styles.itemUsername}>@{item.username}</MText>

          {!!item.eth_wallet && (
            <MdIcon
              name="check-circle"
              size={20}
              style={[this.styles.itemIcon, theme.colorIcon]}
            />
          )}
          {!!item.rewards && (
            <MdIcon
              name="donut-large"
              size={20}
              style={[this.styles.itemIcon, theme.colorIcon]}
            />
          )}

          {!!item.subscribers_count && [
            <MText style={this.styles.itemIconText}>
              {abbrev(item.subscribers_count || 0)}
            </MText>,
            <Icon
              name="md-people"
              size={16}
              style={[this.styles.itemIconWithText, theme.colorIcon]}
            />,
          ]}

          {!!item.impressions && [
            <MText style={this.styles.itemIconText}>
              {abbrev(item.impressions || 0)}
            </MText>,
            <Icon
              name="md-eye"
              size={16}
              style={[this.styles.itemIconWithText, theme.colorIcon]}
            />,
          ]}
        </View>
      </Touchable>
    );
  };

  keyExtractor = item => item.guid;

  EmptyPartial = () => {
    return (
      <View style={this.styles.emptyView}>
        <MText style={this.styles.emptyText}>
          {!this.state.query
            ? i18nService.t('userTypeAhead.placeholder')
            : i18nService.t('userTypeAhead.noResults', {
                query: this.state.query,
              })}
        </MText>
      </View>
    );
  };

  render() {
    const header = this.HeaderPartial();
    return (
      <Modal
        isVisible={this.props.isModalVisible}
        backdropColor={ThemedStyles.getColor('PrimaryBackground')}
        backdropOpacity={1}
        onModalShow={this.onModalShow}
        onModalHide={this.onModalHide}>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={this.state.users}
          ListHeaderComponent={header}
          ListEmptyComponent={this.EmptyPartial}
          renderItem={this.ItemPartial}
          keyExtractor={this.keyExtractor}
          style={ThemedStyles.style.bgPrimaryBackground}
        />
        {/* TODO: Fix double tapping needed to select an item when a TextInput is active */}
      </Modal>
    );
  }
}
