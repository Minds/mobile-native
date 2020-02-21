import React, { Component } from 'react';
import { observer } from 'mobx-react'

import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import i18n from '../common/services/i18n.service';
import TextInput from '../common/components/TextInput';
import SearchResult from './SearchResultComponent';

import Modal from 'react-native-modal';
import ThemedStyles from '../styles/ThemedStyles';

export default
@observer
class SearchComponent extends Component {

  state = {
    searchText: '',
  }

  /**
   * Load search history
   */
  componentDidMount() {
    // TODO: load search history
  }

  /**
   * Init or close search Process
   */
  toggleSearching = () => {
    this.props.user.toggleSearching();
  }

  /**
   * Check if searching
   */
  isSearching = () => this.props.user.searching;

  /**
   * set search text
   */
  search = searchText => {
    this.setState( {searchText} );
    this.searchResult.input(searchText);
  }

  handleSearchResultRef = ref => this.searchResult = ref;

  render() {
    const CS = ThemedStyles.style;
    return (
      <View>
        <Icon
          onPress={!this.isSearching() ? this.toggleSearching : null}
          name="search"
          size={24}
          style={[ styles.button, CS.colorIcon ]}
        />
        <Modal
          isVisible={this.isSearching()}
          backdropColor={ThemedStyles.getColor('secondary_background')}
          backdropOpacity={ 1 }
        >
          <SafeAreaView style={[CS.flexContainer, CS.backgroundSecondary]}>
            <View style={[styles.header, CS.marginBottom4x, Platform.OS === 'android' ? CS.marginTop2x : CS.marginTop4x]}>
              <View style={[CS.rowJustifyStart, CS.paddingLeft2x]}>
                <Icon
                  name="search"
                  size={24}
                  style={[CS.colorIcon, CS.marginRight2x, Platform.OS === 'android' ? CS.centered : null]}
                />
                <TextInput
                  placeholder={i18n.t('discovery.search')}
                  placeholderTextColor={ThemedStyles.getColor('secondary_text')}
                  onChangeText={this.search}
                  value={this.state.searchText}
                  testID="searchInput"
                  style={[styles.textInput, CS.colorPrimaryText]}
                />
              </View>
              <Icon
                onPress={this.toggleSearching}
                name="close"
                size={18}
                style={[styles.button, CS.colorIcon, Platform.OS === 'android' ? CS.centered : null]}
              />
            </View>

            <SearchResult
              user={this.props.user}
              ref={this.handleSearchResultRef}
              navigation={this.props.navigation}
              search={this.search}/>

          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: '60%'
  }
});
