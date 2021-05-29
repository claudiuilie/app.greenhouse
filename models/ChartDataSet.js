class ChartDataSet {

    #_label;
    #_borderColor;
    #_backgroundColor;
    #_fill;
    #_data;

    constructor() {
        this.#_label = null;
        this.#_borderColor = null;
        this.#_backgroundColor = null;
        this.#_fill = false;
        this.#_data = [];
    }

    get label() {
        return this.#_label;
    }

    set label(value) {
        this.#_label = value;
    }

    get borderColor() {
        return this.#_borderColor;
    }

    set borderColor(value) {
        this.#_borderColor = value;
    }

    get backgroundColor() {
        return this.#_backgroundColor;
    }

    set backgroundColor(value) {
        this.#_backgroundColor = value;
    }

    get fill() {
        return this.#_fill;
    }

    set fill(value) {
        this.#_fill = value;
    }

    get data() {
        return this.#_data;
    }

    set data(value) {
        this.#_data = value;
    }

    addToData(obj){
        this.#_data.push(obj);
    }

    toObject(){
        return{
            label: this.label,
            borderColor: this.borderColor,
            backGroundColor: this.backgroundColor,
            fill: this.fill,
            data: this.data
        }
    }
}

module.exports = ChartDataSet;