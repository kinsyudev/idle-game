// src/core/Game.ts
import { Application, Container, Ticker } from "pixi.js";
import TileMap from "../world/tile-map";
import Camera from "./camera";
import { GAME_CONFIG } from "../config/game-config";
import FPSCounter from "../ui/fps-counter";

/**
 * Main game class
 */
export class Game {
  private _app: Application;
  // Using definite assignment assertion operator (!) to tell TypeScript
  // these will be initialized in the init method before being used
  private _tileMap!: TileMap;
  private _camera!: Camera;

  private _fpsCounter!: FPSCounter;
  private _uiContainer!: Container;

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

    // Create UI container (for elements that shouldn't move with the camera)
    this._uiContainer = new Container();
    this._app.stage.addChild(this._uiContainer);

    // Create and add FPS counter to UI container
    this._fpsCounter = new FPSCounter();
    this._uiContainer.addChild(this._fpsCounter);

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

    // Update FPS counter
    this._fpsCounter.update(ticker);

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

  /**
   * Toggle FPS counter visibility
   */
  public toggleFPSCounter(): void {
    if (this._fpsCounter) {
      this._fpsCounter.visible = !this._fpsCounter.visible;
      // Also update the config
      GAME_CONFIG.ui.fpsCounter.show = this._fpsCounter.visible;
    }
  }
}

export default Game;
