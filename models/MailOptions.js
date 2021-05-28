class MailOptions {

    #_from;
    #_to;
    #_subject;
    #_html;

    constructor() {
        this.#_from = process.env.MAIL_TRANSPORTER_SENDER;
        this.#_to = process.env.MAIL_TRANSPORTER_RECEIVER;
        this.#_subject = null;
        this.#_html = null;
    }

    get from() {
        return this.#_from;
    }

    set from(value) {
        this.#_from = value;
    }

    get to() {
        return this.#_to;
    }

    set to(value) {
        this.#_to = value;
    }

    get subject() {
        return this.#_subject;
    }

    set subject(value) {
        this.#_subject = value;
    }

    get html() {
        return this.#_html;
    }

    set html(value) {
        this.#_html = value;
    }

}

module.exports = MailOptions;