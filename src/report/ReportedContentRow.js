//@ts-nocheck
import React, { useCallback } from 'react';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../common/components/Button';
import reportService from './ReportService';
import MText from '../common/components/MText';

export default function ({ appeal }) {
  const CS = ThemedStyles.style;
  const navigation = useNavigation();

  const navToAppealScreen = useCallback(() => {
    navigation.push('AppealScreen', { appeal });
  }, [navigation, appeal]);

  const navToActivity = useCallback(() => {
    const entity = appeal.report.entity;
    if (entity && entity.type != 'comment') {
      navigation.push('Activity', { appeal });
    } else if (entity && entity.type == 'comment') {
      switch (entity.entityObj.type) {
        case 'activity':
          navigation.push('Activity', {
            entity: entity.entityObj,
            hydrate: true,
            focusedCommentUrn: entity.params.focusedCommentUrn,
          });
          break;
        case 'object':
          switch (entity.entityObj.subtype) {
            case 'blog':
              navigation.push('BlogView', {
                blog: entity.entityObj,
                hydrate: true,
                focusedCommentUrn: entity.params.focusedCommentUrn,
              });
              break;
            case 'image':
            case 'video':
              navigation.push('Activity', {
                entity: entity.entityObj,
                hydrate: true,
                focusedCommentUrn: entity.params.focusedCommentUrn,
              });
              break;
          }
          break;
        case 'group':
          navigation.push('GroupView', {
            guid: entity.entityObj.guid,
            tab: 'conversation',
            focusedCommentUrn: entity.params.focusedCommentUrn,
          });
          break;
      }
    }
  }, [navigation, appeal]);

  const date = new Date(appeal.time_created * 1000);

  const entityType =
    appeal.report.entity.type === 'comment'
      ? i18n.t('settings.reportedContent.entityComment')
      : i18n.t('settings.reportedContent.entityPost');

  const action = (
    <MText style={CS.bold}>
      {i18n.t(reportService.getAction(appeal.report))}
    </MText>
  );

  const reason = (
    <MText style={CS.bold}>
      {i18n.t(reportService.getReasonString(appeal.report))}
    </MText>
  );

  const actionTaken = <MText style={CS.bold}>{i18n.t('actionTaken')}</MText>;

  const actionMessage = i18n.to(
    'notification.boostAccepted',
    { entityType },
    {
      ...{ actionTaken },
      ...{ action },
      ...{ reason },
    },
  );

  // Button to nav to appeal screen
  const appealNote = (
    <Button
      onPress={navToAppealScreen}
      text={
        !appeal.note
          ? i18n.t('settings.reportedContent.appeal')
          : i18n.t('settings.reportedContent.appealNote')
      }
    />
  );

  // Button to nav to reported content
  const seeReportedContent = !appeal.report.entity ? (
    <MText>{i18n.t('settings.reportedContent.postNotFound')}</MText>
  ) : (
    <Button
      onPress={navToActivity}
      text={i18n.t('settings.reportedContent.seeReportedContent')}
    />
  );

  return (
    <View style={CS.flexContainer}>
      <View>
        <MText style={CS.bold}>{date.toLocaleString()}</MText>
        <MText>{actionMessage}</MText>
      </View>
      <View>{appealNote}</View>
      <View>{seeReportedContent}</View>
    </View>
  );
}
