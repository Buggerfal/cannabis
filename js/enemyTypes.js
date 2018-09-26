class EnemyFast extends Enemy {
    constructor(game) {
        super(game, 100, 1);
    }
}

Enemy.registerNewEnemy(game => new EnemyFast(game));

class EnemySlow extends Enemy {
    constructor(game) {
        super(game, 200, 1);
    }
}

Enemy.registerNewEnemy(game => new EnemySlow(game));

class EnemySuperSlow extends Enemy {
    constructor(game) {
        super(game, 300, 1);
    }
}

Enemy.registerNewEnemy(game => new EnemySuperSlow(game));

class EnemyTwoLife extends Enemy {
    constructor(game) {
        super(game, 300, 2);
    }
}

Enemy.registerNewEnemy(game => new EnemyTwoLife(game));

class SuperEnemy extends Enemy {
    constructor(game) {
        super(game, 300, 3);
    }
}

Enemy.registerNewEnemy(game => new SuperEnemy(game));