import Magician from '../characters/Magician';

test('testing character tooltip', () => {
  const magician = new Magician(1);

  const icons = {
    level: '\u{1F396}',
    attack: '\u{2694}',
    defence: '\u{1F6E1}',
    health: '\u{2764}',
  };

  const received = `${icons.level}${magician.level} ${icons.attack}${magician.attack} ${icons.defence}${magician.defence} ${icons.health}${magician.health}`;

  const expected = '\u{1F396}1 \u{2694}10 \u{1F6E1}40 \u{2764}50';

  expect(received).toBe(expected);
});
