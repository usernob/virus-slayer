import { Popup } from "./Popup";

export class PausegamePopup extends Popup {
    #button_continue: HTMLButtonElement | null;
    #button_restart: HTMLButtonElement | null;
    #button_quit: HTMLButtonElement | null;

    constructor() {
        super("pause-popup");
        this.#button_continue = this.element?.querySelector(
            "button#btn-continue",
        ) as HTMLButtonElement | null;
        this.#button_restart = this.element?.querySelector(
            "button#btn-restart",
        ) as HTMLButtonElement | null;
        this.#button_quit = this.element?.querySelector(
            "button#btn-quit",
        ) as HTMLButtonElement | null;

        this.#button_quit?.addEventListener("click", () => {
            location.reload();
        })
    }

    onBtnContinueClick(fn: () => void): void {
        this.#button_continue?.addEventListener("click", () => {
            this.hide();
            fn();
        });
    }

    onBtnRestartClick(fn: () => void): void {
        this.#button_restart?.addEventListener("click", () => {
            this.hide();
            fn();
        });
    }
}
