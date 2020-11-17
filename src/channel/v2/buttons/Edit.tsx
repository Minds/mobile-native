import React from 'react';
import { Platform } from 'react-native';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { ChannelButtonsPropsType } from '../ChannelButtons';
import { styles } from './styles';

const isIos = Platform.OS === 'ios';

const Edit = (props: ChannelButtonsPropsType) => {
  const theme = ThemedStyles.style;

  return (
    <Button
      color={ThemedStyles.getColor('secondary_background')}
      text={i18n.t('channel.editChannel')}
      textStyle={isIos ? theme.fontL : theme.fontM}
      containerStyle={styles.button}
      textColor={ThemedStyles.getColor('primary_text')}
      onPress={props.onEditPress}
      inverted
    />
  );
};

export default Edit;
