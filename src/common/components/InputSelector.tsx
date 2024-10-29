import React, { useCallback, useState, useRef } from 'react';
import { View } from 'react-native';

import Selector, {
  SelectorPropsType,
} from '../../common/components/SelectorV2';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import MText from './MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  data: Array<any>;
  valueExtractor: SelectorPropsType['valueExtractor'];
  keyExtractor: SelectorPropsType['keyExtractor'];
  onSelected: SelectorPropsType['onItemSelect'];
  selectTitle?: string;
  label: string;
  selected: any;
  textStyle?: SelectorPropsType['textStyle'];
  backdropOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
};

const InputSelector = (props: PropsType) => {
  const theme = sp.styles.style;

  const [item, setItem] = useState(props.selected);

  let selectorRef = useRef<any>(null);

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
        <MText
          style={[
            theme.marginLeft,
            theme.colorSecondaryText,
            theme.fontM,
            props.labelStyle,
          ]}>
          {props.label}
        </MText>
        <MText
          style={[theme.colorPrimaryText, theme.fontM]}
          onPress={() => selectorRef.current?.show(item)}>
          {getValueOf(item)}
        </MText>
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
