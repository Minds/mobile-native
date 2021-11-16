/* eslint-env detox/detox, jest */
import { waitForAndTap } from '../helpers/waitFor';
export const capturePoster = async () => {
  await waitForAndTap(by.id('CaptureTouchableButton'));
};

export const deletePost = async () => {
  await waitForAndTap(by.id('ActivityMoreButton'));
  await waitForAndTap(by.id('deleteOption'));
  await waitForAndTap(by.text('Ok'));
};
