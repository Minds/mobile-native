import React, { useCallback, useRef } from 'react';

import { TouchableOpacity } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_REMIND } from '../../../common/Permissions';
import { useRoute, useNavigation } from '@react-navigation/native';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import i18n from '../../../common/services/i18n.service';
import createComposeStore from '../../../compose/createComposeStore';
import { showNotification } from '../../../../AppMessages';
import { useLegacyStores } from '../../../common/hooks/__mocks__/use-stores';
import sessionService from '../../../common/services/session.service';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default function ({ entity, size = 21 }: PropsTypes) {
  const theme = ThemedStyles.style;
  const reminded =
    entity.remind_users &&
    entity.remind_users.some(
      (user) => user.guid === sessionService.getUser().guid,
    );

  const color = reminded
    ? theme.colorLink
    : entity.can(FLAG_REMIND)
    ? theme.colorIcon
    : theme.colorTertiaryText;

  const { newsfeed } = useLegacyStores();

  const route = useRoute();
  const navigation = useNavigation<any>();
  const ref = useRef<Menu>(null);
  const showDropdown = useCallback(() => {
    if (ref.current) {
      ref.current.show();
    }
  }, [ref]);

  /**
   * Open quote in composer
   */
  const quote = useCallback(() => {
    // check permission and show alert
    if (!entity.can(FLAG_REMIND, true)) {
      return;
    }
    const { key } = route;
    if (ref.current) {
      ref.current.hide();
    }
    navigation.navigate('Capture', { isRemind: true, entity, parentKey: key });
  }, [route, entity, navigation]);

  const undo = useCallback(() => {
    entity
      .deleteRemind()
      .then(() => {
        showNotification(i18n.t('remindRemoved'), 'success');
      })
      .catch((e) => {
        console.log(e);
        showNotification(i18n.t('errorMessage'), 'warning');
      });
  }, [entity]);

  /**
   * Remind
   */
  const remind = useCallback(() => {
    const compose = createComposeStore({ props: {}, newsfeed: null });
    compose.setRemindEntity(entity);
    if (ref.current) {
      ref.current.hide();
    }
    compose
      .submit()
      .then((activity) => {
        // append the entity to the feed
        newsfeed.feedStore.prepend(activity);

        showNotification(i18n.t('postReminded'), 'success');
      })
      .catch((e) => {
        console.log(e);
        showNotification(i18n.t('errorMessage'), 'warning');
      });
  }, [entity, newsfeed.feedStore]);

  const iconStyle = [theme.colorSecondaryText];

  const menuText = [theme.colorSecondaryText, theme.fontL];

  return (
    <Menu
      ref={ref}
      style={theme.backgroundSecondary}
      button={
        <TouchableOpacityCustom
          style={[
            ThemedStyles.style.rowJustifyCenter,
            ThemedStyles.style.paddingHorizontal3x,
            ThemedStyles.style.paddingVertical4x,
            ThemedStyles.style.alignCenter,
          ]}
          onPress={showDropdown}
          testID="Remind activity button">
          <Icon style={[color, theme.marginRight]} name="repeat" size={size} />
          <Counter count={entity.reminds} />
        </TouchableOpacityCustom>
      }>
      {reminded ? (
        <MenuItem onPress={undo} textStyle={menuText}>
          <Icon style={iconStyle} name="repeat" size={15} />
          {'  ' + i18n.t('undoRemind')}
        </MenuItem>
      ) : (
        <>
          <MenuItem onPress={remind} textStyle={menuText}>
            <Icon style={iconStyle} name="repeat" size={15} />
            {'  ' + i18n.t('capture.remind')}
          </MenuItem>
          <MenuItem onPress={quote} textStyle={menuText}>
            <Icon style={iconStyle} name="edit" size={15} />
            {'  ' + i18n.t('quote')}
          </MenuItem>
        </>
      )}
    </Menu>
  );
}
