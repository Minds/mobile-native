import React, { useCallback, useRef } from 'react';
import { IconButtonNext } from '~ui/icons';
import { FLAG_REMIND } from '../../../common/Permissions';
import { useRoute, useNavigation } from '@react-navigation/native';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import i18n from '../../../common/services/i18n.service';
import createComposeStore from '../../../compose/createComposeStore';
import { showNotification } from '../../../../AppMessages';
import sessionService from '../../../common/services/session.service';
import { actionsContainerStyle } from './styles';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
} from '../../../common/components/bottom-sheet';
import EntityCounter from './EntityCounter';
import { storeRatingService } from 'modules/store-rating';
import { useAnalytics } from '~/common/contexts/analytics.context';

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  hideCount?: boolean;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default function ({ entity, hideCount }: PropsTypes) {
  // Do not render BottomSheet unless it is necessary
  const [shown, setShown] = React.useState(false);

  const reminded =
    entity.remind_users &&
    entity.remind_users.some(
      user => user.guid === sessionService.getUser().guid,
    );

  const disabled = !reminded && !entity.can(FLAG_REMIND);

  const { newsfeed } = useLegacyStores();
  const analytics = useAnalytics();

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
    // We remove it instead of hiding it because it causes some issues in some versions of Android (issue 3543)
    setShown(false);
    navigation.navigate('Compose', {
      isRemind: true,
      entity,
      parentKey: key,
    });
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
        analytics.trackClick('remind');
        storeRatingService.track('remind', true);

        showNotification(i18n.t('postReminded'), 'success');
      })
      .catch(e => {
        console.log(e);
        showNotification(i18n.t('errorMessage'), 'warning');
      });
  }, [entity, newsfeed.feedStore]);

  return (
    <>
      <IconButtonNext
        testID="Remind activity button"
        style={actionsContainerStyle}
        scale
        disabled={disabled}
        name="remind"
        size="small"
        fill
        active={reminded}
        onPress={showDropdown}
        extra={
          !hideCount && entity.reminds ? (
            <EntityCounter entity={entity} countProperty="reminds" />
          ) : null
        }
      />
      {shown && (
        <BottomSheetModal ref={ref} autoShow>
          {reminded ? (
            <BottomSheetMenuItem
              onPress={undo}
              title={i18n.t('undoRemind')}
              iconName="undo"
              iconType="material"
            />
          ) : (
            <>
              <BottomSheetMenuItem
                onPress={remind}
                title={i18n.t('capture.remind')}
                iconName="repeat"
                iconType="material"
              />
              <BottomSheetMenuItem
                onPress={quote}
                title={i18n.t('quote')}
                iconName="edit"
                iconType="material"
              />
            </>
          )}
          <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
        </BottomSheetModal>
      )}
    </>
  );
}
