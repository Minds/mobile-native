const Camera = () => 'Camera';
Camera.getCameraPermissionStatus = jest.fn(() => Promise.resolve('authorized'));
export { Camera };
