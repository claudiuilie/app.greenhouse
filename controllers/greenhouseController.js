const http = require("../services/httpRequestService");
const options = require('../config/config').greenhouse;
let success;

async function setFanIn(value) {

    await http(`http://${options.host}${options.fanInEndpoint}?p=${value}`)
        .then((data) => {
            if (typeof data.return_value !== "undefined")
                success = data.return_value === 1;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })

    return success
}

async function setFanOut(value) {

    await http(`http://${options.host}${options.fanOutEndpoint}?p=${value}`)
        .then((data) => {
            if (typeof data.return_value !== "undefined")
                success = data.return_value === 1;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })
    return success;
}

async function setVegLamp(value) {

    await http(`http://${options.host}/digital/5/${value ? 0 : 1}`)
        .then((data) => {
            if (typeof data !== "undefined")
                success = true;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })
    return success;
}

async function setFruitLamp(value) {
    await http(`http://${options.host}/digital/6/${value ? 0 : 1}`)
        .then((data) => {
            if (typeof data!== "undefined")
                success = true;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })
    return success;
}

async function setPomp(status,runSeconds,sleepSeconds) {

    await http(`http://${options.host}${options.pompEndpoint}?p=${status}&${runSeconds}:${sleepSeconds}`)
        .then((data) => {
            if (typeof data.return_value !== "undefined")
                success = data.return_value === 1;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })
    return success;
}

async function pomp(start) {

    await http(`http://${options.host}/digital/3/p=${start ? 0 : 1}`)
        .then((data) => {
            if (typeof data.return_value !== "undefined")
                success = data.return_value === 1;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })
    return success;
}

async function sleep() {

    await http(`http://${options.host}${options.sleepEndpoint}?p=1`)
        .then((data) => {
            if (typeof data.return_value !== "undefined")
                success = data.return_value === 1;
        })
        .catch((err) => {
            console.log(err);
            success = false
        })
    return success;
}

async function getStats() {
    let stats = null;
    await http(`http://${options.host}`)
        .then((data) => {
            if (typeof data.variables !== "undefined")
                stats = data.variables;
        })
        .catch((err) => {
            console.log(err);
        })
    return stats;
}

module.exports = {
    setFanIn,
    setFanOut,
    setFruitLamp,
    setVegLamp,
    setPomp,
    sleep,
    pomp,
    getStats
}