let Gameplay = function(game) {
    this._game = game;
    this._app = game.app;
    this.menu;
    this._drawIcon(percentages(5, 8));
    this.drawMenu();
    this.drawClose();
};

Gameplay.prototype._drawIcon = function(position) {
    const app = this._app,
        game = this._game,
        self = this;

    this._icon = createSprite(app, {
        x: position.x,
        y: position.y,
        width: 128,
        height: 128,
        path: 'images/interface/settings.png',
        interactive: true
    });

    this._icon.on('click', function() {
        self.slideMenu(true);
    });
};

Gameplay.prototype.destroyIcon = function() {
    this._icon.destroy();
    this.menu.destroy();
    this._exit.destroy();
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

Gameplay.prototype._isMenuAnimationInProgress = false;

Gameplay.prototype.slideMenu = function(isDirection) {
    const menu = this.menu;
    const exit = this._exit;

    if (this._isMenuAnimationInProgress) {
        return;
    }

    this._isMenuAnimationInProgress = true;

    const menuSlideTicker = new window.PIXI.ticker.Ticker();

    menuSlideTicker.stop();
    menuSlideTicker.add(delta => {
        let direction = isDirection ? +delta : -delta;
        let nextMenuPosition = menu.x + direction;
        let nextExitPosition = exit.x + direction;

        let menuSlideOut = nextMenuPosition > 0;
        let menuSlideIn = nextMenuPosition + menu.width < 0;

        if (menuSlideOut) {
            menu.x = 0;
            exit.x = menu.width - exit.width;
        }

        if (menuSlideIn) {
            menu.x = -menu.width;
        }

        if (menuSlideOut || menuSlideIn) {
            this._isMenuAnimationInProgress = false;
            menuSlideTicker.stop();
            menuSlideTicker.destroy();
            return;
        }

        menu.x = nextMenuPosition;
        exit.x = nextExitPosition;
    });

    menuSlideTicker.speed = 20;
    menuSlideTicker.start();
};

Gameplay.prototype.drawClose = function() {
    const app = this._app;
    const self = this;

    const exit = new PIXI.Sprite.fromImage('images/interface/close.png');
    exit.width = 100;
    exit.height = 100;
    setScale(exit);
    exit.x = -exit.width;
    exit.y = 0;
    exit.interactive = true;

    app.stage.addChild(exit);

    this._exit = exit;

    exit.on("click", function() {
        self.slideMenu(false);
    });
};