declare const sharp: any
declare function addAdaptiveIcon(
  imagePath?: string,
  outputPath?: string,
  paddingRatio?: number
): Promise<void>
declare function generateNotificationIcon(
  imagePath?: string,
  outputPath?: string
): Promise<void>
