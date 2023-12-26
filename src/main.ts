import "./style.css";
import Game from "./game";
import { StartGamePopUp } from "./popup/StartGamePopUp";


class Runner {
    game: Game | null;
    startPopUp: StartGamePopUp;

    constructor() {
        this.game = new Game();
        this.startPopUp = new StartGamePopUp();
        this.startPopUp.onStartButtonClick(() => this.game?.run());
    }
}

new Runner();
