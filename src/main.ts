import "./style.css";
import Game from "./game";
import { StartGamePopup } from "./popup/StartGamePopup";


const game = new Game()
const startPopUp = new StartGamePopup()

startPopUp.onStartButtonClick(() => game.run())
