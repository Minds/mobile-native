import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BlogCard from '../blogs/BlogCard';
import Activity from '../newsfeed/activity/Activity';
import ThemedStyles from '~/styles/ThemedStyles';

/**
 * Remind Preview
 * @param {Object} props
 */
export default function (props) {
  const entity = props.entity.remind_object || props.entity;

  const ShowComponent: React.ElementType =
    entity.subtype === 'blog' ? BlogCard : Activity;
  const navigation = useNavigation();

  return (
    <View style={remindContainerStyle}>
      <ShowComponent
        hideTabs={true}
        entity={entity}
        navigation={navigation}
        isReminded
      />
    </View>
  );
}

const remindContainerStyle = ThemedStyles.combine(
  'marginVertical3x',
  'borderRadius3x',
  'border1x',
  'bcolorPrimaryBorder',
);
