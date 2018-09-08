class Enemy {
    constructor(game, speed) {
        this._game = game;
        this._app = game.app;
        this._speed = speed || 100;

        const positionRnd = Enemy.randomEnemyPosition();

        this._enemy = createSprite(this._app, {
            x: positionRnd.x,
            y: positionRnd.y,
            width: 100,
            height: 100,
            path: 'images/enemy/' + randomInteger(1, 2) + '.png'
        });

        this._moveEnemy();
    }

    _moveEnemy() {
        const enemy = this._enemy;
        const app = this._app;
        const player = this._game._player;
        const game = this._game;

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
        });
        this._ticker = ticker;
        ticker.start();
    }

    destroy() {
        this._ticker.stop();
        this._ticker.destroy();
        this._enemy.destroy();
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


    //static enemyInstances = []
}

class EnemyFast extends Enemy {
    constructor(game) {
        super(game, 50);
    }
}

Enemy.registerNewEnemy(game => new EnemyFast(game));

class EnemySlow extends Enemy {
    constructor(game) {
        super(game, 200);
    }
}

Enemy.registerNewEnemy(game => new EnemySlow(game));

class EnemySuperSlow extends Enemy {
    constructor(game) {
        super(game, 350);
    }
}

Enemy.registerNewEnemy(game => new EnemySuperSlow(game));
