import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';
import PositionedCharacter from '../PositionedCharacter';
import Magician from '../characters/Magician';

const testCtrl = new GameController(new GamePlay(), new GameStateService());

test('testing if character move distance is correct', () => {
  const magician = new PositionedCharacter(new Magician(1), 0);
  const received = testCtrl.getMoveAttackOptionsArr(magician.position, 1);

  const expected = [1, 8, 9];

  expect(received).toEqual(expected);
});

test('testing if character attack distance is correct', () => {
  const magician = new PositionedCharacter(new Magician(1), 0);
  const received = testCtrl.getMoveAttackOptionsArr(magician.position, 4);

  const expected = [1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36];

  expect(received).toEqual(expected);
});
