const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let playerInfo;
let allEnemys = [];
let score = 0;

const styleForAllText = new window.PIXI.TextStyle({
    fontFamily: 'myStyle',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 30,
    fill: '#ffffff'
});
//---------------GAME ------------------//
let Game = function() {
    const self = this;
    self.initApp();
    self.addPlayer(WIDTH / 2, HEIGHT / 2);
    self.drawAim(WIDTH / 2, HEIGHT / 2);
    self.playerScore();

    setInterval(function() {
        new Enemy(self.app);
    }, 1000);

    self.createHeart();

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
    setScale(player);

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

Game.prototype.playerScore = function() {
    const xAndY = percentages(3, 3);
    const ticker = new window.PIXI.ticker.Ticker();
    let playerScoreText = new PIXI.Text(score, styleForAllText);

    ticker.stop();
    ticker.add(() => {
        this.app.stage.removeChild(playerScoreText);
        playerScoreText = new PIXI.Text(score, styleForAllText);

        playerScoreText.x = xAndY.x;
        playerScoreText.y = xAndY.y;

        this.app.stage.addChild(playerScoreText);

    });

    ticker.start();
};

Game.prototype.createHeart = function() {
    const xAndY = percentages(80, 7);
    let stepX = xAndY.x;
    for (var i = 0; i <= 2; i++) {
        const heart = new PIXI.Sprite.fromImage('images/interface/heart-live.png');

        heart.anchor.set(0.5);
        heart.width = 100;
        heart.height = 100;
        //width heart + widt heart / 2
        heart.x += stepX;
        heart.y = xAndY.y;
        stepX += heart.width + heart.width / 6;

        this.app.stage.addChild(heart);
    };
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

        this._checkСollision(shot, ticker);
    });

    ticker.start();
};

Shot.prototype._checkСollision = function(shot, ticker) {
    for (let i = 0; i < allEnemys.length; i++) {
        var isCollision = getIsCollide(shot, allEnemys[i]);
        if (isCollision) {
            score += 100;
            shot.destroy();
            allEnemys[i].destroy();
            allEnemys.splice(i, 1);
            ticker.stop();
            ticker.destroy();
        };
    };
};

//---------------SHOT END------------------//

//----------------ENEMY--------------------//
const Enemy = function(app) {
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
    enemy.data = {
        x: enemy.x,
        y: enemy.y,
        id: generatedId()
    };
    this._moveEnemy(enemy);
    allEnemys.push(enemy);
};

let countLife = 0;
Enemy.prototype._moveEnemy = function(enemy) {
    const ticker = new window.PIXI.ticker.Ticker();
    const stepX = (WIDTH / 2 - enemy.x) / 100;
    const stepY = (enemy.y - HEIGHT / 2) / 100;

    ticker.stop();
    ticker.add(() => {
        const isCollide = getIsCollide(playerInfo, enemy);

        if (isCollide) {
            allEnemys = allEnemys.filter(function(element, index) {
                return element.data.id != enemy.data.id;
            });

            countLife += 1;

            enemy.destroy();
            ticker.stop();
            ticker.destroy();
            if (countLife === 3) {
                new GameOver();
            }
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
    //TODO MAP
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

const GameOver = function() {
    console.log('THE END')
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

    if ((player.x + player.width / 2 >= enemy.x) && (player.x <= enemy.x + enemy.width / 2)) XColl = true;
    if ((player.y + player.height / 2 >= enemy.y) && (player.y <= enemy.y + enemy.height / 2)) YColl = true;

    if (XColl & YColl) { return true; }
    return false;
};

function generatedId() {
    return Math.random().toString(36).substr(2, 9);
}

function percentages(percentX, percentY) {
    const toX = (WIDTH / 100) * percentX;
    const toY = (HEIGHT / 100) * percentY;
    return { x: toX, y: toY };
}

function setScale(element) {
    scaleWidth = WIDTH / 1600;
    scaleHeight = HEIGHT / 800;
    element.width *= scaleHeight;
    element.height *= scaleHeight;
}
//---------------GLOBAL END--------------//

let newGame = new Game();

/*
    GULP
    ESLINT
    GIT IGNORE
*/