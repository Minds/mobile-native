import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from '~ui/icons';
import ThemedStyles from '../styles/ThemedStyles';

export default function BottomBar(props) {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const iconStyle = [
    theme.padding3x,
    ThemedStyles.theme ? theme.colorWhite : theme.colorIcon,
  ];
  return (
    <View
      style={[
        theme.bgPrimaryBackground,
        styles.bottomBar,
        theme.paddingLeft2x,
        theme.padding,
      ]}>
      {!props.store.isEdit && (
        <IconButton
          name="image"
          style={iconStyle}
          onPress={() => props.store.selectFromGallery(props.store.mode)}
          testID="attachImage"
          scale
        />
      )}
      {!props.store.isEdit && (
        <IconButton
          name="camera"
          style={iconStyle}
          scale
          onPress={() => props.store.setModePhoto(false)}
        />
      )}
      {!props.store.isGroup() && (
        <IconButton
          name="money"
          style={iconStyle}
          scale
          onPress={() =>
            navigation.navigate('MonetizeSelector', { store: props.store })
          }
        />
      )}
      <IconButton
        name="hashtag
        style={iconStyle}
        scale
        onPress={() =>
          navigation.navigate('TagSelector', { store: props.store })
        }
      />
      <View style={theme.flexContainer} />
      <IconButton
        name="
        cog
        style={iconStyle}
        onPress={props.onOptions}
        testID="postOptions"
        scale
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    height: 70,
    padding: 5,
    alignItems: 'center',
  },
});
