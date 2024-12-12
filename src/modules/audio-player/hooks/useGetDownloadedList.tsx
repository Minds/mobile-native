import { useEffect, useState } from 'react';
import { reaction } from 'mobx';
import sp from '~/services/serviceProvider';

export default function useGetDownloadedList() {
  const service = sp.resolve('audioPlayer');
  const [list, setList] = useState(() => service.downloadedTracks);

  useEffect(
    () =>
      reaction(
        () => service.downloadedTracks,
        list => setList(list),
      ),
    [],
  );

  return { list, count: list ? Object.values(list).length : 0 };
}
