# Tetris

This project is an implementation of Tetris written in pure JavaScript. It's intended to be a very simple implementation which attempted to cover all the aspects of the original game (e.g. tetromino pieces, rotation, clearing row, scoring, leveling up, etc).

You can view/play the game in JSFiddle: http://jsfiddle.net/rarioj/pHFrX/

## What is Tetris?

see [Wikipedia](http://en.wikipedia.org/wiki/Tetris)

![The 5 out of 7 known Tetrominoes](http://upload.wikimedia.org/wikipedia/commons/thumb/5/50/All_5_free_tetrominoes.svg/200px-All_5_free_tetrominoes.svg.png)
> Tetris (Russian: Те́трис) is a tile-matching puzzle video game originally designed and programmed by Alexey Pajitnov in the Soviet Union. It was released on June 6, 1984, while he was working for the Dorodnicyn Computing Centre of the Academy of Science of the USSR in Moscow. He derived its name from the Greek numerical prefix tetra- (all of the game's pieces contain four segments) and tennis, Pajitnov's favorite sport.

## Control

You can control the falling piece with your keyboard.

Use **Left** `⇦`, **Down** `⇩`, and **Right** `⇨` arrow keys in your keyboard to move the piece around the playing field.

Use the letter key **A** to rotate the piece counter-clockwise `↺` and **S** key to rotate the piece clockwise `↻`.

## Usage

If you want to embed the game in your existing web-page, simply include the `tetris.js` JavaScript file and run `TETRIS.play('container-name');` specifying the container name where the Tetris field is rendered.

```html
<script type="text/javascript" src="tetris.js"></script>
<div id="tetris"></div>
<script type="text/javascript">
// Play Tetris with bigger block size and bigger score multiplier
TETRIS.play('tetris', {
    BlockSize: 30,
    ScoreMultiplier: 100
  });
</script>
```

## Configuration

Some aspects of the game are configurable. Refer to the comment in **Config** section in the source code.

```javascript
TETRIS.play('container-name', {
  BlockSize: 25, // Width/height of a single block (in pixel)
  ControlKey: {
    Left: '37', // Move piece left
    Right: '39', // Move piece right
    Down: '40', // Move piece down
    RotateLeft: '65', // Rotate piece counter-clockwise
    RotateRight: '83' // Rotate piece clockwise
  },
  FieldHeight: 22, // Number of rows available in the field (in block)
  FieldWidth: 10, // Number of columns available in the field (in block)
  LevelUpRow: 10, // Number of row(s) must be cleared to get to the next level
  LevelUpSpeed: 50, // Speed increase every level up (in microsecond)
  PieceColor: { // Color of the pieces (in HTML color)
    I: 'red',
    J: 'orange',
    L: 'magenta',
    O: 'blue',
    S: 'lime',
    T: 'olive',
    Z: 'cyan'
  },
  ScoreMultiplier: 10, // Score multiplier
  StartingSpeed: 1000, // Starting interval speed (in microsecond)
  VoidColor: '#fafafa' // Color of a blank/void block (in HTML color)
});
```

### TODO

- Ability to pause, start, and restart the game.
- Next piece block is currently showing only the letter.
- Keeping high score records?
