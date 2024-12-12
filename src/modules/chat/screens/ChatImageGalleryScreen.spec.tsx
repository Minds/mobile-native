import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import ChatImageGalleryScreen from './ChatImageGalleryScreen';
import sp from '~/services/serviceProvider';
import Gallery from 'react-native-awesome-gallery';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 20 }),
}));

jest.mock('~/common/components/ErrorBoundaryScreen', () => ({
  withErrorBoundaryScreen: (component: any) => component,
}));

jest.mock('~/common/ui', () => ({
  ModalFullScreen: ({ children, ...props }: any) => (
    <div testID="modal-full-screen" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('~/services/serviceProvider');
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('api');

jest.mock('react-native-awesome-gallery', () => {
  return {
    __esModule: true,
    default: ({ children }: any) => children,
  };
});

const mockNavigation: any = {
  goBack: jest.fn(),
};

const mockRoute: any = {
  params: {
    images: [
      {
        id: '1',
        url: 'test-url-1',
        width: 100,
        height: 100,
      },
    ],
  },
};

describe('ChatImageGalleryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <ChatImageGalleryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    expect(getByTestId('modal-full-screen')).toBeTruthy();
  });

  it('calls navigation.goBack when swipe to close is triggered', () => {
    const { UNSAFE_getByType } = render(
      <ChatImageGalleryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    const gallery = UNSAFE_getByType(Gallery);
    fireEvent(gallery, 'swipeToClose');

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
