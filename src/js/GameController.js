import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import cursors from './cursors';
import GameState from './GameState';
import themes from './themes';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Vampire, Undead, Daemon];
    this.position = [];
    this.cellsArrs = this.getCellsArray();
    this.cells = this.getCellsArray().flat();
    this.activeCharacter = {};
    this.userPositions = this.cellsArrs.map((item) => item.slice(0, 2)).flat();
    this.enemyPositions = this.cellsArrs.map((item) => item.slice(6, 8)).flat();
    this.turn = 'user';
    this.level = 1;
    this.score = 0;
    this.blockedBoard = false;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const userCharacters = this.generatePlayers(this.userPositions, this.userTypes);
    this.gamePlay.redrawPositions(userCharacters);

    const enemyCharacters = this.generatePlayers(this.enemyPositions, this.enemyTypes);
    this.gamePlay.redrawPositions(enemyCharacters);

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  generatePlayers(positions, types) {
    const team = generateTeam(types, 1, 2);

    for (const character of team) {
      const position = this.getRandomPosition(positions);
      const char = new PositionedCharacter(character, position);
      this.position.push(char);
    }

    return this.position;
  }

  getRandomPosition(positions) {
    let index = positions[Math.floor(Math.random() * positions.length)];

    while (this.checkPosition(index) === true) {
      index = positions[Math.floor(Math.random() * positions.length)];
    }

    return index;
  }

  checkPosition(index) {
    const positions = this.position;

    for (const position of positions) {
      if (index === position.position) {
        return true;
      }
    }

    return false;
  }

  getCellsArray() {
    const cells = [];
    let array = [];

    for (let i = 0; i < this.gamePlay.boardSize ** 2; i += 1) {
      array.push(i);
      if (array.length === this.gamePlay.boardSize) {
        cells.push(array);
        array = [];
      }
    }

    return cells;
  }

  getMoveAttackOptionsArr(currentPosition, distance) {
    const area = [];

    for (let i = currentPosition - this.gamePlay.boardSize * distance; (i <= currentPosition + this.gamePlay.boardSize * distance); i += this.gamePlay.boardSize) {
      if ((i >= 0) && (i < this.gamePlay.boardSize ** 2)) {
        for (let j = i - distance; j <= i + distance; j += 1) {
          if ((j >= i - (i % this.gamePlay.boardSize)) && (j < i + (this.gamePlay.boardSize - (i % this.gamePlay.boardSize)))) {
            area.push(j);
          }
        }
      }
    }

    area.splice(area.indexOf(currentPosition), 1);

    return area;
  }

  deselectAllCells() {
    for (const cell of this.cells) {
      this.gamePlay.deselectCell(cell);
    }
  }

  attack(attacker, attacked) {
    const target = attacked.character;

    let damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    damage = Math.floor(damage);

    target.health -= damage;

    for (const char of this.position) {
      if (char.character.health <= 0) {
        char.character.health = 0;
        this.position = this.position.filter((el) => el.character.health !== 0);
      }
    }

    if (this.activeCharacter.character.health <= 0) {
      this.deselectAllCells();
      this.activeCharacter = {};
    }

    this.gamePlay.showDamage(attacked.position, damage).then(() => {
      this.checkGameStatus();
      this.gamePlay.redrawPositions(this.position);
    });
  }

  checkGameStatus() {
    const userTeam = this.position.filter((el) => ['bowman', 'swordsman', 'magician'].includes(el.character.type));

    const enemyTeam = this.position.filter((el) => ['vampire', 'undead', 'daemon'].includes(el.character.type));

    if (userTeam.length === 0) {
      this.blockedBoard = true;
      this.score = 0;
      GamePlay.showError('Вы проиграли.');
      this.gamePlay.setCursor(cursors.notallowed);

      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }

    if (this.level < 5 && enemyTeam.length === 0) {
      this.nextCharacterLevel();
    }
  }

  nextCharacterLevel() {
    this.nextMapLevel();

    for (const char of this.position) {
      char.character.level += 1;

      char.character.attack = Math.max(char.character.attack, char.character.attack * (80 + char.character.health) / 100);
      char.character.defence = Math.max(char.character.defence, char.character.defence * (80 + char.character.health) / 100);

      char.character.health += 80;
      if (char.character.health > 100) {
        char.character.health = 100;
      }
    }

    this.activeCharacter = {};
    this.deselectAllCells();

    this.gamePlay.redrawPositions(this.position);
  }

  nextMapLevel() {
    const userTeam = this.position.filter((el) => ['bowman', 'swordsman', 'magician'].includes(el.character.type));

    for (const userCharacter of userTeam) {
      this.score += userCharacter.character.health;
    }

    this.level += 1;

    if (this.level === 2) {
      this.gamePlay.drawUi(themes.desert);
      this.redrawCharacters();
    }

    if (this.level === 3) {
      this.gamePlay.drawUi(themes.arctic);
      this.redrawCharacters();
    }

    if (this.level === 4) {
      this.gamePlay.drawUi(themes.mountain);
      this.redrawCharacters();
    }

    if (this.level >= 5) {
      this.blockedBoard = true;
      GamePlay.showMessage('Поздравляю, вы выиграли.');

      this.gamePlay.setCursor(cursors.notallowed);

      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }
  }

  redrawCharacters() {
    this.position = [];

    const userCharacters = this.generatePlayers(this.userPositions, this.userTypes);
    this.gamePlay.redrawPositions(userCharacters);

    const enemyCharacters = this.generatePlayers(this.enemyPositions, this.enemyTypes);
    this.gamePlay.redrawPositions(enemyCharacters);
  }

  enemyTurn() {
    const enemyTeam = this.position.filter((el) => ['vampire', 'undead', 'daemon'].includes(el.character.type));

    if (enemyTeam.length !== 0) {
      this.turn = 'enemy';

      const randomEnemy = Math.floor(Math.random() * enemyTeam.length);

      const userTeam = this.position.filter((el) => ['bowman', 'swordsman', 'magician'].includes(el.character.type));

      const allowedEnemyCells = this.cells.filter((el) => this.getMoveAttackOptionsArr(enemyTeam[randomEnemy].position, enemyTeam[randomEnemy].character.moveDistance).includes(el));

      for (const user of userTeam) {
        if (this.getMoveAttackOptionsArr(enemyTeam[randomEnemy].position, enemyTeam[randomEnemy].character.attackDistance).includes(user.position)) {
          this.attack(enemyTeam[randomEnemy].character, user);
          this.turn = 'user';
          return;
        }
        enemyTeam[randomEnemy].position = this.getRandomPosition(allowedEnemyCells);
        this.gamePlay.redrawPositions(this.position);
        this.turn = 'user';
        return;
      }
    }
  }

  newGame() {
    this.blockedBoard = false;
    this.gamePlay.drawUi(themes.prairie);

    for (const char of this.position) {
      char.character.health = 50;
    }

    this.level = 1;
    this.turn = 'user';
    this.activeCharacter = {};
    this.deselectAllCells();

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    this.redrawCharacters();
  }

  saveGame() {
    if (this.score === 0) {
      GamePlay.showError('Нет игры для сохранения.');
    } else {
      const savedGame = {
        level: this.level,
        position: this.position,
        score: this.score,
      };
      const gameState = GameState.from(savedGame);
      this.stateService.save(gameState);
      GamePlay.showMessage('Ваша игра сохранена.');
    }
  }

  loadGame() {
    try {
      const loadedGame = this.stateService.load();

      if (loadedGame) {
        this.level = loadedGame.level;
        this.position = loadedGame.position;
        this.score = loadedGame.score;

        if (this.level === 2) {
          this.gamePlay.drawUi(themes.desert);
        }

        if (this.level === 3) {
          this.gamePlay.drawUi(themes.arctic);
        }

        if (this.level === 4) {
          this.gamePlay.drawUi(themes.mountain);
        }

        this.activeCharacter = {};
        this.deselectAllCells();

        this.gamePlay.redrawPositions(this.position);
      }

      GamePlay.showMessage('Ваша игра загружена.');
    } catch (err) {
      GamePlay.showError('Нет игры для загрузки.');
    }
  }

  onCellClick(index) {
    if (this.blockedBoard === false) {
      const clickedCharacter = this.position.find((el) => el.position === index);

      const userTeam = this.position.filter((el) => ['bowman', 'swordsman', 'magician'].includes(el.character.type));

      if (clickedCharacter && ['swordsman', 'magician', 'bowman'].includes(clickedCharacter.character.type)) {
        for (const character of userTeam) {
          this.gamePlay.deselectCell(character.position);
        }

        this.gamePlay.selectCell(index);
        this.activeCharacter = clickedCharacter;
      } else if (clickedCharacter && ['vampire', 'undead', 'daemon'].includes(clickedCharacter.character.type) && Object.keys(this.activeCharacter).length === 0) {
        GamePlay.showError('Персонаж должен находиться в вашей команде.');
      }

      if (!clickedCharacter && Object.keys(this.activeCharacter).length !== 0) {
        if (this.getMoveAttackOptionsArr(this.activeCharacter.position, this.activeCharacter.character.moveDistance).includes(index)) {
          this.activeCharacter.position = index;
          this.deselectAllCells();
          this.gamePlay.redrawPositions(this.position);
          this.gamePlay.selectCell(index);
          this.timeout = setTimeout(this.enemyTurn.bind(this), 200);
        } else {
          GamePlay.showError('Персонаж не может ходить в эту клетку.');
        }
      }

      if (clickedCharacter && Object.keys(this.activeCharacter).length !== 0 && ['vampire', 'undead', 'daemon'].includes(clickedCharacter.character.type) && this.gamePlay.boardEl.style.cursor === 'crosshair' && this.getMoveAttackOptionsArr(this.activeCharacter.position, this.activeCharacter.character.attackDistance).includes(index)) {
        this.attack(this.activeCharacter.character, clickedCharacter);
        this.timeout = setTimeout(this.enemyTurn.bind(this), 200);
      }
    }
  }

  onCellEnter(index) {
    if (this.blockedBoard === false) {
      const clickedCharacter = this.position.find((el) => el.position === index);

      if (clickedCharacter && Object.keys(this.activeCharacter).length !== 0 && ['vampire', 'undead', 'daemon'].includes(clickedCharacter.character.type)) {
        if (this.getMoveAttackOptionsArr(this.activeCharacter.position, this.activeCharacter.character.attackDistance).includes(index)) {
          const notActiveCharacterCells = this.cells.filter((cell) => this.activeCharacter.position !== cell);

          this.gamePlay.setCursor(cursors.crosshair);
          for (const cell of notActiveCharacterCells) {
            this.gamePlay.deselectCell(cell);
          }
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else if (clickedCharacter && Object.keys(this.activeCharacter).length === 0) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (!clickedCharacter && Object.keys(this.activeCharacter).length === 0) {
        this.gamePlay.setCursor(cursors.notallowed);
      } else if (!clickedCharacter && Object.keys(this.activeCharacter).length !== 0) {
        if (this.getMoveAttackOptionsArr(this.activeCharacter.position, this.activeCharacter.character.moveDistance).includes(index)) {
          const notActiveCharacterCells = this.cells.filter((cell) => this.activeCharacter.position !== cell);

          for (const cell of notActiveCharacterCells) {
            this.gamePlay.deselectCell(cell);
          }
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else if (clickedCharacter && Object.keys(this.activeCharacter).length !== 0 && ['swordsman', 'magician', 'bowman'].includes(clickedCharacter.character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }

      const icons = {
        level: '\u{1F396}',
        attack: '\u{2694}',
        defence: '\u{1F6E1}',
        health: '\u{2764}',
      };

      if (clickedCharacter) {
        const text = `${icons.level}${clickedCharacter.character.level} ${icons.attack}${clickedCharacter.character.attack} ${icons.defence}${clickedCharacter.character.defence} ${icons.health}${clickedCharacter.character.health}`;
        this.gamePlay.showCellTooltip(text, index);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);

    const notActiveCharacterCells = this.cells.filter((cell) => this.activeCharacter.position !== cell);

    for (const cell of notActiveCharacterCells) {
      this.gamePlay.deselectCell(cell);
    }
  }
}
