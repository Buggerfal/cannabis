let Gameplay = function(game) {
    this._game = game;
    this._app = game.app;
    this.menu;
    this.drawMenu();
    this._drawIcon(percentages(3, 3));
};

Gameplay.prototype._drawIcon = function(position) {
    const app = this._app,
        game = this._game,
        self = this;

    const icon = new PIXI.Sprite.fromImage('images/interface/settings.png');
    icon.x = position.x;
    icon.y = position.y;
    icon.width = 128;
    icon.height = 128;
    setScale(icon);
    icon.interactive = true;

    app.stage.addChild(icon);

    this._icon = icon;

    //TODO
    icon.on('click', function() {
        self.menu.x = 0;
    });
};

//TODO
Gameplay.prototype.hideIcon = function() {
    // this._icon.destroy();
};

Gameplay.prototype.destroyIcon = function() {
    this._icon.destroy();
};

Gameplay.prototype.drawMenu = function() {
    const app = this._app;

    const gameplayMenu = new PIXI.Sprite.fromImage('images/interface/gameplay-menu.jpg');
    gameplayMenu.width = 400;
    gameplayMenu.height = HEIGHT;
    setScale(gameplayMenu);
    gameplayMenu.x = -gameplayMenu.width;
    gameplayMenu.y = 0;
    gameplayMenu.interactive = true;

    app.stage.addChild(gameplayMenu);

    this.menu = gameplayMenu;
};

Gameplay.prototype.slideMenu = function() {
    //TODO
};