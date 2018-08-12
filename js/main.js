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
    this._superScore = 0;
    this._allEnemies = [];
    this._intervalEnemy;
    this._intervalSuperPower;
    this._superAimCount = 0;

    this.initApp();
    this.buttonPlay(WIDTH / 2, HEIGHT / 2);
};

Game.prototype.buttonPlay = function(x, y) {
    //TODO settings
    // const gameplay = new Gameplay(this);
    const buttonStart = createSprite(this.app, {
        x: x,
        y: y,
        width: 200,
        height: 200,
        path: 'images/interface/button-play.png',
        interactive: true
    });

    buttonStart.on("click", () => {
        this.app.stage.removeChild(buttonStart);
        // gameplay.destroyIcon();

        this.addPlayer(WIDTH / 2, HEIGHT / 2);
        this.drawAim(WIDTH / 2, HEIGHT / 2);
        this.playerScore();
        this.createHeart();
        initAnimation();
        this._intervalEnemy = setInterval(() => {
            const enemy = randomInteger(0, 1) ? new EnemyFast(this) : new EnemySlow(this);
            this._allEnemies.push(enemy);
        }, 1500);

        this._onMouseMove = this._onMouseMove.bind(this);
        this._playerShot = this._playerShot.bind(this);

        setTimeout(() => {
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('click', this._playerShot);
        }, 0);
    });
};

Game.prototype._playerShot = function(event) {
    let newShot = new Shot(event.clientX, event.clientY, this);
};

Game.prototype._onMouseMove = function(event) {
    const self = this;
    const playerCenter = {
        x: self._player.x,
        y: self._player.y
    };

    const angle = Math.atan2(event.clientX - playerCenter.x, -(event.clientY - playerCenter.y)) * (180 / Math.PI);

    self.rotatePlayer(angle);
    self._aim.x = event.clientX;
    self._aim.y = event.clientY;
}

Game.prototype.superPower = function() {
    const self = this;
    let x = 0,
        y = 0;

    document.addEventListener('mousemove', function(event) {
        x = event.clientX;
        y = event.clientY;
    });


    self._intervalSuperPower = setInterval(function(event) {
        let newShot = new Shot(x, y, self);
    }, 100);

    setTimeout(function() {
        clearInterval(self._intervalSuperPower);
    }, 7000);
};

Game.prototype.stopInterval = function() {
    clearInterval(this._intervalEnemy);
    clearInterval(this._intervalSuperPower);
};

Game.prototype.initApp = function() {
    const self = this;
    self.app = new PIXI.Application(WIDTH, HEIGHT, { backgroundColor: 0x1099bb });
    document.body.appendChild(self.app.view);
};

Game.prototype.drawAim = function(x, y) {
    this._aim = createSprite(this.app, {
        x: x,
        y: y,
        width: 128,
        height: 128,
        path: 'images/aim.png'
    });
}

Game.prototype.addPlayer = function(x, y) {
    this._player = createSprite(this.app, {
        path: 'images/player.png',
        x: x,
        y: y,
        width: 140,
        height: 95
    });
};

Game.prototype.rotatePlayer = function(deg) {
    this._player.rotation = inRad(deg);
};

Game.prototype._endGame = function() {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('click', this._playerShot);
    this.stopInterval();
    this._allEnemies.forEach(function(el) {
        el.destroy();
    });

    this._player.destroy();
    this._aim.destroy();
    this.showInfo();
    this.restartGame();
};

Game.prototype.showInfo = function() {
    const infoText = "Your high score : ";
    const playerHightScore = new PIXI.Text(infoText + this._score, styleForAllText);

    this._scoreTicker.stop();
    this._scoreTicker.destroy();
    this._playerScoreText.destroy();

    playerHightScore.x = WIDTH / 2;
    playerHightScore.y = HEIGHT / 2;
    playerHightScore.anchor.set(0.5);
    setScale(playerHightScore);

    this.app.stage.addChild(playerHightScore);
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

    this._playerScoreText = playerScoreText;
    this._scoreTicker = ticker;
    ticker.start();
};

Game.prototype.decreaseScore = function() {
    let lastElement = this._scoreHearts.pop();

    if (lastElement) {
        lastElement.destroy();
    }

    if (this._scoreHearts.length <= 0) {
        this._endGame();
    }
};

Game.prototype.createHeart = function() {
    this._scoreHearts = [];
    const xAndY = percentages(65, 7);
    let stepX = xAndY.x;
    for (let i = 0; i <= 2; i++) {

        const heart = createSprite(this.app, {
            x: stepX,
            y: xAndY.y,
            width: 100,
            height: 100,
            path: 'images/interface/heart-live.png'
        });

        stepX += heart.width + heart.width / 6;

        this._scoreHearts.push(heart);
    };
};

//CONTROL SUPER POWER
/*
this._superScore - unstoped shot
this._superAimCount - auto aim
*/
Game.prototype.hitEnemy = function() {
    this._score += 100;
    this._superScore += 100;
    this._superAimCount += 1;

    if (this._superScore === 5000) {
        this.superPower();
        this._superScore = 0;
    }

    if (this._superAimCount === 30) {
        this.superAim();
        this._superAimCount = 0;
    }
};

Game.prototype.superAim = function() {
    let allEnemies = this._allEnemies;

    const superKill = setInterval(function() {
        allEnemies.forEach((en) => {
            document.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: en.x,
                clientY: en.y
            }));
        })

    }, 300);

    setTimeout(function() {
        clearInterval(superKill);
    }, 7000);
};

Game.prototype.restartGame = function() {
    const self = this;
    const restart = createSprite(this.app, {
        x: WIDTH / 2,
        y: HEIGHT / 3,
        width: 200,
        height: 200,
        path: 'images/interface/restart.png',
        interactive: true
    });

    //TODO - delete eventListenner All
    restart.on('click', function() {
        document.body.removeChild(self.app.view);
        let game = new Game();
    });
};

let newGame = new Game();