const service = {
  getLanguages: jest.fn(),
  getUserDefaultLanguage: jest.fn(),
  purgeLanguagesCache: jest.fn(),
  translate: jest.fn(),
  isTranslatable: jest.fn(),
  getLanguageName: jest.fn(),
}

export default service;