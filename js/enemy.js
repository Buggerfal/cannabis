class Enemy {
    constructor(game, speed, life) {
        this._settings = new Settings();
        this._size = this._settings._elementSizes;
        this._sound = new Sound();

        this._game = game;
        this._app = game.app;
        this._speed = speed || 100;
        this._life = life || 1;
        const positionRnd = Enemy.randomEnemyPosition();

        this._aura = this._drawAura(this._app, positionRnd.x, positionRnd.y);

        this._enemy = createSprite(this._app, {
            x: positionRnd.x,
            y: positionRnd.y,
            width: this._size.enemyWidth,
            height: this._size.enemyHeight,
            path: 'images/enemy/' + Utils.random(1, 2) + '.png'
        });

        this._moveEnemy();
    }

    static get _auraColors() {
        Enemy._auraColorsArray = Enemy._auraColorsArray || ['0xffffb3', '0xffff00', '0x1a000d'];
        return Enemy._auraColorsArray;
    }

    decreaseLife() {
        if (this._life === 1) {
            return false;
        }

        this._life--;
        return true;
    }

    _moveEnemy() {
        const enemy = this._enemy;
        const app = this._app;
        const player = this._game._player;
        const game = this._game;
        const aura = this._aura;
        const stepX = (WIDTH / 2 - enemy.x) / this._speed;
        const stepY = (enemy.y - HEIGHT / 2) / this._speed;
        const ticker = new window.PIXI.ticker.Ticker();

        ticker.stop();
        ticker.add(() => {
            const isCollide = getIsCollide(player, this);

            if (isCollide) {
                this._sound.play(this._sound.typesSound.death);
                this._game.decreaseScore();

                game.allEnemies = game.allEnemies.filter((element, index) => {
                    return element != this;
                });

                new explosions(app, enemy.x, enemy.y)

                this.destroy();

                return;
            }

            enemy.x += stepX;
            enemy.y -= stepY;
            aura.x += stepX;
            aura.y -= stepY;
        });
        this._ticker = ticker;
        ticker.start();
    }

    /*
    1) Заранее по прямой получить точки координат учитывая угол
    2) ЗАпушить их в массив координат
    3) Двигать елемент по х и у
    */

    _drawAura(app, x, y) {
        const circle = new PIXI.Graphics();
        circle.lineStyle(0);
        circle.beginFill(Enemy._auraColors[this._life - 1], 0.5);
        circle.drawCircle(x, y, this._size.enemyWidth);
        circle.endFill();

        app.stage.addChild(circle);

        return circle;
    }

    destroy() {
        this._ticker.stop();
        this._ticker.destroy();
        this._enemy.destroy();
        this._app.stage.removeChild(this._enemy);
        this._aura.destroy();
    }

    get x() {
        return this._enemy.x;
    }

    get y() {
        return this._enemy.y;
    }

    static randomEnemyPosition() {
        const randomSide = Utils.random(0, 3);

        const position = [{
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
            x: Utils.random(rndPosition.minX, rndPosition.maxX),
            y: Utils.random(rndPosition.minY, rndPosition.maxY)
        }
    }

    static getRandomEnemy(game) {
        const rand = Utils.random(0, Enemy.enemyInstances.length - 1);
        return Enemy.enemyInstances[rand](game);
    }

    static registerNewEnemy(creator) {
        Enemy.enemyInstances = Enemy.enemyInstances || [];
        Enemy.enemyInstances.push(creator);
    }
}