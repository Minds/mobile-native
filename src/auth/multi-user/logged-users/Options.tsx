import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  BottomSheet,
  BottomSheetButton,
  MenuItem,
} from '../../../common/components/bottom-sheet';
import { MenuItemProps } from '../../../common/components/bottom-sheet/MenuItem';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import AuthService from '../../AuthService';

type PropsType = {
  index: number;
  isActive: boolean;
  username: string;
  onSwitchPress: Function;
};

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

const Options = ({ index, isActive, username, onSwitchPress }: PropsType) => {
  const theme = ThemedStyles.style;
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  const show = React.useCallback(() => {
    ref.current?.present();
  }, []);
  const userOptions: Array<MenuItemProps> = React.useMemo(() => {
    const actions: Array<MenuItemProps> = [
      {
        title: i18n.t('settings.logout'),
        iconName: 'logout',
        iconType: 'material',
        onPress: () => {
          close();
          AuthService.logoutFrom(index);
        },
      },
    ];

    if (isActive) {
      actions.unshift({
        title: i18n.t('multiUser.switchChannel'),
        iconName: 'account-box-multiple',
        iconType: 'material-community',
        onPress: () => {
          close();
          onSwitchPress();
        },
      });
    }

    return actions;
  }, [close, index, isActive, onSwitchPress]);
  return (
    <TouchableOpacity onPress={show} hitSlop={hitSlop}>
      <MIcon name="more-vert" size={24} style={theme.colorSecondaryText} />
      <BottomSheet ref={ref}>
        <Text style={styles.username}>@{username}</Text>
        {userOptions.map((a, i) => (
          <MenuItem {...a} key={i} />
        ))}
        <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
      </BottomSheet>
    </TouchableOpacity>
  );
};

const styles = ThemedStyles.create({
  username: ['centered', 'bold', 'marginVertical5x', { fontSize: 20 }],
});

export default Options;
