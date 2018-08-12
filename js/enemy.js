class Enemy {
    constructor(game) {
        this._game = game;
        this._app = game.app;

        const positionRnd = randomEnemyPosition();
        const enemy = createSprite(this._app, positionRnd.x, positionRnd.y, 100, 100, 'images/enemy/' + randomInteger(1, 4) + '.png', false);

        this._enemy = enemy;
        this._moveEnemy();
    }

    _moveEnemy() {
        const enemy = this._enemy;
        const app = this._app;
        const player = this._game._player;
        const game = this._game;

        const ticker = new window.PIXI.ticker.Ticker();
        const stepX = (WIDTH / 2 - enemy.x) / 100;
        const stepY = (enemy.y - HEIGHT / 2) / 100;

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
    }

    stopEnemy() {
        this._ticker.stop();
    }

    startEnemy() {
        this._ticker.start();
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
}