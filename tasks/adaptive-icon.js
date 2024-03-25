const sharp = require('sharp');

async function addAdaptiveIcon(
  imagePath = './assets/images/icon.png',
  outputPath = './assets/images/icon_adaptive.png',
  paddingRatio = 0.15,
) {
  try {
    // Load the image
    const image = sharp(imagePath);

    // Get image metadata to access dimensions
    const metadata = await image.metadata();

    // Calculate padding
    const padding = Math.round(metadata.width * paddingRatio);

    // Extract the color of the top-left pixel for the background
    const topLeftPixel = await image
      .extract({ width: 1, height: 1, left: 0, top: 0 })
      .raw()
      .toBuffer();

    // Convert the pixel data to rgba format for the background color
    const backgroundColor = `rgb(${topLeftPixel[0]}, ${topLeftPixel[1]}, ${topLeftPixel[2]})`;

    // Resize the image with padding
    const imageBuff = await sharp(imagePath)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: backgroundColor,
      })
      .toBuffer();

    // can't extend and resize in one step
    sharp(imageBuff).resize(1024, null).toFile(outputPath); // Save the output to a new file
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

module.exports = { addAdaptiveIcon };
