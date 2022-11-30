import React, { useEffect, useState } from 'react';
import codePush, { LocalPackage, RemotePackage } from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import { B2, Button, Column, H3 } from '~/common/ui';
import { CODE_PUSH_PROD_KEY, CODE_PUSH_STAGING_KEY } from '~/config/Config';
import { Version } from '~/config/Version';
import ThemedStyles from '~/styles/ThemedStyles';
import MenuItemSelect from '../../common/components/menus/MenuItemSelect';

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

  return (
    <>
      <H3 left="L" top="L">
        CodePush
      </H3>

      <Column horizontal="L" vertical="M">
        {metadata ? (
          <>
            <B2 font="bold">Current CodePush Version</B2>
            <B2>App version: {metadata.appVersion}</B2>
            <B2>Label: {metadata.label}</B2>
            {!!metadata.description && (
              <B2>Description: {metadata.description}</B2>
            )}
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

const useCodePush = () => {
  const [status, setStatus] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState<RemotePackage | null>(
    null,
  );
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [metadata, setMetadata] = useState<LocalPackage | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);

  const handleVersionMismatch = (remotePackage: RemotePackage) => {
    setStatus(
      `Latest update is incompatible with your app version: Current: ${Version.VERSION} Update: ${remotePackage.appVersion}`,
    );
  };

  const sync = (deploymentKey?: string) => {
    codePush
      .sync(
        deploymentKey
          ? {
              deploymentKey,
              installMode: codePush.InstallMode.IMMEDIATE,
            }
          : undefined,
        _status => {
          switch (_status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              setStatus('Checking for update...');
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              setStatus('Downloading package...');
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              setStatus('Installing update...');
              break;
            case codePush.SyncStatus.SYNC_IN_PROGRESS:
              setStatus('Sync in progress...');
              break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
              setStatus('Something went wrong');
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              setStatus('Update ignored');
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              setStatus('Update installed');
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              setStatus('Up-to-date!');
              break;
            default:
              setStatus(String(_status));
              break;
          }
        },
        ({ receivedBytes, totalBytes }) => {
          setDownloadProgress(receivedBytes / totalBytes);
        },
        handleVersionMismatch,
      )
      .catch(() => {
        setStatus('Something went wrong');
      });
  };

  useEffect(() => {
    setMetadataLoading(true);
    codePush
      .getUpdateMetadata()
      .then(data => {
        if (data) {
          setMetadata(data);
          codePush
            .checkForUpdate(data?.deploymentKey, handleVersionMismatch)
            .then(update => {
              if (update) {
                setUpdateAvailable(update);
              }
            });
        }
      })
      .finally(() => {
        setMetadataLoading(false);
      });
  }, []);

  return {
    status,
    metadata,
    error: status === 'Something went wrong',
    downloadProgress,
    sync,
    updateAvailable,
    metadataLoading,
  };
};
