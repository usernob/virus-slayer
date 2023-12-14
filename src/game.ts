import CoronaVirusImage from "/images/coronavirus.png";
import d from "/images/d.png"
import splash from "/images/splash.png"
import { arrayRemove, randomNumber } from "./util";

type Position = {
    x: number
    y: number
}

enum TypeOverlay {
    Image,
    Color
}


enum TypeShape {
    Circle,
    Square
}

type Stroke = {
    style: string
    width: number
}

class Obj {
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
    constructor(ctx: CanvasRenderingContext2D, width: number = 0, height: number = 0, pos: Position = { x: 0, y: 0 }) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.pos = pos;
    }

    /**
     * Sets the color and stroke of the overlay and redraws it.
     *
     * @param {string} color - The color to set.
     * @param {Stroke} [stroke] - The stroke to set. If not provided, a default stroke will be used.
     * @returns {void}
     */
    drawRect(color: string, stroke: Stroke = { style: color, width: 0 }): void {
        this.color = color;
        this.stroke = stroke || { style: color, width: 0 };
        this.typeOverlay = TypeOverlay.Color;
        this.typeShape = TypeShape.Square;
        this.useStroke = !!(this.stroke.width);
        this.draw();
    }

    drawCircle(color: string, stroke: Stroke = { style: color, width: 0 }): void {
        this.color = color;
        this.stroke = stroke || { style: color, width: 0 };
        this.typeOverlay = TypeOverlay.Color;
        this.typeShape = TypeShape.Circle;
        this.useStroke = !!(this.stroke.width);
        this.draw();
    }

    /**
     * Draws an image onto the canvas based on the provided source string.
     *
     * @param {string} src - The source string of the image to be drawn.
     */
    drawImageFromString(src: string) {
        this.image.src = src;
        this.typeOverlay = TypeOverlay.Image;
        this.draw();
    }
    /**
     * Draws an image from an HTMLImageElement.
     *
     * @param {HTMLImageElement} image - The image to draw.
     */
    drawImageFromElement(image: HTMLImageElement) {
        this.image = image;
        this.typeOverlay = TypeOverlay.Image;
        this.draw();
    }

    /**
     * Draws the overlay based on the type.
     *
     * @return {void} This function does not return a value.
     */
    draw() {
        if (this.typeOverlay === TypeOverlay.Image) {
            this.ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
            return
        }

        if (this.typeShape === TypeShape.Circle) {
            this.ctx.beginPath();
            this.ctx.arc(this.pos.x + this.width / 2, this.pos.y + this.height / 2, this.width / 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.color
            this.ctx.fill();
            if (this.useStroke) {
                this.ctx.lineWidth = this.stroke.width
                this.ctx.strokeStyle = this.stroke.style;
                this.ctx.stroke();
            }
        } else {
            this.ctx.fillStyle = this.color
            this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            if (this.useStroke) {
                this.ctx.lineWidth = this.stroke.width
                this.ctx.strokeStyle = this.stroke.style;
                this.ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
            }
        }

    }

    /**
     * Sets the width of the object.
     * @param {number} width - The width of the object.
     */
    setWidth(width: number): void {
        this.width = width
    }

    /**
     * Gets the width of the object.
     * @returns {number} - The width of the object.
     */
    getWidth(): number {
        return this.width
    }

    /**
     * Sets the height of the object.
     * @param {number} height - The height of the object.
     */
    setHeight(height: number): void {
        this.height = height
    }

    /**
     * Gets the height of the object.
     * @returns {number} - The height of the object.
     */
    getHeight(): number {
        return this.height
    }

    /**
     * Sets the color of the object.
     * @param {string} color - The color of the object.
     */
    setColor(color: string): void {
        this.color = color
    }

    /**
     * Gets the color of the object.
     * @returns {string} - The color of the object.
     */
    getColor(): string {
        return this.color
    }

    /**
     * Sets the image source of the object.
     * @param {string} src - The source of the image.
     */
    setImage(src: string): void {
        this.image.src = src
    }

    /**
     * Gets the image element of the object.
     * @returns {HTMLImageElement} - The image element of the object.
     */
    getImage(): HTMLImageElement {
        return this.image
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
        this.pos = pos
    }
}

class Entity extends Obj {
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
    constructor(ctx: CanvasRenderingContext2D, width?: number, height?: number, pos?: Position) {
        super(ctx, width, height, pos);
    }

    /**
     * Sets the value of speedX to the given number.
     *
     * @param {number} x - The new value for speedX.
     */
    setSpeedX(x: number) {
        this.speedX = x;
    }

    /**
     * Set the value of the speedY property.
     *
     * @param {number} y - The new value for the speedY property.
     */
    setSpeedY(y: number) {
        this.speedY = y;
    }

    /**
     * Moves the object by updating its position and calling the draw method.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    move() {
        this.pos.x += this.speedX;
        this.pos.y += this.speedY;
        this.draw()
    }
}

class Virus extends Entity {
    scale: number;
    index: number;
    isAlive: boolean = true;
    deathFrame: number = 100;
    afterDeathFrame: number = 0;


    /**
     * Create a new Virus.
     *
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas.
     * @param {number} scale - The scale factor for the canvas.
     * @param {number} [padding=0] - The padding value for the canvas.
     * @return {void}
     */
    constructor(context: CanvasRenderingContext2D, scale: number, padding: number = 0) {
        super(context, scale - padding, scale - padding);
        this.scale = scale;

        // randomly place virus on segments
        this.index = Math.floor(Math.random() * 4);
        this.setPos({ x: padding / 2 + this.scale * this.index, y: 0 });
        this.drawImageFromString(CoronaVirusImage);
    }

    getIndex(): number {
        return this.index;
    }

    kill() {
        this.isAlive = false;
        this.drawImageFromString(splash);
    }
}


class Bullet extends Entity {
    scale: number;
    index: number;
    /**
     * Create a new Bullet.
     *
     * @param {CanvasRenderingContext2D} context - The rendering context for the canvas.
     * @param {number} scale - The scale factor for the canvas.
     * @param {number} [index=0] - The index of segments where the bullet is located.
     * @return {void}
     */
    constructor(context: CanvasRenderingContext2D, scale: number, index: number = 0, pos: Position = { x: 0, y: 0 }) {
        super(context);
        this.scale = scale;
        this.index = index;

        this.setWidth(scale);
        this.setHeight(scale);

        let { x: posX, y: posY } = pos;
        posX = scale * index;
        this.setPos({ x: posX, y: posY });
        this.drawCircle("white");

    }

    getIndex(): number {
        return this.index;
    }
}


class Scenary {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    background: Obj[] = [];
    dBottom: Obj;
    dangerArea: Obj;

    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context = context;
        this.canvas = canvas;

        // draw background
        for (let i = 0; i < 4; i++) {
            let piece: Obj = new Obj(this.context, this.canvas.width / 4, this.canvas.height, { x: canvas.width / 4 * i, y: 0 });
            piece.drawRect("#232D3F", { style: "#a9a9a9", width: 2 });
            this.background.push(piece);
        }

        // draw red area
        this.dangerArea = new Obj(this.context);
        this.dangerArea.setPos({ x: 0, y: canvas.height - 300 });
        this.dangerArea.setWidth(canvas.width);
        this.dangerArea.setHeight(300);
        this.dangerArea.drawRect("#ff000050");


        // draw bottom image, i dont know what is called
        let dSrc = new Image();
        dSrc.src = d;
        this.dBottom = new Obj(this.context);
        dSrc.onload = () => {
            this.dBottom.setWidth(canvas.width - 20);
            this.dBottom.setHeight(dSrc.height - 30);
            this.dBottom.setPos({ x: 10, y: canvas.height - (dSrc.height - 20) });
            this.dBottom.drawImageFromElement(dSrc);
        }
    }

    draw() {
        for (let i = 0; i < this.background.length; i++) {
            this.background[i].draw();
        }
        this.dangerArea.draw()
        this.dBottom.draw();
    }
}

class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    frame: number = 0;
    scenary: Scenary;
    animationId: number = 0;
    viruses: Virus[] = [];
    bullets: Bullet[] = [];

    constructor() {
        // initialize canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = 260;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        let parent: HTMLElement = document.getElementById("main-content") as HTMLElement;
        parent.innerHTML = "";
        parent.appendChild(this.canvas);

        // draw scenary
        this.scenary = new Scenary(this.context, this.canvas);

        // initialize viruses
        this.viruses.push(new Virus(this.context, this.canvas.width / 4, 20));

        document.addEventListener("keydown", (event) => {
            let keys = ["d", "f", "j", "k"];
            if (keys.includes(event.key)) {
                this.bullets.push(new Bullet(this.context, this.canvas.width / 4, keys.indexOf(event.key), { x: 0, y: this.canvas.height }));
            }
        })
    }

    #checkCollision(bulletId: number) {
        for (let i = 0; i < this.viruses.length; i++) {
            const virus = this.viruses[i];

            const bullet = this.bullets[bulletId];
            if (!bullet) {
                return
            }

            if (!virus.isAlive) {
                return
            }

            if (!(virus.getIndex() == bullet.getIndex())) {
                return
            }

            if (bullet.getPos().y >= virus.getPos().y && bullet.getPos().y <= virus.getPos().y + virus.getHeight()) {
                this.bullets = arrayRemove(this.bullets, bulletId);
                console.log(this.bullets);
                virus.kill();
            }
        };
    }

    draw() {
        this.clear();
        this.scenary.draw();
        this.frame++;

        if ((this.frame / 87) % 1 == 0) {
            this.viruses.push(new Virus(this.context, this.canvas.width / 4, 20))
        }
        for (let i = 0; i < this.viruses.length; i++) {
            const virus = this.viruses[i];

            if (!virus.isAlive) {
                virus.afterDeathFrame++;
                if (virus.afterDeathFrame >= virus.deathFrame) {
                    this.viruses = arrayRemove(this.viruses, i);
                }
                virus.draw()
                continue
            }

            virus.setSpeedY(2);
            virus.move();
            if (virus.getPos().y >= this.canvas.height - 300) {
                this.viruses = arrayRemove(this.viruses, i);
            }
        }

        for (let j = 0; j < this.bullets.length; j++) {
            const bullet = this.bullets[j];

            bullet.setSpeedY(-25);
            this.#checkCollision(j);

            bullet.move();

            if (bullet.getPos().y <= (0 - bullet.getHeight())) {
                this.bullets = arrayRemove(this.bullets, j);
            }
        }
        this.animationId = window.requestAnimationFrame(() => this.draw());
    }

    run() {
        this.animationId = window.requestAnimationFrame(() => this.draw());
    }

    stop() {
        window.cancelAnimationFrame(this.animationId);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Game;