//@ts-nocheck
import React, { useCallback, useState } from 'react';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import { Text } from 'react-native';
import Button from '../common/components/Button';
import { useNavigation } from '@react-navigation/native';

export default function({appeal}) {
  const CS = ThemedStyles.style;
  const navigation = useNavigation();

  const navToAppealScreen = useCallback(() => {
    navigation.push('AppealScreen', {appeal});
  }, [navigation, appeal]);

  const navToActivity = useCallback(() => {
    const entity = appeal.report.entity;
    if (entity && entity.type != 'comment') {
      navigation.push('Activity', {appeal});
    } else if (entity && entity.type == 'comment') {
      switch (entity.entityObj.type ) {
        case 'activity':
          navigation.push('Activity', {
            entity: entity.entityObj, 
            hydrate: true, 
            focusedUrn: entity.params.focusedCommentUrn 
          });
          break;
        case 'object':
          switch(entity.entityObj.subtype) {
            case 'blog':
              navigation.push('BlogView', {
                blog: entity.entityObj,
                hydrate: true,
                focusedUrn: entity.params.focusedCommentUrn
              });
              break;
            case 'image':
            case 'video':
              navigation.push('Activity', {
                entity: entity.entityObj,
                hydrate: true,
                focusedUrn: entity.params.focusedCommentUrn 
              });
              break;
          }
          break;
        case 'group':
          navigation.push('GroupView', {
            guid: entity.entityObj.guid,
            tab: 'conversation',
            focusedUrn: entity.params.focusedCommentUrn 
          });
          break;
      }
    }
  }, [navigation, appeal]);

  const date = new Date(appeal.time_created * 1000);

  const entityType = appeal.report.entity.type == 'comment' 
    ? i18n.t('settings.reportedContent.entityComment')
    : i18n.t('settings.reportedContent.entityPost'); 

  const action = (
    <Text style={CS.bold}>
      {i18n.t(reportService.getAction(appeal.report))}
    </Text>
  );

  const reason = (
    <Text style={CS.bold}>
      {i18n.t(reportService.getReasonString(appeal.report))}
    </Text>
  );

  const actionTaken = <Text style={CS.bold}>{i18n.t('actionTaken')}</Text>;

  const actionMessage = i18n.to('notification.boostAccepted',
    {entityType}, {
    ...{actionTaken},
    ...{action},
    ...{reason},
  });

  // Button to nav to appeal screen
  const appealNote = (<Button 
    onPress={navToAppealScreen}
    text={
      !appeal.note 
        ? i18n.t('settings.reportedContent.appeal')
        : i18n.t('settings.reportedContent.appealNote')
    }
  />);

  // Button to nav to reported content
  const seeReportedContent = !appeal.report.entity
    ? (<Text>{i18n.t('settings.reportedContent.postNotFound')}</Text>)
    : (<Button 
        onPress={navToActivity} 
        text={i18n.t('settings.reportedContent.seeReportedContent')}
      />)

  return (
    <View style={CS.flexContainer}>
      <View>
        <Text style={CS.bold}>{date.toLocaleString()}</Text>
        <Text>{actionMessage}</Text>
      </View>
      <View>
        {appealNote}
      </View>
      <View>
        {seeReportedContent}
      </View>
    </View>
  );
}