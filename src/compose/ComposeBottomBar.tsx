import { useNavigation } from '@react-navigation/native';
import { useIsFeatureOn, useIsIOSFeatureOn } from 'ExperimentsProvider';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { View, Keyboard } from 'react-native';
import { IconButton } from '~ui/icons';
import ThemedStyles from '../styles/ThemedStyles';
import { IS_IPAD } from '~/config/Config';

function ComposeBottomBar(props) {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const isCreateModalOn = useIsFeatureOn('mob-4596-create-modal');
  const isIosMindsHidden = useIsIOSFeatureOn(
    'mob-4637-ios-hide-minds-superminds',
  );

  const allowMedia = !props.store.isEdit;

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
      mode: props.store.allowedMode,
      onMediaConfirmed: media => {
        props.store.attachments.attachMedia(media, props.store.extra, true);
        return true;
      },
    });
  }, [navigation, props.store]);
  const onGalleryPress = useCallback(() => {
    props.store.selectFromGallery(props.store.allowedMode);
  }, [props.store]);

  return (
    <View style={styles.bottomBar}>
      {allowMedia && (
        <IconButton
          name="image"
          style={iconStyle}
          onPress={onGalleryPress}
          testID="attachImage"
          scale
        />
      )}
      {allowMedia && (
        <IconButton
          name="camera"
          style={iconStyle}
          scale
          onPress={onCameraPress}
        />
      )}
      {!props.store.isGroup() &&
        !props.store.isRemind &&
        !isCreateModalOn &&
        !props.store.supermindRequest &&
        !props.store.isEdit &&
        !isIosMindsHidden && (
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
      {
        // don't allow superminding in the context of a supermind reply
        !props.store.isSupermindReply && isCreateModalOn && !IS_IPAD && (
          <IconButton
            name="supermind"
            style={iconStyle}
            scale
            color={props.store.supermindRequest ? 'Link' : 'Icon'}
            onPress={props.onSupermind}
          />
        )
      }

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

export default observer(ComposeBottomBar);

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
