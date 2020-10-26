import { observer } from 'mobx-react';
import React from 'react';

import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import ActivityModel from '../newsfeed/ActivityModel';
import ThemedStyles from '../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/NavigationTypes';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

type Props = {
  entity: ActivityModel;
};

export const CommentsEntityOutlet = observer((props: Props) => {
  const count = props.entity['comments:count'];
  const navigation = useNavigation<
    NativeStackNavigationProp<AppStackParamList>
  >();

  const GoToComments = () => {
    navigation.push('Activity', {
      entity: props.entity,
      scrollToBottom: true,
    });
  };

  const ViewCommentsButton = () => {
    return (
      <Text
        style={[
          ThemedStyles.style.colorIconActive,
          ThemedStyles.style.paddingHorizontal2x,
          ThemedStyles.style.marginBottom3x,
        ]}
        onPress={() => GoToComments()}>
        View {count} comments
      </Text>
    );
  };

  const onNewComment = (comment) => {
    GoToComments();
  };

  return (
    <KeyboardAvoidingView
      style={[ThemedStyles.style.paddingBottom3x]}
      behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
      <View>
        {count > 0 ? ViewCommentsButton() : undefined}

        {/* <View style={[ThemedStyles.style.paddingBottom3x]}>
        <CommentsInput
          entity={props.entity}
          onPosted={onNewComment}></CommentsInput>
          </View> */}
      </View>
    </KeyboardAvoidingView>
  );
});

export default CommentsEntityOutlet;
