# Дипломное задание к курсу «Продвинутый JavaScript». Retro Game

###### tags: `netology` `advanced js`

## Концепция игры

Двухмерная игра в стиле фэнтези, где игроку предстоит выставлять своих персонажей против 
персонажей нечисти. После каждого раунда восстанавливается жизнь уцелевших персонажей 
игрока и повышается их уровень. Максимальный уровень - 4.

Игру можно сохранять и восстанавливать из сохранения.

## Файловая структура

Ключевые сущности:
1. GamePlay - класс, отвечающий за взаимодействие с HTML-страницей
2. GameController - класс, отвечающий за логику приложения (важно: это не контроллер в терминах MVC), там вы будете работать больше всего
3. Character - базовый класс, от которого вы будете наследоваться и реализовывать специализированных персонажей
4. GameState - объект, который хранит текущее состояние игры (может сам себя воссоздавать из другого объекта)
5. GameStateService - объект, который взаимодействует с текущим состоянием (сохраняет данные в localStorage для последующей загрузки)
6. PositionedCharacter - Character, привязанный к координате на поле. Обратите внимание, что несмотря на то, что поле выглядит как двумерный массив, внутри оно хранится как одномерный
7. Team - класс для команды (набор персонажей), представляющих компьютер и игрока
8. generators - модуль, содержащий вспомогательные функции для генерации команды и персонажей
