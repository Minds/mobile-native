import { render } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import { useIsAudioPlayerActive } from '../hooks/useIsAudioPlayerActive';

jest.mock('~/services/serviceProvider');
sp.mockService('styles');

jest.mock('./GlobalAudioPlayer');
jest.mock('../hooks/useIsAudioPlayerActive');

describe('FloatingAudioPlayer', () => {
  it('should render component', () => {
    const comp = render(<FloatingAudioPlayer />);
    expect(comp).toBeTruthy();
  });

  it('should be hidden if player not active', () => {
    const comp = render(<FloatingAudioPlayer />);
    expect(comp.queryByTestId('floating-audio-player')).toBe(null);
  });

  it('should be visible if player is active', () => {
    (useIsAudioPlayerActive as jest.Mock).mockReturnValue(true);

    const comp = render(<FloatingAudioPlayer />);
    expect(comp.queryByTestId('floating-audio-player')).toBeTruthy();
  });
});
