import Character from '../Character';

export default class Undead extends Character {
  constructor(level, attackDistance = 1, moveDistance = 4, type = 'undead') {
    super(level, attackDistance, moveDistance, type);
    this.attack = 40;
    this.defence = 10;
  }
}
