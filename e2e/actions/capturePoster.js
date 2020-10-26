import login from "./login";
import { waitForElement, tapElement, waitForAndTap } from "../helpers/waitFor";

export const capturePoster = async () => {
  await waitForElement(by.id('NewsfeedScreen'));
  await waitForAndTap(by.id('CaptureTabButton'));
  //await waitForElement(by.id('CaptureTextButton'));
  //await waitForAndTap(by.id('CaptureTextButton'));
}

export const deletePost = async () => {
  await waitForAndTap(by.id('ActivityMoreButton'));
  await waitForAndTap(by.id('deleteOption'));
  await waitForAndTap(by.text('Ok'));
  await waitForAndTap(by.text('Ok'));
}
