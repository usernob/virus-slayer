import { Position } from "@/types/gameTypes";
import { Obj } from "./Obj";

export class Entity extends Obj {
    protected speedY: number = 0;
    protected speedX: number = 0;
    /**
     * Create a new Entity.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} [width] - The width of the canvas.
     * @param {number} [height] - The height of the canvas.
     * @param {Position} [pos] - The position of the canvas.
     */
    constructor(
        ctx: CanvasRenderingContext2D,
        width?: number,
        height?: number,
        pos?: Position,
    ) {
        super(ctx, width, height, pos);
    }

    /**
     * Sets the value of speedX to the given number.
     *
     * @param {number} x - The new value for speedX.
     */
    setSpeedX(x: number): void {
        this.speedX = x;
    }

    /**
     * Set the value of the speedY property.
     *
     * @param {number} y - The new value for the speedY property.
     */
    setSpeedY(y: number): void {
        this.speedY = y;
    }

    /**
     * Moves the object by updating its position and calling the draw method.
     */
    move(): void {
        this.pos.x += this.speedX;
        this.pos.y += this.speedY;
        this.draw();
    }
}
