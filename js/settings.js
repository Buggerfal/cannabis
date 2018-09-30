class Settings {
    constructor() {
        this.enemy = {
            width: 100,
            height: 100
        };

        this._positionsForElements = {
            heartsX: 75,
            heartsY: 90,
            levelX: 92,
            levelY: 3,
            scoreX: 7,
            scoreY: 3,
            moneyX: 4,
            moneyY: 85,
            iconMoneyX: 4,
            iconMoneyY: 95
        };

        this._elementSizes = {
            shotWidth: 25,
            shotHeight: 25,
            buttonPlayWidth: 200,
            buttonPlayHeight: 200,
            aimWidth: 128,
            aimHeight: 128,
            iconMoneyWidth: 50,
            iconMoneyHeight: 50,
            heartWidth: 75,
            heartHeight: 75,
            buttonRestartWidth: 200,
            buttonRestartHeight: 200,
            playerWidth: 140,
            playerHeight: 93
        };
    }
}