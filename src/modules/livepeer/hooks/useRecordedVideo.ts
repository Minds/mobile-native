import { useQuery } from '@tanstack/react-query';

export default function useRecordedVideo(
  playbackId: string,
  enabled: boolean = true,
) {
  return useQuery(
    ['recordedVideo', playbackId],
    async () => {
      const response = await fetch(
        `https://minds-player.vercel.app/api/stream?playbackId=${playbackId}`,
      );
      return await response.json();
    },
    { enabled },
  );
}
