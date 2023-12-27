import { Position, Stroke, TypeOverlay, TypeShape } from "@/types/gameTypes";

export class Obj {
    protected width: number;
    protected height: number;
    protected color: string = "#000000";
    protected useStroke: boolean = true;
    protected stroke: Stroke = { style: "#000000", width: 1 };
    protected typeOverlay?: TypeOverlay | undefined;
    protected typeShape?: TypeShape | undefined;
    protected pos: Position;
    protected ctx: CanvasRenderingContext2D;
    protected image: HTMLImageElement = new Image();

    /**
     * Initializes a new instance of the class.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} [width=0] - The width of the instance.
     * @param {number} [height=0] - The height of the instance.
     * @param {Position} [pos={ x: 0, y: 0 }] - The position of the instance.
     */
    constructor(
        ctx: CanvasRenderingContext2D,
        width: number = 0,
        height: number = 0,
        pos: Position = { x: 0, y: 0 },
    ) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.pos = pos;
    }

    /**
     * draw a rectangle
     *
     * @param {string} color - The color to rectangle.
     * @param {Stroke} [stroke] - The stroke to set. If not provided, a default stroke will be used.
     * @returns {void}
     */
    drawRect(color: string, stroke: Stroke = { style: color, width: 0 }): void {
        this.setColor(color);
        this.setTypeShape(TypeShape.Square);
        this.setStroke(stroke);
        this.draw();
    }

    /**
     * draw a circle
     *
     * @param {string} color - the color of circle
     * @param {Stroke} [stroke] - The stroke to set. If not provided, a default stroke will be used.
     * @returns {void}
     */
    drawCircle(
        color: string,
        stroke: Stroke = { style: color, width: 0 },
    ): void {
        this.setColor(color);
        this.setTypeShape(TypeShape.Circle);
        this.setStroke(stroke);
        this.draw();
    }

    /**
     * Draws an image onto the canvas based on the provided source string.
     *
     * @param {string} src - The source string of the image to be drawn.
     */
    drawImageFromString(src: string): void {
        this.setImageFromSrc(src);
        this.draw();
    }
    /**
     * Draws an image from an HTMLImageElement.
     *
     * @param {HTMLImageElement} image - The image to draw.
     */
    drawImageFromElement(image: HTMLImageElement): void {
        this.setImageFromElement(image);
        this.draw();
    }

    /**
     * this method used for update and redraw it based on currently state of object
     *
     * @return {void} This function does not return a value.
     */
    draw(): void {
        if (this.typeOverlay === TypeOverlay.Image) {
            this.ctx.drawImage(
                this.image,
                this.pos.x,
                this.pos.y,
                this.width,
                this.height,
            );
            return;
        }

        if (this.typeShape === TypeShape.Circle) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.pos.x + this.width / 2,
                this.pos.y + this.height / 2,
                this.width / 2,
                0,
                2 * Math.PI,
            );
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            if (this.useStroke) {
                this.ctx.lineWidth = this.stroke.width;
                this.ctx.strokeStyle = this.stroke.style;
                this.ctx.stroke();
            }
        } else {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            if (this.useStroke) {
                this.ctx.lineWidth = this.stroke.width;
                this.ctx.strokeStyle = this.stroke.style;
                this.ctx.strokeRect(
                    this.pos.x,
                    this.pos.y,
                    this.width,
                    this.height,
                );
            }
        }
    }

    /**
     * Sets the width of the object.
     * @param {number} width - The width of the object.
     */
    setWidth(width: number): void {
        this.width = width;
    }

    /**
     * Gets the width of the object.
     * @returns {number} - The width of the object.
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Sets the height of the object.
     * @param {number} height - The height of the object.
     */
    setHeight(height: number): void {
        this.height = height;
    }

    /**
     * Gets the height of the object.
     * @returns {number} - The height of the object.
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Sets the color of the object.
     * @warning this method sould not use with setImageFromSrc or setImageFromElement
     * @param {string} color - The color of the object.
     */
    setColor(color: string): void {
        this.typeOverlay = TypeOverlay.Color;
        this.color = color;
    }

    /**
     * Gets the color of the object.
     * @returns {string} - The color of the object.
     */
    getColor(): string {
        return this.color;
    }

    /**
     * Sets the stroke
     * @param stroke - The Stroke object
     */
    setStroke(stroke: Stroke): void {
        this.stroke = stroke;
        this.useStroke = !!this.stroke.width;
    }

    /**
     * Gets the stroke of object
     * @returns {Stroke} - the stroke
     */
    getStroke(): Stroke {
        return this.stroke;
    }

    /**
     * set Type of shape
     * @param {TypeShape} shape - the type of shape
     */
    setTypeShape(shape: TypeShape) {
        this.typeShape = shape;
    }

    /**
     * get type shape
     * @returns {TypeShape | undefined}
     */
    getTypeShape(): TypeShape | undefined {
        return this.typeShape;
    }

    /**
     * Sets the image source of the object.
     * @warning this method sould not use with setColor
     * @param {string} src - The source of the image.
     */
    setImageFromSrc(src: string): void {
        this.image.src = src;
        this.typeOverlay = TypeOverlay.Image;
    }

    /**
     * Sets the image from Element
     * @warning this method sould not use with setColor
     * @param {HTMLImageElement} image - The image object
     */
    setImageFromElement(image: HTMLImageElement): void {
        this.image = image;
        this.typeOverlay = TypeOverlay.Image;
    }

    /**
     * Gets the image element of the object.
     * @returns {HTMLImageElement} - The image element of the object.
     */
    getImage(): HTMLImageElement {
        return this.image;
    }

    /**
     * Gets the position of the object.
     * @returns {Position} - The position of the object.
     */
    getPos(): Position {
        return this.pos;
    }

    /**
     * Sets the position of the object.
     * @param {Position} pos - The position of the object.
     */
    setPos(pos: Position): void {
        this.pos = pos;
    }
}
