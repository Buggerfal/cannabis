let explosionTextures = [];

function inRad(num) {
    return num * Math.PI / 180;
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
}

function getIsCollide(player, enemy) {
    enemy = enemy._enemy;
    let XColl = false;
    let YColl = false;

    if ((player.x + player.width / 2 >= enemy.x) && (player.x <= enemy.x + enemy.width / 2)) XColl = true;
    if ((player.y + player.height / 2 >= enemy.y) && (player.y <= enemy.y + enemy.height / 2)) YColl = true;
    if (XColl & YColl) { return true; }

    return false;
}

function generatedId() {
    return Math.random().toString(36).substr(2, 9);
}

function percentages(percentX, percentY) {
    const toX = (WIDTH / 100) * percentX;
    const toY = (HEIGHT / 100) * percentY;
    return { x: toX, y: toY };
}

function setScale(element) {
    const scaleWidth = WIDTH / 1600;
    const scaleHeight = HEIGHT / 800;
    element.width *= scaleHeight;
    element.height *= scaleHeight;
}

function initAnimation() {
    for (let i = 1; i < 11; i++) {
        let texture = new PIXI.Texture.fromImage('images/explosion/' + i + '.png');
        explosionTextures.push(texture);
    }
}

function isOutPosition(sprite) {
    if (sprite.x > WIDTH || sprite.x < 0 || sprite.y > HEIGHT || sprite.y < 0 || sprite.scale.x > 0.30) {
        return true;
    } else {
        return false;
    }
}

const explosions = function(app, x, y) {
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
    };
};

const playSound = function(name) {
    const path = `music/${name}`;
    const sound = PIXI.sound.Sound.from(path);
    sound.play();
};

function randomEnemyPosition() {
    const randomSide = randomInteger(0, 3);

    position = [{
            minX: 0,
            maxX: WIDTH,
            minY: 0,
            maxY: 0
        },
        {
            minX: 0,
            maxX: WIDTH,
            minY: HEIGHT,
            maxY: HEIGHT
        },
        {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: HEIGHT
        },
        {
            minX: WIDTH,
            maxX: WIDTH,
            minY: 0,
            maxY: HEIGHT
        },
    ];

    const rndPosition = position[randomSide];

    return {
        x: randomInteger(rndPosition.minX, rndPosition.maxX),
        y: randomInteger(rndPosition.minY, rndPosition.maxY)
    }
}