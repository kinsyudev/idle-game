import { GAME_CONFIG } from "../config/game-config";

export interface GridCoord {
  row: number;
  col: number;
}

export interface ScreenCoord {
  x: number;
  y: number;
}

/**
 * Utility class for handling grid/screen position conversions
 */
export class GridPosition {
  /**
   * Convert grid coordinates (row, col) to isometric screen coordinates (x, y)
   */
  static gridToScreen(gridPos: GridCoord): ScreenCoord {
    const { width: tileWidth, height: tileHeight } = GAME_CONFIG.tile;
    
    return {
      x: (gridPos.col - gridPos.row) * (tileWidth / 2),
      y: (gridPos.col + gridPos.row) * (tileHeight / 2),
    };
  }
  
  /**
   * Convert isometric screen coordinates (x, y) to grid coordinates (row, col)
   * Note: This is an approximation and may need additional logic for precise selection
   */
  static screenToGrid(screenPos: ScreenCoord): GridCoord {
    const { width: tileWidth, height: tileHeight } = GAME_CONFIG.tile;
    
    // Inverse isometric transformation
    const col = (screenPos.x / (tileWidth / 2) + screenPos.y / (tileHeight / 2)) / 2;
    const row = (screenPos.y / (tileHeight / 2) - screenPos.x / (tileWidth / 2)) / 2;
    
    return {
      row: Math.floor(row),
      col: Math.floor(col),
    };
  }
  
  /**
   * Check if grid coordinates are valid within the map bounds
   */
  static isValidPosition(gridPos: GridCoord): boolean {
    const { rows, cols } = GAME_CONFIG.map;
    
    return (
      gridPos.row >= 0 && 
      gridPos.row < rows && 
      gridPos.col >= 0 && 
      gridPos.col < cols
    );
  }
  
  /**
   * Calculate z-index for proper isometric depth sorting
   */
  static calculateZIndex(gridPos: GridCoord): number {
    return gridPos.row + gridPos.col;
  }
}

export default GridPosition;