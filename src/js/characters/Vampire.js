import Character from '../Character';

export default class Vampire extends Character {
  constructor(level, attackDistance = 2, moveDistance = 2, type = 'vampire') {
    super(level, attackDistance, moveDistance, type);
    this.attack = 25;
    this.defence = 25;
  }
}
