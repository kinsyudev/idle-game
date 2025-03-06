// src/index.ts
import { Application, Container, Sprite, Texture, Graphics } from "pixi.js";

// Game settings
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;
const ROWS = 10;
const COLS = 10;

// Create a Pixi application
const app = new Application();
await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x2a2a2a,
  antialias: true,
});

// Add the app's canvas to the body
document.body.appendChild(app.canvas);

// Create a placeholder texture for development
function createIsometricTileTexture(): Texture {
  const graphics = new Graphics();

  // Draw isometric tile shape
  graphics.setStrokeStyle(0xffffff);
  // Diamond shape
  graphics.moveTo(TILE_WIDTH / 2, 0);
  graphics.lineTo(TILE_WIDTH, TILE_HEIGHT / 2);
  graphics.lineTo(TILE_WIDTH / 2, TILE_HEIGHT);
  graphics.lineTo(0, TILE_HEIGHT / 2);
  graphics.closePath();

  graphics.fill(0x88cc88);

  return app.renderer.generateTexture(graphics);
}

// Create tile texture
const tileTexture = createIsometricTileTexture();

// Isometric tilemap container
const tilemap = new Container();
tilemap.x = app.screen.width / 2; // Center it
tilemap.y = 100; // Offset for visibility

// Convert grid (row, col) to isometric (x, y)
function isoPosition(row: number, col: number): { x: number; y: number } {
  return {
    x: (col - row) * (TILE_WIDTH / 2),
    y: (col + row) * (TILE_HEIGHT / 2),
  };
}

// Create the tile grid
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const { x, y } = isoPosition(row, col);
    const tile = new Sprite(tileTexture);
    tile.x = x;
    tile.y = y;
    tile.anchor.set(0.5, 0.5);

    // Make tiles interactive
    tile.eventMode = "static";
    tile.cursor = "pointer";

    // Store grid position for later reference
    tile.eventMode = "dynamic";

    // Click event to highlight the tile
    tile.on("pointerdown", () => {
      tile.tint = tile.tint === 0xff0000 ? 0xffffff : 0xff0000;
      console.log(`Clicked tile at row ${row}, col ${col}`);
    });

    // Add z-index for proper isometric depth sorting
    tile.zIndex = row + col;

    tilemap.addChild(tile);
  }
}

// Enable sorting in the tilemap for proper depth
tilemap.sortableChildren = true;

// Add tilemap to stage
app.stage.addChild(tilemap);

// Add simple camera controls
let isDragging = false;
let prevX = 0;
let prevY = 0;

app.stage.eventMode = "dynamic";

// Mouse down event
app.stage.on("pointerdown", (event) => {
  isDragging = true;
  prevX = event.global.x;
  prevY = event.global.y;
});

// Mouse move event
app.stage.on("pointermove", (event) => {
  if (isDragging) {
    const dx = event.global.x - prevX;
    const dy = event.global.y - prevY;

    tilemap.x += dx;
    tilemap.y += dy;

    prevX = event.global.x;
    prevY = event.global.y;
  }
});

// Mouse up event
app.stage.on("pointerup", () => {
  isDragging = false;
});

app.stage.on("pointerupoutside", () => {
  isDragging = false;
});

// Handle window resize
window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  tilemap.x = app.screen.width / 2;
});
