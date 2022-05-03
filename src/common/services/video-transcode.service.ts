import { FFmpegKit, FFprobeKit, ReturnCode } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

import logService from './log.service';

/**
 * Transcode to mpeg4 and optionally scales a video
 * @returns string with a path to the transcoded video, null when an error happened or false when cancelled
 */
export const transcode = async (
  videoUri: string,
  scaleFullHD?: boolean,
): Promise<string | null | false> => {
  try {
    logService.info('[AttachmentStore] Transcoding', videoUri);
    const safeUrl = RNFS.TemporaryDirectoryPath + '/transcoded.mp4';

    let scale = '';

    if (scaleFullHD) {
      const probeSession = await FFprobeKit.getMediaInformation(videoUri);
      const information = await probeSession.getMediaInformation();
      const properties = await information.getAllProperties();
      const video = properties.streams.find(s => s.codec_type === 'video');
      if (video) {
        let width = video.width;
        let height = video.height;

        const rotationData = video.side_data_list?.find(s => s.rotation);

        // check rotation (we need to invert the scale axis)
        if (rotationData) {
          if (
            rotationData.rotation === 90 ||
            rotationData.rotation === 270 ||
            rotationData.rotation === -90
          ) {
            width = video.height;
            height = video.width;
          }
        }
        scale =
          width > height
            ? "scale='min(1920, iw)':-2"
            : "scale=-2:'min(1920, ih)'";
      }
    }

    const session = await FFmpegKit.execute(
      `-y -i ${videoUri} -vf "${scale}" -crf 30 -preset ultrafast -c:v libx264 -c:a copy ${safeUrl}`,
    );

    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      logService.info('[TranscodeService] Transcoding succeed');
      return `file://${safeUrl}`;
    } else if (ReturnCode.isCancel(returnCode)) {
      logService.info('[TranscodeService] Transcoding canceled');
      return false;
    } else {
      logService.info('[TranscodeService] Transcoding failed');
      return null;
    }
  } catch (err) {
    logService.info('[TranscodeService] Transcoding failed', err);
    return null;
  }
};

export const cancelTranscoding = () => FFmpegKit.cancel();
