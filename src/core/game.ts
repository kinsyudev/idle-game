// src/core/Game.ts
import { Application, Ticker } from "pixi.js";
import TileMap from "../world/tile-map";
import Camera from "./camera";
import { GAME_CONFIG } from "../config/game-config";

/**
 * Main game class
 */
export class Game {
  private _app: Application;
  // Using definite assignment assertion operator (!) to tell TypeScript
  // these will be initialized in the init method before being used
  private _tileMap!: TileMap;
  private _camera!: Camera;
  private _isInitialized: boolean = false;

  /**
   * Create a new Game instance
   */
  constructor() {
    // Create Pixi application
    this._app = new Application();
  }

  /**
   * Initialize the game
   */
  public async init(): Promise<void> {
    // Initialize the Pixi application
    await this._app.init({
      width: GAME_CONFIG.display.defaultWidth,
      height: GAME_CONFIG.display.defaultHeight,
      backgroundColor: GAME_CONFIG.display.backgroundColor,
      antialias: true,
    });

    // Add canvas to the DOM
    document.body.appendChild(this._app.canvas);

    // Create and add tile map
    this._tileMap = new TileMap(this._app.renderer);
    this._app.stage.addChild(this._tileMap);

    // Create camera
    this._camera = new Camera(this._tileMap);

    // Set up game loop - fixed the ticker callback signature
    this._app.ticker.add(this.update, this);

    this._isInitialized = true;

    console.log("Game initialized successfully");
  }

  /**
   * Update game state (called each frame)
   * Updated signature to match PixiJS Ticker callback
   */
  private update(ticker: Ticker): void {
    if (!this._isInitialized) return;

    // Update tile map - pass the ticker directly
    this._tileMap.update(ticker);

    // Additional update logic goes here
  }

  /**
   * Clean up resources when game is destroyed
   */
  public destroy(): void {
    this._app.destroy(true, { children: true });
    this._isInitialized = false;
  }

  /**
   * Get the Pixi application instance
   */
  public get app(): Application {
    return this._app;
  }

  /**
   * Get the tile map
   */
  public get tileMap(): TileMap {
    return this._tileMap;
  }

  /**
   * Get the camera
   */
  public get camera(): Camera {
    return this._camera;
  }
}

export default Game;
