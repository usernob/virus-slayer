import "./style.css";
import Game from "./game";
import { StartGamePopup } from "./popup/StartGamePopup";


class Runner {
    game: Game | null;
    startPopUp: StartGamePopup;

    constructor() {
        this.game = new Game();
        this.startPopUp = new StartGamePopup();
        this.startPopUp.onStartButtonClick(() => this.game?.run());
    }
}

new Runner();
