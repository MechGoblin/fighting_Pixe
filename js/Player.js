import { Container, Graphics } from "./pixi.mjs";
import { engine } from "./engine.js";

export class Player {
    constructor({
        position,
        velocity,
        fighterNumber,
        frameNumbers,
        attackBox = { offset: {}, width: undefined, height: undefined }
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
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[0], "PL" + fighterNumber.toString() + "_Idle_right"), { x: position.x, y: position.y }, 2.5, 0.15, { x: 0.6, y: 0.5 }, true),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[1], "PL" + fighterNumber.toString() + "_Run_right"), { x: position.x, y: position.y }, 2.5, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[2], "PL" + fighterNumber.toString() + "_Jump_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[3], "PL" + fighterNumber.toString() + "_Fall_right"), { x: position.x - 15, y: position.y + 10 }, 2.5, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[4], "PL" + fighterNumber.toString() + "_Take_hit_right"), { x: position.x - 15, y: position.y }, 2.5, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[5], "PL" + fighterNumber.toString() + "_Death_right"), { x: position.x - 15, y: position.y }, 2.5, 0.15, { x: 0.6, y: 0.5 }, false),
            engine.createAnimatedSprite(engine.textureArr(frameNumbers[6], "PL" + fighterNumber.toString() + "_attack_right"), { x: position.x + 70, y: position.y - 20 }, 2.5, 0.15, { x: 0, y: 0.5 }, false)
        ]
        this.animat.forEach((value) => {
            value.visible = false
            this._view.addChild(value)
        });
        this.animat[0].visible = true;
        this.currentAnimation = 0; //Starts with "idle"
        //collision
        this.attackBoxRight = new Graphics().beginFill(0x000000, 0.7).drawRect(this._view.getChildAt(0).position.x, this._view.getChildAt(0).position.y - 40, 210, 50).endFill();
        this.attackBoxLeft = new Graphics().beginFill(0x000000, 0.1).drawRect(this._view.getChildAt(0).position.x - 200, this._view.getChildAt(0).position.y - 40, 210, 50).endFill();
        this.hitBox = new Graphics().beginFill(0xff0000, 0.1).drawRect(this._view.getChildAt(0).position.x - 30, this._view.getChildAt(0).position.y - 60, 70, 130).endFill();
        this.attackBoxRight.visible = false;
        this.attackBoxLeft.visible = false;
        this.hitBox.visible = false;
        this._view.addChild(this.attackBoxRight, this.hitBox, this.attackBoxLeft)
            //mechanics
        this.lastKey = "";
        this.dead = false;
        this.onGround = false;
        this.fallTime = false // use for fall animation
        this.health = 100

    }
    get view() {
            return this._view;
        }
        //updates parameters when used in a loop
    update() {

        this._view.position.x += this.velocity.x;
        this._view.position.y += this.velocity.y;
        if (this._view.position.y >= canvas.height - 360) { //400?  this.hitBox.height
            this.velocity.y = 0
            this._view.position.y = canvas.height - 360
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
        console.log(this.animat[6].anchor)
        if (this.lastKey === 'd' || this.lastKey === 'ArrowRight') {
            if (this.animat[6].scale.x !== 2.)
                this.animat[6].scale.x = 2.5;
            if (this.animat[6].anchor.x !== 0.5)
                this.animat[6].anchor.x = 0.5;
        }
        if (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') {
            if (this.animat[6].scale.x === 2.5)
                this.animat[6].scale.x = -2.5;
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
                if (this.animat[5].scale.x !== 2.)
                    this.animat[5].scale.x = 2.5;
                this.dead = true
                this.switchSprite(5)
            } else if (this.health <= 0 && (this.lastKey === 'a' || this.lastKey === "ArrowLeft")) {
                if (this.animat[5].scale.x === 2.5)
                    this.animat[5].scale.x = -2.5;
                this.dead = true
                this.switchSprite(5)
            } else if (this.lastKey === 'd' || this.lastKey === "ArrowRight") {
                if (this.animat[4].scale.x !== 2.)
                    this.animat[4].scale.x = 2.5;
                this.switchSprite(4)
            } else if (this.lastKey === 'a' || this.lastKey === "ArrowLeft") {
                if (this.animat[4].scale.x === 2.5)
                    this.animat[4].scale.x = -2.5;
                this.switchSprite(4)

            }
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