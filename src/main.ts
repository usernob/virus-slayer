import "./style.css";
import Game from "./game";

class PopUp {
    element: HTMLElement | null;

    constructor(id: string) {
        this.element = document.getElementById(id);
    }

    show() {
        this.element?.classList.remove("hide");
    }

    hide() {
        this.element?.classList.add("hide");
    }
}

class StartGamePopUp extends PopUp {
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

    #inputEventListener() {
        const length: number = this.input?.value.length || 0;
        this.button?.toggleAttribute("disabled", length <= 0);
    }

    #buttonEventListener(fn: () => void) {
        this.hide();
        localStorage.setItem("username", this.input?.value || "usernob");
        fn();
    }

    onStartButtonClick(fn: () => void) {
        this.button?.addEventListener("click", () =>
            this.#buttonEventListener(fn),
        );
    }
}

class Runner {
    game: Game | null;
    startPopUp: StartGamePopUp;

    constructor() {
        this.game = new Game();
        this.startPopUp = new StartGamePopUp();
        this.startPopUp.onStartButtonClick(() => this.game?.run());
    }
}

let runner: Runner = new Runner();
