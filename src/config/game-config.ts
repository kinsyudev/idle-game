/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
  // Display settings
  display: {
    defaultWidth: window.innerWidth,
    defaultHeight: window.innerHeight,
    backgroundColor: 0x2a2a2a,
  },

  // Tile settings
  tile: {
    width: 64, // Width of the tile
    height: 64, // Height of the diamond (top face)
    cubeHeight: 64, // Total height of the cube (add this)
    baseColor: 0x88cc88,
    selectedColor: 0xff0000,
    outlineColor: 0xffffff,
    highlightOpacity: 0.8, // Add this for consistent hover effect
  },

  // Map settings
  map: {
    rows: 10,
    cols: 10,
    initialOffsetX: 0,
    initialOffsetY: 0,
  },

  // Camera settings
  camera: {
    zoomMin: 0.5,
    zoomMax: 2.0,
    zoomStep: 0.1,
    panSpeed: 1.0,
  },

  // UI settings
  ui: {
    fpsCounter: {
      show: true,
      updateInterval: 500, // ms
      position: { x: 10, y: 10 },
    },
  },

  // Debug settings
  debug: {
    showGrid: true,
    showCoordinates: true,
    logClicks: true,
  },
};

export type GameConfig = typeof GAME_CONFIG;
