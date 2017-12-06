import React, {
  Component
} from 'react';

import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  NavigationActions
} from 'react-navigation';

import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button, Avatar } from 'react-native-elements';
import groupsService from './GroupsService';

import { MINDS_URI } from '../config/Config';

/**
 * Groups list screen
 */
export default class GroupsListScreen extends Component {
  state = {
    groups: []
  }

  componentWillMount() {
    groupsService.loadList('featured', '')
      .then(data => {
        this.setState({
          groups: data.groups
        });
      });
  }

  navigateToGroupJoin(group) {
    this.props.navigation.navigate('GroupsJoin', { group: group})
  }

  render() {
    return (
      <ScrollView style={styles.screen}>
        <List containerStyle={styles.list}>
          {
            this.state.groups.map((l, i) => (
              <ListItem
                containerStyle={{ borderBottomWidth: 0}}
                key={i}
                title={l.name}
                avatar={<Avatar width={40} height={40} rounded source={{ uri: MINDS_URI + 'fs/v1/avatars/' + l.guid + '/small' }} />}
                subtitle={'Members '+l['members:count']}
                hideChevron={true}
                onPress={() => this.navigateToGroupJoin(l)}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 5
  },
  screen: {
    backgroundColor: '#FFF',
    flex: 1,
  }
});