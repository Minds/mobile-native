import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BlogCard from '../blogs/BlogCard';
import Activity from '../newsfeed/activity/Activity';
import sp from '~/services/serviceProvider';
/**
 * Remind Preview
 * @param {Object} props
 */
export default function (props) {
  const ShowComponent: React.ElementType =
    props.entity.subtype === 'blog' ? BlogCard : Activity;
  const navigation = useNavigation();

  return (
    <View style={remindContainerStyle}>
      <ShowComponent
        hideTabs={true}
        entity={props.entity}
        navigation={navigation}
        isReminded
      />
    </View>
  );
}

const remindContainerStyle = sp.styles.combine(
  'marginVertical3x',
  'borderRadius3x',
  'border1x',
  'bcolorPrimaryBorder',
);
