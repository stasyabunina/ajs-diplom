import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level, attackDistance = 1, moveDistance = 4, type = 'swordsman') {
    super(level, attackDistance, moveDistance, type);
    this.attack = 40;
    this.defence = 10;
  }
}
