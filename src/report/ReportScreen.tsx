import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import openUrlService from '~/common/services/open-url.service';
import { Button, Icon, Screen } from '~/common/ui';
import { showNotification } from '../../AppMessages';
import TextInput from '../common/components/TextInput';
import i18n from '../common/services/i18n.service';
import mindsService from '../common/services/minds-config.service';
import ThemedStyles from '../styles/ThemedStyles';
import reportService from './ReportService';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import MenuItem from '../common/components/menus/MenuItem';
import type ActivityModel from '~/newsfeed/ActivityModel';

type PropsType = {
  route: any;
  navigation: any;
};

export type Reason = {
  label: string;
  value: number;
  hasMore: boolean;
  reasons?: Reason[];
};
const ReportScreen = ({ route, navigation }: PropsType) => {
  const { entity, requireNote, reason, title } = route.params;
  const theme = ThemedStyles.style;

  const [reasonsList, setReasons] = useState(reason?.reasons || []);

  const [note, setNote] = useState('');

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  });

  useEffect(() => {
    if (!reasonsList.length && !reason) {
      setReasons(getReasons());
    }
  }, [reasonsList.length, reason]);

  return (
    <Screen scroll>
      <View style={theme.flexContainer}>
        {!requireNote &&
          reasonsList?.map((reasonItem, i) => {
            const externalLink = getExternalLinkForReason(reasonItem);
            return (
              <MenuItem
                key={i}
                onPress={
                  externalLink
                    ? () => openUrlService.open(externalLink)
                    : () =>
                        reasonItem.reasons || reasonItem.hasMore
                          ? navigation.push('Report', {
                              title: reasonItem.label,
                              reason: reasonItem,
                              requireNote: reasonItem.value === 11,
                              entity,
                            })
                          : confirmAndSubmit({
                              entity,
                              reason: reason || reasonItem,
                              requireNote,
                              note,
                              subreason: reason ? reasonItem : null,
                              navigation,
                            })
                }
                title={reasonItem.label}
                borderless
                noIcon={!reasonItem.hasMore}
                icon={
                  externalLink && (
                    <Icon name={'external-link'} size="large" color="Link" />
                  )
                }
              />
            );
          })}

        {requireNote && (
          <>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={[
                theme.paddingHorizontal3x,
                theme.margin2x,
                theme.fontL,
                theme.colorPrimaryText,
                theme.bcolorPrimaryBorder,
                theme.border,
                theme.borderRadius5x,
              ]}
              placeholder={i18n.t('reports.explain')}
              returnKeyType="done"
              autoFocus={true}
              verticalAlign="top"
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onChangeText={setNote}
              autoCapitalize={'none'}
            />
            <Button
              align="center"
              onPress={() => {
                confirmAndSubmit({
                  entity,
                  reason: reason,
                  requireNote,
                  note,
                  navigation,
                });
              }}>
              {i18n.t('settings.submit')}
            </Button>
          </>
        )}
      </View>
    </Screen>
  );
};

function getExternalLinkForReason(reason): undefined | string {
  if (reason.value === 10) {
    return 'https://support.minds.com/hc/en-us/requests/new?ticket_form_id=360003221852';
  }

  return;
}

function getReasons() {
  const settings = mindsService.getSettings();

  settings.report_reasons.forEach(r => {
    //@ts-ignore we ignore the type validation because it depends on the server response
    r.label = i18n.t(`reports.reasons.${r.value}.label`, {
      defaultValue: r.label,
    });
    if (r.reasons && r.reasons.length) {
      r.reasons.forEach(r2 => {
        r2.label = i18n.t(
          //@ts-ignore
          `reports.reasons.${r.value}.reasons.${r2.value}.label`,
          { defaultValue: r2.label },
        );
      });
    }
  });
  return settings.report_reasons;
}

function confirmAndSubmit({
  entity,
  reason,
  requireNote,
  note,
  subreason,
  navigation,
}: {
  entity: ActivityModel;
  reason: Reason;
  requireNote: boolean;
  subreason?: Reason;
  note: string;
  navigation: any;
}) {
  if (requireNote && note === '') {
    showNotification(i18n.t('reports.explain'));
    return;
  }

  Alert.alert(
    i18n.t('confirm'),
    `${i18n.t('reports.reportAs')}\n${reason?.label}\n` +
      (subreason ? subreason.label : ''),
    [
      {
        text: i18n.t('no'),
        onPress: () => null, // TODO navigate
      },
      {
        text: i18n.t('yes'),
        onPress: () => {
          submit({ entity, reason, subreason, note });
          if (subreason) {
            navigation.pop(2);
          } else {
            navigation.goBack();
          }
        },
      },
    ],
    { cancelable: false },
  );
}

/**
 * Submit the report
 */
async function submit({
  entity,
  reason,
  subreason,
  note,
}: {
  entity: ActivityModel;
  reason: Reason;
  subreason?: Reason;
  note: string;
}) {
  if (!reason) {
    return;
  }

  try {
    await reportService.report(
      entity.guid,
      reason.value,
      subreason?.value || null,
      note,
    );

    showNotification(i18n.t('reports.weHaveGotYourReport'));
  } catch (e) {
    Alert.alert(i18n.t('error'), i18n.t('reports.errorSubmitting'));
  }
}

export default withErrorBoundaryScreen(ReportScreen, 'ReportScreen');
