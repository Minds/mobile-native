import login from "./login";
import { waitForElement, tapElement, waitForAndTap } from "../helpers/waitFor";

export const capturePoster = async () => {
  await waitForElement(by.id('usernameInput'));
  await login(process.env.loginUser, process.env.loginPass);
  await waitForElement(by.id('NewsfeedScreen'));
  await waitForAndTap(by.id('Capture tab button'));
  await waitForAndTap(by.id('CaptureTextButton'));
}

export const deletePost = async () => {
  await waitForAndTap(by.id('ActivityMoreButton'));
  await waitForAndTap(by.id('deleteOption'));
  await waitForAndTap(by.text('Ok'));
  await waitForAndTap(by.text('Ok'));
}
