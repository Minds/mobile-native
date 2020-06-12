export const TIME = 10000;

export const waitForElement = async (e, visible = true) => {
  if (visible) {
    await waitFor(element(e)).toBeVisible().withTimeout(TIME);
  } else {
    await waitFor(element(e)).toBeNotVisible().withTimeout(TIME);
  }
}

export const tapElement = async (e) => {
  await element(e).tap();
}

export const typeText = async (e, text, replaceText = false) => {
  if (!replaceText) {
    await element(e).typeText(text);
  } else {
    await element(e).replaceText(text);
  }
}

export const waitForAndTap = async (e) => {
  await waitForElement(e);
  await tapElement(e);
}

export const waitForAndType = async (e, text, replaceText = false) => {
  await waitForElement(e);
  await typeText(e, text, replaceText);
  await device.pressBack();
  try {
    await waitForElement(by.text(text));
  } catch (ex) {
    await waitForElement(e);
    await typeText(e, text, replaceText);
    await device.pressBack();
  };
}

/*
  - problems with the emulator, it was frezzing silently with out any errors, i found out later that for some reason i lost the state that i had saved and Hyper-V enabled for local stack
  - not working until i noticed that we never merged in the detox fixes branch a couple of month ago
  - 
*/