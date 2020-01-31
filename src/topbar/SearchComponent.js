import React, { Component } from 'react';
import { observer } from 'mobx-react/native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { CommonStyle as CS } from '../styles/Common';
import i18n from '../common/services/i18n.service';
import TextInput from '../common/components/TextInput';

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
   * 
   */
  search = searchText => this.setState( {searchText} );

  render() {
    return (
      <View style={[this.isSearching() ? styles.width100 : {}]}>
        <Icon 
          onPress={!this.isSearching() ? this.toggleSearching : null}
          name="search"
          size={24}
          style={[ styles.button, CS.colorIcon ]}
        />
        {
          this.isSearching() &&
          <TextInput
            placeholder={i18n.t('discovery.search')}
            onChangeText={this.search}
            value={this.state.searchText}
            testID="searchInput"
            style={[CS.paddingLeft2x]}
          />
        }
        {
          this.isSearching() && 
          (<View style={styles.close}>
            <Icon 
              onPress={this.toggleSearching} 
              name="close" 
              size={24} 
              style={[ styles.button, CS.colorIcon]}
            />
          </View>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
  },
  width100: {
    width: '150%',
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
  close: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }
});
