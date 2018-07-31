let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let playerInfo;
let allEnemys = [];

const styleForAllText = new window.PIXI.TextStyle({
    fontFamily: 'myStyle',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 15,
    fill: '#ffffff',
    align: 'center'
});
//---------------GAME ------------------//
let Game = function() {
    const self = this;
    self._initApp();
    self._addPlayer(WIDTH / 2, HEIGHT / 2);
    self._drawAim(WIDTH / 2, HEIGHT / 2);

    setInterval(function() {
        new Enemy(randomInteger(0, WIDTH), randomInteger(0, HEIGHT), 1, self.app);
    }, 1000);

    document.addEventListener('mousemove', function(e) {
        const playerCenter = {
            x: self._player.x,
            y: self._player.y
        };

        const angle = Math.atan2(e.clientX - playerCenter.x, -(e.clientY - playerCenter.y)) * (180 / Math.PI);

        self._rotatePlayer(angle);
        self._aim.x = e.clientX;
        self._aim.y = e.clientY;
    });
};

Game.prototype._initApp = function() {
    const self = this;
    self.app = new PIXI.Application(WIDTH, HEIGHT, { backgroundColor: 0x1099bb });
    document.body.appendChild(self.app.view);

    document.addEventListener('click', function(e) {
        let newShot = new Shot(e.clientX, e.clientY, self.app, e);
    });
};

Game.prototype._drawAim = function(x, y) {
    const self = this;
    let aim = PIXI.Sprite.fromImage('images/aim.png');

    aim.anchor.set(0.5);
    aim.width = 128;
    aim.height = 128;
    aim.x = x;
    aim.y = y;
    aim.interactive = false;

    this.app.stage.addChild(aim);
    this._aim = aim;
}

Game.prototype._addPlayer = function(x, y) {
    let player = PIXI.Sprite.fromImage('images/player.png');

    player.anchor.set(0.5);
    player.width = 140;
    player.height = 95;
    player.x = x;
    player.y = y;
    player.interactive = true;

    this.app.stage.addChild(player);

    this._player = player;
    playerInfo = player;
};

Game.prototype._rotatePlayer = function(deg) {
    this._player.rotation = inRad(deg);
};

Game.prototype._endGame = function() {
    // console.log("END GAME");
};

//---------------GAME END------------------//

//---------------SHOT ------------------//
let Shot = function(x, y, app, e) {
    const self = this;

    self._drawShot(app, e);
    self._coordinatesShot = [{ x: 0, y: 0 }];
};

Shot.prototype._drawShot = function(app, e) {
    let shot = PIXI.Sprite.fromImage('images/shot.png');

    shot.anchor.set(0.5);
    shot.width = 25;
    shot.height = 25;
    shot.x = WIDTH / 2;
    shot.y = HEIGHT / 2;
    shot.interactive = false;

    app.stage.addChild(shot);

    this._shot = shot;
    self._shot = shot;

    this._moveShot(this._shot, e, WIDTH / 2, HEIGHT / 2);
};

Shot.prototype._moveShot = function(shot, e, x, y) {
    const ticker = new window.PIXI.ticker.Ticker();
    let step = 0;
    const stepX = (e.clientX - shot.x) / 20;
    const stepY = (shot.y - e.clientY) / 20;

    ticker.stop();
    ticker.add(() => {

        if (shot.x > WIDTH || shot.x < 0 || shot.y > HEIGHT || shot.y < 0 || step == 100 || shot.scale.x > 0.30) {
            shot.destroy();
            ticker.stop();
            ticker.destroy();

            return;
        }

        step++;
        shot.x += stepX;
        shot.y -= stepY;
        shot.scale.x += 0.005;
        shot.scale.y += 0.005;

        // this._checkСollision(shot, ticker);
    });

    ticker.start();
};

// Shot.prototype._checkСollision = function(shot, ticker) {
//     for (let i = 0; i < allEnemys.length; i++) {
//         var isCollision = isCenter(shot, allEnemys[i]);
//         if (isCollision) {
// console.log("YEEEE");
//             // delete allEnemys[i];
// allEnemys.splice(allEnemys.indexOf(i), 1);

//             self._destroy(shot, ticker);
//             // break;
//         };
//     };
// };

// Shot.prototype._destroy = function(shot, ticker) {
//     shot.destroy();
//     ticker.stop();
//     ticker.destroy();
// }

//---------------SHOT END------------------//

//----------------ENEMY--------------------//
const Enemy = function(x, y, rotation, app) {
    const self = this;
    const enemy = new PIXI.Sprite.fromImage('images/enemy/' + randomInteger(1, 4) + '.png');
    const positionRnd = randomEnemyPosition();
    enemy.anchor.set(0.5);
    enemy.width = 100;
    enemy.height = 100;
    enemy.x = positionRnd.x;
    enemy.y = positionRnd.y;
    enemy.interactive = false;

    app.stage.addChild(enemy);

    self._enemy = enemy;
    self._moveEnemy(self._enemy);
};

Enemy.prototype._moveEnemy = function(enemy) {
    allEnemys.push(enemy);

    const ticker = new window.PIXI.ticker.Ticker();
    const stepX = (WIDTH / 2 - enemy.x) / 100;
    const stepY = (enemy.y - HEIGHT / 2) / 100;

    ticker.stop();
    ticker.add(() => {
        var checkingInfo = isCenter(playerInfo, enemy);

        if (checkingInfo) {
            enemy.destroy();
            ticker.stop();
            ticker.destroy();

            return;
        }

        enemy.x += stepX;
        enemy.y -= stepY;

    });

    ticker.start();
};

//TODO
Enemy.prototype._explosion = function(app) {
    var explosionTextures = [];

    for (let i = 1; i < 11; i++) {
        let texture = new PIXI.Texture.fromImage('images/explosion/' + i + '.png');
        explosionTextures.push(texture);
    }

    var explosion = new PIXI.extras.AnimatedSprite(explosionTextures);

    explosion.x = WIDTH / 2;
    explosion.y = HEIGHT / 2;
    explosion.animationSpeed = 0.3;
    explosion.anchor.set(0.5);

    app.stage.addChild(explosion);

    explosion.play();
};

//--------------ENEMY END------------------//

//---------------GLOBAL START--------------//
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

function inRad(num) {
    return num * Math.PI / 180;
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
}

function isCenter(player, enemy) {
    var XColl = false;
    var YColl = false;

    if ((player.x + player.width >= enemy.x) && (player.x <= enemy.x + enemy.width)) XColl = true;
    if ((player.y + player.height >= enemy.y) && (player.y <= enemy.y + enemy.height)) YColl = true;

    if (XColl & YColl) { return true; }
    return false;
};
//---------------GLOBAL END--------------//

let newGame = new Game();