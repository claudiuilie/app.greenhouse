class Event {

    #_event_type;
    #_function_name;
    #_event_request;
    #_event_result;
    #_event_error;

    constructor(event_type) {
        this.#_event_type = event_type;
        this.#_function_name = null;
        this.#_event_request = null;
        this.#_event_result = null;
        this.#_event_error = null;
    }

    get function_name() {
        return this.#_function_name;
    }

    set function_name(value) {
        this.#_function_name = value;
    }

    get event_request() {
        return this.#_event_request;
    }

    set event_request(value) {
        this.#_event_request = value;
    }

    get event_result() {
        return this.#_event_result;
    }

    set event_result(value) {
        this.#_event_result = value;
    }

    get event_error() {
        return this.#_event_error;
    }

    set event_error(value) {
        this.#_event_error = value;
    }

    get event_type() {
        return this.#_event_type;
    }

    toObject(){
        return new Object({
        event_type: this.event_type,
        function_name: this.function_name,
        event_request: this.event_request,
        event_result: this.event_result,
        event_error: this.event_error
        });
    }
}

module.exports = Event;
