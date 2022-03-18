export class Canvas {
    constructor(param = {}) {
        this.view = document.getElementById(param.canvasID);
        this.context = this.view.getContext("2d");
        this.view.width = param.w;
        this.view.height = param.h;
    }
}
