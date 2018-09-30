class Aim {
    constructor(app, x, y) {
        this._app = app;
        this._x = x;
        this._y = y;

        this._settings = new Settings().aim;

        this._draw();
    }

    _draw() {
        this._aim = createSprite(this._app, {
            x: this._x,
            y: this._y,
            width: this._settings.width,
            height: this._settings.height,
            path: this._settings.imagePath
        });
    }

    move(x, y) {
        this._aim.x = x;
        this._aim.y = y;
    }

    destroy() {
        this._aim.destroy();
    }
}