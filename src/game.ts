import { arrayRemove } from "./util";
import { Virus } from "./object/Virus";
import { Scenary } from "./hud/Scenary";
import { ScoreBoard } from "./hud/ScoreBoard";
import { gameState } from "./types/gameTypes";

export const dangerAreaHeight = 300;


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
                    this.draw(),
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
