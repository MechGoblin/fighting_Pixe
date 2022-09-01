import { Container } from "./pixi.mjs";
import { engine } from "./engine.js";

export class Player {
    constructor({ position, velocity }) {
        //setup
        this.position = position;
        this.velocity = velocity;
        this.gravity = engine.gravity;

        //animation
        this._view = new Container();

        this.animat = [
            engine.createAnimatedSprite(engine.textureArr(7, "Idle_right"), { x: position.x, y: position.y }, 2.5, 0.15, true),
            engine.createAnimatedSprite(engine.textureArr(7, "Run_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, false),
            engine.createAnimatedSprite(engine.textureArr(1, "Jump_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, false),
            engine.createAnimatedSprite(engine.textureArr(1, "Fall_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, false),
            engine.createAnimatedSprite(engine.textureArr(3, "Take_hit"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, false),
            engine.createAnimatedSprite(engine.textureArr(5, "Death_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, false),
            engine.createAnimatedSprite(engine.textureArr(5, "attack_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.01, false)
        ]

        this.animat.forEach((value) => {
            value.visible = false
            this._view.addChild(value)
        });
        this.animat[0].visible = true;
        this.currentAnimation = 0; //Starts with "idle"

        //For mechanic
        this.lastKey = "";
        this.dead = false;
        this.onGround = false;
        this.fallTime = false // use for fall animation
    }
    get view() {
            return this._view;
        }
        //updates parameters when used in a loop
    update() {
        this._view.position.x += this.velocity.x;
        this._view.position.y += this.velocity.y;
        if (this._view.position.y + this.velocity.y + this.animat[0].textures[0].height >= canvas.height - 400) { //400?
            this.velocity.y = 0
            this._view.position.y = 150
            this.onGround = true
        } else {
            this.velocity.y += this.gravity
            this.onGround = false
            this.fallTime = true
        }
        if (this.onGround) {
            if (this.fallTime) {
                this.fallTime = false
            }
        }
    }

    attack() {
            if (this.lastKey === 'd' || this.lastKey === 'ArrowRight') {
                this.switchSprite(6)
            }
            if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
                this.switchSprite(6)
            }
            this.isAttacking = true
        }
        //look number of animation in array "animat"
    switchSprite(nextAnimation) {
        if (nextAnimation !== this.currentAnimation) {
            this.animat[nextAnimation].visible = true;
            this.animat[nextAnimation].gotoAndPlay(0);
            this.animat[this.currentAnimation].visible = false;
            this.currentAnimation = nextAnimation;
        }
    }



}