// src/core/Camera.ts
import { Container } from 'pixi.js';
import { GAME_CONFIG } from '../config/game-config';


/**
 * Camera class for handling view transformations
 */
export class Camera {
  private _target: Container;
  private _zoom: number = 1;
  private _isDragging: boolean = false;
  private _lastPosition = { x: 0, y: 0 };
  
  /**
   * Create a new Camera instance
   */
  constructor(target: Container) {
    this._target = target;
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners for camera movement
   */
  private setupEventListeners(): void {
    const stage = this._target.parent;
    if (!stage) return;
    
    // Make stage interactive
    stage.eventMode = 'dynamic';
    
    // Mouse down event
    stage.on('pointerdown', (event) => {
      this._isDragging = true;
      this._lastPosition.x = event.global.x;
      this._lastPosition.y = event.global.y;
    });
    
    // Mouse move event
    stage.on('pointermove', (event) => {
      if (this._isDragging) {
        const dx = event.global.x - this._lastPosition.x;
        const dy = event.global.y - this._lastPosition.y;
        
        this._target.x += dx;
        this._target.y += dy;
        
        this._lastPosition.x = event.global.x;
        this._lastPosition.y = event.global.y;
      }
    });
    
    // Mouse up event
    stage.on('pointerup', () => {
      this._isDragging = false;
    });
    
    stage.on('pointerupoutside', () => {
      this._isDragging = false;
    });
    
    // Wheel event for zooming
    window.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.zoom(event.deltaY < 0 ? 1 : -1);
    });
    
    // Window resize event
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  /**
   * Handle window resize
   */
  private handleResize(): void {
    // Adjust camera target position on resize
    if (this._target.parent) {
      this._target.x = this._target.parent.width / 2;
    }
  }
  
  /**
   * Zoom camera
   */
  public zoom(direction: number): void {
    const { zoomMin, zoomMax, zoomStep } = GAME_CONFIG.camera;
    
    const newZoom = this._zoom + (direction * zoomStep);
    
    // Clamp zoom between min and max
    this._zoom = Math.max(zoomMin, Math.min(zoomMax, newZoom));
    
    // Apply zoom to target
    this._target.scale.set(this._zoom);
  }
  
  /**
   * Move camera to center on a specific position
   */
  public centerOn(x: number, y: number): void {
    if (this._target.parent) {
      this._target.x = this._target.parent.width / 2 - (x * this._zoom);
      this._target.y = this._target.parent.height / 2 - (y * this._zoom);
    }
  }
  
  /**
   * Get current zoom level
   */
  public get getCurrentZoom(): number {
    return this._zoom;
  }
  
  /**
   * Check if camera is being dragged
   */
  public get isDragging(): boolean {
    return this._isDragging;
  }
}

export default Camera;