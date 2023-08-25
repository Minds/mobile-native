import createCardSelectorStore from './createCardSelectorStore';

describe('createCardSelectorStore', () => {
  let store;

  beforeEach(() => {
    store = createCardSelectorStore({
      onCardSelected: jest.fn(),
      selectedCardId: '',
    });
    store.init();
  });

  it('should have the correct default values', () => {
    expect(store.loaded).toBe(true);
    expect(store.cards.length).toBe(0);
    expect(store.current).toBe(0);
    expect(store.inProgress).toBe(false);
    expect(store.cardDetails).toEqual({});
    expect(store.intentKey).toBe('');
    expect(store.intentId).toBe('');
  });

  // TODO: init
  // TODO: initStripe
  // TODO: getSetupIntent
  // TODO: loadCards
  // TODO: selectCard
  // TODO: saveCard
  // TODO: onCardChange
});
