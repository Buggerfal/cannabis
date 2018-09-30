// get set text

class Utils {
    static random(min, max) {
        let rand = min + Math.random() * (max - min);
        rand = Math.round(rand);
        return rand;
    }

    static get textStyle() {
        Utils._style = Utils._style || new window.PIXI.TextStyle({
            fontFamily: 'myStyle',
            fontWeight: 'bold',
            fontStyle: 'normal',
            fontSize: 30,
            fill: '#ffffff'
        });

        return Utils._style;
    }
}