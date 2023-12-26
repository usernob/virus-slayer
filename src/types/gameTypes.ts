export type Position = {
    x: number;
    y: number;
};

export enum TypeOverlay {
    Image,
    Color,
}

export enum TypeShape {
    Circle,
    Square,
}

export type Stroke = {
    style: string;
    width: number;
};

export enum gameState {
    STOPED,
    COUNTDOWN,
    PLAYING,
    PAUSE,
    GAMEOVER,
}
