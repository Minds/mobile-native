import { observer } from 'mobx-react';
import React from 'react';

import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import ActivityModel from '../newsfeed/ActivityModel';
import ThemedStyles from '../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/NavigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
      <Text style={styles.text} onPress={() => GoToComments()}>
        View {count} comments
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView
      style={ThemedStyles.style.paddingBottom3x}
      behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
      <View>{count > 0 ? ViewCommentsButton() : undefined}</View>
    </KeyboardAvoidingView>
  );
});

const styles = ThemedStyles.create({
  text: ['colorIconActive', 'paddingHorizontal2x', 'marginBottom3x'],
});

export default CommentsEntityOutlet;
