import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import {
  MINDS_URI,
} from '../../../config/Config';


export default class CommentView extends Component<{}> {

  render() {

    let body;
    const entity = this.props.entity;
    const user_guid = '';

    switch (entity.entityObj.type) {
      case "activity":
        if (entity.entityObj.owner_guid == user_guid) {
          body = (
            <View>
              <Text>your activity</Text>
            </View>
          )
        } else {
          body = (
            <View>
              <Text>{entity.entityObj.ownerObj.name}'s activity</Text>
            </View>
          )
        }
        break;
      case "object":
        if (entity.entityObj.title) {
          body = (
            <View>
              <Text>{entity.entityObj.title}</Text>
            </View>
          )
        } else if (entity.entityObj.owner_guid == user_guid) {
          body = (
            <View>
              <Text>your {entity.entityObj.subtype}</Text>
            </View>
          )
        } else {
          body = (
            <View>
              <Text>{entity.entityObj.ownerObj.name}'s {entity.entityObj.subtype}</Text>
            </View>
          )
        }
        break;
      default:
         body = (
          <View>
            <Text>... oops.</Text>
          </View>
         )
    }

    return (  
      <View>
        <Text>{entity.fromObj.name}</Text>
        <Text>commented on</Text>

        { body }
      </View>
    );
  }

}

const styles = StyleSheet.create({

});