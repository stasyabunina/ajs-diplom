import { calcTileType } from '../utils';

test('testing border drawing', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
  expect(calcTileType(7, 8)).toBe('top-right');
  expect(calcTileType(1, 8)).toBe('top');
  expect(calcTileType(56, 8)).toBe('bottom-left');
  expect(calcTileType(63, 8)).toBe('bottom-right');
  expect(calcTileType(62, 8)).toBe('bottom');
  expect(calcTileType(7, 7)).toBe('left');
  expect(calcTileType(15, 8)).toBe('right');
  expect(calcTileType(27, 8)).toBe('center');
});
