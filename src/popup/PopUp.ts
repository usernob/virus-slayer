export class PopUp {
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

