class Shot {
    constructor(x, y, game) {
        this.settingsSizes = new Settings;
        this._sizesPath = this.settingsSizes._elementSizes;

        this._game = game;
        this._app = game.app;
        this._drawShot();
        this._moveShot(x, y);
        this._coordinatesShot = [{ x: 0, y: 0 }];
    }

    _drawShot() {
        this._shot = createSprite(this._app, {
            x: WIDTH / 2,
            y: HEIGHT / 2,
            width: this._sizesPath.shotWidth,
            height: this._sizesPath.shotHeight,
            path: 'images/shot.png'
        });
    }

    _moveShot(x, y) {
        const ticker = new window.PIXI.ticker.Ticker();
        let step = 0;
        const stepX = (x - this._shot.x) / 20;
        const stepY = (this._shot.y - y) / 20;
        playSound('shot.mp3');

        ticker.stop();
        ticker.add(() => {
            if (this._shot.scale.x > 0.3) {
                this._ticker.stop();
                this._ticker.destroy();
                this._shot.destroy();
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
    }

    stopShot() {
        this._ticker.stop();
    }

    startShot() {
        this._ticker.start();
    }

    _checkСollision() {
        let allEnemies = this._game.allEnemies;

        for (let i = 0; i < allEnemies.length; i++) {
            let isCollision = getIsCollide(this._shot, allEnemies[i]);

            if (isCollision) {
                if (allEnemies[i]._enemy._life <= 1) {
                    allEnemies[i].destroy();
                    allEnemies.splice(i, 1);
                    this._destroy();
                    return;
                } else {
                    allEnemies[i]._enemy._life -= 1;
                    this._destroy();
                }
            }
        }

    }

    _destroy() {
        new explosions(this._app, this._shot.x, this._shot.y);
        this._game.hitEnemy();
        this._ticker.stop();
        this._ticker.destroy();
        this._shot.destroy();
        playSound('explosion.mp3');
    }
}