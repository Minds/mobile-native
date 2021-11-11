import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import ThemedStyles, { useMemoStyle, useStyle } from '../styles/ThemedStyles';
import i18nService from '../common/services/i18n.service';
import { observer } from 'mobx-react';
import TextInput from '../common/components/TextInput';
import MText from '../common/components/MText';

/**
 * Title input
 * @param {Object} props
 */
export default observer(function TitleInput(props) {
  const [open, setOpen] = useState(Boolean(props.store.title));
  const onPress = useCallback(() => {
    setOpen(old => {
      if (old === true) {
        props.store.setTitle('');
      }
      return !old;
    });
  }, [setOpen, props]);

  const theme = ThemedStyles.style;
  return (
    <View style={open ? container : containerClosed}>
      <View
        style={useMemoStyle(
          [
            'fullWidth',
            'rowJustifyEnd',
            'alignCenter',
            'paddingRight',
            open ? {} : { width: 80 },
          ],
          [open],
        )}>
        <Icon
          name={open ? 'minus' : 'plus'}
          size={16}
          style={theme.colorTertiaryText}
          onPress={onPress}
        />
        <MText style={titleStyle} onPress={onPress}>
          Title
        </MText>
      </View>
      {open && (
        <TextInput
          style={textInputStyle}
          placeholder={i18nService.t('title')}
          placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
          onChangeText={props.store.setTitle}
          textAlignVertical="top"
          value={props.store.title}
          multiline={false}
          selectTextOnFocus={false}
          underlineColorAndroid="transparent"
          testID="PostTitleInput"
        />
      )}
    </View>
  );
});

const textInputStyle = ThemedStyles.combine('colorPrimaryText', 'fontXXL');
const container = ThemedStyles.combine('fullWidth');
const containerClosed = ThemedStyles.combine('fullWidth', {
  alignItems: 'flex-end',
});
const titleStyle = ThemedStyles.combine(
  'fontL',
  'colorTertiaryText',
  'paddingHorizontal2x',
);
