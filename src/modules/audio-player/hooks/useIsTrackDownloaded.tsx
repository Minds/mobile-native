import { Track } from 'react-native-track-player';
import useGetDownloadedList from './useGetDownloadedList';

/**
 * Hook to determine if a track is downloaded
 */
export default function useIsTrackDownloaded(track: Track) {
  const { list } = useGetDownloadedList();

  return list.hasOwnProperty(track.id);
}
