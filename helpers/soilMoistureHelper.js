
function moisturePercent(val, dry,wet) {
    return ((val - dry) * 100 / (wet - dry)).toFixed(1)
}

module.exports = {
    moisturePercent
}