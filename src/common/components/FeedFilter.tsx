import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';

type PropsType = {
  hideLabel?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  store: {
    filter: string;
    setFilter: Function;
  };
};

/**
 * Feed Filter selector
 */
const FeedFilter = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const ref = useRef<any>();
  const showDropdown = useCallback(() => {
    if (ref.current) {
      ref.current.show();
    }
  }, [ref]);

  return (
    <Menu
      ref={ref}
      style={[styles.menu, theme.backgroundTertiary]}
      button={
        <TouchableOpacity
          style={[theme.rowJustifyEnd, props.containerStyle]}
          onPress={showDropdown}
          testID="FilterToggle">
          <MdIcon name="filter" size={18} style={theme.colorIcon} />

          {!props.hideLabel && (
            <Text style={[theme.fontL, theme.paddingLeft]}>
              {i18n.t('filter')}
            </Text>
          )}
        </TouchableOpacity>
      }>
      {['all', 'images', 'videos', 'blogs'].map((f) => (
        <MenuItem
          onPress={() => props.store.setFilter(f)}
          textStyle={theme.fontL}
          testID={`Filter${f}`}>
          {props.store.filter === f && <MdIcon name="check" />}
          {' ' + i18n.t(`discovery.${f}`)}
        </MenuItem>
      ))}
    </Menu>
  );
});

export default FeedFilter;

const styles = StyleSheet.create({
  menu: {
    width: 180,
    marginTop: 20,
  },
});
