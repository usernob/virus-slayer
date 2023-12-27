import { Popup } from "./Popup";

export class StartGamePopup extends Popup {
    button: HTMLButtonElement | null;
    input: HTMLInputElement | null;

    constructor() {
        super("start-game-popup");

        this.button = this.element?.querySelector(
            "button",
        ) as HTMLButtonElement | null;

        this.input = this.element?.querySelector(
            "input",
        ) as HTMLInputElement | null;

        this.input?.addEventListener("input", () => this.#inputEventListener());
    }

    #inputEventListener(): void {
        const length: number = this.input?.value.length || 0;
        this.button?.toggleAttribute("disabled", length <= 0);
    }

    #buttonEventListener(): void {
        this.hide();
        localStorage.setItem("username", this.input?.value || "usernob");
    }

    onStartButtonClick(fn: () => void): void {
        this.button?.addEventListener("click", () => {
            this.#buttonEventListener();
            fn();
        });
    }
}
