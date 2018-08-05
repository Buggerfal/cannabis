const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let playerInfo;
let allEnemys = [];
let score = 0;
let countLife = 0;
let explosionTextures = [];

const styleForAllText = new window.PIXI.TextStyle({
    fontFamily: 'myStyle',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 30,
    fill: '#ffffff'
});
//---------------GAME ------------------//
let Game = function() {
    this.initApp();
    this.buttonPlay(WIDTH / 2, HEIGHT / 2);
};

Game.prototype.buttonPlay = function(x, y) {
    const self = this;
    const buttonStart = PIXI.Sprite.fromImage('images/interface/button-play.png');

    buttonStart.anchor.set(0.5);
    buttonStart.width = 200;
    buttonStart.height = 200;
    buttonStart.x = x;
    buttonStart.y = y;
    buttonStart.interactive = true;
    setScale(buttonStart);

    this.app.stage.addChild(buttonStart);

    buttonStart.on("click", function() {
        self.app.stage.removeChild(buttonStart);

        self.addPlayer(WIDTH / 2, HEIGHT / 2);
        self.drawAim(WIDTH / 2, HEIGHT / 2);
        self.playerScore();
        self.createHeart();
        initAnimation();

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

        document.addEventListener('click', function(event) {
            let newShot = new Shot(event.clientX, event.clientY, self.app);
        });
    });
};


Game.prototype.initApp = function() {
    const self = this;
    self.app = new PIXI.Application(WIDTH, HEIGHT, { backgroundColor: 0x1099bb });
    document.body.appendChild(self.app.view);
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
    for (let i = 0; i <= 2; i++) {
        const heart = new PIXI.Sprite.fromImage('images/interface/heart-live.png');

        heart.anchor.set(0.5);
        heart.width = 100;
        heart.height = 100;
        //width heart + widt heart / 2
        heart.x += stepX;
        heart.y = xAndY.y;
        setScale(heart);
        stepX += heart.width + heart.width / 6;

        this.app.stage.addChild(heart);
    };
};

//---------------GAME END------------------//

//---------------SHOT ------------------//
let Shot = function(x, y, app) {
    this._app = app;
    this._drawShot(x, y);
    this._coordinatesShot = [{ x: 0, y: 0 }];
};

Shot.prototype._drawShot = function(x, y) {
    let shot = PIXI.Sprite.fromImage('images/shot.png');

    shot.anchor.set(0.5);
    shot.width = 25;
    shot.height = 25;
    shot.x = WIDTH / 2;
    shot.y = HEIGHT / 2;
    shot.interactive = false;
    setScale(shot);

    this._app.stage.addChild(shot);

    this._shot = shot;
    this._moveShot(x, y);
};

Shot.prototype._moveShot = function(x, y) {
    const ticker = new window.PIXI.ticker.Ticker();
    let step = 0;
    const stepX = (x - this._shot.x) / 20;
    const stepY = (this._shot.y - y) / 20;

    ticker.stop();
    ticker.add(() => {
        if(this.destroy == true){
            console.log("asd");
        }
        if (this._shot.x > WIDTH || this._shot.x < 0 || this._shot.y > HEIGHT || this._shot.y < 0 || step == 100 || this._shot.scale.x > 0.30) {
            this._shot.destroy();
            ticker.stop();
            ticker.destroy();

            return;
        }

        step++;
        this._shot.x += stepX;
        this._shot.y -= stepY;
        this._shot.scale.x += 0.005;
        this._shot.scale.y += 0.005;

        this._checkСollision(ticker);
    });

    ticker.start();
};

Shot.prototype._checkСollision = function(ticker) {
    for (let i = 0; i < allEnemys.length; i++) {
        var isCollision = getIsCollide(this._shot, allEnemys[i]);
        if (isCollision) {
            new explosions(this._app, this._shot.x, this._shot.y)
            score += 100;
            ticker.stop();
            ticker.destroy();
            this.destroy = true;
            this._shot.destroy();
            allEnemys[i].destroy();
            allEnemys.splice(i, 1);
            return;
        }
    }
};

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
    setScale(enemy);
    enemy.interactive = false;
    app.stage.addChild(enemy);
    this.data = {
        x: enemy.x,
        y: enemy.y,
        id: generatedId()
    };
    this._enemy = enemy;
    this._moveEnemy(enemy, app);
    allEnemys.push(this);
};

Enemy.prototype._moveEnemy = function(enemy, app) {
    const ticker = new window.PIXI.ticker.Ticker();
    const stepX = (WIDTH / 2 - enemy.x) / 100;
    const stepY = (enemy.y - HEIGHT / 2) / 100;

    ticker.stop();
    ticker.add(() => {
        const isCollide = getIsCollide(playerInfo, this);

        if (isCollide) {
            const id = this.data.id;
            allEnemys = allEnemys.filter(function(element, index) {
                return element.data.id != id;
            });

            countLife += 1;

            new explosions(app, enemy.x, enemy.y)

            enemy.destroy();
            ticker.stop();
            ticker.destroy();
            if (countLife === 3) {
                GameOver(app);
            }
            return;
        }

        enemy.x += stepX;
        enemy.y -= stepY;
        // enemy.data.x = enemy.x;
        // enemy.data.y = enemy.y;

    });
    this._ticker = ticker;
    ticker.start();
};

Enemy.prototype.destroy = function() {
    this._ticker.stop();
    this._ticker.destroy();
    this._enemy.destroy();
};

const explosions = function(app, x, y) {
    const explosion = new PIXI.extras.AnimatedSprite(explosionTextures);

    explosion.x = x;
    explosion.y = y;
    explosion.animationSpeed = 0.3;
    explosion.anchor.set(0.5);
    explosion.loop = false;
    app.stage.addChild(explosion);

    explosion.play();
    // setTimeout(function() {

    // }, 550);
    explosion.onComplete = () => {
        explosion.stop();
        explosion.destroy();
    };
};

const GameOver = function(app) {
    console.log('THE END');

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
    enemy = enemy._enemy;
    let XColl = false;
    let YColl = false;
try{

    if ((player.x + player.width / 2 >= enemy.x) && (player.x <= enemy.x + enemy.width / 2)) XColl = true;
    if ((player.y + player.height / 2 >= enemy.y) && (player.y <= enemy.y + enemy.height / 2)) YColl = true;
} catch {
    console.log("1");
}

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

function initAnimation() {
    for (let i = 1; i < 11; i++) {
        let texture = new PIXI.Texture.fromImage('images/explosion/' + i + '.png');
        explosionTextures.push(texture);
    }
}
//---------------GLOBAL END--------------//

let newGame = new Game();

/*
    GULP
    ESLINT
    GIT IGNORE

    SUPER POWER

    document.addEventListener('mousemove', function(event) {
    let newShot = new Shot(event.clientX, event.clientY, self.app, event);
}
*/