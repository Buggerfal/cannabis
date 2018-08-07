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
};

Enemy.prototype.stopEnemy = function() {
    this._ticker.stop();
};

Enemy.prototype.startEnemy = function() {
    this._ticker.start();
};

Enemy.prototype.destroy = function() {
    this._ticker.stop();
    this._ticker.destroy();
    this._enemy.destroy();
};