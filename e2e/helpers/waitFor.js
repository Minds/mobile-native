export const TIME = 10000;

export const waitForElement = async (e, visible = true) => {
  if (visible) {
    console.log(`waitFor element ${e} to be visible`);
    await waitFor(element(e)).toBeVisible().withTimeout(TIME);
    console.log('found');
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
}