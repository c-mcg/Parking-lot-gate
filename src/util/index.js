
exports.cls = function(reactInstance, subName=null, modifiers=null) {
    if (reactInstance == null) return;

    var name = reactInstance.type ? reactInstance.type.displayName : null;
    if (!name) {
        name = reactInstance.constructor.name;
    }
    var base = name.split(".").join("-");
    base = subName != null && subName !== "" ? base + "-" + subName : base;
    var output = []
    output[0] = base
    if (modifiers != null) {
        for (var key of Object.keys(modifiers)) {
            if (modifiers[key] != undefined && modifiers[key]) {
                output.push(base + "--" + key);
            }
        }
    }
    return output.join(" ");
}

exports.splitStringIntoChunks = function(str, chunkSize) {
    if (str.length <= chunkSize) {
        return [str];
    }

    var chunks = new Array(Math.ceil(str.length / chunkSize)).fill(null);
    
    return chunks.map((item, index) => {
        var size = Math.min(str.length, chunkSize);

        var chunk = str.substring(0, size);
        str = str.substring(size, str.length);

        return chunk;
    });
}

// Changes '1' to '01'
var formatNum = (num) => {
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

    var type = component.type;
    do {
        if (type === elementClass || type instanceof elementClass) {
            return true;
        }
    } while(type && type.prototype && (type = type.prototype) !== Object)

    return false;
}

