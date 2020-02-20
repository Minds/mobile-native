import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment-timezone';
import i18n from './src/common/services/i18n.service';

require('./node_modules/react-native-gesture-handler/jestSetup.js');

const XMLHttpRequest = {
  open: jest.fn(),
  abort: jest.fn(),
  onerror: jest.fn(),
}
global.XMLHttpRequest = XMLHttpRequest;


configure({ adapter: new Adapter() });

jest.mock('react-native-localize');
// jest.mock('mobx-react', () => require('mobx-react/custom'));

jest.mock('./AppStores');
jest.useFakeTimers();

jest.doMock('moment', () => {
  moment.tz.setDefault('America/Los_Angeles');
  return moment;
});

jest.doMock('moment-timezone', () => {
  moment.tz.setDefault('America/Los_Angeles');
  return moment;
});

i18n.setLocale('en');