class Enemy {
    constructor(game, speed, life) {

        this._auraColors = ['0xffffb3', '0xffff00', '0x1a000d'];
        this._game = game;
        this._app = game.app;
        this._speed = speed || 100;
        this._life = life || 1;
        this.sizes = 100;
        const positionRnd = Enemy.randomEnemyPosition();

        this._aura = this.drawAura(this._app, positionRnd.x, positionRnd.y);

        this._enemy = createSprite(this._app, {
            x: positionRnd.x,
            y: positionRnd.y,
            width: this.sizes,
            height: this.sizes,
            path: 'images/enemy/' + randomInteger(1, 2) + '.png'
        });

        this._enemy._life = life;

        this._moveEnemy();
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
                playSound('death.mp3');
                this._game.decreaseScore();

                game._allEnemies = game._allEnemies.filter((element, index) => {
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

    drawAura(app, x, y) {
        const circle = new PIXI.Graphics();
        circle.lineStyle(0);
        circle.beginFill(this._auraColors[this._life - 1], 0.5);
        circle.drawCircle(x, y, this.sizes);
        circle.endFill();

        app.stage.addChild(circle);

        return circle;
    }

    destroy() {
        this._ticker.stop();
        this._ticker.destroy();
        this._enemy.destroy();
        this._aura.destroy();
    }

    get x() {
        return this._enemy.x;
    }

    get y() {
        return this._enemy.y;
    }

    static randomEnemyPosition() {
        const randomSide = randomInteger(0, 3);

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
            x: randomInteger(rndPosition.minX, rndPosition.maxX),
            y: randomInteger(rndPosition.minY, rndPosition.maxY)
        }
    }

    static getRandomEnemy(game) {
        const rand = randomInteger(0, Enemy.enemyInstances.length - 1);
        return Enemy.enemyInstances[rand](game);
    }

    static registerNewEnemy(creator) {
        Enemy.enemyInstances = Enemy.enemyInstances || [];
        Enemy.enemyInstances.push(creator);
    }
}