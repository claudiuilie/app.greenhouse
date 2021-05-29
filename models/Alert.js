class Alert {
    #_type;
    #_text;

    get text() {
        return this.#_text;
    }

    set text(value) {
        this.#_text = value;
    }

    get type() {
        return this.#_type;
    }

    set type(value) {
        this.#_type = value;
    }

    toObject(){
        return new Object({
            type: this.type,
            text: this.text
        })
    }
}

module.exports = Alert;