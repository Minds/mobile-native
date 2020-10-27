import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

export type ItemType = {
  title: string;
  onPress: () => void;
  titleStyle?: StyleProp<TextStyle>;
};

export interface PropsType {
  list: Array<ItemType>;
  isVisible: boolean;
}

export default function BottomButtonOptions({ isVisible, list }: PropsType) {
  const theme = ThemedStyles.style;
  return (
    <BottomSheet
      isVisible={isVisible}
      modalProps={{ style: theme.borderRadius5 }}>
      {list.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={[
            theme.backgroundPrimary,
            theme.borderPrimary,
            i < list.length - 1 ? theme.borderBottomHair : null,
          ]}
          onPress={l.onPress}>
          <ListItem.Content>
            <ListItem.Title
              style={[
                theme.colorPrimaryText,
                theme.paddingVertical,
                theme.centered,
                l.titleStyle,
              ]}>
              {l.title}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}
