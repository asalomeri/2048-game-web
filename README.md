# 2048 Game 🎮

An interactive browser-based implementation of the classic **2048 puzzle game**, built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no dependencies.

![2048 Game](https://img.shields.io/badge/game-2048-orange) ![License](https://img.shields.io/badge/license-MIT-blue) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 🕹️ How to Play

1. Use the **arrow keys** (↑ ↓ ← →) on your keyboard to move all tiles simultaneously.
2. When two tiles with the **same number** collide, they **merge into one** with their combined value.
3. A new tile (2 or 4) appears after every valid move.
4. Keep merging tiles until you reach the **2048** tile to win!
5. The game ends when the board is full and **no moves are possible**.

```
Before move (→):       After move (→):
 2  |  2  |  .  |  .     .  |  .  |  4  |  .
 4  |  .  |  4  |  .     .  |  .  |  .  |  8
 .  |  2  |  2  |  4     .  |  .  |  4  |  4
 8  |  .  |  .  |  8     .  |  .  |  .  | 16
```

---

## ✨ Features

- **4×4 grid** gameplay with smooth animated tiles
- **Arrow key** controls for desktop
- **Touch / swipe** controls for mobile devices
- **Score tracking** with real-time updates
- **Best score** persistence via `localStorage`
- **Win detection** — congratulations message when you hit 2048
- **Keep playing** option after winning to chase higher scores
- **Game over** detection when no valid moves remain
- **Responsive design** — looks great on desktop, tablet, and phone
- **Color-coded tiles** for values 2 through 2048 and beyond
- **CSS animations** for tile appearances and merges

---

## 🚀 Getting Started

### Play Online

Simply open `index.html` in any modern web browser — no server or build step required.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/asalomeri/2048-game-web.git

# Navigate into the project folder
cd 2048-game-web

# Open in your browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Or serve it with any static file server:

```bash
# Using Python
python -m http.server 8080
# Then visit http://localhost:8080
```

---

## 🎮 Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move Left  | `←` Arrow | Swipe Left  |
| Move Right | `→` Arrow | Swipe Right |
| Move Up    | `↑` Arrow | Swipe Up    |
| Move Down  | `↓` Arrow | Swipe Down  |
| New Game   | Click button | Tap button |

---

## 📂 Project Structure

```
2048-game-web/
├── index.html    # Game layout and HTML structure
├── style.css     # Styling, tile colors, animations, responsive design
├── script.js     # All game logic (movement, merging, scoring, events)
├── README.md     # This file
├── LICENSE       # MIT License
└── .gitignore    # Standard web project gitignore
```

---

## 🧠 Game Rules

- The board is a **4×4 grid**.
- Each turn, you slide all tiles in one direction (up/down/left/right).
- Tiles slide as far as possible in the chosen direction.
- Two tiles with the **same value** that collide merge into **one tile** with twice the value.
- Each tile can only merge **once per turn**.
- After every move, a new tile (**2** with 90% probability, **4** with 10%) appears in a random empty cell.
- **Win**: Create a tile with the value **2048**.
- **Lose**: The board is completely full and no adjacent tiles can merge.

---

## 🌐 Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome 80+ | ✅ |
| Firefox 75+ | ✅ |
| Safari 13+ | ✅ |
| Edge 80+ | ✅ |
| Mobile Chrome | ✅ |
| Mobile Safari | ✅ |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

Original 2048 game concept by [Gabriele Cirulli](https://github.com/gabrielecirulli/2048).
