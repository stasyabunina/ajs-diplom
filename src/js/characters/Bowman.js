import Character from '../Character';

export default class Bowman extends Character {
  constructor(level, attackDistance = 2, moveDistance = 2, type = 'bowman') {
    super(level, attackDistance, moveDistance, type);
    this.attack = 25;
    this.defence = 25;
  }
}
