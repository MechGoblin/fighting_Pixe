import * as PIXI from "./pixi.mjs";
import { assetsMap } from "./assetsMap.js";
import { Player } from "./Player.js";
import { engine } from "./engine.js";

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
const runGame = () => {

    //preloop
    const stage = app.stage;
    //let sheet = PIXI.Loader.shared.resources["../assets/test.json"].spritesheet;  To create animations from a spritesheet

    //level
    //background
    const bg = new Sprite(Texture.from("background"));
    stage.addChild(bg);
    //shop
    stage.addChild(engine.createAnimatedSprite(engine.textureArr(5, "shop"), { x: 685, y: 128 }, 2.75, 0.2, true));
    //player
    const player = new Player({
        position: {
            x: 200,
            y: 200
        },
        velocity: {
            x: 0,
            y: 0
        }
    });
    stage.addChild(player.view)


    //Update Loop
    let renderer = PIXI.autoDetectRenderer();
    let ticker = PIXI.Ticker.shared;
    ticker.autoStart = false;
    ticker.stop();


    function animate(time) {
        time = app.ticker.lastTime
        ticker.update(time);
        renderer.render(stage);
        requestAnimationFrame(animate);

        player.update();

        //player1 movement
        player.velocity.x = 0
            //move left
        if (keys.a.pressed && player.lastKey === 'a') {
            if (player.position.x <= 0) {
                player.velocity.x = 0
            } else {
                console.log(player.lastKey)
                player.velocity.x = -5
            }
            player.switchSprite(1)

        }
        //move right
        else if (keys.d.pressed && player.lastKey === 'd') {
            if (player.position.x >= 955) {
                player.velocity.x = 0
            } else {
                player.velocity.x = 5
            }
            player.switchSprite(1)
                //Idle
        } else if (player.lastKey === 'd') {
            player.switchSprite(0) //player.switchSprite('idle_right')
        } else {
            player.switchSprite(0) //player.switchSprite('idle_left')
        }
        if (player.velocity.y < 0 && (player.velocity.x > 0 || player.lastKey === 'd')) {
            player.switchSprite(2) //('jump_right')
        } else if (player.velocity.y < 0 && (player.velocity.x < 0 || player.lastKey === 'a')) {
            player.switchSprite(2) //('jump_left')
        } else if (player.velocity.y > 0 && (player.velocity.x > 0 || player.lastKey === 'd')) {
            player.switchSprite(3) //('fall_right')
        } else if (player.velocity.y > 0 && (player.velocity.x < 0 || player.lastKey === 'a')) {
            player.switchSprite(3) //('fall_left')
        }

    }
    animate(performance.now());

    window.addEventListener('keydown', (event) => {
        //play = true
        if (!player.dead) {
            switch (event.key) {
                case 'd':
                    keys.d.pressed = true
                    player.lastKey = 'd'
                    break
                case 'a':
                    keys.a.pressed = true
                    player.lastKey = 'a'
                    break
                case 'w':
                    if (player.view.position.y < 150) {
                        player.velocity.y += 0
                    } else { player.velocity.y = -20 }
                    break
                case 's':
                    player.attack()
                    break
            }

        }
    })
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            case 'w':
                //player.velocity.y = -10
                break

                // case 'ArrowRight':
                //     keys.ArrowRight.pressed = false
                //     break
                // case 'ArrowLeft':
                //     keys.ArrowLeft.pressed = false
                //     break
                // case 'ArrowUp':
                //     //
                //     break
        }
    })
}



assetsMap.sprites.forEach((value) => app.loader.add(value.name, value.url));
app.loader.load(runGame)