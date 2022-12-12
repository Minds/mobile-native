import React, { useCallback } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Icon } from '../ui';
import InputBase from './InputBase';
import Selector from './SelectorV2';

export type InputSelectorProps = {
  data: Array<any>;
  valueExtractor: (value: any) => any;
  keyExtractor: (value: any) => any;
  onSelected: (value: any) => any;
  selectTitle?: string;
  label: string;
  selected: any;
  textStyle?: TextStyle | TextStyle[];
  backdropOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  info?: string;
  error?: string;
  borderless?: boolean;
};

const InputSelector = (props: InputSelectorProps) => {
  const onSelected = useCallback(
    item => {
      props.onSelected(props.keyExtractor(item));
    },
    [props],
  );

  const getValueOf = useCallback(
    key => {
      const selected = props.data.find(i => props.keyExtractor(i) === key);
      return props.valueExtractor(selected);
    },
    [props],
  );

  return (
    <Selector
      onItemSelect={onSelected}
      title={props.selectTitle || ''}
      data={props.data}
      valueExtractor={props.valueExtractor}
      keyExtractor={props.keyExtractor}
      textStyle={props.textStyle}
      backdropOpacity={props.backdropOpacity}>
      {show => (
        <InputBase
          onPress={() => show(props.selected)}
          style={[{ minHeight: 90 }, props.containerStyle]}
          label={props.label}
          labelStyle={props.labelStyle}
          info={props.info}
          borderless={props.borderless}
          error={props.error}
          value={getValueOf(props.selected)}
          icon={<Icon name="chevron-down" />}
        />
      )}
    </Selector>
  );
};

export default InputSelector;
