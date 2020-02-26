import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import CenteredLoading from '../common/components/CenteredLoading';
import DiscoveryUserNew from '../discovery/DiscoveryUserNew';
import i18n from '../common/services/i18n.service';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import debounce from '../common/helpers/debounce';
import ThemedStyles from '../styles/ThemedStyles';
import { inject } from 'mobx-react';

export default
@inject('discovery')
class SearchResultComponent extends Component {
  search = '';

  state = {
    loading: false,
    suggested: [],
    history: [],
  };

  async componentDidMount() {
    const history = await this.props.user.getSearchHistory();
    this.setState({ history });
  }

  /**
   * Only show suggested when search length > 2
   */
  shouldShowSuggested = () => this.search.length > 2;

  input = async search => {
    this.search = search;
    if (this.shouldShowSuggested()) {
      this.setState({ loading: true });
      const suggested = await this.props.user.getSuggestedSearch(search);
      this.setState({
        suggested: suggested,
        loading: false,
      });
    }
  };

  /**
   * List based on what user has typed
   */
  renderSuggestedSearch = () => {
    const CS = ThemedStyles.style;
    const suggestedSearch =
      this.state.suggested.length === 0 ? (
        this.state.loading ? (
          <CenteredLoading />
        ) : (
          <View style={CS.flexContainerCenter}>
            {this.renderFindInDiscovery(false)}
          </View>
        )
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled">
          {this.state.suggested.map(this.renderUser)}
          {this.renderFindInDiscovery()}
        </ScrollView>
      );

    return suggestedSearch;
  };

  searchDiscovery = () => {
    this.props.discovery.setQuery(this.search);
    this.props.discovery.filters.search(this.search);
    this.props.navigation.navigate('Discovery');
    this.searchBarItemTap(this.search);
  };

  renderFindInDiscovery = (showBorder = true) => {
    const CS = ThemedStyles.style;
    const borders = showBorder ? [CS.borderTopHair, CS.borderPrimary] : [];
    return (
      <TouchableOpacity
        onPress={this.searchDiscovery}
        style={[CS.flexColumnCentered, CS.padding3x, ...borders]}>
        <Text style={CS.colorSecondaryText}>{`SEARCH MINDS: ${
          this.search
        }`}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render user
   */
  renderUser = (user, index) => {
    return (
      <DiscoveryUserNew
        row={{ item: user }}
        key={user.guid}
        testID={`suggestedUser${index}`}
        onUserTap={this.searchBarItemTap}
        subscribe={false}
        navigation={this.props.navigation}
      />
    );
  };

  /**
   * List based on user search history
   * rendered when nothing has been typed
   */
  renderSearchHistory = () => {
    const CS = ThemedStyles.style;
    const searchHistory =
      this.state.history.length === 0 ? (
        this.renderEmptyMessageHistory()
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled">
          {this.state.history.map(item => (
            <Text
              onPress={() => this.props.search(item)}
              style={[
                CS.subTitleText,
                CS.colorSecondaryText,
                CS.fontLight,
                CS.marginTop3x,
                CS.marginLeft2x,
              ]}>
              {item}
            </Text>
          ))}
        </ScrollView>
      );

    return [
      <View style={[styles.row, CS.marginBottom3x]}>
        <Text style={[CS.subTitleText, CS.colorSecondaryText, CS.fontM]}>
          {i18n.t('searchBar.searchHistory')}
        </Text>
        <Text
          style={[CS.subTitleText, CS.colorSecondaryText, CS.fontM]}
          onPress={this.clearSearchHistory}>
          {i18n.t('searchBar.clear')}
        </Text>
      </View>,
      searchHistory,
    ];
  };

  /**
   * nav to taped channel and clean the search
   */
  searchBarItemTap = item => {
    this.props.search('');
    this.props.user.toggleSearching();
    this.props.user.searchBarItemTap(item);
  };

  /**
   * Rendered when suggest comes empty
   */
  renderEmptyMessageSuggest = () => {
    const CS = ThemedStyles.style;

    return (
      <View style={[CS.centered]}>
        <FAIcon name="grin-beam-sweat" size={36} style={[CS.colorIcon]} />
        <Text style={[CS.subTitleText, CS.colorSecondaryText]}>
          {i18n.t('searchBar.emptySuggested')}
        </Text>
      </View>
    );
  };

  /**
   * Rendered when no search history
   */
  renderEmptyMessageHistory = () => {
    const CS = ThemedStyles.style;

    return (
      <View style={[CS.centered]}>
        <FAIcon name="history" size={36} style={[CS.colorIcon]} />
        <Text style={[CS.subTitleText, CS.colorSecondaryText]}>
          {i18n.t('searchBar.emptySearchHistory')}
        </Text>
      </View>
    );
  };

  clearSearchHistory = async () => {
    this.props.user.searchBarClearHistory();
    this.setState({ history: [] });
  };

  render() {
    const CS = ThemedStyles.style;

    // If have something to search, render suggested, else, search history
    const render = this.shouldShowSuggested()
      ? this.renderSuggestedSearch()
      : this.renderSearchHistory();

    return (
      <View
        style={[
          CS.backgroundPrimary,
          CS.padding2x,
          {
            borderTopColor: ThemedStyles.getColor('primary_border'),
            borderTopWidth: 1,
          },
        ]}>
        {render}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
