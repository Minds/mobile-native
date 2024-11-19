import { useWindowDimensions, View } from 'react-native';
import GlobalAudioPlayer from './GlobalAudioPlayer';
import sp from '~/services/serviceProvider';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useEffect, useRef, useState } from 'react';
import TrackPlayer, { Track } from 'react-native-track-player';
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from '@gorhom/bottom-sheet';
import { AudioQueueItem } from './AudioQueueItem';
import useGetDownloadedList from '../hooks/useGetDownloadedList';
import { IS_IOS } from '../../../config/Config';

export type FullscreenAudioPlayerProps = {
  bottomSheetRef: BottomSheetMethods;
};

export const FullscreenAudioPlayer = (props: FullscreenAudioPlayerProps) => {
  const [queue, setQueue] = useState<Track[]>();
  const { list: downloadedList } = useGetDownloadedList();

  const listRef = useRef<BottomSheetFlatListMethods>(null);

  // On first call build the queue, or when the downloaded list is updated
  useEffect(() => {
    buildQueue();
  }, [downloadedList]);

  const buildQueue = async () => {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);

    if (queue.length === 0) {
      props.bottomSheetRef.close();
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

  const { height } = useWindowDimensions();

  return (
    <>
      <View style={[sp.styles.style.padding4x]}>
        <GlobalAudioPlayer fullscreen />
      </View>
      <BottomSheetFlatList
        ref={listRef}
        data={queue}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={[
          IS_IOS ? sp.styles.style.paddingBottom6x : undefined,
          { maxHeight: height * 0.8 - 100 },
        ]}
      />
    </>
  );
};
