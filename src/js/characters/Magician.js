import Character from '../Character';

export default class Magician extends Character {
  constructor(level, attackDistance = 4, moveDistance = 1, type = 'magician') {
    super(level, attackDistance, moveDistance, type);
    this.attack = 10;
    this.defence = 40;
  }
}
