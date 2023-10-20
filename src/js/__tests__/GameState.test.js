import GameStateService from '../GameStateService';

let storage;
let stateService;

beforeEach(() => {
  storage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };

  stateService = new GameStateService(storage);
  jest.clearAllMocks();
});

test('testing if the save is loaded', () => {
  const saved = {
    level: 3,
    position: [],
    score: 157,
  };

  storage.getItem.mockReturnValue(JSON.stringify(saved));
  expect(stateService.load()).toEqual(saved);
});

test('tesing loading with invalid json', () => {
  storage.getItem.mockReturnValue('invalid JSON string');
  expect(() => stateService.load()).toThrow('Invalid state');
});

test('testing loading when state is null', () => {
  storage.getItem.mockReturnValue(null);
  expect(stateService.load()).toBeNull();
});
