class Player {
    constructor(app, x, y) {
        this._app = app;
        this._x = x;
        this._y = y;

        this._settings = new Settings().player;

        this._draw();
    }

    _draw() {
        this._player = createSprite(this._app, {
            path: this._settings.imagePath,
            x: this._x,
            y: this._y,
            width: this._settings.width,
            height: this._settings.height
        });
    }

    rotateTo(x, y) {
        const angle = Math.atan2(
            x - this._player.x, -(y - this._player.y)
        ) * (180 / Math.PI);

        this._player.rotation = inRad(angle);
    }

    destroy() {
        this._player.destroy();
    }
}