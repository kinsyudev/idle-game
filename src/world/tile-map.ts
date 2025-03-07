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
    // Center the map horizontally, adjust vertically to account for cube height
    this.x = GAME_CONFIG.display.defaultWidth / 2;
    this.y =
      GAME_CONFIG.map.initialOffsetY +
      GAME_CONFIG.display.defaultHeight / 4 -
      (GAME_CONFIG.map.rows * GAME_CONFIG.tile.height) / 4;

    // Generate the tile grid
    this.generateTiles(renderer);
  }

  // Optionally, you can add a method to create tiles with varied heights for terrain
  private createElevatedTile(
    renderer: Renderer,
    gridPos: GridCoord,
    type: TileType,
    elevation: number = 0
  ): Tile {
    // Create base tile data
    const tileData: TileData = {
      type,
      walkable: type !== TileType.WATER && type !== TileType.ROCK,
      buildable: type === TileType.GRASS || type === TileType.SAND,
      elevation, // Store elevation in tile data
    };

    // Create texture
    const texture = createTileTexture(renderer, type);

    // Create tile
    const tile = new Tile(gridPos, texture, tileData);

    // Adjust y position based on elevation
    if (elevation > 0) {
      tile.y -= elevation * (GAME_CONFIG.tile.cubeHeight / 4);
    }

    return tile;
  }

  /**
   * Generate tiles for the map with terrain elevation
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

        // Create texture for the tile (still using the 3D cube texture)
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

  // /**
  //  * Generate a simple elevation map with small hills and valleys
  //  */
  // private generateSimpleElevationMap(rows: number, cols: number): number[][] {
  //   const elevationMap: number[][] = Array(rows)
  //     .fill(0)
  //     .map(() => Array(cols).fill(0));

  //   // Create a couple of "mountain" peaks
  //   const peaks = [
  //     { row: Math.floor(rows / 4), col: Math.floor(cols / 4), height: 3 },
  //     {
  //       row: Math.floor((rows * 3) / 4),
  //       col: Math.floor((cols * 3) / 4),
  //       height: 4,
  //     },
  //   ];

  //   // Generate elevation based on distance from peaks
  //   for (let row = 0; row < rows; row++) {
  //     for (let col = 0; col < cols; col++) {
  //       // Find the closest peak and set elevation based on distance
  //       let maxElevation = 0;

  //       for (const peak of peaks) {
  //         const distance = Math.sqrt(
  //           Math.pow(row - peak.row, 2) + Math.pow(col - peak.col, 2)
  //         );

  //         // Set elevation based on distance from peak
  //         const elevationFromPeak = Math.max(
  //           0,
  //           Math.floor(peak.height - distance / 2)
  //         );

  //         // Keep the highest elevation if multiple peaks affect this tile
  //         maxElevation = Math.max(maxElevation, elevationFromPeak);
  //       }

  //       elevationMap[row][col] = maxElevation;
  //     }
  //   }

  //   return elevationMap;
  // }

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
