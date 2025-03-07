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
}

/**
 * Represents a single tile in the isometric grid
 */
export class Tile extends Sprite {
  private _gridPosition: GridCoord;
  private _isSelected: boolean = false;
  private _tileData: TileData;

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

    // Adjust the y position to account for the 3D height effect
    const heightOffset = GAME_CONFIG.tile.height / 8;
    this.y = screenPos.y;

    // Set anchor to center of the tile
    this.anchor.set(0.5, 0.5);

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

  /**
   * Handle pointer over event
   */
  private onPointerOver = (): void => {
    if (!this._isSelected) {
      this.alpha = 0.8;
    }
  };

  /**
   * Handle pointer out event
   */
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
    this.tint = this._isSelected ? GAME_CONFIG.tile.selectedColor : 0xffffff;
  }

  /**
   * Set selected state
   */
  public setSelected(selected: boolean): void {
    this._isSelected = selected;
    this.tint = this._isSelected ? GAME_CONFIG.tile.selectedColor : 0xffffff;
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
 * Create a texture for a 3D isometric tile
 */
export function createTileTexture(
  renderer: Renderer,
  tileType: TileType = TileType.GRASS
): Texture {
  const { width, height, outlineColor, baseColor } = GAME_CONFIG.tile;
  const tileHeight = height * (GAME_CONFIG.tile.heightRatio || 0.5);

  const graphics = new Graphics();

  // Calculate colors for different faces
  let fillColor = baseColor;
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
  const topColor = fillColor;
  const leftColor = adjustColor(
    fillColor,
    GAME_CONFIG.tile.leftFaceBrightness || -40
  );
  const rightColor = adjustColor(
    fillColor,
    GAME_CONFIG.tile.rightFaceBrightness || -20
  );

  // Draw TOP face (diamond/rhombus)
  graphics.moveTo(width / 2, height / 2 - tileHeight);
  graphics.lineTo(width, height / 2);
  graphics.lineTo(width / 2, height / 2 + tileHeight);
  graphics.lineTo(0, height / 2);
  graphics.closePath();
  graphics.fill(topColor);

  // Draw RIGHT face
  graphics.moveTo(width, height / 2); // Top-right
  graphics.lineTo(width / 2, height / 2 + tileHeight); // Bottom-right
  graphics.lineTo(width / 2, height / 2 + tileHeight + tileHeight); // Bottom-center
  graphics.lineTo(width, height / 2 + tileHeight); // Top-center of right face
  graphics.closePath();
  graphics.fill(rightColor);

  // Draw LEFT face
  graphics.moveTo(0, height / 2); // Top-left
  graphics.lineTo(width / 2, height / 2 + tileHeight); // Bottom-left
  graphics.lineTo(width / 2, height / 2 + tileHeight + tileHeight); // Bottom-center
  graphics.lineTo(0, height / 2 + tileHeight); // Top-center of left face
  graphics.closePath();
  graphics.fill(leftColor);

  // Add an outline
  graphics.lineStyle(1, outlineColor, 0.5);
  graphics.moveTo(width / 2, height / 2 - tileHeight);
  graphics.lineTo(width, height / 2);
  graphics.lineTo(width / 2, height / 2 + tileHeight);
  graphics.lineTo(0, height / 2);
  graphics.lineTo(width / 2, height / 2 - tileHeight);
  graphics.stroke();

  return renderer.generateTexture(graphics);
}

/**
 * Adjust a color by a certain amount
 * @param color The base color in hex format (0xRRGGBB)
 * @param amount The amount to adjust (-255 to 255)
 * @returns The adjusted color
 */
function adjustColor(color: number, amount: number): number {
  const r = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (color & 0xff) + amount));

  return (r << 16) | (g << 8) | b;
}

export default Tile;
