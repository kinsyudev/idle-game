import { Container, Renderer, Ticker } from "pixi.js";
import { GridCoord } from "./grid-position";
import Tile, { TileType, TileData, createTileTexture } from "./tile";
import { GAME_CONFIG } from "../config/game-config";

/**
 * Manages the isometric tile grid
 */
export class TileMap extends Container {
  private _tiles: Tile[][] = [];
  private _selectedTile: Tile | null = null;

  /**
   * Create a new TileMap instance
   */
  constructor(renderer: Renderer) {
    super();

    // Enable sorting for proper depth
    this.sortableChildren = true;

    // Position the tilemap on screen
    this.x = GAME_CONFIG.display.defaultWidth / 2;
    this.y =
      GAME_CONFIG.map.initialOffsetY +
      GAME_CONFIG.display.defaultWidth / 2 -
      (GAME_CONFIG.map.rows * GAME_CONFIG.tile.height) / 2;

    // Generate the tile grid
    this.generateTiles(renderer);
  }

  /**
   * Generate tiles for the map
   */
  private generateTiles(renderer: Renderer): void {
    const { rows, cols } = GAME_CONFIG.map;

    // Create a 2D array to hold tiles
    this._tiles = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));

    // Create tiles for each grid position
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Determine tile type (just a simple pattern for now)
        let tileType = TileType.GRASS;

        // Create a simple pattern for demonstration
        if ((row + col) % 7 === 0) {
          tileType = TileType.WATER;
        } else if ((row + col) % 5 === 0) {
          tileType = TileType.ROCK;
        } else if ((row + col) % 9 === 0) {
          tileType = TileType.SAND;
        }

        // Create tile data
        const tileData: TileData = {
          type: tileType,
          walkable: tileType !== TileType.WATER && tileType !== TileType.ROCK,
          buildable: tileType === TileType.GRASS || tileType === TileType.SAND,
        };

        // Create texture for the tile
        const texture = createTileTexture(renderer, tileType);

        // Create grid position
        const gridPos: GridCoord = { row, col };

        // Create the tile
        const tile = new Tile(gridPos, texture, tileData);

        // Add event listeners
        tile.on("pointerdown", () => this.onTileClick(tile));

        // Store and add the tile
        this._tiles[row][col] = tile;
        this.addChild(tile);
      }
    }
  }

  /**
   * Handle tile click
   */
  private onTileClick(tile: Tile): void {
    // Deselect previous tile if any
    if (this._selectedTile && this._selectedTile !== tile) {
      this._selectedTile.setSelected(false);
    }

    // Update selected tile reference
    this._selectedTile = tile.isSelected ? null : tile;
  }

  /**
   * Get tile at grid position
   */
  public getTileAt(gridPos: GridCoord): Tile | null {
    const { rows, cols } = GAME_CONFIG.map;

    if (
      gridPos.row >= 0 &&
      gridPos.row < rows &&
      gridPos.col >= 0 &&
      gridPos.col < cols
    ) {
      return this._tiles[gridPos.row][gridPos.col];
    }

    return null;
  }

  /**
   * Get currently selected tile
   */
  public get selectedTile(): Tile | null {
    return this._selectedTile;
  }

  /**
   * Update the tilemap (can be used for animations or other updates)
   * Updated to match PixiJS Ticker callback signature
   */
  public update(ticker: Ticker): void {
    // Get delta from ticker
    const delta = ticker.deltaTime;

    // Any update logic for the tilemap that uses delta
    // For example:
    // this._tiles.forEach(row => row.forEach(tile => tile.update(delta)));
  }
}

export default TileMap;
