import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import ThemedStyles from '../styles/ThemedStyles';
import i18nService from '../common/services/i18n.service';
import { observer } from 'mobx-react';

/**
 * Title input
 * @param {Object} props
 */
export default observer(function(props) {
  const [open, setOpen] = useState(false);
  const onpress = useCallback(() => {
    setOpen(old => {
      if (old === true) {
        props.store.setTitle('');
      }
      return !old;
    });
  }, [setOpen, props]);

  const theme = ThemedStyles.style;
  return (
    <View style={theme.fullWidth}>
      <View
        style={[
          theme.fullWidth,
          theme.rowJustifyEnd,
          theme.alignCenter,
          theme.paddingRight,
          theme.marginTop3x,
        ]}>
        <Icon
          name={open ? 'minus' : 'plus'}
          size={20}
          style={theme.colorTertiaryText}
          onPress={onpress}
        />
        <Text
          style={[theme.fontXL, theme.colorIcon, theme.paddingHorizontal2x]}
          onPress={onpress}>
          Title
        </Text>
      </View>
      {open && (
        <TextInput
          style={[
            theme.colorPrimaryText,
            theme.fontXXL,
            theme.paddingHorizontal4x,
          ]}
          placeholder={i18nService.t('title')}
          placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
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