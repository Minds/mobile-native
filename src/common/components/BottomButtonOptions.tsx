import React from 'react';
import { Platform, StyleProp, StyleSheet, TextStyle } from 'react-native';
import { View } from 'react-native-animatable';
import { ListItem } from 'react-native-elements';
import Modal from 'react-native-modal';
import { DARK_THEME } from '../../styles/Colors';
import ThemedStyles from '../../styles/ThemedStyles';

export type ItemType = {
  title: string;
  onPress: () => void;
  titleStyle?: StyleProp<TextStyle>;
};

export interface PropsType {
  list: Array<Array<ItemType>>;
  isVisible: boolean;
  onPressClose?: () => void;
}

const isIOS = Platform.OS === 'ios';
/**
 * Bottom options menu
 */
export default function BottomButtonOptions({
  isVisible,
  list,
  onPressClose,
}: PropsType) {
  const theme = ThemedStyles.style;

  return (
    <Modal
      avoidKeyboard={true}
      onBackdropPress={onPressClose}
      isVisible={isVisible}
      backdropColor={DARK_THEME.secondary_background}
      backdropOpacity={0.5}
      useNativeDriver={true}
      style={[theme.fullWidth, theme.margin0x, theme.justifyEnd]}
      animationInTiming={100}
      animationOutTiming={100}
      animationOut="fadeOut"
      animationIn="fadeIn">
      <View style={theme.paddingBottom}>
        {list.map((plist, indx) => (
          <View style={theme.paddingBottom2x} key={`${indx}c`}>
            {plist.map((l, i) => (
              <ListItem
                key={i}
                underlayColor="transparent"
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
            ))}
          </View>
        ))}
      </View>
    </Modal>
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
