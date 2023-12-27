import { arrayRemove } from "./util";
import { Virus } from "./object/Virus";
import { Scenary } from "./hud/Scenary";
import { ScoreBoard } from "./hud/ScoreBoard";
import { gameState } from "./types/gameTypes";
import { PausegamePopup } from "./popup/PauseGamePopup";
import { GameOverPopup } from "./popup/GameOverPopup";

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
    interval: NodeJS.Timeout | undefined;
    state: gameState = gameState.STOPED;
    #pausePopup: PausegamePopup;
    #gameoverPopup: GameOverPopup;

    constructor() {
        // initialize canvas
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.canvas.width = 260;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        // The parent element is the element where the game will be displayed
        this.parent = document.getElementById("main-content") as HTMLElement;

        this.scoreboard = new ScoreBoard();

        this.#pausePopup = new PausegamePopup();
        this.#gameoverPopup = new GameOverPopup();

        this.registerEventListener();

        // draw scenary
        this.scenary = new Scenary(this.context, this.canvas);
    }

    /**
     * Registers all event listeners and specifies the callback to be executed when the event occurs
     *
     * @returns {void}
     */
    registerEventListener(): void {
        document.addEventListener("keydown", (ev) =>
            this.keydownEventListener(ev),
        );

        this.#pausePopup.onBtnContinueClick(() => this.resume());
        this.#pausePopup.onBtnRestartClick(() => this.restart());

        this.#gameoverPopup.onBtnRestart(() => this.restart());
    }

    /**
     * This is callback for keydown event listener, used for game control
     *
     * @param {KeyboardEvent} ev - The keydown event
     * @returns {void}
     */
    keydownEventListener(ev: KeyboardEvent): void {
        let keys = ["d", "f", "j", "k"];
        if (keys.includes(ev.key) && this.state == gameState.PLAYING) {
            let index: number = keys.indexOf(ev.key);
            // make background of this segments/index lighter than other segments so is kind of pulsating
            this.scenary.pulseBgColor("#ffffff50", index);

            this.killVirusInDangerArea(index);
        }

        // escape is used for pause and resume toggle
        if (ev.key == "Escape") {
            if (this.state == gameState.PAUSE) {
                this.resume();
            } else if (this.state == gameState.PLAYING) {
                this.pause();
            }
        }
    }

    /**
     * If virus in danger area, kill it
     *
     * @param {number} index - The index of the segment
     * @returns {void}
     */
    killVirusInDangerArea(index: number): void {
        // filter virus and create new array of virus, only alive virus and in same index of segment and in danger area will be returned
        const arrVirus = this.viruses.filter((items) => {
            return (
                items.isAlive() &&
                items.getIndex() == index &&
                items.getPos().y + items.getHeight() >=
                    this.canvas.height - dangerAreaHeight
            );
        });

        if (arrVirus.length > 0) {
            // only kill the first virus in the segment
            this.scoreboard.incrementScore(1);
            arrVirus[0].kill();
        }
    }

    /**
     * this method used for update and redraw it
     *
     * @return {void} This function does not return a value.
     */
    draw(): void {
        if (this.state != gameState.PLAYING) {
            return;
        }

        this.clear();

        this.scenary.draw();
        this.frame++;
        this.virusSpeed += 0.0008;

        for (let i = 0; i < this.viruses.length; i++) {
            const virus = this.viruses[i];

            // if virus is death, draw an death animation
            // death animation will be draw for deathFrame number of frame
            // if afterdeathFrame is equal or greater to death number of frame, virus will be removed
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

            // check if virus is out of screen and increment fail
            if (
                virus.getPos().y + virus.getHeight() >=
                this.canvas.height - this.scenary.dBackground[0].getHeight()
            ) {
                this.viruses = arrayRemove(this.viruses, i);
                this.scoreboard.incrementFail(1);
            }

            // check the fail score is greater than or equal 10 stop the game and show gameover popup
            if (this.scoreboard.getFail() >= 10) {
                this.stop();
                this.#gameoverPopup.setScore(
                    this.scoreboard.getTimeString(),
                    this.scoreboard.getScoreString(),
                    this.scoreboard.getUsername(),
                );
                this.#gameoverPopup.show();
                return;
            }
        }

        // request animation frame
        this.animationId = window.requestAnimationFrame(() => this.draw());
    }

    /**
     * methods to start the game for the first time or after it has been stopped
     *
     * @return {void} This function does not return a value.
     */
    run(): void {
        let count = 0;
        let countdownElm: HTMLElement = document.getElementById("countdown")!;

        // before starting the game, show countdown
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

            // every second spawn virus and increment the time
            if (this.state == gameState.PLAYING) {
                const newVirus = new Virus(this.context, this.canvas.width / 4);
                newVirus.setPadding(20);
                this.viruses.push(newVirus);
                this.scoreboard.incrementTime(1);
            }
        }, 1000);
    }

    pause(): void {
        if (this.state != gameState.PAUSE) {
            this.state = gameState.PAUSE;
            window.cancelAnimationFrame(this.animationId);
            clearInterval(this.interval);
            this.clear();
            this.#pausePopup.show();
        }
    }

    resume(): void {
        if (this.state == gameState.PAUSE) {
            this.#pausePopup.hide();
            this.run();
        }
    }

    stop(): void {
        window.cancelAnimationFrame(this.animationId);
        removeEventListener("keydown", (ev) => this.keydownEventListener(ev));
        clearInterval(this.interval);
        this.state = gameState.GAMEOVER;
        this.scoreboard.hide();
        this.clear();
    }

    restart(): void {
        this.virusSpeed = 1;
        this.scoreboard.resetScore();
        this.frame = 0;
        this.viruses = [];
        this.stop();
        this.run();
    }

    clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Game;
