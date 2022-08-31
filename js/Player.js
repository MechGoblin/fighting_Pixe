import { AnimatedSprite, Container, Texture } from "./pixi.mjs";

export class Player {
    constructor() {
        this._view = new Container();
        this._player = new AnimatedSprite([
            Texture.from("Idle_right_01"),
            Texture.from("Idle_right_02")
        ])

        this._view.addChild(this._player)
    }
    get view() {
        return this._view;
    }
}