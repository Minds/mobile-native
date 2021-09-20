import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import { UserAutoCompleteStore } from './createUserAutocompleteStore';

type PropsType = {
  store: UserAutoCompleteStore;
};

const UserList = ({ store }: PropsType) => {
  const theme = ThemedStyles.style;
  const tagStyle = useStyle('bgTertiaryBackground', {
    margin: 2,
    padding: 9,
    borderRadius: 18,
  });

  if (!store.users) {
    return null;
  }

  return (
    <ScrollView
      horizontal={true}
      keyboardShouldPersistTaps="always"
      style={theme.marginRight8x}>
      {store.users.map((user, i) => {
        return (
          <View style={tagStyle} key={i}>
            <Text onPress={() => store.onSelectTag(user)}>
              @{user.username}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default UserList;
