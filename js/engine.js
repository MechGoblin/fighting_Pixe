"use strict";
import * as PIXI from "./pixi.js";


export class engine {
    //устанавливать для каждого отдельного спрайта в функции гравитации. Перенести её сюда?
    static gravity = 0.7;
    //Попробовать по другому взять ресурсы
    //Улучшить в дальнейшем, пока передавать массив с кадрами анимаций. Возможно решение с помощью promise 
    //static sheet = PIXI.Loader.shared.resources["../assets/test.json"].spritesheet;

    static determineWinner({ player1, player2, timerId }) {
        clearTimeout(timerId)
        document.querySelector('#displayText').style.display = 'flex'
        if (player1.health === player2.health) {
            document.querySelector('#displayText').innerHTML = 'Tie'
        } else if (player1.health > player2.health) {
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
        } else if (player1.health < player2.health) {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
        }
    }


    static rectangularCollision({ object1, object2 }) {
            const bounds1 = object1.getBounds();
            const bounds2 = object2.getBounds();

            return bounds1.x < bounds2.x + bounds2.width &&
                bounds1.x + bounds1.width > bounds2.x &&
                bounds1.y < bounds2.y + bounds2.height &&
                bounds1.y + bounds1.height > bounds2.y;
        }
        //Преобразовает набор текстур с одинаковым названием в массив
    static textureArr(size, textureName) {
            const textures = [];
            for (let i = 0; i <= size; i++) {
                const val = i < 10 ? `0${i}` : `${i}`;
                const texture = PIXI.Texture.from(textureName + `0${val}.png`);
                textures.push(texture);
            }
            return textures;
        }
        //
    static UpdatePlayer({ player, kH, kW }) {

        player.animat.forEach((value) => {
            value.scale.x *= kW;
            value.scale.y *= kH;
            value.position.x *= kW;
            value.position.y *= kH;
        });
        player.hitBox.scale.x *= kW;
        player.hitBox.scale.y *= kH;
        player.hitBox.position.x *= kW;
        player.hitBox.position.y *= kH;
        player.attackBoxRight.scale.x *= kW;
        player.attackBoxRight.scale.y *= kH;
        player.attackBoxRight.position.x *= kW;
        player.attackBoxRight.position.y *= kH;
        player.attackBoxLeft.scale.x *= kW;
        player.attackBoxLeft.scale.y *= kH;
        player.attackBoxLeft.position.x *= kW;
        player.attackBoxLeft.position.y *= kH;
    }
    static createAnimatedSprite(textureNames, position = { x: 0, y: 0 }, scaleVal = { x: 1, y: 1 }, animatVal = 1, anchor = { x: 0, y: 0 }, Play = false) {
        const animatedSprite = new PIXI.AnimatedSprite(textureNames);
        animatedSprite.position.x = position.x;
        animatedSprite.position.y = position.y;
        animatedSprite.scale.x = scaleVal.x;
        animatedSprite.scale.y = scaleVal.y;

        animatedSprite.scale.x = innerWidth / animatedSprite.width * 0.25;
        animatedSprite.scale.y = innerHeight / animatedSprite.height * 0.4;

        animatedSprite.animationSpeed = animatVal;
        animatedSprite.anchor = anchor;
        if (Play) {
            animatedSprite.gotoAndPlay(0);
        }
        return animatedSprite;
    };
}