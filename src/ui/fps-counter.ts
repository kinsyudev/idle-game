// src/ui/FPSCounter.ts
import { Text, TextStyle, Ticker } from "pixi.js";

/**
 * FPS Counter class that displays the current frames per second
 */
export class FPSCounter extends Text {
  private _updateInterval: number = 500; // Update every 500ms for smoother reading
  private _lastUpdate: number = 0;

  /**
   * Create a new FPS Counter
   */
  constructor() {
    super({
      text: "FPS: 0",
      style: {
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "bold",
        fill: "#ffffff",
        stroke: "#000000",
        align: "left",
      },
    });

    // Position in top-right corner with some padding
    this.x = 10;
    this.y = 10;

    // Set anchor point
    this.anchor.set(0, 0);

    // Make sure the FPS counter is always on top
    this.zIndex = 1000;
  }

  /**
   * Update the FPS display
   */
  public update(ticker: Ticker): void {
    // Get current time
    const now = performance.now();

    // Only update text at the specified interval (to avoid flicker)
    if (now - this._lastUpdate > this._updateInterval) {
      // Get FPS from ticker
      const fps = Math.round(ticker.FPS);

      // Update text
      this.text = `FPS: ${fps}`;

      // Add color coding for FPS
      if (fps >= 55) {
        this.style.fill = "#00ff00"; // Green for good FPS
      } else if (fps >= 30) {
        this.style.fill = "#ffff00"; // Yellow for acceptable FPS
      } else {
        this.style.fill = "#ff0000"; // Red for poor FPS
      }

      this._lastUpdate = now;
    }
  }
}

export default FPSCounter;
