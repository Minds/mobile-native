export class Storages {
  session: any;
  app: any;
  user: any;
  userPortrait: any;
  userCache: any;

  constructor() {
    this.session = createMockStorage();
    this.app = createMockStorage();
    this.user = createMockStorage();
    this.userPortrait = createMockStorage();
    this.userCache = createMockStorage();
  }
}

export const createUserStore = jest.fn();

function createMockStorage() {
  const m = {
    clearAll: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
    getString: jest.fn(),

    getNumber: jest.fn(),

    getBoolean: jest.fn(),

    getBuffer: jest.fn(),

    getAllKeys: jest.fn(),
    contains: jest.fn(),
    recrypt: jest.fn(),

    getObject: jest.fn(),
    setObject: jest.fn(),
  };

  return m;
}
