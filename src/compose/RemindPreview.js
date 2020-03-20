import React from 'react';
import { View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BlogCard from '../blogs/BlogCard';
import Activity from '../newsfeed/activity/Activity';
import { useKeyboard } from '@react-native-community/hooks';

const height = Dimensions.get('screen').height;

/**
 * Remind Preview
 * @param {Object} props
 */
export default function(props) {
  const keyboard = useKeyboard();
  const style = {
    maxHeight: height / 2 - keyboard.keyboardHeight,
    paddingHorizontal: 20,
    overflow: 'scroll', // IMPORTANT! the activities and blogs are not rendered correctly without this!
  };
  const ShowComponent = props.entity.subtype === 'blog' ? BlogCard : Activity;
  const navigation = useNavigation();
  return (
    <View style={style}>
      <ShowComponent
        hideTabs={true}
        entity={props.entity}
        navigation={navigation}
      />
    </View>
  );
}
