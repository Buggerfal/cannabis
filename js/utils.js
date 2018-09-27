// get set text

class Utils {
    static random(min, max) {
        let rand = min + Math.random() * (max - min);
        rand = Math.round(rand);
        return rand;
    }
}