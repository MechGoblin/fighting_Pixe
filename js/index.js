import { Application, Graphics, Texture, Sprite, Loader, Ticker, settings } from "./pixi.js";
import { assetsMap } from "./assetsMap.js";
import { Player } from "./Player.js";
import { engine } from "./engine.js"


const devices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i");
// Create the application
const app = new Application({
    resolution: window.devicePixelRatio,
    autoDensity: true,
    width: innerWidth,
    height: innerHeight,
    BackgroundAlpha: 0.5,
    backgroundColor: 0xc2c2c2,
    view: document.getElementById("canvas"),
    antialias: true,
    resizeTo: window
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

    function decreaseTimer() {
        if (timer > 0) {
            timerId = setTimeout(decreaseTimer, 1000)
            timer--
            document.querySelector('#timer').innerHTML = timer
        }
        if (timer === 0) {
            engine.determineWinner({ player1, player2, timerId })
        }
    }
    const stage = app.stage;
    let sheet = Loader.shared.resources["../assets/test.json"].spritesheet; // To create animations from a spritesheet
    let timer = 61
    let timerId = 0
    let play = false
    let playNow = false
    let PL1attackDir = 9;
    let PL2attackDir = 9;
    const playerSpeedX = innerWidth / 260;


    //level
    let background = new Sprite(Texture.from("background"));
    background.position = { x: 0, y: 0 }
    background.scale = { x: innerWidth / background.width, y: innerHeight / background.height }
    stage.addChild(background);


    let GroundBox = new Graphics().beginFill(0xff0000, 0.7).drawRect(0, innerHeight - 0.16 * innerHeight, innerWidth, innerHeight * 0.16).endFill();
    stage.addChild(GroundBox);


    let shop = engine.createAnimatedSprite(sheet.animations["shop"], { x: innerWidth * 0.8, y: innerHeight * 0.635 }, { x: 1, y: 1 }, 0.2, { x: 0.5, y: 0.5 }, true)
    stage.addChild(shop);


    const player1 = new Player({
        position: {
            x: innerWidth - 0.9 * innerWidth,
            y: innerHeight - 0.6 * innerHeight
        },
        velocity: {
            x: 0,
            y: 0
        },
        fighterNumber: 1,
        frameNumbers: [7, 7, 1, 1, 3, 5, 5],
        GroundBox
    });
    const player2 = new Player({
        position: {
            x: 0.9 * innerWidth,
            y: innerHeight - 0.6 * innerHeight
        },
        velocity: {
            x: 0,
            y: 0
        },
        fighterNumber: 2,
        frameNumbers: [3, 6, 1, 1, 2, 6, 3],
        GroundBox
    });
    stage.addChild(player1.view)
    stage.addChild(player2.view)

    //UI
    const joistickBack = new Graphics().beginFill(0xffffff, 0.5).drawCircle(innerWidth * 1 / 16, innerHeight - innerHeight * 1 / 13, innerWidth * 1 / 32).endFill();
    stage.addChild(joistickBack)
    const joistickTarget = new Graphics().beginFill(0xffffff, 0.5).drawCircle(innerWidth * 1 / 16, innerHeight - innerHeight * 1 / 13, innerWidth * 1 / 64).endFill();
    stage.addChild(joistickTarget)

    // black screen
    const blackscreen = new Graphics().beginFill(0x000000, 1).drawRect(0, 0, canvas.width, canvas.height).endFill()
    stage.addChild(blackscreen);


    let renderer = app.renderer;
    let ticker = Ticker.shared;
    ticker.autoStart = false;
    ticker.stop();
    let innerWidthBack = innerWidth;
    let innerHeightBack = innerHeight;
    // window["shop"] = shop;

    function animate(time) {
        if (!playNow) {
            //there will be music
        }
        if (play && !playNow) {
            playNow = true
            document.querySelector('#displayText').style.display = 'none'
            document.querySelector('#interface').style.display = 'flex'
            blackscreen.visible = false;
            // SwitchMusic('Fight')
            decreaseTimer()
        }
        //else if (play && playNow) {
        time = app.ticker.lastTime
        ticker.update(time);
        renderer.render(stage);

        //To adapt, enter elements and multiply by coefficients
        if (innerHeightBack != innerHeight || innerWidthBack != innerWidth) {
            let kW = innerWidth / innerWidthBack;
            let kH = innerHeight / innerHeightBack;
            engine.UpdatePlayer({ player: player1, kH: kH, kW: kW })
            engine.UpdatePlayer({ player: player2, kH: kH, kW: kW })


            GroundBox.scale.x *= kW;
            GroundBox.scale.y *= kH;

            background.scale.x *= kW;
            background.scale.y *= kH;

            shop.scale.x *= kW;
            shop.scale.y *= kH;
            shop.position.x *= kW;
            shop.position.y *= kH;

            innerWidthBack = innerWidth;
            innerHeightBack = innerHeight;
            app.width = innerWidth;
            app.height = innerHeight;
        }
        requestAnimationFrame(animate);



        player1.update();
        player2.update();
        //player1 movement
        if (!player1.dead) {
            //move left
            player1.velocity.x = 0

            if (keys.a.pressed && player1.lastKey === 'a') {
                if (player1.view.position.x <= innerWidth * 0.001 - player1.animat[0].width) {
                    player1.velocity.x = 0
                } else {
                    player1.velocity.x = -1 * playerSpeedX
                }
                if (player1.animat[1].scale.x > 0)
                    player1.animat[1].scale.x = -1 * player1.animat[1].scale.x;
                player1.switchSprite(1)
            }
            //move right
            else if (keys.d.pressed && player1.lastKey === 'd') {
                if (player1.view.position.x >= innerWidth - player1.animat[0].width) {
                    player1.velocity.x = 0
                } else {
                    player1.velocity.x = playerSpeedX
                }
                if (player1.animat[1].scale.x < 0.)
                    player1.animat[1].scale.x = -1 * player1.animat[1].scale.x;
                player1.switchSprite(1)

            } //Idle
            else if (player1.lastKey === 'd') {
                if (player1.animat[0].scale.x < 0)
                    player1.animat[0].scale.x = -1 * player1.animat[0].scale.x;
                player1.switchSprite(0) //player.switchSprite('idle_right')
            } else {
                player1.switchSprite(0) //player.switchSprite('idle_left')
                if (player1.animat[0].scale.x > 0)
                    player1.animat[0].scale.x = -1 * player1.animat[0].scale.x;
            }
            //jump
            if (player1.velocity.y < 0 && (player1.velocity.x > 0 || player1.lastKey === 'd')) {
                if (player1.animat[2].scale.x < 0)
                    player1.animat[2].scale.x = -1 * player1.animat[2].scale.x;
                player1.switchSprite(2) //('jump_right')
            } else if (player1.velocity.y < 0 && (player1.velocity.x < 0 || player1.lastKey === 'a')) {
                player1.switchSprite(2) //('jump_left')
                if (player1.animat[2].scale.x > 0)
                    player1.animat[2].scale.x = -1 * player1.animat[2].scale.x;
            } else if (player1.velocity.y > 0 && (player1.velocity.x > 0 || player1.lastKey === 'd')) {
                player1.switchSprite(3) //('fall_right')
                if (player1.animat[3].scale.x < 0)
                    player1.animat[3].scale.x = -1 * player1.animat[3].scale.x;
            } else if (player1.velocity.y > 0 && (player1.velocity.x < 0 || player1.lastKey === 'a')) {
                player1.switchSprite(3) //('fall_left')
                if (player1.animat[3].scale.x > 0)
                    player1.animat[3].scale.x = -1 * player1.animat[3].scale.x;

            }
        } else if (player1.animat[5].currentFrame === player1.animat[5].totalFrames - 1) {
            player1.animat[5].gotoAndStop(player1.animat[5].totalFrames - 1)
        }
        //player2 movement
        if (!player2.dead) {
            player2.velocity.x = 0
                //move left
            if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
                if (player2.view.position.x <= -1 * innerWidth + player2.animat[0].width * 1.1) {
                    player2.velocity.x = 0
                } else {
                    player2.velocity.x = -1 * playerSpeedX
                }
                if (player2.animat[1].scale.x > 0)
                    player2.animat[1].scale.x = -1 * player2.animat[1].scale.x;
                player2.switchSprite(1)
            }
            //move right
            else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
                if (player2.view.position.x >= innerWidth * 0.1) {
                    player2.velocity.x = 0
                } else {
                    player2.velocity.x = playerSpeedX
                }
                if (player2.animat[1].scale.x < 0.)
                    player2.animat[1].scale.x = -1 * player2.animat[1].scale.x;
                player2.switchSprite(1)
                    //Idle
            }
            //Idle
            else if (player2.lastKey === 'ArrowRight') {
                if (player2.animat[0].scale.x < 0)
                    player2.animat[0].scale.x = -1 * player2.animat[0].scale.x;
                player2.switchSprite(0) //player.switchSprite('idle_right')
            } else {
                if (player2.animat[0].scale.x > 0)
                    player2.animat[0].scale.x = -1 * player2.animat[0].scale.x;
                player2.switchSprite(0) //player.switchSprite('idle_left')
            }
            //jump
            if (player2.velocity.y < 0 && (player2.velocity.x > 0 || player2.lastKey === 'ArrowRight')) {
                if (player2.animat[2].scale.x < 0)
                    player2.animat[2].scale.x = -1 * player2.animat[2].scale.x;
                player2.switchSprite(2) //('jump_right')
            } else if (player2.velocity.y < 0 && (player2.velocity.x < 0 || player2.lastKey === 'ArrowLeft')) {
                if (player2.animat[2].scale.x > 0)
                    player2.animat[2].scale.x = -1 * player2.animat[2].scale.x;
                player2.switchSprite(2) //('jump_left')
            } else if (player2.velocity.y > 0 && (player2.velocity.x > 0 || player2.lastKey === 'ArrowRight')) {
                if (player2.animat[3].scale.x < 0)
                    player2.animat[3].scale.x = -1 * player2.animat[3].scale.x;
                player2.switchSprite(3) //('fall_right')
            } else if (player2.velocity.y > 0 && (player2.velocity.x < 0 || player2.lastKey === 'ArrowLeft')) {
                if (player2.animat[3].scale.x > 0)
                    player2.animat[3].scale.x = -1 * player2.animat[3].scale.x;
                player2.switchSprite(3) //('fall_left')
            }
        } else if (player2.animat[5].currentFrame === player2.animat[5].totalFrames - 1) {
            player2.animat[5].gotoAndStop(player2.animat[5].totalFrames - 1)
        }
        //determining the direction of attack
        if (player1.lastKey === "d") {
            PL1attackDir = 7;
        } else {
            PL1attackDir = 9;
        }
        if (player2.lastKey === "ArrowRight") {
            PL2attackDir = 7;
        } else {
            PL2attackDir = 9;
        }
        //detect Collision  player 1
        if (engine.rectangularCollision({
                object1: player1._view.getChildAt(PL1attackDir),
                object2: player2._view.getChildAt(8)
            }) && player1.isAttacking && player1.animat[6].currentFrame === 4) {
            player2.takeHit()
            player1.isAttacking = false
            gsap.to('#enemyHealth', {
                width: player2.health + '%'
            })
        }
        if (player1.isAttacking && player1.animat[6].currentFrame === 4) { //&& player.frameCurrent === 4
            player1.isAttacking = false
        }


        //detect Collision  player 2
        if (engine.rectangularCollision({
                object1: player2._view.getChildAt(PL2attackDir),
                object2: player1._view.getChildAt(8)
            }) && player2.isAttacking && player2.animat[6].currentFrame === 2) {
            player1.takeHit()
            player2.isAttacking = false
            gsap.to('#playerHealth', {
                width: player1.health + '%'
            })
        }
        if (player2.isAttacking && player2.animat[6].currentFrame === 2) { //&& player.frameCurrent === 4
            player2.isAttacking = false
        }
        //EndGame
        if (player1.health <= 0 || player2.health <= 0) engine.determineWinner({ player1, player2, timerId })

    }
    animate(performance.now());

    window.addEventListener("orientationchange", checkOrientationChange);
    if (devices.test(navigator.userAgent)) {
        addEventListener('touchstart', (event) => {
            play = true
            joistickTarget.interactive = true;
        });

    } else {
        window.addEventListener('keydown', (event) => {

            play = true
            if (!player1.dead) {
                switch (event.key) {
                    case 'd':
                        keys.d.pressed = true
                        player1.lastKey = 'd'
                        break
                    case 'a':
                        keys.a.pressed = true
                        player1.lastKey = 'a'
                        break
                    case 'w':
                        if (player1.view.position.y < 150) {
                            player1.velocity.y += 0
                        } else { player1.velocity.y = -20 }
                        break
                    case 's':
                        player1.attack()
                        break
                }
            }
            if (!player2.dead) {
                switch (event.key) {
                    case 'ArrowRight':
                        console.log("qq")
                        keys.ArrowRight.pressed = true
                        player2.lastKey = 'ArrowRight'
                        break
                    case 'ArrowLeft':
                        keys.ArrowLeft.pressed = true
                        player2.lastKey = 'ArrowLeft'
                        break
                    case 'ArrowUp':
                        if (player2.position.y < 150) {
                            player2.velocity.y += 0
                        } else { player2.velocity.y = -20 }
                        break
                    case 'ArrowDown':
                        player2.attack()
                        break;
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

                case 'ArrowRight':
                    keys.ArrowRight.pressed = false
                    break
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = false
                    break
                case 'ArrowUp':
                    //
                    break
            }
        })
    }

}




function checkOrientationChange() {
    let screenOrientation = window.orientation;
    switch (screenOrientation) {
        case 0:
            console.log('you are in portrait-primary mode');
            break;
        case 90:
            goFullScreen();
            break;
        case 180:
            goFullScreen();
            break;
        case 270:
            goFullScreen();
            break;
        default:
            console.log('implementation of screen orientation');
    }
}

// function to request full screen of device browser

function goFullScreen() {
    var elem = document.getElementById("canvas");
    if (elem.requestFullscreen) {
        elem.requestFullscreen().then(data => {
            lockScreenOrientation();
        }, err => {
            console.log('no');
        });
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen().then(data => {
            lockScreenOrientation();
        }, err => {
            console.log('Full Screen request failed');
        });
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen().then(data => {
            lockScreenOrientation();
        }, err => {
            console.log('Full Screen request failed');
        });
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen().then(data => {
            lockScreenOrientation();
        }, err => {
            console.log('Full Screen request failed');
        });
    }
}

//function to lock the screen. in this case the screen will be locked in portrait-primary mode.

function lockScreenOrientation() {
    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

    if (screen.lockOrientationUniversal("landscape-primary")) {
        // Orientation was locked
    } else {
        // Orientation lock failed
    }
}



Loader.shared.add(assetsMap.sprites[0].name, assetsMap.sprites[0].url);
Loader.shared.add("../assets/test.json").load(runGame)