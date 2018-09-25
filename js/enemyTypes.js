class EnemyFast extends Enemy {
    constructor(game) {
        super(game, 100);
        this._enemy._life = 1;
    }
}

Enemy.registerNewEnemy(game => new EnemyFast(game));

class EnemySlow extends Enemy {
    constructor(game) {
        super(game, 200);
        this._enemy._life = 1;
    }
}

Enemy.registerNewEnemy(game => new EnemySlow(game));

class EnemySuperSlow extends Enemy {
    constructor(game) {
        super(game, 300);
        this._enemy._life = 1;
    }
}

Enemy.registerNewEnemy(game => new EnemySuperSlow(game));

class EnemyFourLife extends Enemy {
    constructor(game) {
        super(game, 300);
        this._enemy._life = 2;
    }
}

Enemy.registerNewEnemy(game => new EnemyFourLife(game));