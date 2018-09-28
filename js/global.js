let explosionTextures = [];

const playerLevel = [
    { score: 1000, level: 1 },
    { score: 2000, level: 2 },
    { score: 3000, level: 3 },
    { score: 20000, level: 4 },
    { score: 25000, level: 5 },
    { score: 30000, level: 6 },
    { score: 35000, level: 7 },
    { score: 40000, level: 8 }
];

function inRad(num) {
    return num * Math.PI / 180;
}

function getIsCollide(player, enemy) {
    enemy = enemy._enemy;
    let XColl = false;
    let YColl = false;

    if (player.x + player.width / 2 >= enemy.x &&
        player.x <= enemy.x + enemy.width / 2) {
        XColl = true;
    }

    if (player.y + player.height / 2 >= enemy.y &&
        player.y <= enemy.y + enemy.height / 2) {
        YColl = true;
    }
    return XColl && YColl;
}

function percentages(percentX, percentY) {
    const toX = (WIDTH / 100) * percentX;
    const toY = (HEIGHT / 100) * percentY;
    return { x: toX, y: toY };
}

function setScale(element) {
    const scaleWidth = WIDTH / 1200;
    const scaleHeight = HEIGHT / 800;
    element.width *= scaleHeight;
    element.height *= scaleHeight;
}

function isOutPosition(sprite) {
    if (sprite.x > WIDTH || sprite.x < 0 || sprite.y > HEIGHT || sprite.y < 0 || sprite.scale.x > 0.30) {
        return true;
    } else {
        return false;
    }
}

class explosions {
    constructor(app, x, y) {

        const explosion = new PIXI.extras.AnimatedSprite(explosionTextures);

        explosion.x = x;
        explosion.y = y;
        explosion.animationSpeed = 0.3;
        explosion.anchor.set(0.5);
        explosion.loop = false;
        app.stage.addChild(explosion);

        explosion.play();

        explosion.onComplete = () => {
            explosion.stop();
            explosion.destroy();
            app.stage.removeChild(explosion);
        };
    }

    static initAnimation() {
        for (let i = 1; i < 11; i++) {
            let texture = new PIXI.Texture.fromImage('images/explosion/' + i + '.png');
            explosionTextures.push(texture);
        }
    }
}

const createSprite = (app, options) => {
    options = Object.assign({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        interactive: false
    }, options);

    const sprite = PIXI.Sprite.fromImage(options.path);

    sprite.anchor.set(0.5);
    sprite.width = options.width;
    sprite.height = options.height;
    sprite.x = options.x;
    sprite.y = options.y;
    sprite.interactive = options.interactive;

    setScale(sprite);

    app.stage.addChild(sprite);

    return sprite;
};