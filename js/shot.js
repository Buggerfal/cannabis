let Shot = function(x, y, game) {
    this._game = game;
    this._app = game.app;
    this._drawShot(x, y);
    this._coordinatesShot = [{ x: 0, y: 0 }];
};

Shot.prototype._drawShot = function(x, y) {
    const shot = createSprite(this._app, WIDTH / 2, HEIGHT / 2, 25, 25, 'images/shot.png', false);

    this._shot = shot;
    this._moveShot(x, y);
};

Shot.prototype._moveShot = function(x, y) {
    const ticker = new window.PIXI.ticker.Ticker();
    let step = 0;
    const stepX = (x - this._shot.x) / 20;
    const stepY = (this._shot.y - y) / 20;
    playSound('shot.mp3');

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

Shot.prototype.stopShot = function() {
    this._ticker.stop();
};

Shot.prototype.startShot = function() {
    this._ticker.start();
};

Shot.prototype._checkСollision = function() {
    let allEnemies = this._game._allEnemies;

    for (let i = 0; i < allEnemies.length; i++) {
        var isCollision = getIsCollide(this._shot, allEnemies[i]);
        if (isCollision) {
            new explosions(this._app, this._shot.x, this._shot.y);

            this._game.hitEnemy();

            this._ticker.stop();
            this._ticker.destroy();
            this._shot.destroy();
            playSound('explosion.mp3');

            allEnemies[i].destroy();

            allEnemies.splice(i, 1);

            return;
        }
    }

};