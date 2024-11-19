import React from 'react';
import { render } from '@testing-library/react-native';
import sp from '~/services/serviceProvider';
import DownloadedAudioScreen from './DownloadedAudioScreen';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('audioPlayer');

describe('DownloadedAudioScreen', () => {
  it('renders without crashing', () => {
    const comp = render(<DownloadedAudioScreen />);
    expect(comp).toBeTruthy();
  });
});
