class GameInterface {
    constructor(app) {
        this._app = app;
        this._settings = new Settings().gameInterfaces;

    }

    drawPlayButton(onStart) {
        const settings = this._settings.playButton
        this._playButton = createSprite(this._app, {
            x: settings.x,
            y: settings.y,
            width: settings.width,
            height: settings.height,
            path: settings.imagePath,
            interactive: true
        });

        this._playButton.on("click", () => {
            this._destroyPlayButton();
            onStart();
        });

    }

    _destroyPlayButton() {

        //TODO unsubscribe click event
        this._app.stage.removeChild(this._playButton);
        this._playButton.destroy();
    }
}