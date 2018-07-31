const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
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
    self.initApp();
    self.addPlayer(WIDTH / 2, HEIGHT / 2);
    self.drawAim(WIDTH / 2, HEIGHT / 2);

    setInterval(function() {
        new Enemy(self.app);
    }, 1000);

    document.addEventListener('mousemove', function(event) {
        const playerCenter = {
            x: self._player.x,
            y: self._player.y
        };

        const angle = Math.atan2(event.clientX - playerCenter.x, -(event.clientY - playerCenter.y)) * (180 / Math.PI);

        self.rotatePlayer(angle);
        self._aim.x = event.clientX;
        self._aim.y = event.clientY;
    });
};

Game.prototype.initApp = function() {
    const self = this;
    self.app = new PIXI.Application(WIDTH, HEIGHT, { backgroundColor: 0x1099bb });
    document.body.appendChild(self.app.view);

    document.addEventListener('click', function(event) {
        let newShot = new Shot(event.clientX, event.clientY, self.app, event);
    });
};

Game.prototype.drawAim = function(x, y) {
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

Game.prototype.addPlayer = function(x, y) {
    const player = PIXI.Sprite.fromImage('images/player.png');

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

Game.prototype.rotatePlayer = function(deg) {
    this._player.rotation = inRad(deg);
};

Game.prototype._endGame = function() {
    // console.log("END GAME");
};

//---------------GAME END------------------//

//---------------SHOT ------------------//
let Shot = function(x, y, app, event) {
    this._drawShot(app, event);
    this._coordinatesShot = [{ x: 0, y: 0 }];
};

Shot.prototype._drawShot = function(app, event) {
    let shot = PIXI.Sprite.fromImage('images/shot.png');

    shot.anchor.set(0.5);
    shot.width = 25;
    shot.height = 25;
    shot.x = WIDTH / 2;
    shot.y = HEIGHT / 2;
    shot.interactive = false;

    app.stage.addChild(shot);

    this._shot = shot;


    this._moveShot(this._shot, event);
};

Shot.prototype._moveShot = function(shot, event) {
    const ticker = new window.PIXI.ticker.Ticker();
    let step = 0;
    const stepX = (event.clientX - shot.x) / 20;
    const stepY = (shot.y - event.clientY) / 20;

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

        this._checkСollision(shot);
    });

    ticker.start();
};

Shot.prototype._checkСollision = function(shot) {
    for (let i = 0; i < allEnemys.length; i++) {
        console.log(allEnemys[i].x);
        // var isCollision = getIsCollide(shot, allEnemys[i]);
        // if (isCollision) {
        //     console.log("YEEEE");
        //     // delete allEnemys[i];
        //     allEnemys.splice(allEnemys.indexOf(i), 1);

        //     self._destroy(shot, ticker);
        //     // break;
        // };
    };
};

// Shot.prototype._destroy = function(shot, ticker) {
//     shot.destroy();
//     ticker.stop();
//     ticker.destroy();
// }

//---------------SHOT END------------------//

//----------------ENEMY--------------------//
const Enemy = function(app) {
    const enemy = new PIXI.Sprite.fromImage('images/enemy/' + randomInteger(1, 4) + '.png');
    const positionRnd = randomEnemyPosition();
    enemy.anchor.set(0.5);
    enemy.width = 100;
    enemy.height = 100;
    enemy.x = positionRnd.x;
    enemy.y = positionRnd.y;
    enemy.interactive = false;

    app.stage.addChild(enemy);
    enemy.data = { x: 0, y: 0 };
    this._moveEnemy(enemy);
    allEnemys.push(enemy);
};

Enemy.prototype._moveEnemy = function(enemy) {
    console.log('all', allEnemys);
    // console.log('enemy', enemy.x);

    const ticker = new window.PIXI.ticker.Ticker();
    const stepX = (WIDTH / 2 - enemy.x) / 100;
    const stepY = (enemy.y - HEIGHT / 2) / 100;

    ticker.stop();
    ticker.add(() => {
        const isCollide = getIsCollide(playerInfo, enemy);

        if (isCollide) {
            enemy.destroy();
            ticker.stop();
            ticker.destroy();

            return;
        }
        enemy.x += stepX;
        enemy.y -= stepY;
        enemy.data.x = enemy.x;
        enemy.data.y = enemy.y;

    });

    ticker.start();
};

//TODO
Enemy.prototype._explosion = function(app) {
    let explosionTextures = [];

    for (let i = 1; i < 11; i++) {
        let texture = new PIXI.Texture.fromImage('images/explosion/' + i + '.png');
        explosionTextures.push(texture);
    }

    const explosion = new PIXI.extras.AnimatedSprite(explosionTextures);

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
    let rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
}

function getIsCollide(player, enemy) {
    let XColl = false;
    let YColl = false;

    if ((player.x + player.width >= enemy.x) && (player.x <= enemy.x + enemy.width)) XColl = true;
    if ((player.y + player.height >= enemy.y) && (player.y <= enemy.y + enemy.height)) YColl = true;

    if (XColl & YColl) { return true; }
    return false;
};
//---------------GLOBAL END--------------//

let newGame = new Game();