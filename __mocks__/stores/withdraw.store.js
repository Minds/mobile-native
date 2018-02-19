export default function withdrawStoreMockFactory() {
  return {
    ledger: [],

    load: jest.fn(),
  };
}
