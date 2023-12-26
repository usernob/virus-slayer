import { formatTime } from "@/util";

export class ScoreBoard {
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
