import React, { useEffect, useReducer } from 'react';
import { LocalPackage, RemotePackage } from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import MenuItemSelect from '~/common/components/menus/MenuItemSelect';
import { B2, B3, Button, Column, H3 } from '~/common/ui';
import {
  CODE_PUSH_PROD_KEY,
  CODE_PUSH_RC_KEY,
  CODE_PUSH_STAGING_KEY,
} from '~/config/Config';
import { Version } from '~/config/Version';
import ThemedStyles from '~/styles/ThemedStyles';
import { codePush, logMessage } from '../';

const CodePushDebugger = () => {
  const {
    sync,
    metadata,
    status,
    error,
    downloadProgress,
    updateAvailable,
    metadataLoading,
  } = useCodePush();

  const {
    appVersion,
    label,
    description,
    failedInstall,
    isFirstRun,
    isPending,
  } = metadata ?? {};
  return (
    <>
      <H3 left="L" top="L">
        CodePush
      </H3>

      <Column horizontal="L" vertical="M">
        {metadata ? (
          <>
            <B2 font="bold">
              App Version: {Version.VERSION}
              <B3> ({appVersion})</B3>
            </B2>
            <B2>CodePush Version: {label}</B2>
            {!!description && <B2>Description: {description}</B2>}
            {failedInstall ? (
              <B2>{`failedInstall: ${failedInstall} isFirstRun: ${isFirstRun} isPending: ${isPending}`}</B2>
            ) : undefined}
          </>
        ) : metadataLoading ? (
          <B2>Loading metadata...</B2>
        ) : (
          <B2>No CodePush applied</B2>
        )}
      </Column>

      <MenuItemSelect
        selectTitle={'Select Deployment'}
        title={'Deployment'}
        data={[
          {
            label: 'Staging',
            key: CODE_PUSH_STAGING_KEY,
          },
          {
            label: 'Release Candidate',
            key: CODE_PUSH_RC_KEY,
          },
          {
            label: 'Production',
            key: CODE_PUSH_PROD_KEY,
          },
        ]}
        valueExtractor={item => item?.label}
        keyExtractor={item => item?.key}
        onSelected={(deployment: string) => sync(deployment)}
        selected={metadata?.deploymentKey}
        backdropOpacity={0.99}
      />

      {!!updateAvailable && (
        <Column horizontal="L" vertical="M">
          <B2 font="bold">Update available!</B2>
          <B2>App version: {updateAvailable.appVersion}</B2>
          <B2>Label: {updateAvailable.label}</B2>
          {!!updateAvailable.description && (
            <B2>Description: {updateAvailable.description}</B2>
          )}
          <Button
            top="M"
            type="action"
            onPress={() => sync(updateAvailable.deploymentKey)}>
            Update
          </Button>
        </Column>
      )}

      <Column vertical="M">
        {!!downloadProgress && (
          <Progress.Bar
            progress={downloadProgress}
            color={ThemedStyles.getColor('Link')}
            width={null}
            useNativeDriver={true}
            style={[
              ThemedStyles.style.marginHorizontal4x,
              ThemedStyles.style.marginBottom,
            ]}
          />
        )}

        {!!status && (
          <B2 left="L" color={error ? 'danger' : undefined}>
            {status}
          </B2>
        )}
      </Column>
    </>
  );
};

export default CodePushDebugger;

type EventType = Partial<{
  status: String;
  updateAvailable: RemotePackage | null;
  downloadProgress: number;
  metadata: LocalPackage | null;
  metadataLoading: boolean;
}>;
type EventReducer = (prev: EventType, next: EventType) => EventType;

const useCodePush = () => {
  const [event, updateEvent] = useReducer<EventReducer>(
    (prev, next) => ({ ...prev, ...next }),
    {
      status: '',
      updateAvailable: null,
      downloadProgress: 0,
      metadata: null,
      metadataLoading: false,
    },
  );
  const { status } = event;

  useEffect(() => {
    if (status !== '') {
      logMessage(status, 'CodePush status:');
    }
  }, [status]);

  const handleVersionMismatch = (remotePackage: RemotePackage) => {
    updateEvent({
      status: `Latest update is incompatible with your app version: Current: ${Version.VERSION} Update: ${remotePackage.appVersion}`,
    });
  };

  const sync = (deploymentKey?: string) => {
    codePush.clearUpdates();
    codePush
      .sync(
        deploymentKey
          ? {
              deploymentKey,
              installMode: codePush.InstallMode.IMMEDIATE,
            }
          : undefined,
        _status => {
          updateEvent({ status: statusMapping[_status] ?? `${_status}` });
        },
        ({ receivedBytes, totalBytes }) => {
          updateEvent({ downloadProgress: receivedBytes / totalBytes });
        },
        handleVersionMismatch,
      )
      .catch(() => updateEvent({ status: 'Something went wrong' }));
  };

  useEffect(() => {
    updateEvent({ metadataLoading: true });
    codePush
      .getUpdateMetadata()
      .then(data => {
        logMessage(data, 'CodePush UpdateMetadata:');
        if (data) {
          updateEvent({ metadata: data });
          codePush
            .checkForUpdate(data?.deploymentKey, handleVersionMismatch)
            .then(update =>
              update ? updateEvent({ updateAvailable: update }) : undefined,
            );
        }
      })
      .finally(() => updateEvent({ metadataLoading: false }));
  }, []);
  return {
    ...event,
    error: status === 'Something went wrong',
    sync,
  };
};

const statusMapping = {
  [codePush.SyncStatus.CHECKING_FOR_UPDATE]: 'Checking for update...',
  [codePush.SyncStatus.DOWNLOADING_PACKAGE]: 'Downloading package...',
  [codePush.SyncStatus.INSTALLING_UPDATE]: 'Installing update...',
  [codePush.SyncStatus.SYNC_IN_PROGRESS]: 'Sync in progress...',
  [codePush.SyncStatus.UNKNOWN_ERROR]: 'Something went wrong',
  [codePush.SyncStatus.UPDATE_IGNORED]: 'Update ignored',
  [codePush.SyncStatus.UPDATE_INSTALLED]: 'Update installed',
  [codePush.SyncStatus.UP_TO_DATE]: 'Up-to-date!',
};
