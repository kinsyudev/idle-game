import { Sprite, Texture, Graphics, FederatedPointerEvent } from 'pixi.js';
import GridPosition, { GridCoord } from './grid-position';
import { GAME_CONFIG } from '../config/game-config';


export enum TileType {
  GRASS = 'grass',
  WATER = 'water',
  ROCK = 'rock',
  SAND = 'sand',
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
    this.y = screenPos.y;
    
    // Set anchor to center of the tile
    this.anchor.set(0.5, 0.5);
    
    // Set z-index for proper depth sorting
    this.zIndex = GridPosition.calculateZIndex(gridPos);
    
    // Make the tile interactive
    this.eventMode = 'static';
    this.cursor = 'pointer';
    
    // Set up event listeners
    this.on('pointerdown', this.onPointerDown);
    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);
  }
  
  /**
   * Handle pointer down event
   */
  private onPointerDown = (event: FederatedPointerEvent): void => {
    this.toggleSelected();
    console.log(`Clicked tile at row ${this._gridPosition.row}, col ${this._gridPosition.col}`);
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
 * Create a texture for an isometric tile
 */
export function createTileTexture(
  renderer: any,
  tileType: TileType = TileType.GRASS
): Texture {
  const { width, height, baseColor, outlineColor } = GAME_CONFIG.tile;
  const graphics = new Graphics();
  
  // Set color based on tile type
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
  
  // Draw isometric tile shape
  graphics.setStrokeStyle(0xffffff);
  // Diamond shape
  graphics.moveTo(width / 2, 0);
  graphics.lineTo(width, height / 2);
  graphics.lineTo(width / 2, height);
  graphics.lineTo(0, height / 2);
  graphics.closePath();
  
  graphics.fill(fillColor);
  
  return renderer.generateTexture(graphics);
}

export default Tile;