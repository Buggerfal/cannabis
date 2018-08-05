const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

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
    this._allEnemies = [];
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
            self._allEnemies.push(enemy);
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

let newGame = new Game();

/*
    GULP
    ESLINT
*/