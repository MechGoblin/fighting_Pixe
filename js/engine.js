import * as PIXI from "./pixi.mjs";

export class engine {
    //устанавливать для каждого отдельного спрайта в функции гравитации. Перенести её сюда?
    static gravity = 0.7;
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

    //Можно создавать AnimatedSprite с помощью атласа, но так включаю начальные параметры
    static createAnimatedSprite(textureNames, position = { x: 0, y: 0 }, scaleVal = 1, animatVal = 1, Play = false) {
        const animatedSprite = new PIXI.AnimatedSprite(textureNames);
        animatedSprite.position.x = position.x;
        animatedSprite.position.y = position.y;
        animatedSprite.scale.set(scaleVal);
        animatedSprite.animationSpeed = animatVal;
        if (Play) {
            animatedSprite.gotoAndPlay(0);
        }
        return animatedSprite;
    };
}