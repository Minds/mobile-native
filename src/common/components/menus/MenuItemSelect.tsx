import React, { useCallback } from 'react';
import { TextStyle } from 'react-native';
import { B2 } from '../../ui';
import Selector from '../SelectorV2';
import MenuItem, { MenuItemProps } from './MenuItem';

type MenuItemSelectProps = MenuItemProps & {
  data: Array<any>;
  valueExtractor: (value: any) => any;
  keyExtractor: (value: any) => any;
  onSelected: (value: any) => any;
  selected: any;
  info?: string;
  error?: string;
  selectTitle?: string;
  textStyle?: TextStyle | TextStyle[];
  backdropOpacity?: number;
};

export default function MenuItemSelect(props: MenuItemSelectProps) {
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
        <MenuItem
          {...props}
          onPress={() => show(props.selected)}
          icon={<B2 color="primary">{getValueOf(props.selected)}</B2>}
        />
      )}
    </Selector>
  );
}
