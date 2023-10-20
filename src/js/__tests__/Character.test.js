import { generateTeam, characterGenerator } from '../generators';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Bowman from '../characters/Bowman';
import Vampire from '../characters/Vampire';
import Character from '../Character';

test('testing character creation', () => {
  expect(() => { new Character(1, 'magician'); }).toThrow('Ошибка. Создавать объекты этого класса через new Character() запрещено.');
});

test('testing magician creation', () => {
  const received = new Magician(1);
  const expected = {
    type: 'magician',
    level: 1,
    health: 50,
    attack: 10,
    defence: 40,
    moveDistance: 1,
    attackDistance: 4,
  };

  expect(received).toEqual(expected);
});

test('testing vampire attack', () => {
  const vampire = new Vampire(1);
  expect(vampire.attack).toBe(25);
});

test('testing new characters creation', () => {
  const userTypes = [Bowman, Swordsman, Magician];
  const character = characterGenerator(userTypes, 2);
  const result = [
    character.next().value,
    character.next().value,
    character.next().value,
    character.next().value,
  ];

  expect(result.length).toBe(4);
});

test('testing new team length', () => {
  const userTypes = [Bowman, Swordsman, Magician];
  const team = generateTeam(userTypes, 1, 2);

  expect(team.length).toBe(2);
});

test('testing new team character level', () => {
  const userTypes = [Bowman, Swordsman, Magician];
  const team = generateTeam(userTypes, 1, 2);

  expect(team[0].level).toBe(1);
});
