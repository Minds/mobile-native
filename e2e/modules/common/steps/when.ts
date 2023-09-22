import { When } from '@cucumber/cucumber';
import { selectElement } from '../../../helpers/Utils';

// common "When" steps
When(/I tap on (.+)/, async (text: string) => {
  const el = await selectElement('text', text, true);
  await el.click();
});
