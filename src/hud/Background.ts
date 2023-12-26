import { Obj } from "@/object/Obj";

export class Background extends Obj {
    #pulse: boolean = false;
    #pulseFrame: number = 5;
    pulseFrameCount: number = 0;
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    setPulse(state: boolean) {
        this.#pulse = state;
    }
    getPulse(): boolean {
        return this.#pulse;
    }

    getPulseFrame(): number {
        return this.#pulseFrame;
    }
}
