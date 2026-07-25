/**
 * script.js — 2048 Game Logic
 *
 * Board representation: a flat 16-element array (indices 0-15)
 * mapping to a 4×4 grid where index = row * 4 + col.
 *
 * The rendering approach:
 *  - 16 static <div class="cell"> elements provide the grey background slots.
 *  - Tile <div> elements are absolutely positioned over the board using
 *    CSS custom properties (--row, --col) and computed percentages, so
 *    transitions animate them smoothly between positions.
 */

'use strict';

/* ============================================================
   Constants
   ============================================================ */
const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const BEST_SCORE_KEY = 'bestScore';
const WIN_VALUE = 2048;

/* ============================================================
   State
   ============================================================ */
let board = [];        // flat array [0..15]
let score = 0;
let bestScore = 0;
let gameOver = false;
let won = false;
let keepPlaying = false;

/* DOM references */
const boardEl         = document.getElementById('board');
const scoreEl         = document.getElementById('score');
const bestScoreEl     = document.getElementById('best-score');
const gameMessageEl   = document.getElementById('game-message');
const messageTextEl   = document.getElementById('message-text');
const newGameBtn      = document.getElementById('new-game-btn');
const keepPlayingBtn  = document.getElementById('keep-playing-btn');
const tryAgainBtn     = document.getElementById('try-again-btn');

/* ============================================================
   Initialisation
   ============================================================ */

/** Build the static background cell elements once. */
function buildBoardCells() {
  boardEl.innerHTML = '';
  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    boardEl.appendChild(cell);
  }
}

/** Start / restart a new game. */
function initGame() {
  board = new Array(CELL_COUNT).fill(0);
  score = 0;
  gameOver = false;
  won = false;
  keepPlaying = false;

  bestScore = parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);

  updateScoreDisplay();
  clearMessage();

  // Add two starter tiles
  addRandomTile();
  addRandomTile();

  renderBoard(/* animate= */ false);
}

/* ============================================================
   Tile Generation
   ============================================================ */

/** Place a new tile (90 % chance of 2, 10 % chance of 4) in a random empty cell. */
function addRandomTile() {
  const empty = getEmptyCells();
  if (empty.length === 0) return;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  board[idx] = Math.random() < 0.9 ? 2 : 4;
  return idx;
}

/** Return indices of all zero cells. */
function getEmptyCells() {
  const empties = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    if (board[i] === 0) empties.push(i);
  }
  return empties;
}

/* ============================================================
   Move Logic
   ============================================================ */

/**
 * Slide & merge a single row/column array of values (left-to-right).
 * Returns { line, gained } where line is the new array and gained is
 * the score earned from merges in this line.
 */
function slideLine(line) {
  // Remove zeros
  let values = line.filter(v => v !== 0);
  let gained = 0;

  // Merge adjacent equal values (left-to-right, each cell merges once)
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === values[i + 1]) {
      values[i] *= 2;
      gained += values[i];
      values.splice(i + 1, 1);
    }
  }

  // Pad with zeros on the right
  while (values.length < GRID_SIZE) values.push(0);
  return { line: values, gained };
}

/**
 * Apply a move in the given direction.
 * Returns true if any tile moved or merged (i.e. the board changed).
 */
function move(direction) {
  if (gameOver) return false;
  if (won && !keepPlaying) return false;

  const prevBoard = board.slice();
  let totalGained = 0;

  if (direction === 'left') {
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = getRow(r);
      const { line, gained } = slideLine(row);
      setRow(r, line);
      totalGained += gained;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = getRow(r).reverse();
      const { line, gained } = slideLine(row);
      setRow(r, line.reverse());
      totalGained += gained;
    }
  } else if (direction === 'up') {
    for (let c = 0; c < GRID_SIZE; c++) {
      const col = getCol(c);
      const { line, gained } = slideLine(col);
      setCol(c, line);
      totalGained += gained;
    }
  } else if (direction === 'down') {
    for (let c = 0; c < GRID_SIZE; c++) {
      const col = getCol(c).reverse();
      const { line, gained } = slideLine(col);
      setCol(c, line.reverse());
      totalGained += gained;
    }
  }

  const changed = board.some((v, i) => v !== prevBoard[i]);
  if (!changed) return false;

  // Update score
  score += totalGained;
  updateScoreDisplay();

  // Spawn a new tile
  const newIdx = addRandomTile();

  // Render
  renderBoard(/* animate= */ true, newIdx);

  // Check win / lose
  checkWin();
  if (!won || keepPlaying) checkLose();

  return true;
}

/* ============================================================
   Board Accessors
   ============================================================ */

function getRow(r) {
  return [
    board[r * GRID_SIZE + 0],
    board[r * GRID_SIZE + 1],
    board[r * GRID_SIZE + 2],
    board[r * GRID_SIZE + 3],
  ];
}

function setRow(r, values) {
  for (let c = 0; c < GRID_SIZE; c++) {
    board[r * GRID_SIZE + c] = values[c];
  }
}

function getCol(c) {
  return [
    board[0 * GRID_SIZE + c],
    board[1 * GRID_SIZE + c],
    board[2 * GRID_SIZE + c],
    board[3 * GRID_SIZE + c],
  ];
}

function setCol(c, values) {
  for (let r = 0; r < GRID_SIZE; r++) {
    board[r * GRID_SIZE + c] = values[r];
  }
}

/* ============================================================
   Win / Lose Checks
   ============================================================ */

function checkWin() {
  if (won) return;
  if (board.includes(WIN_VALUE)) {
    won = true;
    if (!keepPlaying) showMessage('🎉 You Won!', 'won');
  }
}

function checkLose() {
  if (getEmptyCells().length > 0) return; // still have empty cells

  // Check for any possible merge horizontally or vertically
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const idx = r * GRID_SIZE + c;
      const val = board[idx];
      if (c < GRID_SIZE - 1 && board[idx + 1] === val) return;
      if (r < GRID_SIZE - 1 && board[idx + GRID_SIZE] === val) return;
    }
  }

  // No moves available
  gameOver = true;
  showMessage('Game Over!', 'over');
}

/* ============================================================
   Score Display
   ============================================================ */

function updateScoreDisplay() {
  scoreEl.textContent = score;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(BEST_SCORE_KEY, bestScore);
  }
  bestScoreEl.textContent = bestScore;

  // Tiny bump animation
  [scoreEl, bestScoreEl].forEach(el => {
    el.classList.remove('bump');
    void el.offsetWidth; // force reflow
    el.classList.add('bump');
    el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
  });
}

/* ============================================================
   Message Display
   ============================================================ */

function showMessage(text, state) {
  messageTextEl.textContent = text;
  gameMessageEl.className = 'game-message ' + state;

  if (state === 'won') {
    keepPlayingBtn.style.display = 'inline-block';
    tryAgainBtn.style.display = 'inline-block';
  } else if (state === 'over') {
    keepPlayingBtn.style.display = 'none';
    tryAgainBtn.style.display = 'inline-block';
  }
}

function clearMessage() {
  messageTextEl.textContent = 'Good luck! 🎮';
  gameMessageEl.className = 'game-message';
  keepPlayingBtn.style.display = 'none';
  tryAgainBtn.style.display = 'none';
}

/* ============================================================
   Rendering
   ============================================================ */

/**
 * Re-render all tiles over the static background cells.
 * Each tile is absolutely positioned using percentage offsets derived
 * from the cell grid so CSS transitions animate movement.
 *
 * @param {boolean} animate - If true, apply appear/merge classes.
 * @param {number|undefined} newIdx - Index of the newly spawned tile (gets appear animation).
 */
function renderBoard(animate, newIdx) {
  // Remove existing tile elements (leave cell backgrounds)
  boardEl.querySelectorAll('.tile').forEach(t => t.remove());

  // Compute cell size as a fraction of board width.
  // The board uses CSS grid with gap; we replicate the layout via JS.
  // We use CSS variables on the board for gap/padding info via getComputedStyle.
  const boardRect = boardEl.getBoundingClientRect();
  const boardStyle = getComputedStyle(boardEl);
  const gap = parseFloat(boardStyle.gap) || 12;
  const totalGap = gap * (GRID_SIZE - 1);
  const cellSize = (boardRect.width - totalGap) / GRID_SIZE;

  board.forEach((value, idx) => {
    if (value === 0) return;

    const row = Math.floor(idx / GRID_SIZE);
    const col = idx % GRID_SIZE;

    const tile = document.createElement('div');
    tile.className = `tile ${tileClass(value)}`;

    // Position
    tile.style.width  = `${cellSize}px`;
    tile.style.height = `${cellSize}px`;
    tile.style.top    = `${row * (cellSize + gap)}px`;
    tile.style.left   = `${col * (cellSize + gap)}px`;

    // Font size scales with cell size and value length
    tile.style.fontSize = tileFontSize(value, cellSize);

    tile.textContent = value;

    if (animate) {
      if (idx === newIdx) {
        tile.classList.add('tile-new');
      }
    }

    boardEl.appendChild(tile);
  });
}

/** Map a tile value to its CSS color class. */
function tileClass(value) {
  const classes = {
    2: 'tile-2', 4: 'tile-4', 8: 'tile-8', 16: 'tile-16',
    32: 'tile-32', 64: 'tile-64', 128: 'tile-128', 256: 'tile-256',
    512: 'tile-512', 1024: 'tile-1024', 2048: 'tile-2048',
  };
  return classes[value] || 'tile-super';
}

/** Return an appropriate font-size string for a tile. */
function tileFontSize(value, cellSize) {
  const digits = String(value).length;
  // Scale: 1-2 digits → 40% of cell, more digits → proportionally smaller
  const ratio = Math.max(0.22, 0.42 - (digits - 1) * 0.065);
  return `${Math.floor(cellSize * ratio)}px`;
}

/* ============================================================
   Event Listeners
   ============================================================ */

// Keyboard
document.addEventListener('keydown', e => {
  const map = {
    ArrowLeft: 'left', ArrowRight: 'right',
    ArrowUp: 'up', ArrowDown: 'down',
  };
  const direction = map[e.key];
  if (direction) {
    e.preventDefault();
    move(direction);
  }
});

// Buttons
newGameBtn.addEventListener('click', initGame);
keepPlayingBtn.addEventListener('click', () => {
  keepPlaying = true;
  clearMessage();
});
tryAgainBtn.addEventListener('click', initGame);

// Touch / Swipe
let touchStartX = 0;
let touchStartY = 0;
const MIN_SWIPE = 30; // px

boardEl.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

boardEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) < MIN_SWIPE && Math.abs(dy) < MIN_SWIPE) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? 'right' : 'left');
  } else {
    move(dy > 0 ? 'down' : 'up');
  }
}, { passive: true });

// Re-render on window resize so tile positions stay correct
window.addEventListener('resize', () => renderBoard(false));

/* ============================================================
   Bootstrap
   ============================================================ */
buildBoardCells();
initGame();
