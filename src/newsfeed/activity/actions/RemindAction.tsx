import React, { useCallback, useRef } from 'react';

import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { FLAG_REMIND } from '../../../common/Permissions';
import { useRoute, useNavigation } from '@react-navigation/native';
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
import {
  BottomSheet,
  BottomSheetButton,
  MenuItem,
} from '../../../common/components/bottom-sheet';
import PressableScale from '../../../common/components/PressableScale';

// prevent double tap in touchable
const PressableCustom = withPreventDoubleTap(PressableScale);

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  hideCount?: boolean;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default function ({ entity, size = 19, hideCount }: PropsTypes) {
  // Do not render BottomSheet unless it is necessary
  const [shown, setShown] = React.useState(false);

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
  const ref = useRef<any>(null);

  const showDropdown = useCallback(() => {
    if (!shown) {
      setShown(true);
      return;
    }
    if (ref.current) {
      ref.current.present();
    }
  }, [shown]);

  const close = useCallback(() => {
    if (ref.current) {
      ref.current.dismiss();
    }
  }, []);

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
      ref.current.dismiss();
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
      ref.current.dismiss();
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
    <>
      <PressableCustom
        style={actionsContainerStyle}
        onPress={showDropdown}
        testID="Remind activity button">
        <Icon style={buttonIconStyle} name="repeat" size={size} />
        {!hideCount && <Counter count={entity.reminds} />}
      </PressableCustom>
      {shown && (
        <BottomSheet ref={ref} autoShow>
          {reminded ? (
            <MenuItem
              onPress={undo}
              title={i18n.t('undoRemind')}
              iconName="undo"
              iconType="material"
            />
          ) : (
            <>
              <MenuItem
                onPress={remind}
                title={i18n.t('capture.remind')}
                iconName="repeat"
                iconType="material"
              />
              <MenuItem
                onPress={quote}
                title={i18n.t('quote')}
                iconName="edit"
                iconType="material"
              />
            </>
          )}
          <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
        </BottomSheet>
      )}
    </>
  );
}
