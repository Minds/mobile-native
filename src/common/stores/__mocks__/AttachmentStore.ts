import { extendObservable } from 'mobx';

const mock = jest.fn().mockImplementation(() => {
  return extendObservable(
    {
      uploading: false,
      progress: 0,
      deleteUploading: false,
      guid: '',
      license: '',
      attachMedia: jest.fn(),
      delete: jest.fn(),
      setProgress: jest.fn(),
      setUploading: jest.fn(),
      setHasAttachment: jest.fn(),
      setLicense: jest.fn(),
      clear: jest.fn(),
    },
    {
      uri: '',
      type: '',
      hasAttachment: false,
    },
  );
});

export default mock;
