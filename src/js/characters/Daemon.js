import Character from '../Character';

export default class Daemon extends Character {
  constructor(level, attackDistance = 4, moveDistance = 1, type = 'daemon') {
    super(level, attackDistance, moveDistance, type);
    this.attack = 10;
    this.defence = 10;
  }
}
