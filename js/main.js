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
class Game {
    constructor(game, speed) {
        this._score = 0;
        this._moneyForShot = 0;
        this.allEnemies = [];
        this._intervalEnemy;
        this._intervalSuperPower;
        this._checkAutoAim = false;
        this._checkBurstShooting = false;
        this._playerLevel = 0;
        this.initApp();
        this.buttonPlay(WIDTH / 2, HEIGHT / 2);
    }

    buttonPlay(x, y) {
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
            this.addPlayer(WIDTH / 2, HEIGHT / 2);
            this.drawAim(WIDTH / 2, HEIGHT / 2);
            this.playerScore();
            this.createHeart();
            this.money();
            this._drawPlayerLevel();
            explosions.initAnimation();

            this._intervalEnemy = setInterval(() => {
                const enemy = Enemy.getRandomEnemy(this);
                this.allEnemies.push(enemy);
            }, 1500);

            this._onMouseMove = this._onMouseMove.bind(this);
            this._playerShot = this._playerShot.bind(this);

            setTimeout(() => {
                document.addEventListener('mousemove', this._onMouseMove);
                document.addEventListener('click', this._playerShot);
                document.addEventListener("keydown", (e) => {
                    switch (e.keyCode) {
                        case 81:
                            this.BurstShooting();
                            break;
                        case 87:
                            this.autoAim();
                            break;
                    }
                });
            }, 0);
        });
    }

    _drawPlayerLevel() {
        this.app._playerLvl = this._playerLevel;
        const playerLvl = new PIXI.Text("Level " + this._playerLevel, styleForAllText);
        const xAndY = percentages(94, 3);

        playerLvl.x = xAndY.x;
        playerLvl.y = xAndY.y;
        playerLvl.anchor.set(0.5);
        setScale(playerLvl);

        this.app.stage.addChild(playerLvl);
        this._textLvl = playerLvl;
    }

    _destroyLvl() {
        this._textLvl.destroy();
    }

    _playerShot(event) {
        let newShot = new Shot(event.clientX, event.clientY, this);
    }

    _onMouseMove(event) {
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

    BurstShooting() {
        if (this._moneyForShot < 30 || this._checkBurstShooting) return;

        this._moneyForShot -= 30;
        this._checkBurstShooting = true;

        const self = this;
        let x = 0,
            y = 0;

        document.addEventListener('mousemove', (event) => {
            x = event.clientX;
            y = event.clientY;
        });


        self._intervalSuperPower = setInterval((event) => {
            let newShot = new Shot(x, y, self);
        }, 100);

        setTimeout(() => {
            clearInterval(self._intervalSuperPower);
            this._checkBurstShooting = false;
        }, 7000);
    }

    autoAim() {
        if (this._moneyForShot < 20 || this._checkAutoAim) return;

        this._moneyForShot -= 20;
        let allEnemies = this.allEnemies;
        this._checkAutoAim = true;

        const superKill = setInterval(() => {
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

        setTimeout(() => {
            clearInterval(superKill);
            this._checkAutoAim = false;
        }, 7000);
    }

    hitEnemy() {
        this._score += 100;
        this._moneyForShot += 1;
        let checkLvlScore = playerLevel.filter((el, index) => {
            if (el.score === this._score) {
                return el.level;
            }
            return;
        });
        if (checkLvlScore.length > 0) {
            this._playerLevel = checkLvlScore[0].level;
            this._destroyLvl();
            this._drawPlayerLevel();
        }
    }

    stopInterval() {
        clearInterval(this._intervalEnemy);
        clearInterval(this._intervalSuperPower);
    }

    initApp() {
        const self = this;
        self.app = new PIXI.Application(WIDTH, HEIGHT, { backgroundColor: 0x1099bb });
        document.body.appendChild(self.app.view);
    }

    drawAim(x, y) {
        this._aim = createSprite(this.app, {
            x: x,
            y: y,
            width: 128,
            height: 128,
            path: 'images/aim.png'
        });
    }

    addPlayer(x, y) {
        this._player = createSprite(this.app, {
            path: 'images/player.png',
            x: x,
            y: y,
            width: 140,
            height: 95
        });
    }

    rotatePlayer(deg) {
        this._player.rotation = inRad(deg);
    }

    _endGame() {
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('click', this._playerShot);
        this.stopInterval();
        this.allEnemies.forEach((el) => {
            el.destroy();
        });

        this._player.destroy();
        this._aim.destroy();
        this.showInfo();
        this.restartGame();
    }

    showInfo() {
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
    }

    playerScore() {
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
    }

    money() {
        const xAndY = percentages(3, 15);
        const ticker = new window.PIXI.ticker.Ticker();
        let moneyShot = new PIXI.Text(this._moneyForShot, styleForAllText);

        const money = createSprite(this.app, {
            x: xAndY.x,
            y: xAndY.y,
            width: 50,
            height: 50,
            path: 'images/money.png'
        });

        ticker.stop();
        ticker.add(() => {
            this.app.stage.removeChild(moneyShot);
            moneyShot = new PIXI.Text(this._moneyForShot, styleForAllText);

            moneyShot.x = xAndY.x;
            moneyShot.y = xAndY.y + money.height;
            moneyShot.anchor.set(0.5);

            this.app.stage.addChild(moneyShot);
        });
        this._moneyShot = this.moneyShot;
        ticker.start();

    }

    decreaseScore() {
        let lastElement = this._scoreHearts.pop();

        if (lastElement) {
            lastElement.destroy();
        }

        if (this._scoreHearts.length <= 0) {
            this._endGame();
        }
    }

    createHeart() {
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
    }

    restartGame() {
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
        restart.on('click', () => {
            document.body.removeChild(self.app.view);
            let game = new Game();
        });
    }
}

let newGame = new Game();

// Создлать уровень
// Создать Инструкцию
// get для жизней, очей и баксов
// Utils create
// Merge branch
// Все функции и методы на процентах