import React from 'react';
import { Platform, StyleProp, StyleSheet, TextStyle } from 'react-native';
import { View } from 'react-native-animatable';
import { BottomSheet, ListItem } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

export type ItemType = {
  title: string;
  onPress: () => void;
  titleStyle?: StyleProp<TextStyle>;
};

export interface PropsType {
  list: Array<Array<ItemType>>;
  isVisible: boolean;
}

const isIOS = Platform.OS === 'ios';
/**
 * Bottom options menu
 */
export default function BottomButtonOptions({ isVisible, list }: PropsType) {
  const theme = ThemedStyles.style;

  return (
    <BottomSheet
      isVisible={isVisible}
      modalProps={{ style: theme.borderRadius5 }}>
      <View style={theme.paddingBottom}>
        {list.map((plist) =>
          plist.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={[
                theme.backgroundPrimary,
                theme.marginHorizontal3x,
                theme.borderPrimary,
                i < plist.length - 1 ? theme.borderBottomHair : null,
                i === 0 ? styles.borderRadiusTop : null,
                i === plist.length - 1 ? styles.borderRadiusBottom : null,
              ]}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title
                  style={[
                    theme.colorPrimaryText,
                    isIOS ? theme.paddingVertical : null,
                    theme.fontXL,
                    theme.centered,
                    l.titleStyle,
                  ]}>
                  {l.title}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )),
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  borderRadiusTop: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  borderRadiusBottom: {
    marginBottom: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
