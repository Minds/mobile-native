import React, { useCallback } from 'react';
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
  BottomSheetButton,
  BottomSheetMenuItem,
  pushBottomSheet,
} from '../../../common/components/bottom-sheet';
import EntityCounter from './EntityCounter';
import { storeRatingService } from 'modules/store-rating';
import { useAnalytics } from '~/common/contexts/analytics.context';
import NavigationService from '../../../navigation/NavigationService';

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

  /**
   * Open quote in composer
   */
  const quote = useCallback(() => {
    // check permission and show alert
    if (!entity.can(FLAG_REMIND, true)) {
      return;
    }
    const { key } = route;
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
  }, [analytics, entity, newsfeed.feedStore]);

  const showDropdown = useCallback(() => {
    pushRemindActionSheet({
      reminded,
      onUndo: undo,
      onRemind: remind,
      onQuote: quote,
    });
  }, [quote, remind, reminded, undo]);

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
    </>
  );
}

const pushRemindActionSheet = ({
  reminded,
  onUndo,
  onRemind,
  onQuote,
}: {
  reminded?: boolean;
  onUndo: () => void;
  onRemind: () => void;
  onQuote: () => void;
}) =>
  pushBottomSheet({
    safe: true,
    component: ref => (
      <>
        {reminded ? (
          <BottomSheetMenuItem
            onPress={onUndo}
            title={i18n.t('undoRemind')}
            iconName="undo"
            iconType="material"
          />
        ) : (
          <>
            <BottomSheetMenuItem
              onPress={() => {
                onRemind();
                ref.close();
              }}
              title={i18n.t('capture.remind')}
              iconName="repeat"
              iconType="material"
            />
            <BottomSheetMenuItem
              onPress={() => {
                NavigationService.goBack();
                onQuote();
              }}
              title={i18n.t('quote')}
              iconName="edit"
              iconType="material"
            />
          </>
        )}
        <BottomSheetButton text={i18n.t('cancel')} onPress={ref.close} />
      </>
    ),
  });
