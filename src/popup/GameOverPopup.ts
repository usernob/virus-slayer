import { Popup } from "./Popup";

export class GameOverPopup extends Popup {
    #time: HTMLElement | null;
    #score: HTMLElement | null;
    #player: HTMLElement | null;
    #btn_restart: HTMLButtonElement | null;

    constructor() {
        super("gameover-popup");

        this.#time = this.element?.querySelector(
            "p>span#gameover-time",
        ) as HTMLElement | null;
        this.#score = this.element?.querySelector(
            "p>span#gameover-score",
        ) as HTMLElement | null;
        this.#player = this.element?.querySelector(
            "p>span#gameover-player",
        ) as HTMLElement | null;
        this.#btn_restart = this.element?.querySelector(
            "button#btn-gameover-restart",
        ) as HTMLButtonElement | null;
    }

    setScore(time: string, score: string, player: string): void {
        this.#innerText(this.#time, time);
        this.#innerText(this.#score, score);
        this.#innerText(this.#player, player);
    }

    #innerText<T extends HTMLElement | null>(elm: T, data: string): void {
        if (elm) {
            elm.innerText = data;
        }
    }

    onBtnRestart(fn: () => void): void {
        this.#btn_restart?.addEventListener("click", () => {
            this.hide();
            fn();
        });
    }
}
