/*global
    exports
*/

exports.cls = function(reactInstance, subName=null, modifiers=null) {
    if (reactInstance == null) return;

    let name = reactInstance.type ? reactInstance.type.displayName : null;

    if (!name) {
        name = reactInstance.constructor.name;
    }

    let base = name.split(".").join("-");
    let output = [];

    base = subName != null && subName !== "" ? base + "-" + subName : base;

    if (modifiers != null) {
        output = Object.keys(modifiers).map((key) => {
            return modifiers[key] ? base + "--" + key : ""
        });
    }
    output.unshift(base);

    return output.join(" ");
}

exports.splitStringIntoChunks = function(str, chunkSize) {
    if (str.length <= chunkSize) {
        return [str];
    }

    const chunks = new Array(Math.ceil(str.length / chunkSize)).fill(null);

    return chunks.map(() => {
        const size = Math.min(str.length, chunkSize);
        const chunk = str.substring(0, size);

        str = str.substring(size, str.length);

        return chunk;
    });
}

// Changes '1' to '01'
const formatNum = (num) => {
    return (num > 9 ? '' : '0') + num;
}

exports.formatDate = function(dateObj) {
    return [
        formatNum(dateObj.getMonth() + 1),
        formatNum(dateObj.getDate()),
        dateObj.getFullYear()
    ].join('/');
}

exports.formatTime = function(dateObj) {
    return [
        formatNum(dateObj.getHours()),
        formatNum(dateObj.getMinutes()),
        formatNum(dateObj.getSeconds()),
    ].join(':')
}

exports.componentInstanceOf = (component, elementClass) => {
    if (!component) {
        return false;
    }

    if (component instanceof elementClass) {
        return true;
    }

    let type = component.type;

    do {
        if (type === elementClass || type instanceof elementClass) {
            return true;
        }
    } while(type && type.prototype && (type = type.prototype) !== Object)

    return false;
}

