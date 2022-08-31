import * as PIXI from "./pixi.mjs";

import { assetsMap } from "./assetsMap.js";
import { Player } from "./Player.js";

let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader,
    resources = PIXI.Loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

// Create the application
const app = new Application({
    width: 1024,
    height: 576,
    backgroundColor: 0xc2c2c2,
    view: document.getElementById("canvas"),
});

const runGame = () => {
    //background
    const bg = new Sprite(Texture.from("background"));
    app.stage.addChild(bg);
    //player
    const player = new Player();
    app.stage.addChild(player.view)
    const shop = createAnimatedSprite(textureArr(5, "tile"), { x: 685, y: 128 }, 2.75, 0.2, true);
    //shop.gotoAndPlay(0);
    app.stage.addChild(shop);
}

//image index = {00;099}
export const textureArr = (size, textureName) => {
    const textures = [];
    for (let i = 0; i <= size; i++) {
        const val = i < 10 ? `0${i}` : `${i}`;
        const texture = PIXI.Texture.from(textureName + `0${val}.png`);
        textures.push(texture);
    }
    return textures;
}
export const createAnimatedSprite = (textureNames, position = { x: 0, y: 0 }, scaleVal = 1, animatVal = 1, Play = false) => {
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

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


assetsMap.sprites.forEach((value) => app.loader.add(value.name, value.url));
app.loader.load(runGame)