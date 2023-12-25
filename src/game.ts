import CoronaVirusImage from "/images/coronavirus.png";
import d from "/images/d.png";
import splash from "/images/splash.png";
import { arrayRemove, formatTime } from "./util";

type Position = {
    x: number;
    y: number;
};

enum TypeOverlay {
    Image,
    Color,
}

enum TypeShape {
    Circle,
    Square,
}

type Stroke = {
    style: string;
    width: number;
};

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
    constructor(
        ctx: CanvasRenderingContext2D,
        width: number = 0,
        height: number = 0,
        pos: Position = { x: 0, y: 0 }
    ) {
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
        this.setColor(color);
        this.setTypeShape(TypeShape.Square);
        this.setStroke(stroke);
        this.draw();
    }

    drawCircle(
        color: string,
        stroke: Stroke = { style: color, width: 0 }
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
    drawImageFromString(src: string) {
        this.setImageFromSrc(src);
        this.draw();
    }
    /**
     * Draws an image from an HTMLImageElement.
     *
     * @param {HTMLImageElement} image - The image to draw.
     */
    drawImageFromElement(image: HTMLImageElement) {
        this.setImageFromElement(image);
        this.draw();
    }

    /**
     * Draws the overlay based on the type.
     *
     * @return {void} This function does not return a value.
     */
    draw() {
        if (this.typeOverlay === TypeOverlay.Image) {
            this.ctx.drawImage(
                this.image,
                this.pos.x,
                this.pos.y,
                this.width,
                this.height
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
                2 * Math.PI
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
                    this.height
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

    setTypeShape(shape: TypeShape) {
        this.typeShape = shape;
    }

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
    constructor(
        ctx: CanvasRenderingContext2D,
        width?: number,
        height?: number,
        pos?: Position
    ) {
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
        this.draw();
    }
}

class Virus extends Entity {
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
     * @param {number} [padding=0] - The padding value for the canvas.
     * @return {void}
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

const dangerAreaHeight = 300;

class Background extends Obj {
    #pulse: boolean = false;
    #pulseFrame: number = 5;
    pulseFrameCount: number = 0;
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    setPulse(state: boolean) {
        this.#pulse = state;
    }
    getPulse(): boolean {
        return this.#pulse;
    }

    getPulseFrame(): number {
        return this.#pulseFrame;
    }
}

class Scenary {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    background: Background[] = [];
    dangerArea: Obj[] = [];
    dBackground: Obj[] = [];
    #bgColors: string = "#232D3F";
    dBottom: Obj;

    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context = context;
        this.canvas = canvas;

        // draw background
        for (let i = 0; i < 4; i++) {
            let bg: Background = new Background(this.context);
            bg.setWidth(canvas.width / 4);
            bg.setHeight(canvas.height);
            bg.setPos({
                x: (canvas.width / 4) * i,
                y: 0,
            });
            bg.setColor(this.#bgColors);
            bg.setStroke({ style: "#a9a9a9", width: 2 });
            this.background.push(bg);

            let dngrArea: Obj = new Obj(
                this.context,
                canvas.width / 4,
                dangerAreaHeight,
                {
                    x: (canvas.width / 4) * i,
                    y: canvas.height - dangerAreaHeight,
                }
            );
            dngrArea.setColor("#ff000050");
            this.dangerArea.push(dngrArea);

            this.dBackground.push(new Obj(context));
        }

        // draw bottom image, i dont know what is called
        let dSrc = new Image();
        dSrc.src = d;
        this.dBottom = new Obj(this.context);
        dSrc.onload = () => {
            for (let i = 0; i < 4; i++) {
                this.dBackground[i].setHeight(dSrc.height);
                this.dBackground[i].setWidth(canvas.width / 4);
                this.dBackground[i].setPos({
                    x: (canvas.width / 4) * i,
                    y: canvas.height - dSrc.height,
                });
                // this.dBackground[i].drawRect(
                //     i % 2 == 0 ? "#408cb0" : "#5f62b1",
                //     {
                //         style: "#a9a9a9",
                //         width: 2,
                //     }
                // );
                this.dBackground[i].setColor(
                    i % 2 == 0 ? "#408cb0" : "#5f62b1"
                );
                this.dBackground[i].setStroke({ style: "#a9a9a9", width: 2 });
            }

            this.dBottom.setWidth(canvas.width - 20);
            this.dBottom.setHeight(dSrc.height - 30);
            this.dBottom.setPos({
                x: 10,
                y: canvas.height - (dSrc.height - 20),
            });
            this.dBottom.setImageFromElement(dSrc);
        };
    }

    draw() {
        for (let i = 0; i < this.background.length; i++) {
            let thisBg: Background = this.background[i];
            if (thisBg.getPulse()) {
                thisBg.pulseFrameCount++;
                if (thisBg.pulseFrameCount >= thisBg.getPulseFrame()) {
                    thisBg.setColor(this.#bgColors);
                }
            }
            thisBg.draw();

            this.dangerArea[i].draw();
            this.dBackground[i].draw();
        }
        this.dBottom.draw();
    }

    pulseBgColor(bgColor: string, index: number) {
        this.background[index].setPulse(true);
        this.background[index].pulseFrameCount = 0;
        this.background[index].setColor(bgColor);
    }
}

class ScoreBoard {
    #scoreBoardElm: HTMLElement;
    #time: number = 0;
    #score: number = 0;
    #fail: number = 0;
    #username: string = "";

    constructor() {
        this.#scoreBoardElm = document.getElementById("score-board")!;
        this.#username = localStorage.getItem("username") || "unknown";
    }

    showScore() {
        if (this.#scoreBoardElm.classList.contains("hide")) {
            this.#scoreBoardElm.classList.remove("hide");
        }
        this.fillScoreBoard("#time", formatTime(this.#time));
        this.fillScoreBoard("#score", this.#score.toString());
        this.fillScoreBoard("#fail", this.#fail.toString());
        this.fillScoreBoard("#username", this.#username.toString());
    }

    fillScoreBoard(id: string, data: string) {
        let elm: HTMLElement | null = this.#scoreBoardElm.querySelector(id);
        if (elm) {
            elm.innerHTML = data;
        }
    }

    getTime(): number {
        return this.#time;
    }

    getScore(): number {
        return this.#score;
    }

    getFail(): number {
        return this.#fail;
    }

    getUsername(): string {
        return this.#username;
    }

    setTime(time: number) {
        this.#time = time;
        this.showScore();
    }

    setScore(score: number) {
        this.#score = score;
        this.showScore();
    }

    setFail(fail: number) {
        this.#fail = fail;
        this.showScore();
    }

    setUsername(username: string) {
        this.#username = username;
        this.showScore();
    }

    incrementTime(i: number) {
        this.#time += i;
        this.showScore();
    }

    incrementScore(i: number) {
        this.#score += i;
        this.showScore();
    }

    incrementFail(i: number) {
        this.#fail += i;
        this.showScore();
    }
}

enum gameState {
    STOPED,
    COUNTDOWN,
    PLAYING,
    PAUSE,
    GAMEOVER,
}

class Game {
    parent: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    frame: number = 0;
    scenary: Scenary;
    animationId: number = 0;
    viruses: Virus[] = [];
    virusSpeed: number = 1;
    scoreboard: ScoreBoard;
    interval: number = 0;
    isPause: boolean = true;
    state: gameState = gameState.STOPED;

    constructor() {
        // initialize canvas
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.canvas.width = 260;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.parent = document.getElementById("main-content") as HTMLElement;

        this.scoreboard = new ScoreBoard();

        // draw scenary
        this.scenary = new Scenary(this.context, this.canvas);

        document.addEventListener("keydown", (ev) => this.eventListener(ev));
    }

    eventListener(ev: KeyboardEvent) {
        let keys = ["d", "f", "j", "k"];
        if (keys.includes(ev.key) && this.state == gameState.PLAYING) {
            let index: number = keys.indexOf(ev.key);
            this.scenary.pulseBgColor("#ffffff50", index);
            this.killVirusInDangerArea(index);
        }

        if (ev.key == "Escape") {
            if (this.state == gameState.PAUSE) {
                this.resume();
            } else if (this.state == gameState.PLAYING) {
                this.pause();
            }
        }
    }

    killVirusInDangerArea(index: number) {
        const arrVirus = this.viruses.filter((items) => {
            return (
                items.isAlive() &&
                items.getIndex() == index &&
                items.getPos().y + items.getHeight() >=
                    this.canvas.height - dangerAreaHeight
            );
        });
        if (arrVirus.length > 0) {
            this.scoreboard.incrementScore(1);
            arrVirus[0].kill();
        }
    }

    draw() {
        if (this.state != gameState.PLAYING) {
            return;
        }

        this.clear();

        this.scenary.draw();
        this.frame++;
        this.virusSpeed += 0.0008;

        for (let i = 0; i < this.viruses.length; i++) {
            const virus = this.viruses[i];

            if (!virus.isAlive()) {
                virus.afterDeathFrame++;
                if (virus.afterDeathFrame >= virus.deathFrame) {
                    this.viruses = arrayRemove(this.viruses, i);
                }
                virus.draw();
                continue;
            }

            virus.setSpeedY(this.virusSpeed);
            virus.move();
            if (
                virus.getPos().y + virus.getHeight() >=
                this.canvas.height - this.scenary.dBackground[0].getHeight()
            ) {
                this.viruses = arrayRemove(this.viruses, i);
                this.scoreboard.incrementFail(1);
            }

            if (this.scoreboard.getFail() >= 10) {
                this.stop();
                return;
            }
        }

        this.animationId = window.requestAnimationFrame(() => this.draw());
    }

    run() {
        let count = 0;
        let countdownElm: HTMLElement = document.getElementById("countdown")!;

        this.state = gameState.COUNTDOWN;

        this.interval = setInterval(() => {
            countdownElm.querySelector("h2")!.innerHTML = (
                3 - count
            ).toString();

            if (count == 3 && this.state == gameState.COUNTDOWN) {
                this.animationId = window.requestAnimationFrame(() =>
                    this.draw()
                );
                countdownElm.classList.add("hide");
                this.scoreboard.showScore();
                this.state = gameState.PLAYING;
            }

            if (this.state == gameState.COUNTDOWN) {
                countdownElm.classList.remove("hide");
                count++;
            }

            if (
                this.state != gameState.PAUSE &&
                this.state != gameState.COUNTDOWN
            ) {
                const newVirus = new Virus(this.context, this.canvas.width / 4);
                newVirus.setPadding(20);
                this.viruses.push(newVirus);
                this.scoreboard.incrementTime(1);
            }
        }, 1000);
    }

    pause() {
        if (this.state != gameState.PAUSE) {
            this.state = gameState.PAUSE;
            window.cancelAnimationFrame(this.animationId);
            clearInterval(this.interval);
            this.clear();
        }
    }

    resume() {
        if (this.state == gameState.PAUSE) {
            this.run();
        }
    }

    stop() {
        window.cancelAnimationFrame(this.animationId);
        removeEventListener("keydown", (ev) => this.eventListener(ev));
        clearInterval(this.interval);
        this.state = gameState.GAMEOVER;
        this.clear();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Game;
