//@ts-nocheck
import React, { useCallback, useState, useRef } from 'react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import Selector from '../../common/components/Selector';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

type PropsType = {
  data: Array<any>;
  valueExtractor: Function;
  keyExtractor: Function;
  onSelected: Function;
  selectTitle?: string;
  label: string;
  selected: any;
  textStyle?: StyleProp<TextStyle>;
  backdropOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
};

const InputSelector = (props: PropsType) => {
  const theme = ThemedStyles.style;

  const [item, setItem] = useState(props.selected);

  let selectorRef = useRef(null);

  const selected = useCallback(
    item => {
      const value = props.keyExtractor(item);
      setItem(value);
      props.onSelected(value);
    },
    [setItem, props],
  );

  const getValueOf = useCallback(
    key => {
      const item = props.data.find(item => props.keyExtractor(item) === key);
      return props.valueExtractor(item);
    },
    [props],
  );

  return (
    <View
      style={[
        theme.bgPrimaryBackground,
        theme.paddingTop4x,
        props.mainContainerStyle,
      ]}>
      <View
        style={[
          theme.rowJustifySpaceBetween,
          theme.bgSecondaryBackground,
          theme.paddingVertical3x,
          theme.paddingHorizontal3x,
          theme.bcolorPrimaryBorder,
          theme.borderHair,
          props.containerStyle,
        ]}>
        <Text
          style={[
            theme.marginLeft,
            theme.colorSecondaryText,
            theme.fontM,
            props.labelStyle,
          ]}>
          {props.label}
        </Text>
        <Text
          style={[theme.colorPrimaryText, theme.fontM]}
          onPress={() => selectorRef.current.show(item)}>
          {getValueOf(item)}
        </Text>
      </View>
      <Selector
        ref={selectorRef}
        onItemSelect={selected}
        title={props.selectTitle || ''}
        data={props.data}
        valueExtractor={props.valueExtractor}
        keyExtractor={props.keyExtractor}
        textStyle={props.textStyle}
        backdropOpacity={props.backdropOpacity}
      />
    </View>
  );
};

export default InputSelector;
