import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import BlogCard from '../blogs/BlogCard';
import Activity from '../newsfeed/activity/Activity';
import { useKeyboard } from '@react-native-community/hooks';
import ThemedStyles from '../styles/ThemedStyles';

const height = Dimensions.get('screen').height;

/**
 * Remind Preview
 * @param {Object} props
 */
export default function (props) {
  const backgroundColor = ThemedStyles.getColor('primary_background');
  const startColor = backgroundColor + '00';
  const endColor = backgroundColor + 'FF';
  const keyboard = useKeyboard();
  const style = {
    maxHeight: height / 2 - keyboard.keyboardHeight,
    paddingHorizontal: 20,
    overflow: 'scroll', // IMPORTANT! the activities and blogs are not rendered correctly without this!
  };

  const entity = props.entity.remind_object || props.entity;

  const ShowComponent = entity.subtype === 'blog' ? BlogCard : Activity;
  const navigation = useNavigation();

  return (
    <View style={style}>
      <ShowComponent hideTabs={true} entity={entity} navigation={navigation} />
      <LinearGradient colors={[startColor, endColor]} style={styles.linear} />
    </View>
  );
}

const styles = StyleSheet.create({
  linear: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    height: '35%',
    width: '100%',
  },
});
