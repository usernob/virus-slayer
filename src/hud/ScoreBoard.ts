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

    showScore(): void {
        if (this.#scoreBoardElm.classList.contains("hide")) {
            this.#scoreBoardElm.classList.remove("hide");
        }
        this.fillScoreBoard("#time", this.getTimeString());
        this.fillScoreBoard("#score", this.getScoreString());
        this.fillScoreBoard("#fail", this.getFailString());
        this.fillScoreBoard("#username", this.getUsername());
    }

    fillScoreBoard(id: string, data: string): void {
        let elm: HTMLElement | null = this.#scoreBoardElm.querySelector(id);
        if (elm) {
            elm.innerHTML = data;
        }
    }

    getTimeString(): string {
        return formatTime(this.#time);
    }

    getScoreString(): string {
        return this.#score.toString();
    }

    getFailString(): string {
        return this.#fail.toString();
    }

    getFail(): number {
        return this.#fail;
    }

    getUsername(): string {
        return this.#username;
    }

    setTime(time: number): void {
        this.#time = time;
        this.showScore();
    }

    setScore(score: number): void {
        this.#score = score;
        this.showScore();
    }

    setFail(fail: number): void {
        this.#fail = fail;
        this.showScore();
    }

    setUsername(username: string): void {
        this.#username = username;
        this.showScore();
    }

    incrementTime(i: number): void {
        this.#time += i;
        this.showScore();
    }

    incrementScore(i: number): void {
        this.#score += i;
        this.showScore();
    }

    incrementFail(i: number): void {
        this.#fail += i;
        this.showScore();
    }

    resetScore(): void {
        this.#time = 0;
        this.#score = 0;
        this.#fail = 0;
        this.showScore();
    }

    hide(): void {
        this.#scoreBoardElm.classList.add("hide");
    }
}
