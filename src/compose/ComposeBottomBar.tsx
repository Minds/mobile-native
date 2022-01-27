import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { View, Keyboard } from 'react-native';
import { IconButton } from '~ui/icons';
import ThemedStyles from '../styles/ThemedStyles';

export default function ComposeBottomBar(props) {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const iconStyle = useMemo(
    () => [
      theme.padding3x,
      ThemedStyles.theme ? theme.colorWhite : theme.colorIcon,
    ],
    [theme.colorIcon, theme.colorWhite, theme.padding3x],
  );
  const onCameraPress = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate('Capture', {
      onMediaConfirmed: media => {
        props.store.onMedia(media);
        props.store.attachment.attachMedia(media, props.store.extra);
        return true;
      },
    });
  }, [navigation, props.store]);
  const onGalleryPress = useCallback(
    () => props.store.selectFromGallery('any'),
    [props.store],
  );

  return (
    <View style={styles.bottomBar}>
      {!props.store.isEdit && !props.store.isRemind && (
        <IconButton
          name="image"
          style={iconStyle}
          onPress={onGalleryPress}
          testID="attachImage"
          scale
        />
      )}
      {!props.store.isEdit && !props.store.isRemind && (
        <IconButton
          name="camera"
          style={iconStyle}
          scale
          onPress={onCameraPress}
        />
      )}
      {!props.store.isGroup() && (
        <IconButton
          name="money"
          style={iconStyle}
          scale
          onPress={props.onMoney}
        />
      )}
      <IconButton
        name="hashtag"
        style={iconStyle}
        scale
        onPress={props.onHashtag}
      />
      <View style={theme.flexContainer} />
      <IconButton
        name="cog"
        style={iconStyle}
        onPress={props.onOptions}
        testID="postOptions"
        scale
      />
    </View>
  );
}

const styles = ThemedStyles.create({
  bottomBar: [
    'bgPrimaryBackground',
    'paddingLeft2x',
    'padding',
    {
      flexDirection: 'row',
      height: 70,
      padding: 5,
      alignItems: 'center',
    },
  ],
});
