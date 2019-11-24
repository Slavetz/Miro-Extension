var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsonStringify = function () {
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i,
            k,
            v,
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':
                if (!value) return 'null';
                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;

                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    v = partial.length === 0 ? '[]' : (gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']');
                    gap = mind;
                    return v;
                }

                if (rep && (typeof rep === 'undefined' ? 'undefined' : _typeof(rep)) === 'object') {
                    length = rep.length;

                    for (i = 0; i < length; i += 1) {
                        k = rep[i];

                        if (typeof k === 'string') {
                            v = str(k, value);

                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);

                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ? '{}' : (gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}');
                gap = mind;
                return v;
        }
    }

    return function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (typeof space === 'string') {
            indent = space;
        }

        rep = replacer;

        if (replacer && typeof replacer !== 'function' && ((typeof replacer === 'undefined' ? 'undefined' : _typeof(replacer)) !== 'object' || typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

        return str('', {
            '': value
        });
    };
}();

var _map = function _map(array, callback) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        newArray.push(callback(array[i], i, array));
    }

    return newArray;
};

var _forEach = function _forEach(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
};

var _objectKeys = function _objectKeys(obj) {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{
        toString: null
    }.propertyIsEnumerable('toString'),
        dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        dontEnumsLength = dontEnums.length;

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
    }

    var result = [],
        prop,
        i;

    for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
        }
    }

    if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
            }
        }
    }

    return result;
};

var options = {
    env: 'ILST',
    path: '/Users/zoich/Library/Application Support/Adobe/CEP/extensions/Miro-Extension/temp/ILST/',
    scale: '1'
};

var save = exportPages(options);

function exportPages(options) {

    var pages = void 0;
    var env = options.env;
    var path = options.path;
    var scale = options.scale;

    /** Получаем страницы */
    if (env === 'IDSN') {
        pages = getPagesObjectFromInDesign(scale);
    } else if (env === 'ILST') {
        pages = getPagesObjectFromIllustrator(scale);
    }

    if (pages === undefined) return;

    /** Диалог сохранения файла */
    var savePath = File.saveDialog('Save path', '*.miro');
    if (savePath === null) return;

    /** Пишем все картинки */
    if (env === 'IDSN') {
        exportImagesFromInDesign(pages, path, scale);
    } else if (env === 'ILST') {
        exportImagesFromIllustrator(pages, path, scale);
    }

    exportJSON(pages, path);

    return _jsonStringify({ path: decodeURI(savePath.relativeURI), pages: pages });
}

/**+++++++++++++++++++++++++++++++++++++++++++++++++**/
/**+++++++++++++++++++++++++++++++++++++++++++++++++**/

function getPagesObjectFromIllustrator(scale) {

    var artboards = app.activeDocument.artboards;

    var artboardsNames = getArtboardsNames(artboards);

    if (artboards.length > artboardsNames.length) {
        alert('Artboard names must be unique! They will be used to update artboards on miro board.');
        return;
    }

    function getArtboardsNames(artboards) {
        var obj = {};
        _forEach(artboards, function (el, e) {
            obj[el.name] = e;
        });
        return _objectKeys(obj);
    }

    var arr = _map(artboards, function (el) {

        var h = (el.artboardRect[1] - el.artboardRect[3]) * scale;
        var w = (el.artboardRect[2] - el.artboardRect[0]) * scale;

        return {
            title: el.name,
            externalId: el.name,
            filename: el.name.replace(' ', '_').toLowerCase() + '.png',
            y: -(h * 0.5 + el.artboardRect[3] * scale),
            x: w * 0.5 + el.artboardRect[0] * scale,
            height: h,
            width: w,
            artboardRect: el.artboardRect
        };
    });

    return arr;
}

function exportImagesFromIllustrator(pages, path, scale) {

    _forEach(pages, function (page, p) {

        var exportOptions = new ImageCaptureOptions();
        exportOptions.antiAliasing = true;
        exportOptions.matte = true;
        exportOptions.resolution = 72 * scale;
        exportOptions.transparency = false;

        var fileSpec = new File(path + page.filename);

        app.activeDocument.imageCapture(fileSpec, page.artboardRect, exportOptions);
    });
}

/**+++++++++++++++++++++++++++++++++++++++++++++++++**/
/**+++++++++++++++++++++++++++++++++++++++++++++++++**/

function exportJSON(json, saveStr) {

    var file = new File(saveStr + 'images.json');

    file.encoding = "utf-8";
    file.open("w");

    var jsonFileStr = _jsonStringify(json);
    //jsonFileStr = jsonFileStr.replace(/"(\d{15,})"(?!:)/g,'$1');

    file.write(jsonFileStr);
    file.close();

    return null;
}
