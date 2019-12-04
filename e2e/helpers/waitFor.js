export const TIME = 10000;

export const waitForElement = async (e) => {
  await waitFor(element(e)).toBeVisible().withTimeout(TIME);
}

export const tapElement = async (e) => {
  await element(e).tap();
}

export const typeText = async (e, text) => {
  await element(e).typeText(text);
}

export const waitForAndTap = async (e) => {
  await waitForElement(e);
  await tapElement(e);
}

export const waitForAndType = async (e, text) => {
  await waitForElement(e);
  await typeText(e, text);
}