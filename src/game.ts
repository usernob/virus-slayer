import CoronaVirusImage from "/public/images/coronavirus.png";
import d from "/public/images/d.png"
import { arrayRemove } from "./util";

type Position = {
    x: number
    y: number
}

enum TypeOverlay {
    Image,
    Color
}


type Stroke = {
    style: string
    width: number
}

class Obj {
    protected width: number;
    protected height: number;
    protected color: string = "#000000";
    protected stroke: Stroke = { style: "#000000", width: 1 };
    protected type?: TypeOverlay | undefined;
    protected pos: Position;
    protected ctx: CanvasRenderingContext2D;
    protected image: HTMLImageElement = new Image();

    constructor(ctx: CanvasRenderingContext2D, width?: number, height?: number, pos?: Position) {
        this.ctx = ctx;
        this.width = width || 0;
        this.height = height || 0;
        this.pos = pos || { x: 0, y: 0 };
        return this;
    }

    drawColor(color: string, stroke?: Stroke) {
        this.color = color;
        this.stroke = stroke || { style: color, width: 0 };
        this.type = TypeOverlay.Color;
        this.update();
    }

    drawImageFromString(src: string) {
        this.image.src = src;
        this.type = TypeOverlay.Image;
        this.update();
    }
    drawImageFromElement(image: HTMLImageElement) {
        this.image = image;
        this.type = TypeOverlay.Image;
        this.update();
    }

    update() {
        switch (this.type) {
            case TypeOverlay.Image:
                this.ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
                break;
            case TypeOverlay.Color:
                this.ctx.fillStyle = this.color
                this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
                this.ctx.lineWidth = this.stroke.width
                this.ctx.strokeStyle = this.stroke.style;
                this.ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
                // this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
                // this.ctx.fillStyle = this.color
                // this.ctx.fill();
                // this.ctx.lineWidth = this.stroke.width
                // this.ctx.strokeStyle = this.stroke.style;
                // // this.ctx.fillRect(this.pos.x, this.pos.y, this.width - (this.stroke.width * 2), this.height);
                // this.ctx.stroke();
                break;
            default:
                break;
        }
    }


    setWidth(width: number) {
        this.width = width
    }

    getWidth(): number {
        return this.width
    }

    setHeight(height: number) {
        this.height = height
    }

    getHeight(): number {
        return this.height
    }

    setColor(color: string) {
        this.color = color
    }

    getColor(): string {
        return this.color
    }

    setImage(src: string) {
        this.image.src = src
    }

    getImage(): HTMLImageElement {
        return this.image
    }

    getPos(): Position {
        return this.pos;
    }

    setPos(pos: Position) {
        this.pos = pos
    }


}

class Entity extends Obj {
    protected speedY: number = 0;
    protected speedX: number = 0;
    constructor(ctx: CanvasRenderingContext2D, width?: number, height?: number, pos?: Position) {
        super(ctx, width, height, pos);
    }

    setSpeedX(x: number) {
        this.speedX = x;
    }

    setSpeedY(y: number) {
        this.speedY = y;
    }

    move() {
        this.pos.x += this.speedX;
        this.pos.y += this.speedY;
        this.update()
    }
}

class Virus extends Entity {
    scale: number;
    index: number;

    constructor(context: CanvasRenderingContext2D, scale: number, padding: number = 0) {
        super(context, scale - padding, scale - padding);
        this.scale = scale;
        this.index = Math.floor(Math.random() * 4);
        this.setPos({ x: padding / 2 + this.scale * this.index, y: 0 });
        this.drawImageFromString(CoronaVirusImage);
    }
}

class Scenary {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    background: Obj[] = [];
    dBottom: Obj;

    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context = context;
        this.canvas = canvas;
        let dSrc = new Image();
        dSrc.src = d;
        this.dBottom = new Obj(this.context);
        this.dBottom.setWidth(canvas.width - 20);
        this.dBottom.setHeight(dSrc.height - 30);
        this.dBottom.setPos({ x: 10, y: canvas.height - (dSrc.height - 20) });

        for (let i = 0; i < 4; i++) {
            let piece: Obj = new Obj(this.context, this.canvas.width / 4, this.canvas.height, { x: canvas.width / 4 * i, y: 0 });
            piece.drawColor("#232D3F", { style: "#a9a9a9", width: 2 });
            this.background.push(piece);
        }
        this.dBottom.drawImageFromElement(dSrc);
    }

    update() {
        for (let i = 0; i < this.background.length; i++) {
            this.background[i].update();
        }
        this.dBottom.update();
    }
}

class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    frame: number = 0;
    scenary: Scenary;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 260;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        let parent: HTMLElement = document.getElementById("main-content") as HTMLElement;
        parent.innerHTML = "";
        parent.appendChild(this.canvas);
        this.scenary = new Scenary(this.context, this.canvas);
    }

    run() {
        let viruses: Virus[] = [];
        console.log(this.canvas.height);
        setInterval(() => {
            this.clear();
            this.scenary.update();
            this.frame++;
            if ((this.frame / 200) % 1 == 0) {
                viruses.push(new Virus(this.context, this.canvas.width / 4, 20))
            }
            for (let i = 0; i < viruses.length; i++) {
                let virus = viruses[i];
                virus.setSpeedY(1);
                virus.move();
                if (virus.getPos().y >= this.canvas.height - 300) {
                    viruses = arrayRemove(viruses, i);
                }
            }
        }, 10)
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Game;