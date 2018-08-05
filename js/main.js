const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let playerInfo;
let allEnemys = [];
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
    this._score = 0;
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
            const enemy = new Enemy(self);
            allEnemys.push(enemy);
        }, 1000);

        // playSound('main.mp3');

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


        setTimeout(() => {
            document.addEventListener('click', function(event) {
                let newShot = new Shot(event.clientX, event.clientY, self);
            });

        }, 0);

    });
};

Game.prototype.superPower = function() {
    const self = this;
    let x = 0,
        y = 0;

    document.addEventListener('mousemove', function(event) {
        x = event.clientX;
        y = event.clientY;
    });


    let interval = setInterval(function(event) {
        let newShot = new Shot(x, y, self);
    }, 100);

    setTimeout(function() {
        clearInterval(interval);
    }, 7000);
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
    console.log("END GAME");
};

Game.prototype.playerScore = function() {
    const xAndY = percentages(3, 3);
    const ticker = new window.PIXI.ticker.Ticker();
    let playerScoreText = new PIXI.Text(this._score, styleForAllText);

    ticker.stop();
    ticker.add(() => {
        this.app.stage.removeChild(playerScoreText);
        playerScoreText = new PIXI.Text(this._score, styleForAllText);

        playerScoreText.x = xAndY.x;
        playerScoreText.y = xAndY.y;

        this.app.stage.addChild(playerScoreText);

    });

    ticker.start();
};

Game.prototype.decreaseScore = function() {
    let lastElement = this._scoreHearts.pop();

    if (lastElement) {
        lastElement.destroy();
        this.superPower();
    }

    if (this._scoreHearts.length <= 0) {
        this._endGame();
    }
};

Game.prototype.createHeart = function() {
    this._scoreHearts = [];
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
        this._scoreHearts.push(heart);
    };
};

Game.prototype.hitEnemy = function() {
    this._score += 100;
};

//---------------GAME END------------------//

//---------------SHOT ------------------//
let Shot = function(x, y, game) {
    this._game = game;
    this._app = game.app;
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
        if (isOutPosition(this._shot)) {
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

    this._ticker = ticker;

    ticker.start();
};

Shot.prototype._checkСollision = function() {
    for (let i = 0; i < allEnemys.length; i++) {
        var isCollision = getIsCollide(this._shot, allEnemys[i]);
        if (isCollision) {
            new explosions(this._app, this._shot.x, this._shot.y);

            this._game.hitEnemy();

            this._ticker.stop();
            this._ticker.destroy();
            this._shot.destroy();
            playSound('explosion.mp3');

            allEnemys[i].destroy();

            allEnemys.splice(i, 1);

            return;
        }
    }

};

//---------------SHOT END------------------//

//----------------ENEMY--------------------//
const Enemy = function(game) {
    this._game = game;
    this._app = game.app;

    const enemy = new PIXI.Sprite.fromImage('images/enemy/' + randomInteger(1, 4) + '.png');
    const positionRnd = randomEnemyPosition();
    enemy.anchor.set(0.5);
    enemy.width = 100;
    enemy.height = 100;
    enemy.x = positionRnd.x;
    enemy.y = positionRnd.y;
    setScale(enemy);
    enemy.interactive = false;

    this._app.stage.addChild(enemy);

    this._enemy = enemy;
    this._moveEnemy();
};

Enemy.prototype._moveEnemy = function() {
    const enemy = this._enemy,
        app = this._app;

    const ticker = new window.PIXI.ticker.Ticker();
    const stepX = (WIDTH / 2 - enemy.x) / 100;
    const stepY = (enemy.y - HEIGHT / 2) / 100;

    ticker.stop();
    ticker.add(() => {
        const isCollide = getIsCollide(playerInfo, this);

        if (isCollide) {
            this._game.decreaseScore();

            allEnemys = allEnemys.filter((element, index) => {
                return element != this;
            });

            new explosions(app, enemy.x, enemy.y)

            enemy.destroy();
            ticker.stop();
            ticker.destroy();

            return;
        }

        enemy.x += stepX;
        enemy.y -= stepY;
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

//---------------GLOBAL END--------------//

let newGame = new Game();

/*
    GULP
    ESLINT

    SUPER POWER
    
setInterval(function (){
   allEnemys.forEach((en) => {
		document.dispatchEvent(new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window,
		clientX: en._enemy.x,
		clientY: en._enemy.y
	}));
	})

}, 100);

*/