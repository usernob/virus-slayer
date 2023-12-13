import "./style.css";
import Game from "./game";

enum Status {
    Start,
    Runnig,
    Pause,
    GameOver
}


class PopUp {
    #parent!: HTMLElement;
    #element!: Node;

    constructor(id: string) {
        let parent: HTMLElement | null = document.querySelector("#main-content");
        if (parent) {
            this.#parent = parent
        }

        let element: HTMLTemplateElement = document.getElementById(id) as HTMLTemplateElement;
        if (element) {
            this.#element = element.content.cloneNode(true);
        }
    }

    showPopUp(): void {
        this.#parent.innerHTML = "";
        this.#parent.appendChild(this.#element);
    }

    protected getElement(): HTMLElement {
        return this.#element as HTMLElement;
    }

    protected getParent(): HTMLElement {
        return this.#parent;
    }
}

class StartGamePopUp extends PopUp {
    button: HTMLButtonElement;
    input: HTMLInputElement;
    constructor() {
        super("template-start-game");
        this.button = this.getElement().querySelector("button#play-btn") as HTMLButtonElement;
        this.input = this.getElement().querySelector("input#player_name") as HTMLInputElement;
        this.showPopUp()
        this.InputEventListener()
    }

    ButtonPlayClickListener(callback: (this: HTMLButtonElement, ev: Event) => void) {
        this.button.addEventListener("click", callback)
    }

    InputEventListener() {
        this.input.addEventListener("input", () => {
            this.button.disabled = !(this.input.value.length > 0)
        })
    }
}

class GameRunner {
    status: Status;
    constructor() {
        const game = new Game();
        this.status = Status.Start;
        // const startGamePopup = new StartGamePopUp();
        // startGamePopup.ButtonPlayClickListener(() => {
        // this.status = Status.Runnig;
        game.run();
        // })

    }

}

let game: GameRunner = new GameRunner();