const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const styleForAllText = new window.PIXI.TextStyle({
    fontFamily: 'myStyle',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 30,
    fill: '#ffffff'
});

class Game {
    constructor(game, speed) {
        this.settingsPosition = new Settings;
        this.settingsSizes = new Settings;

        this._positionsForElements = {
            heartsX: 75,
            heartsY: 90,
            levelX: 94,
            levelY: 3,
            scoreX: 3,
            scoreY: 3,
            moneyX: 3,
            moneyY: 15
        };

        this.allEnemies = [];
        this._intervalEnemy;
        this._intervalSuperPower;
        this._checkAutoAim = false;
        this._checkBurstShooting = false;
        this._playerMoney = 0;
        this._playerLevel = 0;
        this._playerScore = 0;

        this.initApp();
        this.buttonPlay(WIDTH / 2, HEIGHT / 2);
    }

    buttonPlay(x, y) {
        const buttonStart = createSprite(this.app, {
            x: x,
            y: y,
            width: this.settingsSizes._elementSizes.buttonPlayWidth,
            height: this.settingsSizes._elementSizes.buttonPlayHeight,
            path: 'images/interface/button-play.png',
            interactive: true
        });

        buttonStart.on("click", () => {
            this.app.stage.removeChild(buttonStart);
            this._initInterface();
            this._drawPlayerMoney();

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

    _initInterface() {
        this.addPlayer(WIDTH / 2, HEIGHT / 2);
        this.drawAim(WIDTH / 2, HEIGHT / 2);
        this._drawPlayerScore();
        this.createHeart();
        this._drawIconMoney();
        this._drawPlayerLevel();
        explosions.initAnimation();
    }

    _drawPlayerLevel() {
        this.app._playerLvl = this._playerLevel;

        const xAndY = percentages(this._positionsForElements.levelX, this._positionsForElements.levelY);
        const playerLvl = new PIXI.Text("Level " + this._playerLevel, styleForAllText);

        playerLvl.x = xAndY.x;
        playerLvl.y = xAndY.y;
        playerLvl.anchor.set(0.5);
        setScale(playerLvl);

        this.app.stage.addChild(playerLvl);
        this._textLvl = playerLvl;
    }

    _destroyPlayerLevel() {
        this._textLvl.destroy();
    }

    _drawPlayerScore() {
        this.app._playerScore = this._playerScore;

        const xAndY = percentages(this._positionsForElements.scoreX, this._positionsForElements.scoreY);
        const score = new PIXI.Text("Score: " + this._playerScore, styleForAllText);
        score.x = xAndY.x;
        score.y = xAndY.y;
        score.anchor.set(0.5);
        setScale(score);

        this.app.stage.addChild(score);
        this._texScore = score;
    }

    _destroyPlayerScore() {
        this._texScore.destroy();
    }

    _drawPlayerMoney() {
        this.app._playerMoney = this._playerMoney;

        const xAndY = percentages(this._positionsForElements.moneyX, this._positionsForElements.moneyY);
        const money = new PIXI.Text(this._playerMoney, styleForAllText);
        money.x = xAndY.x;
        money.y = xAndY.y + money.height;
        money.anchor.set(0.5);
        setScale(money);

        this.app.stage.addChild(money);
        this._textMoney = money;
    }

    _destroyPlayerMoney() {
        this._textMoney.destroy();
    }

    _drawIconMoney() {
        const xAndY = percentages(3, 15);
        const drawPlayerMoney = createSprite(this.app, {
            x: xAndY.x,
            y: xAndY.y,
            width: this.settingsSizes._elementSizes.iconMoneyWidth,
            height: this.settingsSizes._elementSizes.iconMoneyHeight,
            path: 'images/money.png'
        });

        this.app.stage.addChild(drawPlayerMoney);
    }

    hitEnemy() {
        this._playerScore += 100;
        this._playerMoney += 1;

        this._destroyPlayerScore();
        this._destroyPlayerMoney();
        this._drawPlayerScore();
        this._drawPlayerMoney();

        let checkLvlScore = playerLevel.filter((el, index) => {
            if (el.score === this._playerScore) {
                return el.level;
            }
            return;
        });
        if (checkLvlScore.length > 0) {
            this._playerLevel = checkLvlScore[0].level;
            this._destroyPlayerLevel();
            this._drawPlayerLevel();
        }
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
        if (this._playerMoney < 30 || this._checkBurstShooting) return;

        this._playerMoney -= 30;
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
        if (this._playerMoney < 20 || this._checkAutoAim) return;

        this._playerMoney -= 20;
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
            width: this.settingsSizes._elementSizes.aimWidth,
            height: this.settingsSizes._elementSizes.aimHeight,
            path: 'images/aim.png'
        });
    }

    addPlayer(x, y) {
        this._player = createSprite(this.app, {
            path: 'images/player.png',
            x: x,
            y: y,
            width: this.settingsSizes._elementSizes.playerWidth,
            height: this.settingsSizes._elementSizes.playerHeight
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
        const playerHightScore = new PIXI.Text(infoText + this._playerScore, styleForAllText);

        this._scoreTicker.stop();
        this._scoreTicker.destroy();
        this._playerScoreText.destroy();

        playerHightScore.x = WIDTH / 2;
        playerHightScore.y = HEIGHT / 2;
        playerHightScore.anchor.set(0.5);
        setScale(playerHightScore);

        this.app.stage.addChild(playerHightScore);
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
        const xAndY = percentages(this._positionsForElements.heartsX, this._positionsForElements.heartsY);
        let stepX = xAndY.x;
        for (let i = 0; i <= 2; i++) {

            const heart = createSprite(this.app, {
                x: stepX,
                y: xAndY.y,
                width: this.settingsSizes._elementSizes.heartWidth,
                height: this.settingsSizes._elementSizes.heartHeight,
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
            width: this.settingsSizes._elementSizes.buttonRestartWidth,
            height: this.settingsSizes._elementSizes.buttonRestartHeight,
            path: 'images/interface/restart.png',
            interactive: true
        });

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