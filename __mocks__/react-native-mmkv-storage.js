export default {
  Loader: () => ({
    withInstanceID: () => ({
      setProcessingMode: jest.fn(),
      withEncryption: jest.fn(),
      initialize: () => ({
        setItem: jest.fn(),
        getItem: jest.fn(),
        setStringAsync: jest.fn(),
        getStringAsync: jest.fn(),
        setIntAsync: jest.fn(),
        getIntAsync: jest.fn(),
        setBoolAsync: jest.fn(),
        getBoolAsync: jest.fn(),

        setMapAsync: jest.fn(),

        getMapAsync: jest.fn(),

        setArrayAsync: jest.fn(),

        getArrayAsync: jest.fn(),

        getMultipleItemsAsync: jest.fn(),

        clearStore: jest.fn(),

        clearMemoryCache: jest.fn(),

        removeItem: jest.fn(),

        setString: jest.fn(),

        getString: jest.fn(),
        setInt: jest.fn(),
        getInt: jest.fn(),

        setBool: jest.fn(),
        getBool: jest.fn(),
        setMap: jest.fn(),
        getMap: jest.fn(),
        setArray: jest.fn(),
        getArray: jest.fn(),
        getMultipleItems: jest.fn(),
        getAllMMKVInstanceIDs: jest.fn(),
        getCurrentMMKVInstanceIDs: jest.fn(),
        getKey: jest.fn(),
      }),
    }),
  }),
};
