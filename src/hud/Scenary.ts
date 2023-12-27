import { Obj } from "@/object/Obj";
import { Background } from "./Background";
import d from "/images/d.png";
import { dangerAreaHeight } from "@/game";

export class Scenary {
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
                },
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
                this.dBackground[i].setColor(
                    i % 2 == 0 ? "#408cb0" : "#5f62b1",
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

    draw(): void {
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

    pulseBgColor(bgColor: string, index: number): void {
        this.background[index].setPulse(true);
        this.background[index].pulseFrameCount = 0;
        this.background[index].setColor(bgColor);
    }
}
