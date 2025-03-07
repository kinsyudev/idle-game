import {
  Sprite,
  Texture,
  Graphics,
  FederatedPointerEvent,
  Renderer,
} from "pixi.js";
import GridPosition, { GridCoord } from "./grid-position";
import { GAME_CONFIG } from "../config/game-config";

export enum TileType {
  GRASS = "grass",
  WATER = "water",
  ROCK = "rock",
  SAND = "sand",
}

export interface TileData {
  type: TileType;
  walkable: boolean;
  buildable: boolean;
  elevation?: number;
}

/**
 * Represents a single tile in the isometric grid
 */
export class Tile extends Sprite {
  private _gridPosition: GridCoord;
  private _isSelected: boolean = false;
  private _tileData: TileData;

  private _originalY?: number;

  /**
   * Create a new Tile instance
   */
  constructor(gridPos: GridCoord, texture: Texture, tileData: TileData) {
    super(texture);

    this._gridPosition = gridPos;
    this._tileData = tileData;

    // Set position based on grid coordinates
    const screenPos = GridPosition.gridToScreen(gridPos);
    this.x = screenPos.x;
    this.y = screenPos.y;

    // Set anchor to the middle-bottom of the tile for proper stacking
    // This is changed from (0.5, 0.5) to (0.5, 1.0) for cube appearance
    // We draw our cubes from rtl, so we start from the right
    this.anchor.set(0.5, 1.0);

    // Set z-index for proper depth sorting
    this.zIndex = GridPosition.calculateZIndex(gridPos);

    // Make the tile interactive
    this.eventMode = "static";
    this.cursor = "pointer";

    // Set up event listeners
    this.on("pointerdown", this.onPointerDown);
    this.on("pointerover", this.onPointerOver);
    this.on("pointerout", this.onPointerOut);
  }

  /**
   * Handle pointer down event
   */
  private onPointerDown = (event: FederatedPointerEvent): void => {
    this.toggleSelected();
    console.log(
      `Clicked tile at row ${this._gridPosition.row}, col ${this._gridPosition.col}`
    );
  };

  // Update the pointer event handlers
  private onPointerOver = (): void => {
    if (!this._isSelected) {
      this.alpha = GAME_CONFIG.tile.highlightOpacity;
    }
  };

  private onPointerOut = (): void => {
    if (!this._isSelected) {
      this.alpha = 1.0;
    }
  };
  /**
   * Toggle selected state
   */
  public toggleSelected(): void {
    this._isSelected = !this._isSelected;

    if (this._isSelected) {
      // Create highlight effect
      this.tint = GAME_CONFIG.tile.selectedColor;

      // Optional: Add a slight elevation effect for selected tiles
      if (!this._originalY) {
        this._originalY = this.y;
      }
      this.y = this._originalY - 5; // Lift the tile up slightly
    } else {
      // Remove highlight effect
      this.tint = 0xffffff;

      // Reset position if elevated
      if (this._originalY !== undefined) {
        this.y = this._originalY;
      }
    }
  }

  /**
   * Set selected state
   */
  public setSelected(selected: boolean): void {
    if (this._isSelected !== selected) {
      this._isSelected = selected;

      if (selected) {
        // Create highlight effect
        this.tint = GAME_CONFIG.tile.selectedColor;

        // Optional: Add a slight elevation effect for selected tiles
        if (!this._originalY) {
          this._originalY = this.y;
        }
        this.y = this._originalY - 5; // Lift the tile up slightly
      } else {
        // Remove highlight effect
        this.tint = 0xffffff;

        // Reset position if elevated
        if (this._originalY !== undefined) {
          this.y = this._originalY;
        }
      }
    }
  }

  /**
   * Get grid position
   */
  public get gridPosition(): GridCoord {
    return this._gridPosition;
  }

  /**
   * Get tile data
   */
  public get tileData(): TileData {
    return this._tileData;
  }

  /**
   * Check if tile is selected
   */
  public get isSelected(): boolean {
    return this._isSelected;
  }

  /**
   * Check if tile is walkable
   */
  public get isWalkable(): boolean {
    return this._tileData.walkable;
  }

  /**
   * Check if tile is buildable
   */
  public get isBuildable(): boolean {
    return this._tileData.buildable;
  }
}
/**
 * Create a texture for an isometric cube tile
 */
export function createTileTexture(
  renderer: Renderer,
  tileType: TileType = TileType.GRASS
): Texture {
  const { width, height, cubeHeight, baseColor, outlineColor } = GAME_CONFIG.tile;
  const graphics = new Graphics();

  // Set color based on tile type
  let fillColor = baseColor;
  let topColor: number;
  let leftColor: number;
  let rightColor: number;

  switch (tileType) {
    case TileType.WATER:
      fillColor = 0x4444ff;
      break;
    case TileType.ROCK:
      fillColor = 0x888888;
      break;
    case TileType.SAND:
      fillColor = 0xddcc88;
      break;
    default:
      fillColor = baseColor;
  }

  // Create shades for the sides
  topColor = fillColor;
  leftColor = adjustBrightness(fillColor, -20); // Darker
  rightColor = adjustBrightness(fillColor, -40); // Darkest

  // Set line style
  graphics.setStrokeStyle({
    color: 0x000000,
    width: 1,
    alpha: 0.5,
  });

  // Calculate vertical offset using cubeHeight
  // This determines how tall the cube appears
  const verticalOffset = cubeHeight - height / 2;

  // Draw the top face (diamond)
  graphics.moveTo(width / 2, 0);
  graphics.lineTo(width, height / 4);
  graphics.lineTo(width / 2, height / 2);
  graphics.lineTo(0, height / 4);
  graphics.closePath();
  graphics.fill(topColor);

  // Draw the right face (right side of cube)
  graphics.moveTo(width, height / 4);
  graphics.lineTo(width, height / 4 + verticalOffset);
  graphics.lineTo(width / 2, height / 2 + verticalOffset);
  graphics.lineTo(width / 2, height / 2);
  graphics.closePath();
  graphics.fill(rightColor);

  // Draw the left face (left side of cube)
  graphics.moveTo(0, height / 4);
  graphics.lineTo(width / 2, height / 2);
  graphics.lineTo(width / 2, height / 2 + verticalOffset);
  graphics.lineTo(0, height / 4 + verticalOffset);
  graphics.closePath();
  graphics.fill(leftColor);

  return renderer.generateTexture(graphics);
}
/**
 * Adjust the brightness of a color
 * @param color - The hex color to adjust
 * @param percent - The percentage to adjust (-100 to 100)
 */
function adjustBrightness(color: number, percent: number): number {
  // Extract RGB components
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;

  // Adjust brightness
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

  // Combine back to hex
  return (newR << 16) | (newG << 8) | newB;
}

export default Tile;
