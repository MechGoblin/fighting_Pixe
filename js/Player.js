"use strict";
import { Container, Graphics } from "./pixi.js";
import { engine } from "./engine.js";

export class Player {
    constructor({
        position,
        velocity,
        fighterNumber,
        frameNumbers,
        groundBox
    }) {
        //setup
        this.position = position;
        this.velocity = velocity;
        this.gravity = engine.gravity;
        this.fighterNumber = fighterNumber; //To select a fighter later
        this.frameNumbers = frameNumbers;
        //animation
        this._view = new Container();
        this.animat = [
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[0], "PL" + fighterNumber.toString() + "_Idle_right"), { x: position.x, y: position.y }, { x: 2.5, y: 2.5 }, 0.15, { x: 0.6, y: 0.5 }, true),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[1], "PL" + fighterNumber.toString() + "_Run_right"), { x: position.x, y: position.y }, { x: 2.5, y: 2.5 }, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[2], "PL" + fighterNumber.toString() + "_Jump_right"), { x: position.x - 15, y: position.y + 10 }, { x: 2.5, y: 2.5 }, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[3], "PL" + fighterNumber.toString() + "_Fall_right"), { x: position.x - 15, y: position.y + 10 }, { x: 2.5, y: 2.5 }, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[4], "PL" + fighterNumber.toString() + "_Take_hit_right"), { x: position.x - 15, y: position.y }, { x: 2.5, y: 2.5 }, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[5], "PL" + fighterNumber.toString() + "_Death_right"), { x: position.x - 15, y: position.y }, { x: 2.5, y: 2.5 }, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[6], "PL" + fighterNumber.toString() + "_attack_right"), { x: position.x, y: position.y - 25 }, { x: 1, y: 1.88405 }, 0.15, { x: 0.5, y: 0.5 }, false)
        ]
        this.animat.forEach((value) => {
            value.visible = false
            this._view.addChild(value)
        });
        //settings of position
        this.view.getChildAt(6).position = { x: this.view.getChildAt(6).position.x + this.view.getChildAt(6).width / 3.3, y: this.view.getChildAt(6).position.y - this.view.getChildAt(6).height / 64 }

        //Starts with "idle"
        this.animat[0].visible = true;
        this.currentAnimation = 0;
        //collision
        this.attackBoxRight = new Graphics().beginFill(0x000000, 0.7).drawRect(
            this.view.getChildAt(0).position.x,
            this.view.getChildAt(0).position.y - this.view.getChildAt(6).height / 8,
            this.view.getChildAt(6).width * 3 / 4,
            this.view.getChildAt(6).height / 4).endFill();
        this.attackBoxLeft = new Graphics().beginFill(0x000000, 0.7).drawRect(
            this.view.getChildAt(0).position.x - this.view.getChildAt(6).width * 0.7,
            this.view.getChildAt(0).position.y - this.view.getChildAt(6).height / 8,
            this.view.getChildAt(6).width * 0.75,
            this.view.getChildAt(6).height / 4).endFill();
        this.hitBox = new Graphics().beginFill(0xff0000, 0.7).drawRect(
            this.view.getChildAt(0).position.x - this.view.getChildAt(0).width / 4,
            this.view.getChildAt(0).position.y - this.view.getChildAt(0).height / 2,
            this.view.getChildAt(0).width / 2,
            this.view.getChildAt(0).height).endFill();
        this.rightBlockBox = new Graphics().beginFill(0x0000ff, 0.7).drawRect(
            this.view.getChildAt(0).position.x + this.view.getChildAt(0).width / 4,
            this.view.getChildAt(0).position.y - this.view.getChildAt(0).height / 2,
            this.view.getChildAt(0).width / 2,
            this.view.getChildAt(0).height).endFill();
        this.leftBlockBox = new Graphics().beginFill(0x0000ff, 0.7).drawRect(
            this.view.getChildAt(0).position.x - this.view.getChildAt(0).width / 1.55,
            this.view.getChildAt(0).position.y - this.view.getChildAt(0).height / 2,
            this.view.getChildAt(0).width / 2,
            this.view.getChildAt(0).height).endFill();
        //debug Collision
        this.attackBoxRight.visible = true;
        this.attackBoxLeft.visible = true;
        this.hitBox.visible = true;
        this._view.addChild(this.attackBoxRight, this.hitBox, this.attackBoxLeft, this.rightBlockBox, this.leftBlockBox)
            //mechanics
        this.lastKey = "";
        this.dead = false;
        this.onGround = false;
        this.fallTime = false // use for fall animation
        this.health = 100
            //gravity
        this.groundBox = groundBox

    }
    get view() { return this._view; }
        //updates parameters when used in a loop
    update() {

        this._view.position.x += this.velocity.x;
        this._view.position.y += this.velocity.y;


        if (this._view.position.y >= innerHeight - 0.16 * innerHeight * 3 - this.hitBox.height) {
            this.velocity.y = 0
            this._view.position.y = innerHeight - 0.16 * innerHeight * 3 - this.hitBox.height
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
            if (this.animat[6].scale.x < 0)
                this.animat[6].scale.x = -1 * this.animat[6].scale.x;
            if (this.animat[6].anchor.x !== 0.5)
                this.animat[6].anchor.x = 0.5;
        }
        if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
            if (this.animat[6].scale.x > 0)
                this.animat[6].scale.x = -1 * this.animat[6].scale.x;
            if (this.animat[6].anchor.x === 0.5)
                this.animat[6].anchor.x = 0;
        }
        this.switchSprite(6)
        this.isAttacking = true
    }
    takeHit() {
        this.health -= 20
        console.log(this.health)

        if (this.health <= 0 && (this.lastKey === 'd' || this.lastKey === "ArrowRight")) {
            // if (this.animat[5].scale.x !== 2.)
            //     this.animat[5].scale.x = 2.5;
            this.dead = true
            this.switchSprite(5)
        } else if (this.health <= 0 && (this.lastKey === 'a' || this.lastKey === "ArrowLeft")) {
            // if (this.animat[5].scale.x === 2.5)
            //     this.animat[5].scale.x = -2.5;
            this.dead = true
            this.switchSprite(5)
        } else if (this.lastKey === 'd' || this.lastKey === "ArrowRight") {
            // if (this.animat[4].scale.x !== 2.)
            //     this.animat[4].scale.x = 2.5;
            this.switchSprite(4)
        } else if (this.lastKey === 'a' || this.lastKey === "ArrowLeft") {
            // if (this.animat[4].scale.x === 2.5)
            //     this.animat[4].scale.x = -2.5;
            this.switchSprite(4)

        }
    }
    block() {
            this.velocity.y = 0;
            this.velocity.x = 0;

            this.blocking = true;
        }
        //look number of animation in array "animat"
    switchSprite(nextAnimation) {
        if (this.currentAnimation === 6 && this.animat[6].currentFrame < this.animat[6].totalFrames - 1) return
        else if (this.currentAnimation === 4 && this.animat[4].currentFrame < this.animat[4].totalFrames - 1) return


        if (nextAnimation !== this.currentAnimation) {
            this.animat[nextAnimation].visible = true;
            this.animat[nextAnimation].gotoAndPlay(0);
            this.animat[this.currentAnimation].visible = false;
            this.currentAnimation = nextAnimation;
        }
    }



}