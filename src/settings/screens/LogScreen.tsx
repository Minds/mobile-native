import React from 'react';
import { B1, Row, Screen, ScreenHeader, ScreenSection } from '~/common/ui';
import logService from '~/common/services/log.service';
import ThemedStyles from '~/styles/ThemedStyles';
import Clipboard from '@react-native-clipboard/clipboard';
import { showNotification } from 'AppMessages';

export default function LogScreen() {
  try {
    throw new Error('boom');
  } catch (error) {
    logService.exception(error);
  }
  return (
    <Screen safe scroll>
      <ScreenHeader
        title="Log"
        extra={
          <B1
            onPress={() => {
              Clipboard.setString(logService.data?.map(getText).join('\n'));
              showNotification('Log saved to the clipboard');
            }}>
            Copy
          </B1>
        }
      />
      <ScreenSection>
        {logService.data?.map(d => {
          return (
            <Row
              containerStyle={
                d.type === 'info'
                  ? undefined
                  : ThemedStyles.style.bgDangerBackground
              }>
              <B1>{getText(d)}</B1>
            </Row>
          );
        })}
      </ScreenSection>
    </Screen>
  );
}

function getText(data) {
  return data.args
    ? data.args
        .map(item => {
          if (
            item instanceof String ||
            typeof item === 'string' ||
            typeof item === 'number'
          ) {
            return item;
          }
          if (item instanceof Error) {
            return item.stack;
          }
          if (item instanceof Object && item.toString) {
            return item.toString();
          }
        })
        .join(', ')
    : '-';
}
