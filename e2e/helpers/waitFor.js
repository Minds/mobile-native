const TIME = 10000;

export const waitForElement = async (by, needle) => {
  await waitFor(element(by(needle))).toBeVisible().withTimeout(TIME);
}

export const tapElement = async (by, needle) => {
  await element(by(needle)).tap();
}

export const typeText = async (by, needle, text) => {
  await element(by(needle)).typeText(text);
}

export const waitForAndTap = async (by, needle) => {
  await waitForElement(by, needle);
  await tapElement(by, needle);
}

export const waitForAndType = async (by, needle, text) => {
  await waitForElement(by, needle);
  await typeText(by, needle, text);
}