import { render } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import AudioTrackComp from './AudioTrackComp';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');
sp.mockService('api');
sp.mockService('settings');

describe('AudioTrackComp', () => {
  it('should render component', () => {
    const comp = render(
      <AudioTrackComp track={{ url: 'fake' }} rightButtons={<></>} />,
    );
    expect(comp).toBeTruthy();
  });
});
