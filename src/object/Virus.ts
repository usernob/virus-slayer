import CoronaVirusImage from "/images/coronavirus.png";
import splash from "/images/splash.png";
import { Entity } from "./Entity";

export class Virus extends Entity {
    scale: number;
    padding: number = 0;
    index: number;
    alive: boolean = true;
    deathFrame: number = 40;
    afterDeathFrame: number = 0;

    /**
     * Create a new Virus.
     *
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas.
     * @param {number} scale - The scale factor for the canvas.
     */
    constructor(context: CanvasRenderingContext2D, scale: number) {
        super(context, scale, scale);
        this.scale = scale;

        // randomly place virus on segments between 0 - 3
        this.index = Math.floor(Math.random() * 4);
        this.setPos({ x: this.scale * this.index, y: 0 - this.getHeight() });
        this.drawImageFromString(CoronaVirusImage);
    }

    getIndex(): number {
        return this.index;
    }

    isAlive() {
        return this.alive;
    }

    setPadding(padding: number) {
        this.padding = padding;
        this.setWidth(this.scale - padding);
        this.setHeight(this.scale - padding);
        this.setPos({
            x: padding / 2 + this.scale * this.index,
            y: this.getPos().y,
        });
    }

    kill() {
        this.alive = false;
        this.setPadding(0);
        this.drawImageFromString(splash);
    }
}
