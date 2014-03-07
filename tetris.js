
// +-+-+-+-+-+-+-+-+-+ //
//                     //
//     T E T R I S     //
//                     //
// +-+-+-+-+-+-+-+-+-+ //

// Ario Jatmiko <rarioj@yahoo.co.id>
// Tetris - 1.0.0 (2014-03-08)
// License: https://tldrlegal.com/license/mit-license The MIT License
// What is Tetris? http://en.wikipedia.org/wiki/Tetris

var TETRIS = {

  // ========== //
  //   Config   //
  // ========== //
  // All these parameters are configurable.
  config: {
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
  },

  // ========= //
  //   State   //
  // ========= //
  // Currently running game states.
  state: {
    shape: {},
    form: [],
    color: 'black',
    drop: false,
    rotate: 0,
    rows: 0,
    score: 0,
    level: 1,
    next: '',
    over: false,
    board: null,
    speed: 0,
    interval: null
  },

  // ========= //
  //   Piece   //
  // ========= //
  // The most difficult and fun bit to develop.
  piece: {
    available: [ 'I', 'J', 'L', 'O', 'S', 'T', 'Z' ],
    type: {
      I: {
        start: [ 3, 0 ],
        shape: [
          [ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ],
          [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ]
        ]
      },
      J: {
        start: [ 4, 0 ],
        shape: [
          [ [ 0, 0 ], [ 0, 1 ], [ 1, 1 ], [ 2, 1 ] ],
          [ [ 2, 0 ], [ 1, 0 ], [ 1, 1 ], [ 1, 2 ] ],
          [ [ 2, 2 ], [ 2, 1 ], [ 1, 1 ], [ 0, 1 ] ],
          [ [ 0, 2 ], [ 1, 2 ], [ 1, 1 ], [ 1, 0 ] ]
        ]
      },
      L: {
        start: [ 4, 0 ],
        shape: [
          [ [ 2, 0 ], [ 2, 1 ], [ 1, 1 ], [ 0, 1 ] ],
          [ [ 2, 2 ], [ 1, 2 ], [ 1, 1 ], [ 1, 0 ] ],
          [ [ 0, 2 ], [ 0, 1 ], [ 1, 1 ], [ 2, 1 ] ],
          [ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ], [ 1, 2 ] ]
        ]
      },
      O: {
        start: [ 4, 0 ],
        shape: [
          [ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ], [ 1, 1 ] ]
        ]
      },
      S: {
        start: [ 4, 0 ],
        shape: [
          [ [ 2, 0 ], [ 1, 0 ], [ 1, 1 ], [ 0, 1 ] ],
          [ [ 0, 0 ], [ 0, 1 ], [ 1, 1 ], [ 1, 2 ] ]
        ]
      },
      T: {
        start: [ 4, 0 ],
        shape: [
          [ [ 1, 0 ], [ 0, 1 ], [ 1, 1 ], [ 2, 1 ] ],
          [ [ 2, 1 ], [ 1, 0 ], [ 1, 1 ], [ 1, 2 ] ],
          [ [ 1, 2 ], [ 2, 1 ], [ 1, 1 ], [ 0, 1 ] ],
          [ [ 0, 1 ], [ 1, 2 ], [ 1, 1 ], [ 1, 0 ] ]
        ]
      },
      Z: {
        start: [ 4, 0 ],
        shape: [
          [ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ], [ 2, 1 ] ],
          [ [ 2, 0 ], [ 2, 1 ], [ 1, 1 ], [ 1, 2 ] ]
        ]
      }
    }
  },

  // ======== //
  //   Play   //
  // ======== //
  // Play the game!
  play: function(name, config) {
    config = config || {};
    for(var property in $T.config) {
      if(config.hasOwnProperty(property)){
        $T.config[property] = config[property];
      }
    }
    $T.state.color = $T.config.VoidColor;
    $T.state.speed = $T.config.StartingSpeed;
    document.onkeydown = function(e) {
      e = e || window.event;
      $T.fn.keyboardAction(e.keyCode, 'event');
    }
    $T.fn.renderField(name);
    $T.fn.renderNextPiece();
    $T.state.interval = setInterval($T.fn.stepInterval, $T.state.speed);
  },

  // ============= //
  //   Functions   //
  // ============= //
  // Helper, renderer, and control functions.
  fn: {

    // Function: mod
    // Allows negative value modulus.
    mod: function(a, b) {
      return (a % b + b) % b;
    },

    // Function: renderField
    // Renders the playing field.
    renderField: function(name) {
      var field = document.getElementById(name);
      var i, j, k;
      field.style.width = ($T.config.BlockSize * $T.config.FieldWidth) + 'px';
      field.style.height = ($T.config.BlockSize * $T.config.FieldHeight) + 'px';
      field.style.border = '1px solid black';
      for (i = 0; i < $T.config.FieldHeight; i++) {
        var row = document.createElement('div');
        row.setAttribute('id', 'row-' + i);
        row.setAttribute('class', 'field-row');
        for (j = 0; j < $T.config.FieldWidth; j++) {
          var col = document.createElement('div');
          col.setAttribute('id', 'row-' + i + '-col-' + j);
          col.setAttribute('class', 'field-column');
          col.setAttribute('taken', '0');
          col.setAttribute('control', '0');
          col.style.width = ($T.config.BlockSize) + 'px';
          col.style.height = ($T.config.BlockSize) + 'px';
          col.style.cssFloat = 'left';
          col.style.backgroundColor = $T.config.VoidColor;
          row.appendChild(col);
        }
        field.appendChild(row);
      }
      $T.state.board = document.createElement('div');
      $T.state.board.style.fontFamily = 'monospace';
      $T.state.board.style.fontSize = 'smaller';
      $T.state.board.style.textAlign = 'center';
      $T.fn.renderBoard();
      field.appendChild($T.state.board);
    },

    // Function: renderBlock
    // Renders a block.
    renderBlock: function(color, taken, control, x, y, index) {
      var block = document.getElementById('row-' + y + '-col-' + x);
      block.style.backgroundColor = color;
      if (taken) {
        block.setAttribute('taken', '1');
      } else {
        block.setAttribute('taken', '0');
      }
      if (control) {
        block.setAttribute('control', '1');
      } else {
        block.setAttribute('control', '0');
      }
    },

    // Function: renderPiece
    // Renders a single piece.
    renderPiece: function(type, rotate, x, y) {
      var shape = $T.piece.type[type].shape;
      var form = shape[$T.fn.mod(rotate, shape.length)];
      var color = $T.config.PieceColor[type];
      var blank = $T.config.VoidColor;
      $T.state.shape = shape;
      $T.state.color = $T.config.PieceColor[type];
      for (var i = 0; i < 4; i++) {
        if (!$T.fn.isBlockAvailable(x + form[i][0], y + form[i][1])) {
          return false;
        }
      }
      for (var i = 0; i < 4; i++) {
        $T.fn.renderBlock(color, true, true, x + form[i][0], y + form[i][1], i);
        $T.state.form[i] = [ x + form[i][0], y + form[i][1] ];
      }
      return true;
    },

    // Function: renderNextPiece
    // Gets the next random piece.
    renderNextPiece: function() {
      var rand = Math.floor(Math.random() * $T.piece.available.length);
      var type = $T.piece.available[rand];
      if ($T.state.next != '') {
        var tmp = $T.state.next;
        $T.state.next = type;
        type = tmp;
      } else {
        $T.state.next = type;
      }
      var next = $T.piece.type[type];
      var test = $T.fn.renderPiece(type, 0, next.start[0], next.start[1]);
      if (!test) {
        $T.state.over = true;
        clearInterval($T.state.interval);
      }
      $T.fn.renderBoard();
    },

    // Function: renderBoard
    // Renders the score and level board.
    renderBoard: function() {
      var board = '';
      board += '[ROW: <strong>' + $T.state.rows + '</strong>] &bull; ';
      board += '[LVL: <strong>' + $T.state.level + '</strong>]<br />';
      board += '[PTS: <strong>' + $T.state.score + '</strong>] &bull; ';
      board += '[NXT: <strong>' + $T.state.next + '</strong>]<br />';
      if ($T.state.over) {
        board += '<br />&bull; <strong>Game Over!</strong> &bull;';
      }
      $T.state.board.innerHTML = board;
    },

    // Function: isBlockAvailable
    // Checks whether or not a block is taken or in control.
    isBlockAvailable: function(x, y) {
      if (block = document.getElementById('row-' + y + '-col-' + x)) {
        var taken = block.getAttribute('taken');
        var control = block.getAttribute('control');
        if (taken == '1') {
          if (control == '1') {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
      return false;
    },

    // Function: stepInterval
    // Performs a single step interval.
    stepInterval: function() {
      if ($T.state.drop) {
        var shape = $T.state.shape;
        var form = $T.state.form;
        var color = $T.state.color;
        var blank = $T.config.VoidColor;

        // drop the piece
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(color, true, false, form[i][0], form[i][1], i);
        }

        // clear row(s), update score and level
        var block, taken, color;
        var score = 0, count = 0;
        for (var i = $T.config.FieldHeight - 1; i > 0; i--) {
          count = 0;
          for (var j = 0; j < $T.config.FieldWidth; j++) {
            block = document.getElementById('row-' + i + '-col-' + j);
            taken = block.getAttribute('taken');
            if (taken == '1') {
              count++;
            }
          }
          // there's something to clear
          if (count == $T.config.FieldWidth) {
            score++;
            for (var k = i - 1; k > 0; k--) {
              for (var l = 0; l < $T.config.FieldWidth; l++) {
                block = document.getElementById('row-' + k + '-col-' + l);
                taken = block.getAttribute('taken');
                color = block.style.backgroundColor;
                $T.fn.renderBlock(color, (taken == '1'), false, l, k + 1, 0);
              }
            }
            i = i + 1;
          }
        }

        // update score and level
        if (score) {
          $T.state.rows += score;
          $T.state.score += (Math.pow(score, 2) * $T.config.ScoreMultiplier);
          var level = Math.floor(($T.state.rows / $T.config.LevelUpRow) + 1);
          if (level > $T.state.level) {
            $T.state.level++;
            clearInterval($T.state.interval);
            $T.state.speed = $T.state.speed - $T.config.LevelUpSpeed;
            $T.state.interval = setInterval($T.fn.stepInterval, $T.state.speed);
          }
        }

        // reset current piece for the next piece
        $T.state.shape = {};
        $T.state.form = [];
        $T.state.color = $T.config.VoidColor;
        $T.state.drop = false;
        $T.state.rotate = 0;
        $T.fn.renderNextPiece();

        return;
      }

      // trigger key down event
      $T.fn.keyboardAction($T.config.ControlKey.Down, 'interval');
    },

    // Function: keyboardAction
    // Triggers keyboard key event.
    keyboardAction: function(key, from) {
      var shape = $T.state.shape;
      var form = $T.state.form;
      var color = $T.state.color;
      var blank = $T.config.VoidColor;

      // ######### //
      // MOVE LEFT //
      // ######### //
      if (key == $T.config.ControlKey.Left) {
        for (var i = 0; i < 4; i++) {
          if (!$T.fn.isBlockAvailable(form[i][0] - 1, form[i][1])) {
            return;
          }
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(blank, false, false, form[i][0], form[i][1], i);
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(color, true, true, form[i][0] - 1, form[i][1], i);
          $T.state.form[i] = [ form[i][0] - 1, form[i][1] ];
        }
      } else

      // ########## //
      // MOVE RIGHT //
      // ########## //
      if (key == $T.config.ControlKey.Right) {
        for (var i = 0; i < 4; i++) {
          if (!$T.fn.isBlockAvailable(form[i][0] + 1, form[i][1])) {
            return;
          }
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(blank, false, false, form[i][0], form[i][1], i);
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(color, true, true, form[i][0] + 1, form[i][1], i);
          $T.state.form[i] = [ form[i][0] + 1, form[i][1] ];
        }
      } else

      // ########### //
      // ROTATE LEFT //
      // ########### //
      if (key == $T.config.ControlKey.RotateLeft) {
        var s1 = shape[$T.fn.mod($T.state.rotate, shape.length)];
        var s2 = shape[$T.fn.mod($T.state.rotate - 1, shape.length)];
        var x, y;
        for (var i = 0; i < 4; i++) {
          x = form[i][0] - s1[i][0] + s2[i][0];
          y = form[i][1] - s1[i][1] + s2[i][1];
          if (!$T.fn.isBlockAvailable(x, y)) {
            return;
          }
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(blank, false, false, form[i][0], form[i][1], i);
        }
        for (var i = 0; i < 4; i++) {
          x = form[i][0] - s1[i][0] + s2[i][0];
          y = form[i][1] - s1[i][1] + s2[i][1];
          $T.fn.renderBlock(color, true, true, x, y, i);
          $T.state.form[i] = [ x, y ];
        }
        $T.state.rotate--;
      } else

      // ############ //
      // ROTATE RIGHT //
      // ############ //
      if (key == $T.config.ControlKey.RotateRight) {
        var s1 = shape[$T.fn.mod($T.state.rotate, shape.length)];
        var s2 = shape[$T.fn.mod($T.state.rotate + 1, shape.length)];
        var x, y;
        for (var i = 0; i < 4; i++) {
          x = form[i][0] - s1[i][0] + s2[i][0];
          y = form[i][1] - s1[i][1] + s2[i][1];
          if (!$T.fn.isBlockAvailable(x, y)) {
            return;
          }
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(blank, false, false, form[i][0], form[i][1], i);
        }
        for (var i = 0; i < 4; i++) {
          x = form[i][0] - s1[i][0] + s2[i][0];
          y = form[i][1] - s1[i][1] + s2[i][1];
          $T.fn.renderBlock(color, true, true, x, y, i);
          $T.state.form[i] = [ x, y ];
        }
        $T.state.rotate++;
      } else

      // ######### //
      // MOVE DOWN //
      // ######### //
      if (key == $T.config.ControlKey.Down) {
        for (var i = 0; i < 4; i++) {
          if (!$T.fn.isBlockAvailable(form[i][0], form[i][1] + 1)) {
            if (from == 'interval') {
              $T.state.drop = true;
            }
            return;
          }
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(blank, false, false, form[i][0], form[i][1], i);
        }
        for (var i = 0; i < 4; i++) {
          $T.fn.renderBlock(color, true, true, form[i][0], form[i][1] + 1, i);
          $T.state.form[i] = [ form[i][0], form[i][1] + 1 ];
        }
      }
    }
  }
};

// Shortcut
var $T = TETRIS;
