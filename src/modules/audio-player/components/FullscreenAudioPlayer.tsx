import { View } from 'react-native';
import GlobalAudioPlayer from './GlobalAudioPlayer';
import sp from '~/services/serviceProvider';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useEffect, useState } from 'react';
import TrackPlayer, { Track } from 'react-native-track-player';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AudioQueueItem } from './AudioQueueItem';
import useGetDownloadedList from '../hooks/useGetDownloadedList';
import { IS_IOS } from '../../../config/Config';

export type FullscreenAudioPlayerProps = {
  bottomSheetRef?: BottomSheetMethods;
};

export const FullscreenAudioPlayer = (props: FullscreenAudioPlayerProps) => {
  const [queue, setQueue] = useState<Track[]>();
  const { list: downloadedList } = useGetDownloadedList();

  // On first call build the queue, or when the downloaded list is updated
  useEffect(() => {
    buildQueue();
  }, [downloadedList]);

  const buildQueue = async () => {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);

    if (queue.length === 0) {
      props.bottomSheetRef?.close();
    }
  };

  const renderItem = React.useCallback(
    (row: { item: Track; index: number }): React.ReactElement => {
      return (
        <AudioQueueItem
          track={row.item}
          trackIndex={row.index}
          onRemoveTrack={() => buildQueue()} // Rebuild the queue on track being removed
        />
      );
    },
    [queue, downloadedList],
  );

  return (
    <View>
      <View style={[sp.styles.style.padding4x]}>
        <GlobalAudioPlayer fullscreen />
      </View>
      <BottomSheetFlatList
        data={queue}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={[
          IS_IOS ? sp.styles.style.paddingBottom6x : undefined,
          { maxHeight: '50%' },
        ]}
      />
    </View>
  );
};
