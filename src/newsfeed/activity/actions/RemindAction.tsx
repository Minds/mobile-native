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
import sessionService from '../../../common/services/session.service';
import {
  actionsContainerStyle,
  iconActiveStyle,
  iconDisabledStyle,
  iconNormalStyle,
} from './styles';
import { useLegacyStores } from '../../../common/hooks/use-stores';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  hideCount?: boolean;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default function ({ entity, size = 21, hideCount }: PropsTypes) {
  const theme = ThemedStyles.style;
  const reminded =
    entity.remind_users &&
    entity.remind_users.some(
      user => user.guid === sessionService.getUser().guid,
    );

  const buttonIconStyle = reminded
    ? iconActiveStyle
    : entity.can(FLAG_REMIND)
    ? iconNormalStyle
    : iconDisabledStyle;

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
      .catch(e => {
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
      .then(activity => {
        // append the entity to the feed
        newsfeed.feedStore.prepend(activity);

        showNotification(i18n.t('postReminded'), 'success');
      })
      .catch(e => {
        console.log(e);
        showNotification(i18n.t('errorMessage'), 'warning');
      });
  }, [entity, newsfeed.feedStore]);

  return (
    <Menu
      ref={ref}
      style={theme.backgroundSecondary}
      button={
        <TouchableOpacityCustom
          style={actionsContainerStyle}
          onPress={showDropdown}
          testID="Remind activity button">
          <Icon style={buttonIconStyle} name="repeat" size={size} />
          {!hideCount && <Counter count={entity.reminds} />}
        </TouchableOpacityCustom>
      }>
      {reminded ? (
        <MenuItem onPress={undo} textStyle={menuText}>
          <Icon style={theme.colorSecondaryText} name="repeat" size={15} />
          {'  ' + i18n.t('undoRemind')}
        </MenuItem>
      ) : (
        <>
          <MenuItem onPress={remind} textStyle={menuText}>
            <Icon style={theme.colorSecondaryText} name="repeat" size={15} />
            {'  ' + i18n.t('capture.remind')}
          </MenuItem>
          <MenuItem onPress={quote} textStyle={menuText}>
            <Icon style={theme.colorSecondaryText} name="edit" size={15} />
            {'  ' + i18n.t('quote')}
          </MenuItem>
        </>
      )}
    </Menu>
  );
}

const menuText = ThemedStyles.combine('colorSecondaryText', 'fontL');
