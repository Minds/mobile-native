import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from '~ui/icons';
import FIcon from 'react-native-vector-icons/Feather';
// import Icon from 'react-native-vector-icons/Ionicons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
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
      ]}
    >
      {!props.store.isEdit && (
        <IconButton
          size={27}
          name="image"
          style={iconStyle}
          onPress={() => props.store.selectFromGallery(props.store.mode)}
          testID="attachImage"
        />
      )}
      {!props.store.isEdit && (
        <IconButton
          name="camera"
          size={27}
          style={iconStyle}
          onPress={() => props.store.setModePhoto(false)}
        />
      )}
      {!props.store.isGroup() && (
        <IconButton
          name="money"
          size={27}
          style={iconStyle}
          onPress={() =>
            navigation.navigate('MonetizeSelector', { store: props.store })
          }
        />
      )}
      <IconButton
        name="hashtag"
        size={27}
        style={iconStyle}
        onPress={() =>
          navigation.navigate('TagSelector', { store: props.store })
        }
      />
      <View style={theme.flexContainer} />
      <IconButton
        name="cog"
        size={27}
        style={iconStyle}
        onPress={props.onOptions}
        testID="postOptions"
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
