class Sound {
    constructor() {
        this.typesSound = {
            explosion: 'explosion.mp3',
            shot: 'shot.mp3',
            death: 'death.mp3'
        };
    }

    play(name) {
        const path = `music/${name}`;
        const sound = PIXI.sound.Sound.from(path);

        sound.play();
        this.stop(sound)
    }

    stop(sound) {
        setTimeout(() => {
            sound.stop();
            sound.destroy();
        }, 3000);
    }
}