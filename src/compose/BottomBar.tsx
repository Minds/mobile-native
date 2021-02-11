import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
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
        theme.backgroundPrimary,
        styles.bottomBar,
        theme.paddingLeft2x,
        theme.padding,
      ]}>
      <FIcon
        size={27}
        name="image"
        style={iconStyle}
        onPress={() => props.store.selectFromGallery(props.store.mode)}
      />
      <Icon
        name="ios-camera-sharp"
        size={27}
        style={iconStyle}
        onPress={() => props.store.setModePhoto(false)}
      />
      <IconM
        name="attach-money"
        size={27}
        style={iconStyle}
        onPress={() =>
          navigation.navigate('MonetizeSelector', { store: props.store })
        }
      />
      <FIcon
        name="hash"
        size={27}
        style={iconStyle}
        onPress={() =>
          navigation.navigate('TagSelector', { store: props.store })
        }
      />
      <View style={theme.flexContainer} />
      <IconMC
        name="cog"
        size={27}
        style={iconStyle}
        onPress={props.onOptions}
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
