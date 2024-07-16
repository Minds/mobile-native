import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Icon, Screen } from '~/common/ui';
import { showNotification } from '../../AppMessages';
import TextInput from '../common/components/TextInput';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import MenuItem from '../common/components/menus/MenuItem';
import ActivityModel from '~/newsfeed/ActivityModel';
import { ChatMessage } from '~/modules/chat/types';
import {
  CreateNewReportMutationVariables,
  IllegalSubReasonEnum,
  NsfwSubReasonEnum,
  ReportReasonEnum,
  SecuritySubReasonEnum,
  useCreateNewReportMutation,
} from '~/graphql/api';
import { IS_TENANT } from '~/config/Config';
import UserModel from '~/channel/UserModel';
import sp from '~/services/serviceProvider';

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
  const theme = sp.styles.style;
  const i18n = sp.i18n;
  const [reasonsList, setReasons] = useState(reason?.reasons || []);

  const [note, setNote] = useState('');

  const reportMutation = useCreateNewReportMutation();

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
                    ? () => sp.resolve('openURL').open(externalLink)
                    : () =>
                        reasonItem.reasons || reasonItem.hasMore
                          ? navigation.push('Report', {
                              title: reasonItem.label,
                              reason: reasonItem,
                              requireNote: reasonItem.value === 11,
                              entity,
                            })
                          : confirmAndSubmit({
                              callback: async () =>
                                IS_TENANT
                                  ? callMutation({
                                      mutation: reportMutation,
                                      entity,
                                      reason: reason || reasonItem,
                                      subreason: reason
                                        ? reasonItem
                                        : undefined,
                                    })
                                  : submit({
                                      entity,
                                      reason: reason || reasonItem,
                                      subreason: reason ? reasonItem : null,
                                      note,
                                    }),
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
                  callback: async () =>
                    IS_TENANT
                      ? callMutation({
                          mutation: reportMutation,
                          entity,
                          reason,
                          subreason: undefined,
                        })
                      : submit({
                          entity,
                          reason,
                          note,
                        }),
                  reason,
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
    return 'https://www.minds.com/p/dmca';
  }

  return;
}

function getReasons() {
  const settings = sp.config.getSettings();

  settings.report_reasons.forEach(r => {
    //@ts-ignore we ignore the type validation because it depends on the server response
    r.label = i18n.t(`reports.reasons.${r.value}.label`, {
      defaultValue: r.label,
    });
    if (r.reasons && r.reasons.length) {
      r.reasons.forEach(r2 => {
        r2.label = sp.i18n.t(
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
  callback,
  reason,
  requireNote,
  note,
  subreason,
  navigation,
}: {
  callback: () => void | Promise<void>;
  reason: Reason;
  requireNote: boolean;
  subreason?: Reason;
  note: string;
  navigation: any;
}) {
  const i18n = sp.i18n;
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
        onPress: async () => {
          await callback();

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
  entity: ActivityModel | ChatMessage;
  reason: Reason;
  subreason?: Reason;
  note: string;
}) {
  if (!reason) {
    return;
  }

  try {
    const guid =
      entity instanceof ActivityModel || entity instanceof UserModel
        ? entity.guid
        : entity.node.guid;
    const urn =
      entity instanceof ActivityModel || entity instanceof UserModel
        ? entity.urn
        : entity.node.id;

    console.log(
      'calling Report',
      guid,
      reason.value,
      subreason?.value || null,
      note,
    );
    await sp
      .resolve('report')
      .report(guid, urn, reason.value, subreason?.value || null, note);

    showNotification(sp.i18n.t('reports.weHaveGotYourReport'));
  } catch (e) {
    sp.log.exception('[ReportScreen]', e);
    Alert.alert(sp.i18n.t('error'), sp.i18n.t('reports.errorSubmitting'));
  }
}

/**
 * Submit the report
 */
async function callMutation({
  mutation,
  entity,
  reason,
  subreason,
}: {
  mutation: ReturnType<typeof useCreateNewReportMutation>;
  entity: ActivityModel | ChatMessage;
  reason: Reason;
  subreason?: Reason;
}) {
  if (!reason) {
    return;
  }

  try {
    const entityUrn =
      entity instanceof ActivityModel ? entity.urn : entity.node.id;

    const reasons = mapLegacyReasonToEnums(
      reason.value,
      subreason?.value || null,
    );

    const data: CreateNewReportMutationVariables = {
      entityUrn,
      ...reasons,
    };

    await mutation.mutate(data);

    showNotification(sp.i18n.t('reports.weHaveGotYourReport'));
  } catch (e) {
    Alert.alert(sp.i18n.t('error'), sp.i18n.t('reports.errorSubmitting'));
  }
}

function mapLegacyReasonToEnums(
  reasonCode: number,
  subReasonCode: number | null = null,
) {
  let reasonString: string = `${reasonCode}`;
  if (subReasonCode) {
    reasonString += `.${subReasonCode}`;
  }

  switch (reasonString) {
    case '1':
      return {
        reason: ReportReasonEnum.Illegal,
      };
    case '1.1':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Terrorism,
      };
    case '1.2':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.MinorsSexualization,
      };
    case '1.3':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      };
    case '1.4':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Fraud,
      };
    case '1.5':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.RevengePorn,
      };
    case '1.6':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Trafficking,
      };
    case '1.7':
      return {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.AnimalAbuse,
      };
    case '2':
      return {
        reason: ReportReasonEnum.Nsfw,
      };
    case '2.1':
      return {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.Nudity,
      };
    case '2.2':
      return {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.Pornography,
      };
    case '2.3':
      return {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.Profanity,
      };
    case '2.4':
      return {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.ViolenceGore,
      };
    case '2.5':
      return {
        reason: ReportReasonEnum.Nsfw,
        nsfwSubReason: NsfwSubReasonEnum.RaceReligionGender,
      };
    case '3':
      return {
        reason: ReportReasonEnum.IncitementToViolence,
      };
    case '4':
      return {
        reason: ReportReasonEnum.Harassment,
      };
    case '5':
      return {
        reason: ReportReasonEnum.PersonalConfidentialInformation,
      };
    case '7':
      return {
        reason: ReportReasonEnum.Impersonation,
      };
    case '8':
      return {
        reason: ReportReasonEnum.Spam,
      };
    case '10':
      return {
        reason: ReportReasonEnum.IntellectualPropertyViolation,
      };
    case '13':
      return {
        reason: ReportReasonEnum.Malware,
      };
    case '16':
      return {
        reason: ReportReasonEnum.InauthenticEngagement,
      };
    case '17':
      return {
        reason: ReportReasonEnum.Security,
      };
    case '17.1':
      return {
        reason: ReportReasonEnum.Security,
        securitySubReason: SecuritySubReasonEnum.HackedAccount,
      };
    case '18':
      return {
        reason: ReportReasonEnum.ViolatesPremiumContentPolicy,
      };
    case '11':
    default:
      return {
        reason: ReportReasonEnum.AnotherReason,
      };
  }
}

export default withErrorBoundaryScreen(ReportScreen, 'ReportScreen');
