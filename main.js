"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => KTagPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  })();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = (function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  })();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;
var types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");
var jsYaml = {
  Type,
  Schema,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
  load,
  loadAll,
  dump,
  YAMLException,
  types,
  safeLoad,
  safeLoadAll,
  safeDump
};

// src/core/tagger.ts
function buildPrompt(noteBody, tags, notePath, maxLen) {
  const tagList = tags.map((t) => `- ${t.path}: ${t.desc}`).join("\n");
  const trimmedBody = noteBody.length > maxLen ? noteBody.slice(0, maxLen) + "\n\n[truncated]" : noteBody;
  return `You are a classification system. You do NOT answer questions. You do NOT summarize. You do NOT respond to the content. You ONLY output a JSON object with tags.

Your task: read the note below and classify it by assigning tags from the provided taxonomy.

## Rules
- Pick ALL tags that apply, but do not over-tag. Typically 2-5 tags per note.
- ONLY use tags from the list below. Do not invent new tags.
- A parent tag (e.g. product/aem-assets) can be used alongside its children (e.g. product/aem-assets/dynamic-media) if both genuinely apply.
- If the note is too short or empty to meaningfully tag, return {"tags": []}.
- Respond with ONLY valid JSON. No markdown, no explanation, no commentary.

## Available tags
${tagList}

## Required JSON response format
{"tags": ["tag/path", ...]}

## File path (use as additional context for classification)
${notePath}

## Note to classify
${trimmedBody}`;
}

// src/plugin/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  ollamaUrl: "http://localhost:11434",
  model: "qwen2.5-coder:7b",
  taxonomyYaml: `domain:
  work: "Anything related to work or employment"
  personal: "Personal life, hobbies, non-work"

type:
  meeting-notes: "Meeting notes, call summaries"
  learning: "Technical reference, study notes, training"
  planning: "Roadmaps, strategy, architecture decisions"
  reflection: "Self-assessment, reviews, feedback"
  brainstorm: "Ideas, concepts, early-stage thinking"
  task-list: "TODO or action item notes"
  reference: "Link collections, templates, lookup material"`,
  autoTag: true,
  debounceSeconds: 30,
  changeThreshold: 100
};
var KTagSettingTab = class extends import_obsidian.PluginSettingTab {
  plugin;
  progressContainer = null;
  progressBar = null;
  progressLabel = null;
  stopButton = null;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h3", { text: "Connection" });
    new import_obsidian.Setting(containerEl).setName("Ollama URL").setDesc("URL of your local Ollama server").addText(
      (text) => text.setPlaceholder("http://localhost:11434").setValue(this.plugin.settings.ollamaUrl).onChange(async (value) => {
        this.plugin.settings.ollamaUrl = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Model").setDesc("Ollama model to use for tagging").addText(
      (text) => text.setPlaceholder("qwen2.5-coder:7b").setValue(this.plugin.settings.model).onChange(async (value) => {
        this.plugin.settings.model = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "Auto-tagging" });
    new import_obsidian.Setting(containerEl).setName("Auto-tag on edit").setDesc("Automatically re-tag notes when content changes significantly").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoTag).onChange(async (value) => {
        this.plugin.settings.autoTag = value;
        await this.plugin.saveSettings();
        this.plugin.setupAutoTag();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Debounce (seconds)").setDesc("Wait this long after the last edit before auto-tagging").addText(
      (text) => text.setPlaceholder("30").setValue(String(this.plugin.settings.debounceSeconds)).onChange(async (value) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num > 0) {
          this.plugin.settings.debounceSeconds = num;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("Change threshold (characters)").setDesc("Minimum character difference from last tagging before auto-tag triggers").addText(
      (text) => text.setPlaceholder("100").setValue(String(this.plugin.settings.changeThreshold)).onChange(async (value) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0) {
          this.plugin.settings.changeThreshold = num;
          await this.plugin.saveSettings();
        }
      })
    );
    containerEl.createEl("h3", { text: "Batch tagging" });
    const batchSetting = new import_obsidian.Setting(containerEl).setName("Tag all notes").setDesc("Run the tagger across your entire vault");
    batchSetting.addButton(
      (btn) => btn.setButtonText("Tag untagged").setCta().onClick(() => this.runBatch(false))
    );
    batchSetting.addButton(
      (btn) => btn.setButtonText("Re-tag all").setWarning().onClick(() => this.runBatch(true))
    );
    this.progressContainer = containerEl.createDiv({ cls: "ktag-progress-container" });
    this.progressContainer.style.display = "none";
    this.progressContainer.style.marginTop = "12px";
    this.progressLabel = this.progressContainer.createDiv({ cls: "ktag-progress-label" });
    this.progressLabel.style.fontSize = "12px";
    this.progressLabel.style.marginBottom = "4px";
    this.progressLabel.style.color = "var(--text-muted)";
    const barOuter = this.progressContainer.createDiv({ cls: "ktag-progress-bar-outer" });
    barOuter.style.width = "100%";
    barOuter.style.height = "8px";
    barOuter.style.borderRadius = "4px";
    barOuter.style.backgroundColor = "var(--background-modifier-border)";
    barOuter.style.overflow = "hidden";
    this.progressBar = barOuter.createDiv({ cls: "ktag-progress-bar-inner" });
    this.progressBar.style.height = "100%";
    this.progressBar.style.width = "0%";
    this.progressBar.style.borderRadius = "4px";
    this.progressBar.style.backgroundColor = "var(--interactive-accent)";
    this.progressBar.style.transition = "width 0.2s ease";
    const stopContainer = this.progressContainer.createDiv();
    stopContainer.style.marginTop = "8px";
    this.stopButton = stopContainer.createEl("button", { text: "Stop" });
    this.stopButton.style.fontSize = "12px";
    this.stopButton.addEventListener("click", () => {
      this.plugin.cancelBatch();
    });
    containerEl.createEl("h3", { text: "Taxonomy" });
    new import_obsidian.Setting(containerEl).setName("Tag taxonomy").setDesc("YAML definition of your tag hierarchy").addTextArea(
      (text) => text.setPlaceholder("Enter your taxonomy YAML...").setValue(this.plugin.settings.taxonomyYaml).onChange(async (value) => {
        this.plugin.settings.taxonomyYaml = value;
        await this.plugin.saveSettings();
      })
    );
    const taxonomyTextarea = containerEl.querySelector(
      "textarea"
    );
    if (taxonomyTextarea) {
      taxonomyTextarea.style.width = "100%";
      taxonomyTextarea.style.height = "300px";
      taxonomyTextarea.style.fontFamily = "monospace";
      taxonomyTextarea.style.fontSize = "12px";
    }
  }
  async runBatch(force) {
    if (this.progressContainer) {
      this.progressContainer.style.display = "block";
    }
    this.updateProgress(0, 0, "Starting...");
    await this.plugin.tagAllNotesWithProgress(force, (current, total, name, stats) => {
      this.updateProgress(current, total, name, stats);
    });
  }
  updateProgress(current, total, noteName, stats) {
    if (!this.progressBar || !this.progressLabel) return;
    const pct = total > 0 ? Math.round(current / total * 100) : 0;
    this.progressBar.style.width = `${pct}%`;
    if (stats && current === total) {
      this.progressLabel.textContent = `Done. Tagged: ${stats.tagged}, Skipped: ${stats.skipped}, Failed: ${stats.failed}`;
      if (this.stopButton) this.stopButton.style.display = "none";
    } else {
      this.progressLabel.textContent = `${current}/${total} \u2014 ${noteName}`;
    }
  }
};

// src/plugin/main.ts
var KTagPlugin = class extends import_obsidian2.Plugin {
  settings = DEFAULT_SETTINGS;
  modifyRef = null;
  lastTaggedLength = /* @__PURE__ */ new Map();
  debouncedTaggers = /* @__PURE__ */ new Map();
  batchCancelled = false;
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new KTagSettingTab(this.app, this));
    this.addCommand({
      id: "tag-current-note",
      name: "Tag current note",
      callback: () => this.tagCurrentNote()
    });
    this.addCommand({
      id: "tag-all-notes",
      name: "Tag all untagged notes in vault",
      callback: () => this.tagAllNotes(false)
    });
    this.addCommand({
      id: "retag-all-notes",
      name: "Re-tag all notes in vault (overwrite existing)",
      callback: () => this.tagAllNotes(true)
    });
    this.setupAutoTag();
  }
  onunload() {
    this.teardownAutoTag();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  setupAutoTag() {
    this.teardownAutoTag();
    if (!this.settings.autoTag) return;
    this.modifyRef = this.app.vault.on("modify", (file) => {
      if (!(file instanceof import_obsidian2.TFile) || file.extension !== "md") return;
      this.scheduleAutoTag(file);
    });
    this.registerEvent(this.modifyRef);
  }
  teardownAutoTag() {
    if (this.modifyRef) {
      this.app.vault.offref(this.modifyRef);
      this.modifyRef = null;
    }
    this.debouncedTaggers.clear();
  }
  scheduleAutoTag(file) {
    let debouncedFn = this.debouncedTaggers.get(file.path);
    if (!debouncedFn) {
      debouncedFn = (0, import_obsidian2.debounce)(
        async (f) => {
          await this.autoTagFile(f);
          this.debouncedTaggers.delete(f.path);
        },
        this.settings.debounceSeconds * 1e3,
        true
      );
      this.debouncedTaggers.set(file.path, debouncedFn);
    }
    debouncedFn(file);
  }
  async autoTagFile(file) {
    const content = await this.app.vault.read(file);
    const lastLength = this.lastTaggedLength.get(file.path);
    if (lastLength !== void 0) {
      const diff = Math.abs(content.length - lastLength);
      if (diff < this.settings.changeThreshold) return;
    }
    let tags;
    try {
      tags = this.loadTags();
    } catch {
      return;
    }
    try {
      const resultTags = await this.callOllama(content, file.path, tags);
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        fm.tags = resultTags;
        if (!fm.created) {
          fm.created = new Date(file.stat.ctime).toISOString().split("T")[0];
        }
      });
      this.lastTaggedLength.set(file.path, content.length);
    } catch {
    }
  }
  loadTags() {
    const raw = jsYaml.load(this.settings.taxonomyYaml);
    const tags = [];
    this.flatten(raw, [], tags);
    return tags;
  }
  flatten(node, prefix, tags) {
    if (typeof node === "string") {
      tags.push({ path: [...prefix].join("/"), desc: node });
      return;
    }
    if (typeof node === "object" && node !== null) {
      const obj = node;
      if (typeof obj._desc === "string") {
        tags.push({ path: prefix.join("/"), desc: obj._desc });
      }
      for (const [key, value] of Object.entries(obj)) {
        if (key === "_desc") continue;
        this.flatten(value, [...prefix, key], tags);
      }
    }
  }
  async callOllama(noteBody, notePath, tags) {
    const prompt = buildPrompt(noteBody, tags, notePath, 4e3);
    const response = await fetch(`${this.settings.ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.settings.model,
        prompt,
        stream: false,
        format: "json",
        options: { temperature: 0.1, num_predict: 256 }
      })
    });
    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }
    const data = await response.json();
    const parsed = JSON.parse(data.response);
    if (!parsed.tags || !Array.isArray(parsed.tags)) {
      return [];
    }
    return parsed.tags;
  }
  async tagFile(file, tags) {
    const content = await this.app.vault.read(file);
    const resultTags = await this.callOllama(content, file.path, tags);
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.tags = resultTags;
      if (!fm.created) {
        fm.created = new Date(file.stat.ctime).toISOString().split("T")[0];
      }
    });
    this.lastTaggedLength.set(file.path, content.length);
    return resultTags;
  }
  async tagCurrentNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new import_obsidian2.Notice("No active note");
      return;
    }
    let tags;
    try {
      tags = this.loadTags();
    } catch {
      new import_obsidian2.Notice("Invalid taxonomy YAML \u2014 check kTag settings");
      return;
    }
    new import_obsidian2.Notice(`kTag: tagging ${file.basename}...`);
    try {
      const resultTags = await this.tagFile(file, tags);
      new import_obsidian2.Notice(`kTag: ${file.basename} \u2192 ${resultTags.join(", ") || "no tags"}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      new import_obsidian2.Notice(`kTag failed: ${msg}`);
    }
  }
  cancelBatch() {
    this.batchCancelled = true;
  }
  async tagAllNotesWithProgress(force, onProgress) {
    let tags;
    try {
      tags = this.loadTags();
    } catch {
      new import_obsidian2.Notice("Invalid taxonomy YAML \u2014 check kTag settings");
      return;
    }
    const files = this.app.vault.getMarkdownFiles();
    let tagged = 0;
    let skipped = 0;
    let failed = 0;
    this.batchCancelled = false;
    for (let i = 0; i < files.length; i++) {
      if (this.batchCancelled) {
        new import_obsidian2.Notice(`kTag stopped. Tagged: ${tagged}, Skipped: ${skipped}, Failed: ${failed}`);
        onProgress(i, files.length, "Cancelled", { tagged, skipped, failed });
        return;
      }
      const file = files[i];
      onProgress(i, files.length, file.basename, { tagged, skipped, failed });
      const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!force && fm?.tags && Array.isArray(fm.tags) && fm.tags.length > 0) {
        skipped++;
        continue;
      }
      try {
        await this.tagFile(file, tags);
        tagged++;
      } catch {
        failed++;
      }
    }
    onProgress(files.length, files.length, "", { tagged, skipped, failed });
    new import_obsidian2.Notice(`kTag done. Tagged: ${tagged}, Skipped: ${skipped}, Failed: ${failed}`);
  }
  async tagAllNotes(force) {
    await this.tagAllNotesWithProgress(force, () => {
    });
  }
};
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3BsdWdpbi9tYWluLnRzIiwgIm5vZGVfbW9kdWxlcy9qcy15YW1sL2Rpc3QvanMteWFtbC5tanMiLCAic3JjL2NvcmUvdGFnZ2VyLnRzIiwgInNyYy9wbHVnaW4vc2V0dGluZ3MudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IE5vdGljZSwgUGx1Z2luLCBURmlsZSwgRXZlbnRSZWYsIGRlYm91bmNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeWFtbCBmcm9tIFwianMteWFtbFwiO1xuaW1wb3J0IHsgdHlwZSBUYWcgfSBmcm9tIFwiLi4vY29yZS90YXhvbm9teS5qc1wiO1xuaW1wb3J0IHsgYnVpbGRQcm9tcHQgfSBmcm9tIFwiLi4vY29yZS90YWdnZXIuanNcIjtcbmltcG9ydCB7XG4gIEtUYWdTZXR0aW5nVGFiLFxuICB0eXBlIEtUYWdTZXR0aW5ncyxcbiAgREVGQVVMVF9TRVRUSU5HUyxcbn0gZnJvbSBcIi4vc2V0dGluZ3MuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS1RhZ1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBLVGFnU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuICBwcml2YXRlIG1vZGlmeVJlZjogRXZlbnRSZWYgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsYXN0VGFnZ2VkTGVuZ3RoOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIGRlYm91bmNlZFRhZ2dlcnM6IE1hcDxzdHJpbmcsIFJldHVyblR5cGU8dHlwZW9mIGRlYm91bmNlPj4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgYmF0Y2hDYW5jZWxsZWQgPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEtUYWdTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwidGFnLWN1cnJlbnQtbm90ZVwiLFxuICAgICAgbmFtZTogXCJUYWcgY3VycmVudCBub3RlXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy50YWdDdXJyZW50Tm90ZSgpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInRhZy1hbGwtbm90ZXNcIixcbiAgICAgIG5hbWU6IFwiVGFnIGFsbCB1bnRhZ2dlZCBub3RlcyBpbiB2YXVsdFwiLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMudGFnQWxsTm90ZXMoZmFsc2UpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInJldGFnLWFsbC1ub3Rlc1wiLFxuICAgICAgbmFtZTogXCJSZS10YWcgYWxsIG5vdGVzIGluIHZhdWx0IChvdmVyd3JpdGUgZXhpc3RpbmcpXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy50YWdBbGxOb3Rlcyh0cnVlKSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0dXBBdXRvVGFnKCk7XG4gIH1cblxuICBvbnVubG9hZCgpIHtcbiAgICB0aGlzLnRlYXJkb3duQXV0b1RhZygpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICBzZXR1cEF1dG9UYWcoKSB7XG4gICAgdGhpcy50ZWFyZG93bkF1dG9UYWcoKTtcblxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5hdXRvVGFnKSByZXR1cm47XG5cbiAgICB0aGlzLm1vZGlmeVJlZiA9IHRoaXMuYXBwLnZhdWx0Lm9uKFwibW9kaWZ5XCIsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHx8IGZpbGUuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIHJldHVybjtcbiAgICAgIHRoaXMuc2NoZWR1bGVBdXRvVGFnKGZpbGUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMubW9kaWZ5UmVmKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVhcmRvd25BdXRvVGFnKCkge1xuICAgIGlmICh0aGlzLm1vZGlmeVJlZikge1xuICAgICAgdGhpcy5hcHAudmF1bHQub2ZmcmVmKHRoaXMubW9kaWZ5UmVmKTtcbiAgICAgIHRoaXMubW9kaWZ5UmVmID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRUYWdnZXJzLmNsZWFyKCk7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlQXV0b1RhZyhmaWxlOiBURmlsZSkge1xuICAgIGxldCBkZWJvdW5jZWRGbiA9IHRoaXMuZGVib3VuY2VkVGFnZ2Vycy5nZXQoZmlsZS5wYXRoKTtcblxuICAgIGlmICghZGVib3VuY2VkRm4pIHtcbiAgICAgIGRlYm91bmNlZEZuID0gZGVib3VuY2UoXG4gICAgICAgIGFzeW5jIChmOiBURmlsZSkgPT4ge1xuICAgICAgICAgIGF3YWl0IHRoaXMuYXV0b1RhZ0ZpbGUoZik7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWRUYWdnZXJzLmRlbGV0ZShmLnBhdGgpO1xuICAgICAgICB9LFxuICAgICAgICB0aGlzLnNldHRpbmdzLmRlYm91bmNlU2Vjb25kcyAqIDEwMDAsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG4gICAgICB0aGlzLmRlYm91bmNlZFRhZ2dlcnMuc2V0KGZpbGUucGF0aCwgZGVib3VuY2VkRm4pO1xuICAgIH1cblxuICAgIGRlYm91bmNlZEZuKGZpbGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhdXRvVGFnRmlsZShmaWxlOiBURmlsZSkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuICAgIGNvbnN0IGxhc3RMZW5ndGggPSB0aGlzLmxhc3RUYWdnZWRMZW5ndGguZ2V0KGZpbGUucGF0aCk7XG5cbiAgICAvLyBTa2lwIGlmIGNoYW5nZSBpcyBiZWxvdyB0aHJlc2hvbGRcbiAgICBpZiAobGFzdExlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoY29udGVudC5sZW5ndGggLSBsYXN0TGVuZ3RoKTtcbiAgICAgIGlmIChkaWZmIDwgdGhpcy5zZXR0aW5ncy5jaGFuZ2VUaHJlc2hvbGQpIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdGFnczogVGFnW107XG4gICAgdHJ5IHtcbiAgICAgIHRhZ3MgPSB0aGlzLmxvYWRUYWdzKCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdFRhZ3MgPSBhd2FpdCB0aGlzLmNhbGxPbGxhbWEoY29udGVudCwgZmlsZS5wYXRoLCB0YWdzKTtcblxuICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbSkgPT4ge1xuICAgICAgICBmbS50YWdzID0gcmVzdWx0VGFncztcbiAgICAgICAgaWYgKCFmbS5jcmVhdGVkKSB7XG4gICAgICAgICAgZm0uY3JlYXRlZCA9IG5ldyBEYXRlKGZpbGUuc3RhdC5jdGltZSkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmxhc3RUYWdnZWRMZW5ndGguc2V0KGZpbGUucGF0aCwgY29udGVudC5sZW5ndGgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gU2lsZW50IGZhaWwgZm9yIGF1dG8tdGFnIFx1MjAxNCBkb24ndCBzcGFtIG5vdGljZXNcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvYWRUYWdzKCk6IFRhZ1tdIHtcbiAgICBjb25zdCByYXcgPSB5YW1sLmxvYWQodGhpcy5zZXR0aW5ncy50YXhvbm9teVlhbWwpIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgdGhpcy5mbGF0dGVuKHJhdywgW10sIHRhZ3MpO1xuICAgIHJldHVybiB0YWdzO1xuICB9XG5cbiAgcHJpdmF0ZSBmbGF0dGVuKG5vZGU6IHVua25vd24sIHByZWZpeDogc3RyaW5nW10sIHRhZ3M6IFRhZ1tdKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0YWdzLnB1c2goeyBwYXRoOiBbLi4ucHJlZml4XS5qb2luKFwiL1wiKSwgZGVzYzogbm9kZSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSBcIm9iamVjdFwiICYmIG5vZGUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG9iaiA9IG5vZGUgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgICBpZiAodHlwZW9mIG9iai5fZGVzYyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0YWdzLnB1c2goeyBwYXRoOiBwcmVmaXguam9pbihcIi9cIiksIGRlc2M6IG9iai5fZGVzYyB9KTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iaikpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJfZGVzY1wiKSBjb250aW51ZTtcbiAgICAgICAgdGhpcy5mbGF0dGVuKHZhbHVlLCBbLi4ucHJlZml4LCBrZXldLCB0YWdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNhbGxPbGxhbWEobm90ZUJvZHk6IHN0cmluZywgbm90ZVBhdGg6IHN0cmluZywgdGFnczogVGFnW10pOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgcHJvbXB0ID0gYnVpbGRQcm9tcHQobm90ZUJvZHksIHRhZ3MsIG5vdGVQYXRoLCA0MDAwKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5zZXR0aW5ncy5vbGxhbWFVcmx9L2FwaS9nZW5lcmF0ZWAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1vZGVsOiB0aGlzLnNldHRpbmdzLm1vZGVsLFxuICAgICAgICBwcm9tcHQsXG4gICAgICAgIHN0cmVhbTogZmFsc2UsXG4gICAgICAgIGZvcm1hdDogXCJqc29uXCIsXG4gICAgICAgIG9wdGlvbnM6IHsgdGVtcGVyYXR1cmU6IDAuMSwgbnVtX3ByZWRpY3Q6IDI1NiB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE9sbGFtYSByZXR1cm5lZCAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gKGF3YWl0IHJlc3BvbnNlLmpzb24oKSkgYXMgeyByZXNwb25zZTogc3RyaW5nIH07XG4gICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhLnJlc3BvbnNlKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblxuICAgIGlmICghcGFyc2VkLnRhZ3MgfHwgIUFycmF5LmlzQXJyYXkocGFyc2VkLnRhZ3MpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlZC50YWdzIGFzIHN0cmluZ1tdO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB0YWdGaWxlKGZpbGU6IFRGaWxlLCB0YWdzOiBUYWdbXSk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICBjb25zdCByZXN1bHRUYWdzID0gYXdhaXQgdGhpcy5jYWxsT2xsYW1hKGNvbnRlbnQsIGZpbGUucGF0aCwgdGFncyk7XG5cbiAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZmlsZSwgKGZtKSA9PiB7XG4gICAgICBmbS50YWdzID0gcmVzdWx0VGFncztcbiAgICAgIGlmICghZm0uY3JlYXRlZCkge1xuICAgICAgICBmbS5jcmVhdGVkID0gbmV3IERhdGUoZmlsZS5zdGF0LmN0aW1lKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubGFzdFRhZ2dlZExlbmd0aC5zZXQoZmlsZS5wYXRoLCBjb250ZW50Lmxlbmd0aCk7XG5cbiAgICByZXR1cm4gcmVzdWx0VGFncztcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdGFnQ3VycmVudE5vdGUoKSB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBuZXcgTm90aWNlKFwiTm8gYWN0aXZlIG5vdGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRhZ3M6IFRhZ1tdO1xuICAgIHRyeSB7XG4gICAgICB0YWdzID0gdGhpcy5sb2FkVGFncygpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgbmV3IE5vdGljZShcIkludmFsaWQgdGF4b25vbXkgWUFNTCBcdTIwMTQgY2hlY2sga1RhZyBzZXR0aW5nc1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXcgTm90aWNlKGBrVGFnOiB0YWdnaW5nICR7ZmlsZS5iYXNlbmFtZX0uLi5gKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHRUYWdzID0gYXdhaXQgdGhpcy50YWdGaWxlKGZpbGUsIHRhZ3MpO1xuICAgICAgbmV3IE5vdGljZShga1RhZzogJHtmaWxlLmJhc2VuYW1lfSBcdTIxOTIgJHtyZXN1bHRUYWdzLmpvaW4oXCIsIFwiKSB8fCBcIm5vIHRhZ3NcIn1gKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcbiAgICAgIG5ldyBOb3RpY2UoYGtUYWcgZmFpbGVkOiAke21zZ31gKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWxCYXRjaCgpIHtcbiAgICB0aGlzLmJhdGNoQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHRhZ0FsbE5vdGVzV2l0aFByb2dyZXNzKFxuICAgIGZvcmNlOiBib29sZWFuLFxuICAgIG9uUHJvZ3Jlc3M6IChcbiAgICAgIGN1cnJlbnQ6IG51bWJlcixcbiAgICAgIHRvdGFsOiBudW1iZXIsXG4gICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICBzdGF0czogeyB0YWdnZWQ6IG51bWJlcjsgc2tpcHBlZDogbnVtYmVyOyBmYWlsZWQ6IG51bWJlciB9XG4gICAgKSA9PiB2b2lkXG4gICkge1xuICAgIGxldCB0YWdzOiBUYWdbXTtcbiAgICB0cnkge1xuICAgICAgdGFncyA9IHRoaXMubG9hZFRhZ3MoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJJbnZhbGlkIHRheG9ub215IFlBTUwgXHUyMDE0IGNoZWNrIGtUYWcgc2V0dGluZ3NcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG4gICAgbGV0IHRhZ2dlZCA9IDA7XG4gICAgbGV0IHNraXBwZWQgPSAwO1xuICAgIGxldCBmYWlsZWQgPSAwO1xuICAgIHRoaXMuYmF0Y2hDYW5jZWxsZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmJhdGNoQ2FuY2VsbGVkKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYGtUYWcgc3RvcHBlZC4gVGFnZ2VkOiAke3RhZ2dlZH0sIFNraXBwZWQ6ICR7c2tpcHBlZH0sIEZhaWxlZDogJHtmYWlsZWR9YCk7XG4gICAgICAgIG9uUHJvZ3Jlc3MoaSwgZmlsZXMubGVuZ3RoLCBcIkNhbmNlbGxlZFwiLCB7IHRhZ2dlZCwgc2tpcHBlZCwgZmFpbGVkIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcbiAgICAgIG9uUHJvZ3Jlc3MoaSwgZmlsZXMubGVuZ3RoLCBmaWxlLmJhc2VuYW1lLCB7IHRhZ2dlZCwgc2tpcHBlZCwgZmFpbGVkIH0pO1xuXG4gICAgICBjb25zdCBmbSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpPy5mcm9udG1hdHRlcjtcbiAgICAgIGlmICghZm9yY2UgJiYgZm0/LnRhZ3MgJiYgQXJyYXkuaXNBcnJheShmbS50YWdzKSAmJiBmbS50YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2tpcHBlZCsrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy50YWdGaWxlKGZpbGUsIHRhZ3MpO1xuICAgICAgICB0YWdnZWQrKztcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBmYWlsZWQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblByb2dyZXNzKGZpbGVzLmxlbmd0aCwgZmlsZXMubGVuZ3RoLCBcIlwiLCB7IHRhZ2dlZCwgc2tpcHBlZCwgZmFpbGVkIH0pO1xuICAgIG5ldyBOb3RpY2UoYGtUYWcgZG9uZS4gVGFnZ2VkOiAke3RhZ2dlZH0sIFNraXBwZWQ6ICR7c2tpcHBlZH0sIEZhaWxlZDogJHtmYWlsZWR9YCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHRhZ0FsbE5vdGVzKGZvcmNlOiBib29sZWFuKSB7XG4gICAgYXdhaXQgdGhpcy50YWdBbGxOb3Rlc1dpdGhQcm9ncmVzcyhmb3JjZSwgKCkgPT4ge30pO1xuICB9XG59XG4iLCAiXG4vKiEganMteWFtbCA0LjEuMSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL2pzLXlhbWwgQGxpY2Vuc2UgTUlUICovXG5mdW5jdGlvbiBpc05vdGhpbmcoc3ViamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBzdWJqZWN0ID09PSAndW5kZWZpbmVkJykgfHwgKHN1YmplY3QgPT09IG51bGwpO1xufVxuXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHN1YmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcpICYmIChzdWJqZWN0ICE9PSBudWxsKTtcbn1cblxuXG5mdW5jdGlvbiB0b0FycmF5KHNlcXVlbmNlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHNlcXVlbmNlKSkgcmV0dXJuIHNlcXVlbmNlO1xuICBlbHNlIGlmIChpc05vdGhpbmcoc2VxdWVuY2UpKSByZXR1cm4gW107XG5cbiAgcmV0dXJuIFsgc2VxdWVuY2UgXTtcbn1cblxuXG5mdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgdmFyIGluZGV4LCBsZW5ndGgsIGtleSwgc291cmNlS2V5cztcblxuICBpZiAoc291cmNlKSB7XG4gICAgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG5cbiAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gc291cmNlS2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICBrZXkgPSBzb3VyY2VLZXlzW2luZGV4XTtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuXG5mdW5jdGlvbiByZXBlYXQoc3RyaW5nLCBjb3VudCkge1xuICB2YXIgcmVzdWx0ID0gJycsIGN5Y2xlO1xuXG4gIGZvciAoY3ljbGUgPSAwOyBjeWNsZSA8IGNvdW50OyBjeWNsZSArPSAxKSB7XG4gICAgcmVzdWx0ICs9IHN0cmluZztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gaXNOZWdhdGl2ZVplcm8obnVtYmVyKSB7XG4gIHJldHVybiAobnVtYmVyID09PSAwKSAmJiAoTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZID09PSAxIC8gbnVtYmVyKTtcbn1cblxuXG52YXIgaXNOb3RoaW5nXzEgICAgICA9IGlzTm90aGluZztcbnZhciBpc09iamVjdF8xICAgICAgID0gaXNPYmplY3Q7XG52YXIgdG9BcnJheV8xICAgICAgICA9IHRvQXJyYXk7XG52YXIgcmVwZWF0XzEgICAgICAgICA9IHJlcGVhdDtcbnZhciBpc05lZ2F0aXZlWmVyb18xID0gaXNOZWdhdGl2ZVplcm87XG52YXIgZXh0ZW5kXzEgICAgICAgICA9IGV4dGVuZDtcblxudmFyIGNvbW1vbiA9IHtcblx0aXNOb3RoaW5nOiBpc05vdGhpbmdfMSxcblx0aXNPYmplY3Q6IGlzT2JqZWN0XzEsXG5cdHRvQXJyYXk6IHRvQXJyYXlfMSxcblx0cmVwZWF0OiByZXBlYXRfMSxcblx0aXNOZWdhdGl2ZVplcm86IGlzTmVnYXRpdmVaZXJvXzEsXG5cdGV4dGVuZDogZXh0ZW5kXzFcbn07XG5cbi8vIFlBTUwgZXJyb3IgY2xhc3MuIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvODQ1ODk4NFxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKGV4Y2VwdGlvbiwgY29tcGFjdCkge1xuICB2YXIgd2hlcmUgPSAnJywgbWVzc2FnZSA9IGV4Y2VwdGlvbi5yZWFzb24gfHwgJyh1bmtub3duIHJlYXNvbiknO1xuXG4gIGlmICghZXhjZXB0aW9uLm1hcmspIHJldHVybiBtZXNzYWdlO1xuXG4gIGlmIChleGNlcHRpb24ubWFyay5uYW1lKSB7XG4gICAgd2hlcmUgKz0gJ2luIFwiJyArIGV4Y2VwdGlvbi5tYXJrLm5hbWUgKyAnXCIgJztcbiAgfVxuXG4gIHdoZXJlICs9ICcoJyArIChleGNlcHRpb24ubWFyay5saW5lICsgMSkgKyAnOicgKyAoZXhjZXB0aW9uLm1hcmsuY29sdW1uICsgMSkgKyAnKSc7XG5cbiAgaWYgKCFjb21wYWN0ICYmIGV4Y2VwdGlvbi5tYXJrLnNuaXBwZXQpIHtcbiAgICB3aGVyZSArPSAnXFxuXFxuJyArIGV4Y2VwdGlvbi5tYXJrLnNuaXBwZXQ7XG4gIH1cblxuICByZXR1cm4gbWVzc2FnZSArICcgJyArIHdoZXJlO1xufVxuXG5cbmZ1bmN0aW9uIFlBTUxFeGNlcHRpb24kMShyZWFzb24sIG1hcmspIHtcbiAgLy8gU3VwZXIgY29uc3RydWN0b3JcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICB0aGlzLm5hbWUgPSAnWUFNTEV4Y2VwdGlvbic7XG4gIHRoaXMucmVhc29uID0gcmVhc29uO1xuICB0aGlzLm1hcmsgPSBtYXJrO1xuICB0aGlzLm1lc3NhZ2UgPSBmb3JtYXRFcnJvcih0aGlzLCBmYWxzZSk7XG5cbiAgLy8gSW5jbHVkZSBzdGFjayB0cmFjZSBpbiBlcnJvciBvYmplY3RcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgLy8gQ2hyb21lIGFuZCBOb2RlSlNcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGRiwgSUUgMTArIGFuZCBTYWZhcmkgNisuIEZhbGxiYWNrIGZvciBvdGhlcnNcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjayB8fCAnJztcbiAgfVxufVxuXG5cbi8vIEluaGVyaXQgZnJvbSBFcnJvclxuWUFNTEV4Y2VwdGlvbiQxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbllBTUxFeGNlcHRpb24kMS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBZQU1MRXhjZXB0aW9uJDE7XG5cblxuWUFNTEV4Y2VwdGlvbiQxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGNvbXBhY3QpIHtcbiAgcmV0dXJuIHRoaXMubmFtZSArICc6ICcgKyBmb3JtYXRFcnJvcih0aGlzLCBjb21wYWN0KTtcbn07XG5cblxudmFyIGV4Y2VwdGlvbiA9IFlBTUxFeGNlcHRpb24kMTtcblxuLy8gZ2V0IHNuaXBwZXQgZm9yIGEgc2luZ2xlIGxpbmUsIHJlc3BlY3RpbmcgbWF4TGVuZ3RoXG5mdW5jdGlvbiBnZXRMaW5lKGJ1ZmZlciwgbGluZVN0YXJ0LCBsaW5lRW5kLCBwb3NpdGlvbiwgbWF4TGluZUxlbmd0aCkge1xuICB2YXIgaGVhZCA9ICcnO1xuICB2YXIgdGFpbCA9ICcnO1xuICB2YXIgbWF4SGFsZkxlbmd0aCA9IE1hdGguZmxvb3IobWF4TGluZUxlbmd0aCAvIDIpIC0gMTtcblxuICBpZiAocG9zaXRpb24gLSBsaW5lU3RhcnQgPiBtYXhIYWxmTGVuZ3RoKSB7XG4gICAgaGVhZCA9ICcgLi4uICc7XG4gICAgbGluZVN0YXJ0ID0gcG9zaXRpb24gLSBtYXhIYWxmTGVuZ3RoICsgaGVhZC5sZW5ndGg7XG4gIH1cblxuICBpZiAobGluZUVuZCAtIHBvc2l0aW9uID4gbWF4SGFsZkxlbmd0aCkge1xuICAgIHRhaWwgPSAnIC4uLic7XG4gICAgbGluZUVuZCA9IHBvc2l0aW9uICsgbWF4SGFsZkxlbmd0aCAtIHRhaWwubGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdHI6IGhlYWQgKyBidWZmZXIuc2xpY2UobGluZVN0YXJ0LCBsaW5lRW5kKS5yZXBsYWNlKC9cXHQvZywgJ1x1MjE5MicpICsgdGFpbCxcbiAgICBwb3M6IHBvc2l0aW9uIC0gbGluZVN0YXJ0ICsgaGVhZC5sZW5ndGggLy8gcmVsYXRpdmUgcG9zaXRpb25cbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBwYWRTdGFydChzdHJpbmcsIG1heCkge1xuICByZXR1cm4gY29tbW9uLnJlcGVhdCgnICcsIG1heCAtIHN0cmluZy5sZW5ndGgpICsgc3RyaW5nO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VTbmlwcGV0KG1hcmssIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IE9iamVjdC5jcmVhdGUob3B0aW9ucyB8fCBudWxsKTtcblxuICBpZiAoIW1hcmsuYnVmZmVyKSByZXR1cm4gbnVsbDtcblxuICBpZiAoIW9wdGlvbnMubWF4TGVuZ3RoKSBvcHRpb25zLm1heExlbmd0aCA9IDc5O1xuICBpZiAodHlwZW9mIG9wdGlvbnMuaW5kZW50ICAgICAgIT09ICdudW1iZXInKSBvcHRpb25zLmluZGVudCAgICAgID0gMTtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmxpbmVzQmVmb3JlICE9PSAnbnVtYmVyJykgb3B0aW9ucy5saW5lc0JlZm9yZSA9IDM7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5saW5lc0FmdGVyICAhPT0gJ251bWJlcicpIG9wdGlvbnMubGluZXNBZnRlciAgPSAyO1xuXG4gIHZhciByZSA9IC9cXHI/XFxufFxccnxcXDAvZztcbiAgdmFyIGxpbmVTdGFydHMgPSBbIDAgXTtcbiAgdmFyIGxpbmVFbmRzID0gW107XG4gIHZhciBtYXRjaDtcbiAgdmFyIGZvdW5kTGluZU5vID0gLTE7XG5cbiAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMobWFyay5idWZmZXIpKSkge1xuICAgIGxpbmVFbmRzLnB1c2gobWF0Y2guaW5kZXgpO1xuICAgIGxpbmVTdGFydHMucHVzaChtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG5cbiAgICBpZiAobWFyay5wb3NpdGlvbiA8PSBtYXRjaC5pbmRleCAmJiBmb3VuZExpbmVObyA8IDApIHtcbiAgICAgIGZvdW5kTGluZU5vID0gbGluZVN0YXJ0cy5sZW5ndGggLSAyO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmb3VuZExpbmVObyA8IDApIGZvdW5kTGluZU5vID0gbGluZVN0YXJ0cy5sZW5ndGggLSAxO1xuXG4gIHZhciByZXN1bHQgPSAnJywgaSwgbGluZTtcbiAgdmFyIGxpbmVOb0xlbmd0aCA9IE1hdGgubWluKG1hcmsubGluZSArIG9wdGlvbnMubGluZXNBZnRlciwgbGluZUVuZHMubGVuZ3RoKS50b1N0cmluZygpLmxlbmd0aDtcbiAgdmFyIG1heExpbmVMZW5ndGggPSBvcHRpb25zLm1heExlbmd0aCAtIChvcHRpb25zLmluZGVudCArIGxpbmVOb0xlbmd0aCArIDMpO1xuXG4gIGZvciAoaSA9IDE7IGkgPD0gb3B0aW9ucy5saW5lc0JlZm9yZTsgaSsrKSB7XG4gICAgaWYgKGZvdW5kTGluZU5vIC0gaSA8IDApIGJyZWFrO1xuICAgIGxpbmUgPSBnZXRMaW5lKFxuICAgICAgbWFyay5idWZmZXIsXG4gICAgICBsaW5lU3RhcnRzW2ZvdW5kTGluZU5vIC0gaV0sXG4gICAgICBsaW5lRW5kc1tmb3VuZExpbmVObyAtIGldLFxuICAgICAgbWFyay5wb3NpdGlvbiAtIChsaW5lU3RhcnRzW2ZvdW5kTGluZU5vXSAtIGxpbmVTdGFydHNbZm91bmRMaW5lTm8gLSBpXSksXG4gICAgICBtYXhMaW5lTGVuZ3RoXG4gICAgKTtcbiAgICByZXN1bHQgPSBjb21tb24ucmVwZWF0KCcgJywgb3B0aW9ucy5pbmRlbnQpICsgcGFkU3RhcnQoKG1hcmsubGluZSAtIGkgKyAxKS50b1N0cmluZygpLCBsaW5lTm9MZW5ndGgpICtcbiAgICAgICcgfCAnICsgbGluZS5zdHIgKyAnXFxuJyArIHJlc3VsdDtcbiAgfVxuXG4gIGxpbmUgPSBnZXRMaW5lKG1hcmsuYnVmZmVyLCBsaW5lU3RhcnRzW2ZvdW5kTGluZU5vXSwgbGluZUVuZHNbZm91bmRMaW5lTm9dLCBtYXJrLnBvc2l0aW9uLCBtYXhMaW5lTGVuZ3RoKTtcbiAgcmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJyAnLCBvcHRpb25zLmluZGVudCkgKyBwYWRTdGFydCgobWFyay5saW5lICsgMSkudG9TdHJpbmcoKSwgbGluZU5vTGVuZ3RoKSArXG4gICAgJyB8ICcgKyBsaW5lLnN0ciArICdcXG4nO1xuICByZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnLScsIG9wdGlvbnMuaW5kZW50ICsgbGluZU5vTGVuZ3RoICsgMyArIGxpbmUucG9zKSArICdeJyArICdcXG4nO1xuXG4gIGZvciAoaSA9IDE7IGkgPD0gb3B0aW9ucy5saW5lc0FmdGVyOyBpKyspIHtcbiAgICBpZiAoZm91bmRMaW5lTm8gKyBpID49IGxpbmVFbmRzLmxlbmd0aCkgYnJlYWs7XG4gICAgbGluZSA9IGdldExpbmUoXG4gICAgICBtYXJrLmJ1ZmZlcixcbiAgICAgIGxpbmVTdGFydHNbZm91bmRMaW5lTm8gKyBpXSxcbiAgICAgIGxpbmVFbmRzW2ZvdW5kTGluZU5vICsgaV0sXG4gICAgICBtYXJrLnBvc2l0aW9uIC0gKGxpbmVTdGFydHNbZm91bmRMaW5lTm9dIC0gbGluZVN0YXJ0c1tmb3VuZExpbmVObyArIGldKSxcbiAgICAgIG1heExpbmVMZW5ndGhcbiAgICApO1xuICAgIHJlc3VsdCArPSBjb21tb24ucmVwZWF0KCcgJywgb3B0aW9ucy5pbmRlbnQpICsgcGFkU3RhcnQoKG1hcmsubGluZSArIGkgKyAxKS50b1N0cmluZygpLCBsaW5lTm9MZW5ndGgpICtcbiAgICAgICcgfCAnICsgbGluZS5zdHIgKyAnXFxuJztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQucmVwbGFjZSgvXFxuJC8sICcnKTtcbn1cblxuXG52YXIgc25pcHBldCA9IG1ha2VTbmlwcGV0O1xuXG52YXIgVFlQRV9DT05TVFJVQ1RPUl9PUFRJT05TID0gW1xuICAna2luZCcsXG4gICdtdWx0aScsXG4gICdyZXNvbHZlJyxcbiAgJ2NvbnN0cnVjdCcsXG4gICdpbnN0YW5jZU9mJyxcbiAgJ3ByZWRpY2F0ZScsXG4gICdyZXByZXNlbnQnLFxuICAncmVwcmVzZW50TmFtZScsXG4gICdkZWZhdWx0U3R5bGUnLFxuICAnc3R5bGVBbGlhc2VzJ1xuXTtcblxudmFyIFlBTUxfTk9ERV9LSU5EUyA9IFtcbiAgJ3NjYWxhcicsXG4gICdzZXF1ZW5jZScsXG4gICdtYXBwaW5nJ1xuXTtcblxuZnVuY3Rpb24gY29tcGlsZVN0eWxlQWxpYXNlcyhtYXApIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGlmIChtYXAgIT09IG51bGwpIHtcbiAgICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICBtYXBbc3R5bGVdLmZvckVhY2goZnVuY3Rpb24gKGFsaWFzKSB7XG4gICAgICAgIHJlc3VsdFtTdHJpbmcoYWxpYXMpXSA9IHN0eWxlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBUeXBlJDEodGFnLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoVFlQRV9DT05TVFJVQ1RPUl9PUFRJT05TLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uKCdVbmtub3duIG9wdGlvbiBcIicgKyBuYW1lICsgJ1wiIGlzIG1ldCBpbiBkZWZpbml0aW9uIG9mIFwiJyArIHRhZyArICdcIiBZQU1MIHR5cGUuJyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBUT0RPOiBBZGQgdGFnIGZvcm1hdCBjaGVjay5cbiAgdGhpcy5vcHRpb25zICAgICAgID0gb3B0aW9uczsgLy8ga2VlcCBvcmlnaW5hbCBvcHRpb25zIGluIGNhc2UgdXNlciB3YW50cyB0byBleHRlbmQgdGhpcyB0eXBlIGxhdGVyXG4gIHRoaXMudGFnICAgICAgICAgICA9IHRhZztcbiAgdGhpcy5raW5kICAgICAgICAgID0gb3B0aW9uc1sna2luZCddICAgICAgICAgIHx8IG51bGw7XG4gIHRoaXMucmVzb2x2ZSAgICAgICA9IG9wdGlvbnNbJ3Jlc29sdmUnXSAgICAgICB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9O1xuICB0aGlzLmNvbnN0cnVjdCAgICAgPSBvcHRpb25zWydjb25zdHJ1Y3QnXSAgICAgfHwgZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIGRhdGE7IH07XG4gIHRoaXMuaW5zdGFuY2VPZiAgICA9IG9wdGlvbnNbJ2luc3RhbmNlT2YnXSAgICB8fCBudWxsO1xuICB0aGlzLnByZWRpY2F0ZSAgICAgPSBvcHRpb25zWydwcmVkaWNhdGUnXSAgICAgfHwgbnVsbDtcbiAgdGhpcy5yZXByZXNlbnQgICAgID0gb3B0aW9uc1sncmVwcmVzZW50J10gICAgIHx8IG51bGw7XG4gIHRoaXMucmVwcmVzZW50TmFtZSA9IG9wdGlvbnNbJ3JlcHJlc2VudE5hbWUnXSB8fCBudWxsO1xuICB0aGlzLmRlZmF1bHRTdHlsZSAgPSBvcHRpb25zWydkZWZhdWx0U3R5bGUnXSAgfHwgbnVsbDtcbiAgdGhpcy5tdWx0aSAgICAgICAgID0gb3B0aW9uc1snbXVsdGknXSAgICAgICAgIHx8IGZhbHNlO1xuICB0aGlzLnN0eWxlQWxpYXNlcyAgPSBjb21waWxlU3R5bGVBbGlhc2VzKG9wdGlvbnNbJ3N0eWxlQWxpYXNlcyddIHx8IG51bGwpO1xuXG4gIGlmIChZQU1MX05PREVfS0lORFMuaW5kZXhPZih0aGlzLmtpbmQpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBleGNlcHRpb24oJ1Vua25vd24ga2luZCBcIicgKyB0aGlzLmtpbmQgKyAnXCIgaXMgc3BlY2lmaWVkIGZvciBcIicgKyB0YWcgKyAnXCIgWUFNTCB0eXBlLicpO1xuICB9XG59XG5cbnZhciB0eXBlID0gVHlwZSQxO1xuXG4vKmVzbGludC1kaXNhYmxlIG1heC1sZW4qL1xuXG5cblxuXG5cbmZ1bmN0aW9uIGNvbXBpbGVMaXN0KHNjaGVtYSwgbmFtZSkge1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgc2NoZW1hW25hbWVdLmZvckVhY2goZnVuY3Rpb24gKGN1cnJlbnRUeXBlKSB7XG4gICAgdmFyIG5ld0luZGV4ID0gcmVzdWx0Lmxlbmd0aDtcblxuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uIChwcmV2aW91c1R5cGUsIHByZXZpb3VzSW5kZXgpIHtcbiAgICAgIGlmIChwcmV2aW91c1R5cGUudGFnID09PSBjdXJyZW50VHlwZS50YWcgJiZcbiAgICAgICAgICBwcmV2aW91c1R5cGUua2luZCA9PT0gY3VycmVudFR5cGUua2luZCAmJlxuICAgICAgICAgIHByZXZpb3VzVHlwZS5tdWx0aSA9PT0gY3VycmVudFR5cGUubXVsdGkpIHtcblxuICAgICAgICBuZXdJbmRleCA9IHByZXZpb3VzSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXN1bHRbbmV3SW5kZXhdID0gY3VycmVudFR5cGU7XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gY29tcGlsZU1hcCgvKiBsaXN0cy4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBzY2FsYXI6IHt9LFxuICAgICAgICBzZXF1ZW5jZToge30sXG4gICAgICAgIG1hcHBpbmc6IHt9LFxuICAgICAgICBmYWxsYmFjazoge30sXG4gICAgICAgIG11bHRpOiB7XG4gICAgICAgICAgc2NhbGFyOiBbXSxcbiAgICAgICAgICBzZXF1ZW5jZTogW10sXG4gICAgICAgICAgbWFwcGluZzogW10sXG4gICAgICAgICAgZmFsbGJhY2s6IFtdXG4gICAgICAgIH1cbiAgICAgIH0sIGluZGV4LCBsZW5ndGg7XG5cbiAgZnVuY3Rpb24gY29sbGVjdFR5cGUodHlwZSkge1xuICAgIGlmICh0eXBlLm11bHRpKSB7XG4gICAgICByZXN1bHQubXVsdGlbdHlwZS5raW5kXS5wdXNoKHR5cGUpO1xuICAgICAgcmVzdWx0Lm11bHRpWydmYWxsYmFjayddLnB1c2godHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFt0eXBlLmtpbmRdW3R5cGUudGFnXSA9IHJlc3VsdFsnZmFsbGJhY2snXVt0eXBlLnRhZ10gPSB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGFyZ3VtZW50c1tpbmRleF0uZm9yRWFjaChjb2xsZWN0VHlwZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBTY2hlbWEkMShkZWZpbml0aW9uKSB7XG4gIHJldHVybiB0aGlzLmV4dGVuZChkZWZpbml0aW9uKTtcbn1cblxuXG5TY2hlbWEkMS5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKGRlZmluaXRpb24pIHtcbiAgdmFyIGltcGxpY2l0ID0gW107XG4gIHZhciBleHBsaWNpdCA9IFtdO1xuXG4gIGlmIChkZWZpbml0aW9uIGluc3RhbmNlb2YgdHlwZSkge1xuICAgIC8vIFNjaGVtYS5leHRlbmQodHlwZSlcbiAgICBleHBsaWNpdC5wdXNoKGRlZmluaXRpb24pO1xuXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuICAgIC8vIFNjaGVtYS5leHRlbmQoWyB0eXBlMSwgdHlwZTIsIC4uLiBdKVxuICAgIGV4cGxpY2l0ID0gZXhwbGljaXQuY29uY2F0KGRlZmluaXRpb24pO1xuXG4gIH0gZWxzZSBpZiAoZGVmaW5pdGlvbiAmJiAoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uLmltcGxpY2l0KSB8fCBBcnJheS5pc0FycmF5KGRlZmluaXRpb24uZXhwbGljaXQpKSkge1xuICAgIC8vIFNjaGVtYS5leHRlbmQoeyBleHBsaWNpdDogWyB0eXBlMSwgdHlwZTIsIC4uLiBdLCBpbXBsaWNpdDogWyB0eXBlMSwgdHlwZTIsIC4uLiBdIH0pXG4gICAgaWYgKGRlZmluaXRpb24uaW1wbGljaXQpIGltcGxpY2l0ID0gaW1wbGljaXQuY29uY2F0KGRlZmluaXRpb24uaW1wbGljaXQpO1xuICAgIGlmIChkZWZpbml0aW9uLmV4cGxpY2l0KSBleHBsaWNpdCA9IGV4cGxpY2l0LmNvbmNhdChkZWZpbml0aW9uLmV4cGxpY2l0KTtcblxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBleGNlcHRpb24oJ1NjaGVtYS5leHRlbmQgYXJndW1lbnQgc2hvdWxkIGJlIGEgVHlwZSwgWyBUeXBlIF0sICcgK1xuICAgICAgJ29yIGEgc2NoZW1hIGRlZmluaXRpb24gKHsgaW1wbGljaXQ6IFsuLi5dLCBleHBsaWNpdDogWy4uLl0gfSknKTtcbiAgfVxuXG4gIGltcGxpY2l0LmZvckVhY2goZnVuY3Rpb24gKHR5cGUkMSkge1xuICAgIGlmICghKHR5cGUkMSBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uKCdTcGVjaWZpZWQgbGlzdCBvZiBZQU1MIHR5cGVzIChvciBhIHNpbmdsZSBUeXBlIG9iamVjdCkgY29udGFpbnMgYSBub24tVHlwZSBvYmplY3QuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUkMS5sb2FkS2luZCAmJiB0eXBlJDEubG9hZEtpbmQgIT09ICdzY2FsYXInKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uKCdUaGVyZSBpcyBhIG5vbi1zY2FsYXIgdHlwZSBpbiB0aGUgaW1wbGljaXQgbGlzdCBvZiBhIHNjaGVtYS4gSW1wbGljaXQgcmVzb2x2aW5nIG9mIHN1Y2ggdHlwZXMgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSQxLm11bHRpKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uKCdUaGVyZSBpcyBhIG11bHRpIHR5cGUgaW4gdGhlIGltcGxpY2l0IGxpc3Qgb2YgYSBzY2hlbWEuIE11bHRpIHRhZ3MgY2FuIG9ubHkgYmUgbGlzdGVkIGFzIGV4cGxpY2l0LicpO1xuICAgIH1cbiAgfSk7XG5cbiAgZXhwbGljaXQuZm9yRWFjaChmdW5jdGlvbiAodHlwZSQxKSB7XG4gICAgaWYgKCEodHlwZSQxIGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb24oJ1NwZWNpZmllZCBsaXN0IG9mIFlBTUwgdHlwZXMgKG9yIGEgc2luZ2xlIFR5cGUgb2JqZWN0KSBjb250YWlucyBhIG5vbi1UeXBlIG9iamVjdC4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciByZXN1bHQgPSBPYmplY3QuY3JlYXRlKFNjaGVtYSQxLnByb3RvdHlwZSk7XG5cbiAgcmVzdWx0LmltcGxpY2l0ID0gKHRoaXMuaW1wbGljaXQgfHwgW10pLmNvbmNhdChpbXBsaWNpdCk7XG4gIHJlc3VsdC5leHBsaWNpdCA9ICh0aGlzLmV4cGxpY2l0IHx8IFtdKS5jb25jYXQoZXhwbGljaXQpO1xuXG4gIHJlc3VsdC5jb21waWxlZEltcGxpY2l0ID0gY29tcGlsZUxpc3QocmVzdWx0LCAnaW1wbGljaXQnKTtcbiAgcmVzdWx0LmNvbXBpbGVkRXhwbGljaXQgPSBjb21waWxlTGlzdChyZXN1bHQsICdleHBsaWNpdCcpO1xuICByZXN1bHQuY29tcGlsZWRUeXBlTWFwICA9IGNvbXBpbGVNYXAocmVzdWx0LmNvbXBpbGVkSW1wbGljaXQsIHJlc3VsdC5jb21waWxlZEV4cGxpY2l0KTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG52YXIgc2NoZW1hID0gU2NoZW1hJDE7XG5cbnZhciBzdHIgPSBuZXcgdHlwZSgndGFnOnlhbWwub3JnLDIwMDI6c3RyJywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgY29uc3RydWN0OiBmdW5jdGlvbiAoZGF0YSkgeyByZXR1cm4gZGF0YSAhPT0gbnVsbCA/IGRhdGEgOiAnJzsgfVxufSk7XG5cbnZhciBzZXEgPSBuZXcgdHlwZSgndGFnOnlhbWwub3JnLDIwMDI6c2VxJywge1xuICBraW5kOiAnc2VxdWVuY2UnLFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIChkYXRhKSB7IHJldHVybiBkYXRhICE9PSBudWxsID8gZGF0YSA6IFtdOyB9XG59KTtcblxudmFyIG1hcCA9IG5ldyB0eXBlKCd0YWc6eWFtbC5vcmcsMjAwMjptYXAnLCB7XG4gIGtpbmQ6ICdtYXBwaW5nJyxcbiAgY29uc3RydWN0OiBmdW5jdGlvbiAoZGF0YSkgeyByZXR1cm4gZGF0YSAhPT0gbnVsbCA/IGRhdGEgOiB7fTsgfVxufSk7XG5cbnZhciBmYWlsc2FmZSA9IG5ldyBzY2hlbWEoe1xuICBleHBsaWNpdDogW1xuICAgIHN0cixcbiAgICBzZXEsXG4gICAgbWFwXG4gIF1cbn0pO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbE51bGwoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIHRydWU7XG5cbiAgdmFyIG1heCA9IGRhdGEubGVuZ3RoO1xuXG4gIHJldHVybiAobWF4ID09PSAxICYmIGRhdGEgPT09ICd+JykgfHxcbiAgICAgICAgIChtYXggPT09IDQgJiYgKGRhdGEgPT09ICdudWxsJyB8fCBkYXRhID09PSAnTnVsbCcgfHwgZGF0YSA9PT0gJ05VTEwnKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxOdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNOdWxsKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ID09PSBudWxsO1xufVxuXG52YXIgX251bGwgPSBuZXcgdHlwZSgndGFnOnlhbWwub3JnLDIwMDI6bnVsbCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sTnVsbCxcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sTnVsbCxcbiAgcHJlZGljYXRlOiBpc051bGwsXG4gIHJlcHJlc2VudDoge1xuICAgIGNhbm9uaWNhbDogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ34nOyAgICB9LFxuICAgIGxvd2VyY2FzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ251bGwnOyB9LFxuICAgIHVwcGVyY2FzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ05VTEwnOyB9LFxuICAgIGNhbWVsY2FzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ051bGwnOyB9LFxuICAgIGVtcHR5OiAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gJyc7ICAgICB9XG4gIH0sXG4gIGRlZmF1bHRTdHlsZTogJ2xvd2VyY2FzZSdcbn0pO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbEJvb2xlYW4oZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBtYXggPSBkYXRhLmxlbmd0aDtcblxuICByZXR1cm4gKG1heCA9PT0gNCAmJiAoZGF0YSA9PT0gJ3RydWUnIHx8IGRhdGEgPT09ICdUcnVlJyB8fCBkYXRhID09PSAnVFJVRScpKSB8fFxuICAgICAgICAgKG1heCA9PT0gNSAmJiAoZGF0YSA9PT0gJ2ZhbHNlJyB8fCBkYXRhID09PSAnRmFsc2UnIHx8IGRhdGEgPT09ICdGQUxTRScpKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbEJvb2xlYW4oZGF0YSkge1xuICByZXR1cm4gZGF0YSA9PT0gJ3RydWUnIHx8XG4gICAgICAgICBkYXRhID09PSAnVHJ1ZScgfHxcbiAgICAgICAgIGRhdGEgPT09ICdUUlVFJztcbn1cblxuZnVuY3Rpb24gaXNCb29sZWFuKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn1cblxudmFyIGJvb2wgPSBuZXcgdHlwZSgndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sQm9vbGVhbixcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sQm9vbGVhbixcbiAgcHJlZGljYXRlOiBpc0Jvb2xlYW4sXG4gIHJlcHJlc2VudDoge1xuICAgIGxvd2VyY2FzZTogZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gb2JqZWN0ID8gJ3RydWUnIDogJ2ZhbHNlJzsgfSxcbiAgICB1cHBlcmNhc2U6IGZ1bmN0aW9uIChvYmplY3QpIHsgcmV0dXJuIG9iamVjdCA/ICdUUlVFJyA6ICdGQUxTRSc7IH0sXG4gICAgY2FtZWxjYXNlOiBmdW5jdGlvbiAob2JqZWN0KSB7IHJldHVybiBvYmplY3QgPyAnVHJ1ZScgOiAnRmFsc2UnOyB9XG4gIH0sXG4gIGRlZmF1bHRTdHlsZTogJ2xvd2VyY2FzZSdcbn0pO1xuXG5mdW5jdGlvbiBpc0hleENvZGUoYykge1xuICByZXR1cm4gKCgweDMwLyogMCAqLyA8PSBjKSAmJiAoYyA8PSAweDM5LyogOSAqLykpIHx8XG4gICAgICAgICAoKDB4NDEvKiBBICovIDw9IGMpICYmIChjIDw9IDB4NDYvKiBGICovKSkgfHxcbiAgICAgICAgICgoMHg2MS8qIGEgKi8gPD0gYykgJiYgKGMgPD0gMHg2Ni8qIGYgKi8pKTtcbn1cblxuZnVuY3Rpb24gaXNPY3RDb2RlKGMpIHtcbiAgcmV0dXJuICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzNy8qIDcgKi8pKTtcbn1cblxuZnVuY3Rpb24gaXNEZWNDb2RlKGMpIHtcbiAgcmV0dXJuICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxJbnRlZ2VyKGRhdGEpIHtcbiAgaWYgKGRhdGEgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICB2YXIgbWF4ID0gZGF0YS5sZW5ndGgsXG4gICAgICBpbmRleCA9IDAsXG4gICAgICBoYXNEaWdpdHMgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIGlmICghbWF4KSByZXR1cm4gZmFsc2U7XG5cbiAgY2ggPSBkYXRhW2luZGV4XTtcblxuICAvLyBzaWduXG4gIGlmIChjaCA9PT0gJy0nIHx8IGNoID09PSAnKycpIHtcbiAgICBjaCA9IGRhdGFbKytpbmRleF07XG4gIH1cblxuICBpZiAoY2ggPT09ICcwJykge1xuICAgIC8vIDBcbiAgICBpZiAoaW5kZXggKyAxID09PSBtYXgpIHJldHVybiB0cnVlO1xuICAgIGNoID0gZGF0YVsrK2luZGV4XTtcblxuICAgIC8vIGJhc2UgMiwgYmFzZSA4LCBiYXNlIDE2XG5cbiAgICBpZiAoY2ggPT09ICdiJykge1xuICAgICAgLy8gYmFzZSAyXG4gICAgICBpbmRleCsrO1xuXG4gICAgICBmb3IgKDsgaW5kZXggPCBtYXg7IGluZGV4KyspIHtcbiAgICAgICAgY2ggPSBkYXRhW2luZGV4XTtcbiAgICAgICAgaWYgKGNoID09PSAnXycpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoY2ggIT09ICcwJyAmJiBjaCAhPT0gJzEnKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGhhc0RpZ2l0cyA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzRGlnaXRzICYmIGNoICE9PSAnXyc7XG4gICAgfVxuXG5cbiAgICBpZiAoY2ggPT09ICd4Jykge1xuICAgICAgLy8gYmFzZSAxNlxuICAgICAgaW5kZXgrKztcblxuICAgICAgZm9yICg7IGluZGV4IDwgbWF4OyBpbmRleCsrKSB7XG4gICAgICAgIGNoID0gZGF0YVtpbmRleF07XG4gICAgICAgIGlmIChjaCA9PT0gJ18nKSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFpc0hleENvZGUoZGF0YS5jaGFyQ29kZUF0KGluZGV4KSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaGFzRGlnaXRzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNEaWdpdHMgJiYgY2ggIT09ICdfJztcbiAgICB9XG5cblxuICAgIGlmIChjaCA9PT0gJ28nKSB7XG4gICAgICAvLyBiYXNlIDhcbiAgICAgIGluZGV4Kys7XG5cbiAgICAgIGZvciAoOyBpbmRleCA8IG1heDsgaW5kZXgrKykge1xuICAgICAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgICAgICBpZiAoY2ggPT09ICdfJykgY29udGludWU7XG4gICAgICAgIGlmICghaXNPY3RDb2RlKGRhdGEuY2hhckNvZGVBdChpbmRleCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGhhc0RpZ2l0cyA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzRGlnaXRzICYmIGNoICE9PSAnXyc7XG4gICAgfVxuICB9XG5cbiAgLy8gYmFzZSAxMCAoZXhjZXB0IDApXG5cbiAgLy8gdmFsdWUgc2hvdWxkIG5vdCBzdGFydCB3aXRoIGBfYDtcbiAgaWYgKGNoID09PSAnXycpIHJldHVybiBmYWxzZTtcblxuICBmb3IgKDsgaW5kZXggPCBtYXg7IGluZGV4KyspIHtcbiAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgIGlmIChjaCA9PT0gJ18nKSBjb250aW51ZTtcbiAgICBpZiAoIWlzRGVjQ29kZShkYXRhLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNEaWdpdHMgPSB0cnVlO1xuICB9XG5cbiAgLy8gU2hvdWxkIGhhdmUgZGlnaXRzIGFuZCBzaG91bGQgbm90IGVuZCB3aXRoIGBfYFxuICBpZiAoIWhhc0RpZ2l0cyB8fCBjaCA9PT0gJ18nKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxJbnRlZ2VyKGRhdGEpIHtcbiAgdmFyIHZhbHVlID0gZGF0YSwgc2lnbiA9IDEsIGNoO1xuXG4gIGlmICh2YWx1ZS5pbmRleE9mKCdfJykgIT09IC0xKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9fL2csICcnKTtcbiAgfVxuXG4gIGNoID0gdmFsdWVbMF07XG5cbiAgaWYgKGNoID09PSAnLScgfHwgY2ggPT09ICcrJykge1xuICAgIGlmIChjaCA9PT0gJy0nKSBzaWduID0gLTE7XG4gICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgICBjaCA9IHZhbHVlWzBdO1xuICB9XG5cbiAgaWYgKHZhbHVlID09PSAnMCcpIHJldHVybiAwO1xuXG4gIGlmIChjaCA9PT0gJzAnKSB7XG4gICAgaWYgKHZhbHVlWzFdID09PSAnYicpIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIDIpO1xuICAgIGlmICh2YWx1ZVsxXSA9PT0gJ3gnKSByZXR1cm4gc2lnbiAqIHBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCAxNik7XG4gICAgaWYgKHZhbHVlWzFdID09PSAnbycpIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIDgpO1xuICB9XG5cbiAgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWx1ZSwgMTApO1xufVxuXG5mdW5jdGlvbiBpc0ludGVnZXIob2JqZWN0KSB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkpID09PSAnW29iamVjdCBOdW1iZXJdJyAmJlxuICAgICAgICAgKG9iamVjdCAlIDEgPT09IDAgJiYgIWNvbW1vbi5pc05lZ2F0aXZlWmVybyhvYmplY3QpKTtcbn1cblxudmFyIGludCA9IG5ldyB0eXBlKCd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbEludGVnZXIsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbEludGVnZXIsXG4gIHByZWRpY2F0ZTogaXNJbnRlZ2VyLFxuICByZXByZXNlbnQ6IHtcbiAgICBiaW5hcnk6ICAgICAgZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqID49IDAgPyAnMGInICsgb2JqLnRvU3RyaW5nKDIpIDogJy0wYicgKyBvYmoudG9TdHJpbmcoMikuc2xpY2UoMSk7IH0sXG4gICAgb2N0YWw6ICAgICAgIGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiA+PSAwID8gJzBvJyAgKyBvYmoudG9TdHJpbmcoOCkgOiAnLTBvJyAgKyBvYmoudG9TdHJpbmcoOCkuc2xpY2UoMSk7IH0sXG4gICAgZGVjaW1hbDogICAgIGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iai50b1N0cmluZygxMCk7IH0sXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIGhleGFkZWNpbWFsOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogPj0gMCA/ICcweCcgKyBvYmoudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkgOiAgJy0weCcgKyBvYmoudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkuc2xpY2UoMSk7IH1cbiAgfSxcbiAgZGVmYXVsdFN0eWxlOiAnZGVjaW1hbCcsXG4gIHN0eWxlQWxpYXNlczoge1xuICAgIGJpbmFyeTogICAgICBbIDIsICAnYmluJyBdLFxuICAgIG9jdGFsOiAgICAgICBbIDgsICAnb2N0JyBdLFxuICAgIGRlY2ltYWw6ICAgICBbIDEwLCAnZGVjJyBdLFxuICAgIGhleGFkZWNpbWFsOiBbIDE2LCAnaGV4JyBdXG4gIH1cbn0pO1xuXG52YXIgWUFNTF9GTE9BVF9QQVRURVJOID0gbmV3IFJlZ0V4cChcbiAgLy8gMi41ZTQsIDIuNSBhbmQgaW50ZWdlcnNcbiAgJ14oPzpbLStdPyg/OlswLTldWzAtOV9dKikoPzpcXFxcLlswLTlfXSopPyg/OltlRV1bLStdP1swLTldKyk/JyArXG4gIC8vIC4yZTQsIC4yXG4gIC8vIHNwZWNpYWwgY2FzZSwgc2VlbXMgbm90IGZyb20gc3BlY1xuICAnfFxcXFwuWzAtOV9dKyg/OltlRV1bLStdP1swLTldKyk/JyArXG4gIC8vIC5pbmZcbiAgJ3xbLStdP1xcXFwuKD86aW5mfEluZnxJTkYpJyArXG4gIC8vIC5uYW5cbiAgJ3xcXFxcLig/Om5hbnxOYU58TkFOKSkkJyk7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sRmxvYXQoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICghWUFNTF9GTE9BVF9QQVRURVJOLnRlc3QoZGF0YSkgfHxcbiAgICAgIC8vIFF1aWNrIGhhY2sgdG8gbm90IGFsbG93IGludGVnZXJzIGVuZCB3aXRoIGBfYFxuICAgICAgLy8gUHJvYmFibHkgc2hvdWxkIHVwZGF0ZSByZWdleHAgJiBjaGVjayBzcGVlZFxuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdID09PSAnXycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbEZsb2F0KGRhdGEpIHtcbiAgdmFyIHZhbHVlLCBzaWduO1xuXG4gIHZhbHVlICA9IGRhdGEucmVwbGFjZSgvXy9nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgc2lnbiAgID0gdmFsdWVbMF0gPT09ICctJyA/IC0xIDogMTtcblxuICBpZiAoJystJy5pbmRleE9mKHZhbHVlWzBdKSA+PSAwKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gJy5pbmYnKSB7XG4gICAgcmV0dXJuIChzaWduID09PSAxKSA/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSA6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcblxuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnLm5hbicpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIHJldHVybiBzaWduICogcGFyc2VGbG9hdCh2YWx1ZSwgMTApO1xufVxuXG5cbnZhciBTQ0lFTlRJRklDX1dJVEhPVVRfRE9UID0gL15bLStdP1swLTldK2UvO1xuXG5mdW5jdGlvbiByZXByZXNlbnRZYW1sRmxvYXQob2JqZWN0LCBzdHlsZSkge1xuICB2YXIgcmVzO1xuXG4gIGlmIChpc05hTihvYmplY3QpKSB7XG4gICAgc3dpdGNoIChzdHlsZSkge1xuICAgICAgY2FzZSAnbG93ZXJjYXNlJzogcmV0dXJuICcubmFuJztcbiAgICAgIGNhc2UgJ3VwcGVyY2FzZSc6IHJldHVybiAnLk5BTic7XG4gICAgICBjYXNlICdjYW1lbGNhc2UnOiByZXR1cm4gJy5OYU4nO1xuICAgIH1cbiAgfSBlbHNlIGlmIChOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgPT09IG9iamVjdCkge1xuICAgIHN3aXRjaCAoc3R5bGUpIHtcbiAgICAgIGNhc2UgJ2xvd2VyY2FzZSc6IHJldHVybiAnLmluZic7XG4gICAgICBjYXNlICd1cHBlcmNhc2UnOiByZXR1cm4gJy5JTkYnO1xuICAgICAgY2FzZSAnY2FtZWxjYXNlJzogcmV0dXJuICcuSW5mJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZID09PSBvYmplY3QpIHtcbiAgICBzd2l0Y2ggKHN0eWxlKSB7XG4gICAgICBjYXNlICdsb3dlcmNhc2UnOiByZXR1cm4gJy0uaW5mJztcbiAgICAgIGNhc2UgJ3VwcGVyY2FzZSc6IHJldHVybiAnLS5JTkYnO1xuICAgICAgY2FzZSAnY2FtZWxjYXNlJzogcmV0dXJuICctLkluZic7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNvbW1vbi5pc05lZ2F0aXZlWmVybyhvYmplY3QpKSB7XG4gICAgcmV0dXJuICctMC4wJztcbiAgfVxuXG4gIHJlcyA9IG9iamVjdC50b1N0cmluZygxMCk7XG5cbiAgLy8gSlMgc3RyaW5naWZpZXIgY2FuIGJ1aWxkIHNjaWVudGlmaWMgZm9ybWF0IHdpdGhvdXQgZG90czogNWUtMTAwLFxuICAvLyB3aGlsZSBZQU1MIHJlcXVyZXMgZG90OiA1LmUtMTAwLiBGaXggaXQgd2l0aCBzaW1wbGUgaGFja1xuXG4gIHJldHVybiBTQ0lFTlRJRklDX1dJVEhPVVRfRE9ULnRlc3QocmVzKSA/IHJlcy5yZXBsYWNlKCdlJywgJy5lJykgOiByZXM7XG59XG5cbmZ1bmN0aW9uIGlzRmxvYXQob2JqZWN0KSB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IE51bWJlcl0nKSAmJlxuICAgICAgICAgKG9iamVjdCAlIDEgIT09IDAgfHwgY29tbW9uLmlzTmVnYXRpdmVaZXJvKG9iamVjdCkpO1xufVxuXG52YXIgZmxvYXQgPSBuZXcgdHlwZSgndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbEZsb2F0LFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxGbG9hdCxcbiAgcHJlZGljYXRlOiBpc0Zsb2F0LFxuICByZXByZXNlbnQ6IHJlcHJlc2VudFlhbWxGbG9hdCxcbiAgZGVmYXVsdFN0eWxlOiAnbG93ZXJjYXNlJ1xufSk7XG5cbnZhciBqc29uID0gZmFpbHNhZmUuZXh0ZW5kKHtcbiAgaW1wbGljaXQ6IFtcbiAgICBfbnVsbCxcbiAgICBib29sLFxuICAgIGludCxcbiAgICBmbG9hdFxuICBdXG59KTtcblxudmFyIGNvcmUgPSBqc29uO1xuXG52YXIgWUFNTF9EQVRFX1JFR0VYUCA9IG5ldyBSZWdFeHAoXG4gICdeKFswLTldWzAtOV1bMC05XVswLTldKScgICAgICAgICAgKyAvLyBbMV0geWVhclxuICAnLShbMC05XVswLTldKScgICAgICAgICAgICAgICAgICAgICsgLy8gWzJdIG1vbnRoXG4gICctKFswLTldWzAtOV0pJCcpOyAgICAgICAgICAgICAgICAgICAvLyBbM10gZGF5XG5cbnZhciBZQU1MX1RJTUVTVEFNUF9SRUdFWFAgPSBuZXcgUmVnRXhwKFxuICAnXihbMC05XVswLTldWzAtOV1bMC05XSknICAgICAgICAgICsgLy8gWzFdIHllYXJcbiAgJy0oWzAtOV1bMC05XT8pJyAgICAgICAgICAgICAgICAgICArIC8vIFsyXSBtb250aFxuICAnLShbMC05XVswLTldPyknICAgICAgICAgICAgICAgICAgICsgLy8gWzNdIGRheVxuICAnKD86W1R0XXxbIFxcXFx0XSspJyAgICAgICAgICAgICAgICAgKyAvLyAuLi5cbiAgJyhbMC05XVswLTldPyknICAgICAgICAgICAgICAgICAgICArIC8vIFs0XSBob3VyXG4gICc6KFswLTldWzAtOV0pJyAgICAgICAgICAgICAgICAgICAgKyAvLyBbNV0gbWludXRlXG4gICc6KFswLTldWzAtOV0pJyAgICAgICAgICAgICAgICAgICAgKyAvLyBbNl0gc2Vjb25kXG4gICcoPzpcXFxcLihbMC05XSopKT8nICAgICAgICAgICAgICAgICArIC8vIFs3XSBmcmFjdGlvblxuICAnKD86WyBcXFxcdF0qKFp8KFstK10pKFswLTldWzAtOV0/KScgKyAvLyBbOF0gdHogWzldIHR6X3NpZ24gWzEwXSB0el9ob3VyXG4gICcoPzo6KFswLTldWzAtOV0pKT8pKT8kJyk7ICAgICAgICAgICAvLyBbMTFdIHR6X21pbnV0ZVxuXG5mdW5jdGlvbiByZXNvbHZlWWFtbFRpbWVzdGFtcChkYXRhKSB7XG4gIGlmIChkYXRhID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gIGlmIChZQU1MX0RBVEVfUkVHRVhQLmV4ZWMoZGF0YSkgIT09IG51bGwpIHJldHVybiB0cnVlO1xuICBpZiAoWUFNTF9USU1FU1RBTVBfUkVHRVhQLmV4ZWMoZGF0YSkgIT09IG51bGwpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxUaW1lc3RhbXAoZGF0YSkge1xuICB2YXIgbWF0Y2gsIHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBmcmFjdGlvbiA9IDAsXG4gICAgICBkZWx0YSA9IG51bGwsIHR6X2hvdXIsIHR6X21pbnV0ZSwgZGF0ZTtcblxuICBtYXRjaCA9IFlBTUxfREFURV9SRUdFWFAuZXhlYyhkYXRhKTtcbiAgaWYgKG1hdGNoID09PSBudWxsKSBtYXRjaCA9IFlBTUxfVElNRVNUQU1QX1JFR0VYUC5leGVjKGRhdGEpO1xuXG4gIGlmIChtYXRjaCA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdEYXRlIHJlc29sdmUgZXJyb3InKTtcblxuICAvLyBtYXRjaDogWzFdIHllYXIgWzJdIG1vbnRoIFszXSBkYXlcblxuICB5ZWFyID0gKyhtYXRjaFsxXSk7XG4gIG1vbnRoID0gKyhtYXRjaFsyXSkgLSAxOyAvLyBKUyBtb250aCBzdGFydHMgd2l0aCAwXG4gIGRheSA9ICsobWF0Y2hbM10pO1xuXG4gIGlmICghbWF0Y2hbNF0pIHsgLy8gbm8gaG91clxuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5KSk7XG4gIH1cblxuICAvLyBtYXRjaDogWzRdIGhvdXIgWzVdIG1pbnV0ZSBbNl0gc2Vjb25kIFs3XSBmcmFjdGlvblxuXG4gIGhvdXIgPSArKG1hdGNoWzRdKTtcbiAgbWludXRlID0gKyhtYXRjaFs1XSk7XG4gIHNlY29uZCA9ICsobWF0Y2hbNl0pO1xuXG4gIGlmIChtYXRjaFs3XSkge1xuICAgIGZyYWN0aW9uID0gbWF0Y2hbN10uc2xpY2UoMCwgMyk7XG4gICAgd2hpbGUgKGZyYWN0aW9uLmxlbmd0aCA8IDMpIHsgLy8gbWlsbGktc2Vjb25kc1xuICAgICAgZnJhY3Rpb24gKz0gJzAnO1xuICAgIH1cbiAgICBmcmFjdGlvbiA9ICtmcmFjdGlvbjtcbiAgfVxuXG4gIC8vIG1hdGNoOiBbOF0gdHogWzldIHR6X3NpZ24gWzEwXSB0el9ob3VyIFsxMV0gdHpfbWludXRlXG5cbiAgaWYgKG1hdGNoWzldKSB7XG4gICAgdHpfaG91ciA9ICsobWF0Y2hbMTBdKTtcbiAgICB0el9taW51dGUgPSArKG1hdGNoWzExXSB8fCAwKTtcbiAgICBkZWx0YSA9ICh0el9ob3VyICogNjAgKyB0el9taW51dGUpICogNjAwMDA7IC8vIGRlbHRhIGluIG1pbGktc2Vjb25kc1xuICAgIGlmIChtYXRjaFs5XSA9PT0gJy0nKSBkZWx0YSA9IC1kZWx0YTtcbiAgfVxuXG4gIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgZnJhY3Rpb24pKTtcblxuICBpZiAoZGVsdGEpIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSAtIGRlbHRhKTtcblxuICByZXR1cm4gZGF0ZTtcbn1cblxuZnVuY3Rpb24gcmVwcmVzZW50WWFtbFRpbWVzdGFtcChvYmplY3QgLyosIHN0eWxlKi8pIHtcbiAgcmV0dXJuIG9iamVjdC50b0lTT1N0cmluZygpO1xufVxuXG52YXIgdGltZXN0YW1wID0gbmV3IHR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOnRpbWVzdGFtcCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sVGltZXN0YW1wLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxUaW1lc3RhbXAsXG4gIGluc3RhbmNlT2Y6IERhdGUsXG4gIHJlcHJlc2VudDogcmVwcmVzZW50WWFtbFRpbWVzdGFtcFxufSk7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sTWVyZ2UoZGF0YSkge1xuICByZXR1cm4gZGF0YSA9PT0gJzw8JyB8fCBkYXRhID09PSBudWxsO1xufVxuXG52YXIgbWVyZ2UgPSBuZXcgdHlwZSgndGFnOnlhbWwub3JnLDIwMDI6bWVyZ2UnLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbE1lcmdlXG59KTtcblxuLyplc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlKi9cblxuXG5cblxuXG4vLyBbIDY0LCA2NSwgNjYgXSAtPiBbIHBhZGRpbmcsIENSLCBMRiBdXG52YXIgQkFTRTY0X01BUCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVxcblxccic7XG5cblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxCaW5hcnkoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBjb2RlLCBpZHgsIGJpdGxlbiA9IDAsIG1heCA9IGRhdGEubGVuZ3RoLCBtYXAgPSBCQVNFNjRfTUFQO1xuXG4gIC8vIENvbnZlcnQgb25lIGJ5IG9uZS5cbiAgZm9yIChpZHggPSAwOyBpZHggPCBtYXg7IGlkeCsrKSB7XG4gICAgY29kZSA9IG1hcC5pbmRleE9mKGRhdGEuY2hhckF0KGlkeCkpO1xuXG4gICAgLy8gU2tpcCBDUi9MRlxuICAgIGlmIChjb2RlID4gNjQpIGNvbnRpbnVlO1xuXG4gICAgLy8gRmFpbCBvbiBpbGxlZ2FsIGNoYXJhY3RlcnNcbiAgICBpZiAoY29kZSA8IDApIHJldHVybiBmYWxzZTtcblxuICAgIGJpdGxlbiArPSA2O1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgYXJlIGFueSBiaXRzIGxlZnQsIHNvdXJjZSB3YXMgY29ycnVwdGVkXG4gIHJldHVybiAoYml0bGVuICUgOCkgPT09IDA7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxCaW5hcnkoZGF0YSkge1xuICB2YXIgaWR4LCB0YWlsYml0cyxcbiAgICAgIGlucHV0ID0gZGF0YS5yZXBsYWNlKC9bXFxyXFxuPV0vZywgJycpLCAvLyByZW1vdmUgQ1IvTEYgJiBwYWRkaW5nIHRvIHNpbXBsaWZ5IHNjYW5cbiAgICAgIG1heCA9IGlucHV0Lmxlbmd0aCxcbiAgICAgIG1hcCA9IEJBU0U2NF9NQVAsXG4gICAgICBiaXRzID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIC8vIENvbGxlY3QgYnkgNio0IGJpdHMgKDMgYnl0ZXMpXG5cbiAgZm9yIChpZHggPSAwOyBpZHggPCBtYXg7IGlkeCsrKSB7XG4gICAgaWYgKChpZHggJSA0ID09PSAwKSAmJiBpZHgpIHtcbiAgICAgIHJlc3VsdC5wdXNoKChiaXRzID4+IDE2KSAmIDB4RkYpO1xuICAgICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gOCkgJiAweEZGKTtcbiAgICAgIHJlc3VsdC5wdXNoKGJpdHMgJiAweEZGKTtcbiAgICB9XG5cbiAgICBiaXRzID0gKGJpdHMgPDwgNikgfCBtYXAuaW5kZXhPZihpbnB1dC5jaGFyQXQoaWR4KSk7XG4gIH1cblxuICAvLyBEdW1wIHRhaWxcblxuICB0YWlsYml0cyA9IChtYXggJSA0KSAqIDY7XG5cbiAgaWYgKHRhaWxiaXRzID09PSAwKSB7XG4gICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gMTYpICYgMHhGRik7XG4gICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gOCkgJiAweEZGKTtcbiAgICByZXN1bHQucHVzaChiaXRzICYgMHhGRik7XG4gIH0gZWxzZSBpZiAodGFpbGJpdHMgPT09IDE4KSB7XG4gICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gMTApICYgMHhGRik7XG4gICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gMikgJiAweEZGKTtcbiAgfSBlbHNlIGlmICh0YWlsYml0cyA9PT0gMTIpIHtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiA0KSAmIDB4RkYpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIHJlcHJlc2VudFlhbWxCaW5hcnkob2JqZWN0IC8qLCBzdHlsZSovKSB7XG4gIHZhciByZXN1bHQgPSAnJywgYml0cyA9IDAsIGlkeCwgdGFpbCxcbiAgICAgIG1heCA9IG9iamVjdC5sZW5ndGgsXG4gICAgICBtYXAgPSBCQVNFNjRfTUFQO1xuXG4gIC8vIENvbnZlcnQgZXZlcnkgdGhyZWUgYnl0ZXMgdG8gNCBBU0NJSSBjaGFyYWN0ZXJzLlxuXG4gIGZvciAoaWR4ID0gMDsgaWR4IDwgbWF4OyBpZHgrKykge1xuICAgIGlmICgoaWR4ICUgMyA9PT0gMCkgJiYgaWR4KSB7XG4gICAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDE4KSAmIDB4M0ZdO1xuICAgICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiAxMikgJiAweDNGXTtcbiAgICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gNikgJiAweDNGXTtcbiAgICAgIHJlc3VsdCArPSBtYXBbYml0cyAmIDB4M0ZdO1xuICAgIH1cblxuICAgIGJpdHMgPSAoYml0cyA8PCA4KSArIG9iamVjdFtpZHhdO1xuICB9XG5cbiAgLy8gRHVtcCB0YWlsXG5cbiAgdGFpbCA9IG1heCAlIDM7XG5cbiAgaWYgKHRhaWwgPT09IDApIHtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDE4KSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gMTIpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiA2KSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbYml0cyAmIDB4M0ZdO1xuICB9IGVsc2UgaWYgKHRhaWwgPT09IDIpIHtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDEwKSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gNCkgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzIDw8IDIpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFs2NF07XG4gIH0gZWxzZSBpZiAodGFpbCA9PT0gMSkge1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gMikgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzIDw8IDQpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFs2NF07XG4gICAgcmVzdWx0ICs9IG1hcFs2NF07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpc0JpbmFyeShvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAgJ1tvYmplY3QgVWludDhBcnJheV0nO1xufVxuXG52YXIgYmluYXJ5ID0gbmV3IHR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOmJpbmFyeScsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sQmluYXJ5LFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxCaW5hcnksXG4gIHByZWRpY2F0ZTogaXNCaW5hcnksXG4gIHJlcHJlc2VudDogcmVwcmVzZW50WWFtbEJpbmFyeVxufSk7XG5cbnZhciBfaGFzT3duUHJvcGVydHkkMyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX3RvU3RyaW5nJDIgICAgICAgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbE9tYXAoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIHRydWU7XG5cbiAgdmFyIG9iamVjdEtleXMgPSBbXSwgaW5kZXgsIGxlbmd0aCwgcGFpciwgcGFpcktleSwgcGFpckhhc0tleSxcbiAgICAgIG9iamVjdCA9IGRhdGE7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpciA9IG9iamVjdFtpbmRleF07XG4gICAgcGFpckhhc0tleSA9IGZhbHNlO1xuXG4gICAgaWYgKF90b1N0cmluZyQyLmNhbGwocGFpcikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHBhaXJLZXkgaW4gcGFpcikge1xuICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eSQzLmNhbGwocGFpciwgcGFpcktleSkpIHtcbiAgICAgICAgaWYgKCFwYWlySGFzS2V5KSBwYWlySGFzS2V5ID0gdHJ1ZTtcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwYWlySGFzS2V5KSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmRleE9mKHBhaXJLZXkpID09PSAtMSkgb2JqZWN0S2V5cy5wdXNoKHBhaXJLZXkpO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxPbWFwKGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEgIT09IG51bGwgPyBkYXRhIDogW107XG59XG5cbnZhciBvbWFwID0gbmV3IHR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOm9tYXAnLCB7XG4gIGtpbmQ6ICdzZXF1ZW5jZScsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sT21hcCxcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sT21hcFxufSk7XG5cbnZhciBfdG9TdHJpbmckMSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sUGFpcnMoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIHRydWU7XG5cbiAgdmFyIGluZGV4LCBsZW5ndGgsIHBhaXIsIGtleXMsIHJlc3VsdCxcbiAgICAgIG9iamVjdCA9IGRhdGE7XG5cbiAgcmVzdWx0ID0gbmV3IEFycmF5KG9iamVjdC5sZW5ndGgpO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHBhaXIgPSBvYmplY3RbaW5kZXhdO1xuXG4gICAgaWYgKF90b1N0cmluZyQxLmNhbGwocGFpcikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSByZXR1cm4gZmFsc2U7XG5cbiAgICBrZXlzID0gT2JqZWN0LmtleXMocGFpcik7XG5cbiAgICBpZiAoa2V5cy5sZW5ndGggIT09IDEpIHJldHVybiBmYWxzZTtcblxuICAgIHJlc3VsdFtpbmRleF0gPSBbIGtleXNbMF0sIHBhaXJba2V5c1swXV0gXTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sUGFpcnMoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIFtdO1xuXG4gIHZhciBpbmRleCwgbGVuZ3RoLCBwYWlyLCBrZXlzLCByZXN1bHQsXG4gICAgICBvYmplY3QgPSBkYXRhO1xuXG4gIHJlc3VsdCA9IG5ldyBBcnJheShvYmplY3QubGVuZ3RoKTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBwYWlyID0gb2JqZWN0W2luZGV4XTtcblxuICAgIGtleXMgPSBPYmplY3Qua2V5cyhwYWlyKTtcblxuICAgIHJlc3VsdFtpbmRleF0gPSBbIGtleXNbMF0sIHBhaXJba2V5c1swXV0gXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnZhciBwYWlycyA9IG5ldyB0eXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpwYWlycycsIHtcbiAga2luZDogJ3NlcXVlbmNlJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxQYWlycyxcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sUGFpcnNcbn0pO1xuXG52YXIgX2hhc093blByb3BlcnR5JDIgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbFNldChkYXRhKSB7XG4gIGlmIChkYXRhID09PSBudWxsKSByZXR1cm4gdHJ1ZTtcblxuICB2YXIga2V5LCBvYmplY3QgPSBkYXRhO1xuXG4gIGZvciAoa2V5IGluIG9iamVjdCkge1xuICAgIGlmIChfaGFzT3duUHJvcGVydHkkMi5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgaWYgKG9iamVjdFtrZXldICE9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxTZXQoZGF0YSkge1xuICByZXR1cm4gZGF0YSAhPT0gbnVsbCA/IGRhdGEgOiB7fTtcbn1cblxudmFyIHNldCA9IG5ldyB0eXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpzZXQnLCB7XG4gIGtpbmQ6ICdtYXBwaW5nJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxTZXQsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbFNldFxufSk7XG5cbnZhciBfZGVmYXVsdCA9IGNvcmUuZXh0ZW5kKHtcbiAgaW1wbGljaXQ6IFtcbiAgICB0aW1lc3RhbXAsXG4gICAgbWVyZ2VcbiAgXSxcbiAgZXhwbGljaXQ6IFtcbiAgICBiaW5hcnksXG4gICAgb21hcCxcbiAgICBwYWlycyxcbiAgICBzZXRcbiAgXVxufSk7XG5cbi8qZXNsaW50LWRpc2FibGUgbWF4LWxlbixuby11c2UtYmVmb3JlLWRlZmluZSovXG5cblxuXG5cblxuXG5cbnZhciBfaGFzT3duUHJvcGVydHkkMSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cblxudmFyIENPTlRFWFRfRkxPV19JTiAgID0gMTtcbnZhciBDT05URVhUX0ZMT1dfT1VUICA9IDI7XG52YXIgQ09OVEVYVF9CTE9DS19JTiAgPSAzO1xudmFyIENPTlRFWFRfQkxPQ0tfT1VUID0gNDtcblxuXG52YXIgQ0hPTVBJTkdfQ0xJUCAgPSAxO1xudmFyIENIT01QSU5HX1NUUklQID0gMjtcbnZhciBDSE9NUElOR19LRUVQICA9IDM7XG5cblxudmFyIFBBVFRFUk5fTk9OX1BSSU5UQUJMRSAgICAgICAgID0gL1tcXHgwMC1cXHgwOFxceDBCXFx4MENcXHgwRS1cXHgxRlxceDdGLVxceDg0XFx4ODYtXFx4OUZcXHVGRkZFXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0vO1xudmFyIFBBVFRFUk5fTk9OX0FTQ0lJX0xJTkVfQlJFQUtTID0gL1tcXHg4NVxcdTIwMjhcXHUyMDI5XS87XG52YXIgUEFUVEVSTl9GTE9XX0lORElDQVRPUlMgICAgICAgPSAvWyxcXFtcXF1cXHtcXH1dLztcbnZhciBQQVRURVJOX1RBR19IQU5ETEUgICAgICAgICAgICA9IC9eKD86IXwhIXwhW2EtelxcLV0rISkkL2k7XG52YXIgUEFUVEVSTl9UQUdfVVJJICAgICAgICAgICAgICAgPSAvXig/OiF8W14sXFxbXFxdXFx7XFx9XSkoPzolWzAtOWEtZl17Mn18WzAtOWEtelxcLSM7XFwvXFw/OkAmPVxcK1xcJCxfXFwuIX5cXConXFwoXFwpXFxbXFxdXSkqJC9pO1xuXG5cbmZ1bmN0aW9uIF9jbGFzcyhvYmopIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopOyB9XG5cbmZ1bmN0aW9uIGlzX0VPTChjKSB7XG4gIHJldHVybiAoYyA9PT0gMHgwQS8qIExGICovKSB8fCAoYyA9PT0gMHgwRC8qIENSICovKTtcbn1cblxuZnVuY3Rpb24gaXNfV0hJVEVfU1BBQ0UoYykge1xuICByZXR1cm4gKGMgPT09IDB4MDkvKiBUYWIgKi8pIHx8IChjID09PSAweDIwLyogU3BhY2UgKi8pO1xufVxuXG5mdW5jdGlvbiBpc19XU19PUl9FT0woYykge1xuICByZXR1cm4gKGMgPT09IDB4MDkvKiBUYWIgKi8pIHx8XG4gICAgICAgICAoYyA9PT0gMHgyMC8qIFNwYWNlICovKSB8fFxuICAgICAgICAgKGMgPT09IDB4MEEvKiBMRiAqLykgfHxcbiAgICAgICAgIChjID09PSAweDBELyogQ1IgKi8pO1xufVxuXG5mdW5jdGlvbiBpc19GTE9XX0lORElDQVRPUihjKSB7XG4gIHJldHVybiBjID09PSAweDJDLyogLCAqLyB8fFxuICAgICAgICAgYyA9PT0gMHg1Qi8qIFsgKi8gfHxcbiAgICAgICAgIGMgPT09IDB4NUQvKiBdICovIHx8XG4gICAgICAgICBjID09PSAweDdCLyogeyAqLyB8fFxuICAgICAgICAgYyA9PT0gMHg3RC8qIH0gKi87XG59XG5cbmZ1bmN0aW9uIGZyb21IZXhDb2RlKGMpIHtcbiAgdmFyIGxjO1xuXG4gIGlmICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKSB7XG4gICAgcmV0dXJuIGMgLSAweDMwO1xuICB9XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlKi9cbiAgbGMgPSBjIHwgMHgyMDtcblxuICBpZiAoKDB4NjEvKiBhICovIDw9IGxjKSAmJiAobGMgPD0gMHg2Ni8qIGYgKi8pKSB7XG4gICAgcmV0dXJuIGxjIC0gMHg2MSArIDEwO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVkSGV4TGVuKGMpIHtcbiAgaWYgKGMgPT09IDB4NzgvKiB4ICovKSB7IHJldHVybiAyOyB9XG4gIGlmIChjID09PSAweDc1LyogdSAqLykgeyByZXR1cm4gNDsgfVxuICBpZiAoYyA9PT0gMHg1NS8qIFUgKi8pIHsgcmV0dXJuIDg7IH1cbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGZyb21EZWNpbWFsQ29kZShjKSB7XG4gIGlmICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKSB7XG4gICAgcmV0dXJuIGMgLSAweDMwO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBzaW1wbGVFc2NhcGVTZXF1ZW5jZShjKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIGluZGVudCAqL1xuICByZXR1cm4gKGMgPT09IDB4MzAvKiAwICovKSA/ICdcXHgwMCcgOlxuICAgICAgICAoYyA9PT0gMHg2MS8qIGEgKi8pID8gJ1xceDA3JyA6XG4gICAgICAgIChjID09PSAweDYyLyogYiAqLykgPyAnXFx4MDgnIDpcbiAgICAgICAgKGMgPT09IDB4NzQvKiB0ICovKSA/ICdcXHgwOScgOlxuICAgICAgICAoYyA9PT0gMHgwOS8qIFRhYiAqLykgPyAnXFx4MDknIDpcbiAgICAgICAgKGMgPT09IDB4NkUvKiBuICovKSA/ICdcXHgwQScgOlxuICAgICAgICAoYyA9PT0gMHg3Ni8qIHYgKi8pID8gJ1xceDBCJyA6XG4gICAgICAgIChjID09PSAweDY2LyogZiAqLykgPyAnXFx4MEMnIDpcbiAgICAgICAgKGMgPT09IDB4NzIvKiByICovKSA/ICdcXHgwRCcgOlxuICAgICAgICAoYyA9PT0gMHg2NS8qIGUgKi8pID8gJ1xceDFCJyA6XG4gICAgICAgIChjID09PSAweDIwLyogU3BhY2UgKi8pID8gJyAnIDpcbiAgICAgICAgKGMgPT09IDB4MjIvKiBcIiAqLykgPyAnXFx4MjInIDpcbiAgICAgICAgKGMgPT09IDB4MkYvKiAvICovKSA/ICcvJyA6XG4gICAgICAgIChjID09PSAweDVDLyogXFwgKi8pID8gJ1xceDVDJyA6XG4gICAgICAgIChjID09PSAweDRFLyogTiAqLykgPyAnXFx4ODUnIDpcbiAgICAgICAgKGMgPT09IDB4NUYvKiBfICovKSA/ICdcXHhBMCcgOlxuICAgICAgICAoYyA9PT0gMHg0Qy8qIEwgKi8pID8gJ1xcdTIwMjgnIDpcbiAgICAgICAgKGMgPT09IDB4NTAvKiBQICovKSA/ICdcXHUyMDI5JyA6ICcnO1xufVxuXG5mdW5jdGlvbiBjaGFyRnJvbUNvZGVwb2ludChjKSB7XG4gIGlmIChjIDw9IDB4RkZGRikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICB9XG4gIC8vIEVuY29kZSBVVEYtMTYgc3Vycm9nYXRlIHBhaXJcbiAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTE2I0NvZGVfcG9pbnRzX1UuMkIwMTAwMDBfdG9fVS4yQjEwRkZGRlxuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShcbiAgICAoKGMgLSAweDAxMDAwMCkgPj4gMTApICsgMHhEODAwLFxuICAgICgoYyAtIDB4MDEwMDAwKSAmIDB4MDNGRikgKyAweERDMDBcbiAgKTtcbn1cblxuLy8gc2V0IGEgcHJvcGVydHkgb2YgYSBsaXRlcmFsIG9iamVjdCwgd2hpbGUgcHJvdGVjdGluZyBhZ2FpbnN0IHByb3RvdHlwZSBwb2xsdXRpb24sXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2lzc3Vlcy8xNjQgZm9yIG1vcmUgZGV0YWlsc1xuZnVuY3Rpb24gc2V0UHJvcGVydHkob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIC8vIHVzZWQgZm9yIHRoaXMgc3BlY2lmaWMga2V5IG9ubHkgYmVjYXVzZSBPYmplY3QuZGVmaW5lUHJvcGVydHkgaXMgc2xvd1xuICBpZiAoa2V5ID09PSAnX19wcm90b19fJykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG52YXIgc2ltcGxlRXNjYXBlQ2hlY2sgPSBuZXcgQXJyYXkoMjU2KTsgLy8gaW50ZWdlciwgZm9yIGZhc3QgYWNjZXNzXG52YXIgc2ltcGxlRXNjYXBlTWFwID0gbmV3IEFycmF5KDI1Nik7XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gIHNpbXBsZUVzY2FwZUNoZWNrW2ldID0gc2ltcGxlRXNjYXBlU2VxdWVuY2UoaSkgPyAxIDogMDtcbiAgc2ltcGxlRXNjYXBlTWFwW2ldID0gc2ltcGxlRXNjYXBlU2VxdWVuY2UoaSk7XG59XG5cblxuZnVuY3Rpb24gU3RhdGUkMShpbnB1dCwgb3B0aW9ucykge1xuICB0aGlzLmlucHV0ID0gaW5wdXQ7XG5cbiAgdGhpcy5maWxlbmFtZSAgPSBvcHRpb25zWydmaWxlbmFtZSddICB8fCBudWxsO1xuICB0aGlzLnNjaGVtYSAgICA9IG9wdGlvbnNbJ3NjaGVtYSddICAgIHx8IF9kZWZhdWx0O1xuICB0aGlzLm9uV2FybmluZyA9IG9wdGlvbnNbJ29uV2FybmluZyddIHx8IG51bGw7XG4gIC8vIChIaWRkZW4pIFJlbW92ZT8gbWFrZXMgdGhlIGxvYWRlciB0byBleHBlY3QgWUFNTCAxLjEgZG9jdW1lbnRzXG4gIC8vIGlmIHN1Y2ggZG9jdW1lbnRzIGhhdmUgbm8gZXhwbGljaXQgJVlBTUwgZGlyZWN0aXZlXG4gIHRoaXMubGVnYWN5ICAgID0gb3B0aW9uc1snbGVnYWN5J10gICAgfHwgZmFsc2U7XG5cbiAgdGhpcy5qc29uICAgICAgPSBvcHRpb25zWydqc29uJ10gICAgICB8fCBmYWxzZTtcbiAgdGhpcy5saXN0ZW5lciAgPSBvcHRpb25zWydsaXN0ZW5lciddICB8fCBudWxsO1xuXG4gIHRoaXMuaW1wbGljaXRUeXBlcyA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkSW1wbGljaXQ7XG4gIHRoaXMudHlwZU1hcCAgICAgICA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkVHlwZU1hcDtcblxuICB0aGlzLmxlbmd0aCAgICAgPSBpbnB1dC5sZW5ndGg7XG4gIHRoaXMucG9zaXRpb24gICA9IDA7XG4gIHRoaXMubGluZSAgICAgICA9IDA7XG4gIHRoaXMubGluZVN0YXJ0ICA9IDA7XG4gIHRoaXMubGluZUluZGVudCA9IDA7XG5cbiAgLy8gcG9zaXRpb24gb2YgZmlyc3QgbGVhZGluZyB0YWIgaW4gdGhlIGN1cnJlbnQgbGluZSxcbiAgLy8gdXNlZCB0byBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIHRhYnMgaW4gdGhlIGluZGVudGF0aW9uXG4gIHRoaXMuZmlyc3RUYWJJbkxpbmUgPSAtMTtcblxuICB0aGlzLmRvY3VtZW50cyA9IFtdO1xuXG4gIC8qXG4gIHRoaXMudmVyc2lvbjtcbiAgdGhpcy5jaGVja0xpbmVCcmVha3M7XG4gIHRoaXMudGFnTWFwO1xuICB0aGlzLmFuY2hvck1hcDtcbiAgdGhpcy50YWc7XG4gIHRoaXMuYW5jaG9yO1xuICB0aGlzLmtpbmQ7XG4gIHRoaXMucmVzdWx0OyovXG5cbn1cblxuXG5mdW5jdGlvbiBnZW5lcmF0ZUVycm9yKHN0YXRlLCBtZXNzYWdlKSB7XG4gIHZhciBtYXJrID0ge1xuICAgIG5hbWU6ICAgICBzdGF0ZS5maWxlbmFtZSxcbiAgICBidWZmZXI6ICAgc3RhdGUuaW5wdXQuc2xpY2UoMCwgLTEpLCAvLyBvbWl0IHRyYWlsaW5nIFxcMFxuICAgIHBvc2l0aW9uOiBzdGF0ZS5wb3NpdGlvbixcbiAgICBsaW5lOiAgICAgc3RhdGUubGluZSxcbiAgICBjb2x1bW46ICAgc3RhdGUucG9zaXRpb24gLSBzdGF0ZS5saW5lU3RhcnRcbiAgfTtcblxuICBtYXJrLnNuaXBwZXQgPSBzbmlwcGV0KG1hcmspO1xuXG4gIHJldHVybiBuZXcgZXhjZXB0aW9uKG1lc3NhZ2UsIG1hcmspO1xufVxuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKHN0YXRlLCBtZXNzYWdlKSB7XG4gIHRocm93IGdlbmVyYXRlRXJyb3Ioc3RhdGUsIG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiB0aHJvd1dhcm5pbmcoc3RhdGUsIG1lc3NhZ2UpIHtcbiAgaWYgKHN0YXRlLm9uV2FybmluZykge1xuICAgIHN0YXRlLm9uV2FybmluZy5jYWxsKG51bGwsIGdlbmVyYXRlRXJyb3Ioc3RhdGUsIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG5cbnZhciBkaXJlY3RpdmVIYW5kbGVycyA9IHtcblxuICBZQU1MOiBmdW5jdGlvbiBoYW5kbGVZYW1sRGlyZWN0aXZlKHN0YXRlLCBuYW1lLCBhcmdzKSB7XG5cbiAgICB2YXIgbWF0Y2gsIG1ham9yLCBtaW5vcjtcblxuICAgIGlmIChzdGF0ZS52ZXJzaW9uICE9PSBudWxsKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZHVwbGljYXRpb24gb2YgJVlBTUwgZGlyZWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnWUFNTCBkaXJlY3RpdmUgYWNjZXB0cyBleGFjdGx5IG9uZSBhcmd1bWVudCcpO1xuICAgIH1cblxuICAgIG1hdGNoID0gL14oWzAtOV0rKVxcLihbMC05XSspJC8uZXhlYyhhcmdzWzBdKTtcblxuICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2lsbC1mb3JtZWQgYXJndW1lbnQgb2YgdGhlIFlBTUwgZGlyZWN0aXZlJyk7XG4gICAgfVxuXG4gICAgbWFqb3IgPSBwYXJzZUludChtYXRjaFsxXSwgMTApO1xuICAgIG1pbm9yID0gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKTtcblxuICAgIGlmIChtYWpvciAhPT0gMSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuYWNjZXB0YWJsZSBZQU1MIHZlcnNpb24gb2YgdGhlIGRvY3VtZW50Jyk7XG4gICAgfVxuXG4gICAgc3RhdGUudmVyc2lvbiA9IGFyZ3NbMF07XG4gICAgc3RhdGUuY2hlY2tMaW5lQnJlYWtzID0gKG1pbm9yIDwgMik7XG5cbiAgICBpZiAobWlub3IgIT09IDEgJiYgbWlub3IgIT09IDIpIHtcbiAgICAgIHRocm93V2FybmluZyhzdGF0ZSwgJ3Vuc3VwcG9ydGVkIFlBTUwgdmVyc2lvbiBvZiB0aGUgZG9jdW1lbnQnKTtcbiAgICB9XG4gIH0sXG5cbiAgVEFHOiBmdW5jdGlvbiBoYW5kbGVUYWdEaXJlY3RpdmUoc3RhdGUsIG5hbWUsIGFyZ3MpIHtcblxuICAgIHZhciBoYW5kbGUsIHByZWZpeDtcblxuICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ1RBRyBkaXJlY3RpdmUgYWNjZXB0cyBleGFjdGx5IHR3byBhcmd1bWVudHMnKTtcbiAgICB9XG5cbiAgICBoYW5kbGUgPSBhcmdzWzBdO1xuICAgIHByZWZpeCA9IGFyZ3NbMV07XG5cbiAgICBpZiAoIVBBVFRFUk5fVEFHX0hBTkRMRS50ZXN0KGhhbmRsZSkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdpbGwtZm9ybWVkIHRhZyBoYW5kbGUgKGZpcnN0IGFyZ3VtZW50KSBvZiB0aGUgVEFHIGRpcmVjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChfaGFzT3duUHJvcGVydHkkMS5jYWxsKHN0YXRlLnRhZ01hcCwgaGFuZGxlKSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RoZXJlIGlzIGEgcHJldmlvdXNseSBkZWNsYXJlZCBzdWZmaXggZm9yIFwiJyArIGhhbmRsZSArICdcIiB0YWcgaGFuZGxlJyk7XG4gICAgfVxuXG4gICAgaWYgKCFQQVRURVJOX1RBR19VUkkudGVzdChwcmVmaXgpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnaWxsLWZvcm1lZCB0YWcgcHJlZml4IChzZWNvbmQgYXJndW1lbnQpIG9mIHRoZSBUQUcgZGlyZWN0aXZlJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHByZWZpeCA9IGRlY29kZVVSSUNvbXBvbmVudChwcmVmaXgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RhZyBwcmVmaXggaXMgbWFsZm9ybWVkOiAnICsgcHJlZml4KTtcbiAgICB9XG5cbiAgICBzdGF0ZS50YWdNYXBbaGFuZGxlXSA9IHByZWZpeDtcbiAgfVxufTtcblxuXG5mdW5jdGlvbiBjYXB0dXJlU2VnbWVudChzdGF0ZSwgc3RhcnQsIGVuZCwgY2hlY2tKc29uKSB7XG4gIHZhciBfcG9zaXRpb24sIF9sZW5ndGgsIF9jaGFyYWN0ZXIsIF9yZXN1bHQ7XG5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgX3Jlc3VsdCA9IHN0YXRlLmlucHV0LnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgaWYgKGNoZWNrSnNvbikge1xuICAgICAgZm9yIChfcG9zaXRpb24gPSAwLCBfbGVuZ3RoID0gX3Jlc3VsdC5sZW5ndGg7IF9wb3NpdGlvbiA8IF9sZW5ndGg7IF9wb3NpdGlvbiArPSAxKSB7XG4gICAgICAgIF9jaGFyYWN0ZXIgPSBfcmVzdWx0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uKTtcbiAgICAgICAgaWYgKCEoX2NoYXJhY3RlciA9PT0gMHgwOSB8fFxuICAgICAgICAgICAgICAoMHgyMCA8PSBfY2hhcmFjdGVyICYmIF9jaGFyYWN0ZXIgPD0gMHgxMEZGRkYpKSkge1xuICAgICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdleHBlY3RlZCB2YWxpZCBKU09OIGNoYXJhY3RlcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChQQVRURVJOX05PTl9QUklOVEFCTEUudGVzdChfcmVzdWx0KSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RoZSBzdHJlYW0gY29udGFpbnMgbm9uLXByaW50YWJsZSBjaGFyYWN0ZXJzJyk7XG4gICAgfVxuXG4gICAgc3RhdGUucmVzdWx0ICs9IF9yZXN1bHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgZGVzdGluYXRpb24sIHNvdXJjZSwgb3ZlcnJpZGFibGVLZXlzKSB7XG4gIHZhciBzb3VyY2VLZXlzLCBrZXksIGluZGV4LCBxdWFudGl0eTtcblxuICBpZiAoIWNvbW1vbi5pc09iamVjdChzb3VyY2UpKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Nhbm5vdCBtZXJnZSBtYXBwaW5nczsgdGhlIHByb3ZpZGVkIHNvdXJjZSBvYmplY3QgaXMgdW5hY2NlcHRhYmxlJyk7XG4gIH1cblxuICBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcblxuICBmb3IgKGluZGV4ID0gMCwgcXVhbnRpdHkgPSBzb3VyY2VLZXlzLmxlbmd0aDsgaW5kZXggPCBxdWFudGl0eTsgaW5kZXggKz0gMSkge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaW5kZXhdO1xuXG4gICAgaWYgKCFfaGFzT3duUHJvcGVydHkkMS5jYWxsKGRlc3RpbmF0aW9uLCBrZXkpKSB7XG4gICAgICBzZXRQcm9wZXJ0eShkZXN0aW5hdGlvbiwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICBvdmVycmlkYWJsZUtleXNba2V5XSA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsXG4gIHN0YXJ0TGluZSwgc3RhcnRMaW5lU3RhcnQsIHN0YXJ0UG9zKSB7XG5cbiAgdmFyIGluZGV4LCBxdWFudGl0eTtcblxuICAvLyBUaGUgb3V0cHV0IGlzIGEgcGxhaW4gb2JqZWN0IGhlcmUsIHNvIGtleXMgY2FuIG9ubHkgYmUgc3RyaW5ncy5cbiAgLy8gV2UgbmVlZCB0byBjb252ZXJ0IGtleU5vZGUgdG8gYSBzdHJpbmcsIGJ1dCBkb2luZyBzbyBjYW4gaGFuZyB0aGUgcHJvY2Vzc1xuICAvLyAoZGVlcGx5IG5lc3RlZCBhcnJheXMgdGhhdCBleHBsb2RlIGV4cG9uZW50aWFsbHkgdXNpbmcgYWxpYXNlcykuXG4gIGlmIChBcnJheS5pc0FycmF5KGtleU5vZGUpKSB7XG4gICAga2V5Tm9kZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGtleU5vZGUpO1xuXG4gICAgZm9yIChpbmRleCA9IDAsIHF1YW50aXR5ID0ga2V5Tm9kZS5sZW5ndGg7IGluZGV4IDwgcXVhbnRpdHk7IGluZGV4ICs9IDEpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleU5vZGVbaW5kZXhdKSkge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmVzdGVkIGFycmF5cyBhcmUgbm90IHN1cHBvcnRlZCBpbnNpZGUga2V5cycpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGtleU5vZGUgPT09ICdvYmplY3QnICYmIF9jbGFzcyhrZXlOb2RlW2luZGV4XSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgIGtleU5vZGVbaW5kZXhdID0gJ1tvYmplY3QgT2JqZWN0XSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQXZvaWQgY29kZSBleGVjdXRpb24gaW4gbG9hZCgpIHZpYSB0b1N0cmluZyBwcm9wZXJ0eVxuICAvLyAoc3RpbGwgdXNlIGl0cyBvd24gdG9TdHJpbmcgZm9yIGFycmF5cywgdGltZXN0YW1wcyxcbiAgLy8gYW5kIHdoYXRldmVyIHVzZXIgc2NoZW1hIGV4dGVuc2lvbnMgaGFwcGVuIHRvIGhhdmUgQEB0b1N0cmluZ1RhZylcbiAgaWYgKHR5cGVvZiBrZXlOb2RlID09PSAnb2JqZWN0JyAmJiBfY2xhc3Moa2V5Tm9kZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAga2V5Tm9kZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuICB9XG5cblxuICBrZXlOb2RlID0gU3RyaW5nKGtleU5vZGUpO1xuXG4gIGlmIChfcmVzdWx0ID09PSBudWxsKSB7XG4gICAgX3Jlc3VsdCA9IHt9O1xuICB9XG5cbiAgaWYgKGtleVRhZyA9PT0gJ3RhZzp5YW1sLm9yZywyMDAyOm1lcmdlJykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlTm9kZSkpIHtcbiAgICAgIGZvciAoaW5kZXggPSAwLCBxdWFudGl0eSA9IHZhbHVlTm9kZS5sZW5ndGg7IGluZGV4IDwgcXVhbnRpdHk7IGluZGV4ICs9IDEpIHtcbiAgICAgICAgbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgX3Jlc3VsdCwgdmFsdWVOb2RlW2luZGV4XSwgb3ZlcnJpZGFibGVLZXlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgX3Jlc3VsdCwgdmFsdWVOb2RlLCBvdmVycmlkYWJsZUtleXMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIXN0YXRlLmpzb24gJiZcbiAgICAgICAgIV9oYXNPd25Qcm9wZXJ0eSQxLmNhbGwob3ZlcnJpZGFibGVLZXlzLCBrZXlOb2RlKSAmJlxuICAgICAgICBfaGFzT3duUHJvcGVydHkkMS5jYWxsKF9yZXN1bHQsIGtleU5vZGUpKSB7XG4gICAgICBzdGF0ZS5saW5lID0gc3RhcnRMaW5lIHx8IHN0YXRlLmxpbmU7XG4gICAgICBzdGF0ZS5saW5lU3RhcnQgPSBzdGFydExpbmVTdGFydCB8fCBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBzdGF0ZS5wb3NpdGlvbiA9IHN0YXJ0UG9zIHx8IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2R1cGxpY2F0ZWQgbWFwcGluZyBrZXknKTtcbiAgICB9XG5cbiAgICBzZXRQcm9wZXJ0eShfcmVzdWx0LCBrZXlOb2RlLCB2YWx1ZU5vZGUpO1xuICAgIGRlbGV0ZSBvdmVycmlkYWJsZUtleXNba2V5Tm9kZV07XG4gIH1cblxuICByZXR1cm4gX3Jlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmVhZExpbmVCcmVhayhzdGF0ZSkge1xuICB2YXIgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggPT09IDB4MEEvKiBMRiAqLykge1xuICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gIH0gZWxzZSBpZiAoY2ggPT09IDB4MEQvKiBDUiAqLykge1xuICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgaWYgKHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pID09PSAweDBBLyogTEYgKi8pIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICdhIGxpbmUgYnJlYWsgaXMgZXhwZWN0ZWQnKTtcbiAgfVxuXG4gIHN0YXRlLmxpbmUgKz0gMTtcbiAgc3RhdGUubGluZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG4gIHN0YXRlLmZpcnN0VGFiSW5MaW5lID0gLTE7XG59XG5cbmZ1bmN0aW9uIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGFsbG93Q29tbWVudHMsIGNoZWNrSW5kZW50KSB7XG4gIHZhciBsaW5lQnJlYWtzID0gMCxcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgd2hpbGUgKGNoICE9PSAwKSB7XG4gICAgd2hpbGUgKGlzX1dISVRFX1NQQUNFKGNoKSkge1xuICAgICAgaWYgKGNoID09PSAweDA5LyogVGFiICovICYmIHN0YXRlLmZpcnN0VGFiSW5MaW5lID09PSAtMSkge1xuICAgICAgICBzdGF0ZS5maXJzdFRhYkluTGluZSA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgfVxuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChhbGxvd0NvbW1lbnRzICYmIGNoID09PSAweDIzLyogIyAqLykge1xuICAgICAgZG8ge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9IHdoaWxlIChjaCAhPT0gMHgwQS8qIExGICovICYmIGNoICE9PSAweDBELyogQ1IgKi8gJiYgY2ggIT09IDApO1xuICAgIH1cblxuICAgIGlmIChpc19FT0woY2gpKSB7XG4gICAgICByZWFkTGluZUJyZWFrKHN0YXRlKTtcblxuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgICAgIGxpbmVCcmVha3MrKztcbiAgICAgIHN0YXRlLmxpbmVJbmRlbnQgPSAwO1xuXG4gICAgICB3aGlsZSAoY2ggPT09IDB4MjAvKiBTcGFjZSAqLykge1xuICAgICAgICBzdGF0ZS5saW5lSW5kZW50Kys7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoZWNrSW5kZW50ICE9PSAtMSAmJiBsaW5lQnJlYWtzICE9PSAwICYmIHN0YXRlLmxpbmVJbmRlbnQgPCBjaGVja0luZGVudCkge1xuICAgIHRocm93V2FybmluZyhzdGF0ZSwgJ2RlZmljaWVudCBpbmRlbnRhdGlvbicpO1xuICB9XG5cbiAgcmV0dXJuIGxpbmVCcmVha3M7XG59XG5cbmZ1bmN0aW9uIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZSkge1xuICB2YXIgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb24sXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uKTtcblxuICAvLyBDb25kaXRpb24gc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCBpcyB0ZXN0ZWRcbiAgLy8gaW4gcGFyZW50IG9uIGVhY2ggY2FsbCwgZm9yIGVmZmljaWVuY3kuIE5vIG5lZWRzIHRvIHRlc3QgaGVyZSBhZ2Fpbi5cbiAgaWYgKChjaCA9PT0gMHgyRC8qIC0gKi8gfHwgY2ggPT09IDB4MkUvKiAuICovKSAmJlxuICAgICAgY2ggPT09IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uICsgMSkgJiZcbiAgICAgIGNoID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KF9wb3NpdGlvbiArIDIpKSB7XG5cbiAgICBfcG9zaXRpb24gKz0gMztcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChfcG9zaXRpb24pO1xuXG4gICAgaWYgKGNoID09PSAwIHx8IGlzX1dTX09SX0VPTChjaCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gd3JpdGVGb2xkZWRMaW5lcyhzdGF0ZSwgY291bnQpIHtcbiAgaWYgKGNvdW50ID09PSAxKSB7XG4gICAgc3RhdGUucmVzdWx0ICs9ICcgJztcbiAgfSBlbHNlIGlmIChjb3VudCA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnXFxuJywgY291bnQgLSAxKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHJlYWRQbGFpblNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCwgd2l0aGluRmxvd0NvbGxlY3Rpb24pIHtcbiAgdmFyIHByZWNlZGluZyxcbiAgICAgIGZvbGxvd2luZyxcbiAgICAgIGNhcHR1cmVTdGFydCxcbiAgICAgIGNhcHR1cmVFbmQsXG4gICAgICBoYXNQZW5kaW5nQ29udGVudCxcbiAgICAgIF9saW5lLFxuICAgICAgX2xpbmVTdGFydCxcbiAgICAgIF9saW5lSW5kZW50LFxuICAgICAgX2tpbmQgPSBzdGF0ZS5raW5kLFxuICAgICAgX3Jlc3VsdCA9IHN0YXRlLnJlc3VsdCxcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGlzX1dTX09SX0VPTChjaCkgICAgICB8fFxuICAgICAgaXNfRkxPV19JTkRJQ0FUT1IoY2gpIHx8XG4gICAgICBjaCA9PT0gMHgyMy8qICMgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDI2LyogJiAqLyAgICB8fFxuICAgICAgY2ggPT09IDB4MkEvKiAqICovICAgIHx8XG4gICAgICBjaCA9PT0gMHgyMS8qICEgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDdDLyogfCAqLyAgICB8fFxuICAgICAgY2ggPT09IDB4M0UvKiA+ICovICAgIHx8XG4gICAgICBjaCA9PT0gMHgyNy8qICcgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDIyLyogXCIgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDI1LyogJSAqLyAgICB8fFxuICAgICAgY2ggPT09IDB4NDAvKiBAICovICAgIHx8XG4gICAgICBjaCA9PT0gMHg2MC8qIGAgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoY2ggPT09IDB4M0YvKiA/ICovIHx8IGNoID09PSAweDJELyogLSAqLykge1xuICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgIGlmIChpc19XU19PUl9FT0woZm9sbG93aW5nKSB8fFxuICAgICAgICB3aXRoaW5GbG93Q29sbGVjdGlvbiAmJiBpc19GTE9XX0lORElDQVRPUihmb2xsb3dpbmcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcbiAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICBoYXNQZW5kaW5nQ29udGVudCA9IGZhbHNlO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGlmIChjaCA9PT0gMHgzQS8qIDogKi8pIHtcbiAgICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgaWYgKGlzX1dTX09SX0VPTChmb2xsb3dpbmcpIHx8XG4gICAgICAgICAgd2l0aGluRmxvd0NvbGxlY3Rpb24gJiYgaXNfRkxPV19JTkRJQ0FUT1IoZm9sbG93aW5nKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoY2ggPT09IDB4MjMvKiAjICovKSB7XG4gICAgICBwcmVjZWRpbmcgPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uIC0gMSk7XG5cbiAgICAgIGlmIChpc19XU19PUl9FT0wocHJlY2VkaW5nKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoKHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiYgdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSkgfHxcbiAgICAgICAgICAgICAgIHdpdGhpbkZsb3dDb2xsZWN0aW9uICYmIGlzX0ZMT1dfSU5ESUNBVE9SKGNoKSkge1xuICAgICAgYnJlYWs7XG5cbiAgICB9IGVsc2UgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIF9saW5lID0gc3RhdGUubGluZTtcbiAgICAgIF9saW5lU3RhcnQgPSBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBfbGluZUluZGVudCA9IHN0YXRlLmxpbmVJbmRlbnQ7XG4gICAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCBmYWxzZSwgLTEpO1xuXG4gICAgICBpZiAoc3RhdGUubGluZUluZGVudCA+PSBub2RlSW5kZW50KSB7XG4gICAgICAgIGhhc1BlbmRpbmdDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbiA9IGNhcHR1cmVFbmQ7XG4gICAgICAgIHN0YXRlLmxpbmUgPSBfbGluZTtcbiAgICAgICAgc3RhdGUubGluZVN0YXJ0ID0gX2xpbmVTdGFydDtcbiAgICAgICAgc3RhdGUubGluZUluZGVudCA9IF9saW5lSW5kZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUGVuZGluZ0NvbnRlbnQpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIGZhbHNlKTtcbiAgICAgIHdyaXRlRm9sZGVkTGluZXMoc3RhdGUsIHN0YXRlLmxpbmUgLSBfbGluZSk7XG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgICBoYXNQZW5kaW5nQ29udGVudCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb24gKyAxO1xuICAgIH1cblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgfVxuXG4gIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIGZhbHNlKTtcblxuICBpZiAoc3RhdGUucmVzdWx0KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gX2tpbmQ7XG4gIHN0YXRlLnJlc3VsdCA9IF9yZXN1bHQ7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVhZFNpbmdsZVF1b3RlZFNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2gsXG4gICAgICBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQ7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggIT09IDB4MjcvKiAnICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcbiAgc3RhdGUucG9zaXRpb24rKztcbiAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlICgoY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSkgIT09IDApIHtcbiAgICBpZiAoY2ggPT09IDB4MjcvKiAnICovKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICAgIGlmIChjaCA9PT0gMHgyNy8qICcgKi8pIHtcbiAgICAgICAgY2FwdHVyZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG4gICAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICAgIGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChpc19FT0woY2gpKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBjYXB0dXJlRW5kLCB0cnVlKTtcbiAgICAgIHdyaXRlRm9sZGVkTGluZXMoc3RhdGUsIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGZhbHNlLCBub2RlSW5kZW50KSk7XG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB9IGVsc2UgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiYgdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZXhwZWN0ZWQgZW5kIG9mIHRoZSBkb2N1bWVudCB3aXRoaW4gYSBzaW5nbGUgcXVvdGVkIHNjYWxhcicpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgfVxuICB9XG5cbiAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZXhwZWN0ZWQgZW5kIG9mIHRoZSBzdHJlYW0gd2l0aGluIGEgc2luZ2xlIHF1b3RlZCBzY2FsYXInKTtcbn1cblxuZnVuY3Rpb24gcmVhZERvdWJsZVF1b3RlZFNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2FwdHVyZVN0YXJ0LFxuICAgICAgY2FwdHVyZUVuZCxcbiAgICAgIGhleExlbmd0aCxcbiAgICAgIGhleFJlc3VsdCxcbiAgICAgIHRtcCxcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoICE9PSAweDIyLyogXCIgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gJ3NjYWxhcic7XG4gIHN0YXRlLnJlc3VsdCA9ICcnO1xuICBzdGF0ZS5wb3NpdGlvbisrO1xuICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgd2hpbGUgKChjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pKSAhPT0gMCkge1xuICAgIGlmIChjaCA9PT0gMHgyMi8qIFwiICovKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDVDLyogXFwgKi8pIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIHN0YXRlLnBvc2l0aW9uLCB0cnVlKTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgZmFsc2UsIG5vZGVJbmRlbnQpO1xuXG4gICAgICAgIC8vIFRPRE86IHJld29yayB0byBpbmxpbmUgZm4gd2l0aCBubyB0eXBlIGNhc3Q/XG4gICAgICB9IGVsc2UgaWYgKGNoIDwgMjU2ICYmIHNpbXBsZUVzY2FwZUNoZWNrW2NoXSkge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gc2ltcGxlRXNjYXBlTWFwW2NoXTtcbiAgICAgICAgc3RhdGUucG9zaXRpb24rKztcblxuICAgICAgfSBlbHNlIGlmICgodG1wID0gZXNjYXBlZEhleExlbihjaCkpID4gMCkge1xuICAgICAgICBoZXhMZW5ndGggPSB0bXA7XG4gICAgICAgIGhleFJlc3VsdCA9IDA7XG5cbiAgICAgICAgZm9yICg7IGhleExlbmd0aCA+IDA7IGhleExlbmd0aC0tKSB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gICAgICAgICAgaWYgKCh0bXAgPSBmcm9tSGV4Q29kZShjaCkpID49IDApIHtcbiAgICAgICAgICAgIGhleFJlc3VsdCA9IChoZXhSZXN1bHQgPDwgNCkgKyB0bXA7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2V4cGVjdGVkIGhleGFkZWNpbWFsIGNoYXJhY3RlcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjaGFyRnJvbUNvZGVwb2ludChoZXhSZXN1bHQpO1xuXG4gICAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmtub3duIGVzY2FwZSBzZXF1ZW5jZScpO1xuICAgICAgfVxuXG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB9IGVsc2UgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIHRydWUpO1xuICAgICAgd3JpdGVGb2xkZWRMaW5lcyhzdGF0ZSwgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgZmFsc2UsIG5vZGVJbmRlbnQpKTtcbiAgICAgIGNhcHR1cmVTdGFydCA9IGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcblxuICAgIH0gZWxzZSBpZiAoc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCAmJiB0ZXN0RG9jdW1lbnRTZXBhcmF0b3Ioc3RhdGUpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIGRvY3VtZW50IHdpdGhpbiBhIGRvdWJsZSBxdW90ZWQgc2NhbGFyJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgIGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcbiAgICB9XG4gIH1cblxuICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSBkb3VibGUgcXVvdGVkIHNjYWxhcicpO1xufVxuXG5mdW5jdGlvbiByZWFkRmxvd0NvbGxlY3Rpb24oc3RhdGUsIG5vZGVJbmRlbnQpIHtcbiAgdmFyIHJlYWROZXh0ID0gdHJ1ZSxcbiAgICAgIF9saW5lLFxuICAgICAgX2xpbmVTdGFydCxcbiAgICAgIF9wb3MsXG4gICAgICBfdGFnICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIF9yZXN1bHQsXG4gICAgICBfYW5jaG9yICA9IHN0YXRlLmFuY2hvcixcbiAgICAgIGZvbGxvd2luZyxcbiAgICAgIHRlcm1pbmF0b3IsXG4gICAgICBpc1BhaXIsXG4gICAgICBpc0V4cGxpY2l0UGFpcixcbiAgICAgIGlzTWFwcGluZyxcbiAgICAgIG92ZXJyaWRhYmxlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICBrZXlOb2RlLFxuICAgICAga2V5VGFnLFxuICAgICAgdmFsdWVOb2RlLFxuICAgICAgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggPT09IDB4NUIvKiBbICovKSB7XG4gICAgdGVybWluYXRvciA9IDB4NUQ7LyogXSAqL1xuICAgIGlzTWFwcGluZyA9IGZhbHNlO1xuICAgIF9yZXN1bHQgPSBbXTtcbiAgfSBlbHNlIGlmIChjaCA9PT0gMHg3Qi8qIHsgKi8pIHtcbiAgICB0ZXJtaW5hdG9yID0gMHg3RDsvKiB9ICovXG4gICAgaXNNYXBwaW5nID0gdHJ1ZTtcbiAgICBfcmVzdWx0ID0ge307XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gX3Jlc3VsdDtcbiAgfVxuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICB3aGlsZSAoY2ggIT09IDApIHtcbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCBub2RlSW5kZW50KTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoY2ggPT09IHRlcm1pbmF0b3IpIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgc3RhdGUuYW5jaG9yID0gX2FuY2hvcjtcbiAgICAgIHN0YXRlLmtpbmQgPSBpc01hcHBpbmcgPyAnbWFwcGluZycgOiAnc2VxdWVuY2UnO1xuICAgICAgc3RhdGUucmVzdWx0ID0gX3Jlc3VsdDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIXJlYWROZXh0KSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbWlzc2VkIGNvbW1hIGJldHdlZW4gZmxvdyBjb2xsZWN0aW9uIGVudHJpZXMnKTtcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDJDLyogLCAqLykge1xuICAgICAgLy8gXCJmbG93IGNvbGxlY3Rpb24gZW50cmllcyBjYW4gbmV2ZXIgYmUgY29tcGxldGVseSBlbXB0eVwiLCBhcyBwZXIgWUFNTCAxLjIsIHNlY3Rpb24gNy40XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCBcImV4cGVjdGVkIHRoZSBub2RlIGNvbnRlbnQsIGJ1dCBmb3VuZCAnLCdcIik7XG4gICAgfVxuXG4gICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgaXNQYWlyID0gaXNFeHBsaWNpdFBhaXIgPSBmYWxzZTtcblxuICAgIGlmIChjaCA9PT0gMHgzRi8qID8gKi8pIHtcbiAgICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgaWYgKGlzX1dTX09SX0VPTChmb2xsb3dpbmcpKSB7XG4gICAgICAgIGlzUGFpciA9IGlzRXhwbGljaXRQYWlyID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xpbmUgPSBzdGF0ZS5saW5lOyAvLyBTYXZlIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgX2xpbmVTdGFydCA9IHN0YXRlLmxpbmVTdGFydDtcbiAgICBfcG9zID0gc3RhdGUucG9zaXRpb247XG4gICAgY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfRkxPV19JTiwgZmFsc2UsIHRydWUpO1xuICAgIGtleVRhZyA9IHN0YXRlLnRhZztcbiAgICBrZXlOb2RlID0gc3RhdGUucmVzdWx0O1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmICgoaXNFeHBsaWNpdFBhaXIgfHwgc3RhdGUubGluZSA9PT0gX2xpbmUpICYmIGNoID09PSAweDNBLyogOiAqLykge1xuICAgICAgaXNQYWlyID0gdHJ1ZTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuICAgICAgY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfRkxPV19JTiwgZmFsc2UsIHRydWUpO1xuICAgICAgdmFsdWVOb2RlID0gc3RhdGUucmVzdWx0O1xuICAgIH1cblxuICAgIGlmIChpc01hcHBpbmcpIHtcbiAgICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsIF9saW5lLCBfbGluZVN0YXJ0LCBfcG9zKTtcbiAgICB9IGVsc2UgaWYgKGlzUGFpcikge1xuICAgICAgX3Jlc3VsdC5wdXNoKHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIG51bGwsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsIF9saW5lLCBfbGluZVN0YXJ0LCBfcG9zKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9yZXN1bHQucHVzaChrZXlOb2RlKTtcbiAgICB9XG5cbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCBub2RlSW5kZW50KTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoY2ggPT09IDB4MkMvKiAsICovKSB7XG4gICAgICByZWFkTmV4dCA9IHRydWU7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWROZXh0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZXhwZWN0ZWQgZW5kIG9mIHRoZSBzdHJlYW0gd2l0aGluIGEgZmxvdyBjb2xsZWN0aW9uJyk7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja1NjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2FwdHVyZVN0YXJ0LFxuICAgICAgZm9sZGluZyxcbiAgICAgIGNob21waW5nICAgICAgID0gQ0hPTVBJTkdfQ0xJUCxcbiAgICAgIGRpZFJlYWRDb250ZW50ID0gZmFsc2UsXG4gICAgICBkZXRlY3RlZEluZGVudCA9IGZhbHNlLFxuICAgICAgdGV4dEluZGVudCAgICAgPSBub2RlSW5kZW50LFxuICAgICAgZW1wdHlMaW5lcyAgICAgPSAwLFxuICAgICAgYXRNb3JlSW5kZW50ZWQgPSBmYWxzZSxcbiAgICAgIHRtcCxcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoID09PSAweDdDLyogfCAqLykge1xuICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChjaCA9PT0gMHgzRS8qID4gKi8pIHtcbiAgICBmb2xkaW5nID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gJ3NjYWxhcic7XG4gIHN0YXRlLnJlc3VsdCA9ICcnO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gMHgyQi8qICsgKi8gfHwgY2ggPT09IDB4MkQvKiAtICovKSB7XG4gICAgICBpZiAoQ0hPTVBJTkdfQ0xJUCA9PT0gY2hvbXBpbmcpIHtcbiAgICAgICAgY2hvbXBpbmcgPSAoY2ggPT09IDB4MkIvKiArICovKSA/IENIT01QSU5HX0tFRVAgOiBDSE9NUElOR19TVFJJUDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdyZXBlYXQgb2YgYSBjaG9tcGluZyBtb2RlIGlkZW50aWZpZXInKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoKHRtcCA9IGZyb21EZWNpbWFsQ29kZShjaCkpID49IDApIHtcbiAgICAgIGlmICh0bXAgPT09IDApIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2JhZCBleHBsaWNpdCBpbmRlbnRhdGlvbiB3aWR0aCBvZiBhIGJsb2NrIHNjYWxhcjsgaXQgY2Fubm90IGJlIGxlc3MgdGhhbiBvbmUnKTtcbiAgICAgIH0gZWxzZSBpZiAoIWRldGVjdGVkSW5kZW50KSB7XG4gICAgICAgIHRleHRJbmRlbnQgPSBub2RlSW5kZW50ICsgdG1wIC0gMTtcbiAgICAgICAgZGV0ZWN0ZWRJbmRlbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3JlcGVhdCBvZiBhbiBpbmRlbnRhdGlvbiB3aWR0aCBpZGVudGlmaWVyJyk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzX1dISVRFX1NQQUNFKGNoKSkge1xuICAgIGRvIHsgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pOyB9XG4gICAgd2hpbGUgKGlzX1dISVRFX1NQQUNFKGNoKSk7XG5cbiAgICBpZiAoY2ggPT09IDB4MjMvKiAjICovKSB7XG4gICAgICBkbyB7IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTsgfVxuICAgICAgd2hpbGUgKCFpc19FT0woY2gpICYmIChjaCAhPT0gMCkpO1xuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIHJlYWRMaW5lQnJlYWsoc3RhdGUpO1xuICAgIHN0YXRlLmxpbmVJbmRlbnQgPSAwO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIHdoaWxlICgoIWRldGVjdGVkSW5kZW50IHx8IHN0YXRlLmxpbmVJbmRlbnQgPCB0ZXh0SW5kZW50KSAmJlxuICAgICAgICAgICAoY2ggPT09IDB4MjAvKiBTcGFjZSAqLykpIHtcbiAgICAgIHN0YXRlLmxpbmVJbmRlbnQrKztcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAoIWRldGVjdGVkSW5kZW50ICYmIHN0YXRlLmxpbmVJbmRlbnQgPiB0ZXh0SW5kZW50KSB7XG4gICAgICB0ZXh0SW5kZW50ID0gc3RhdGUubGluZUluZGVudDtcbiAgICB9XG5cbiAgICBpZiAoaXNfRU9MKGNoKSkge1xuICAgICAgZW1wdHlMaW5lcysrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gRW5kIG9mIHRoZSBzY2FsYXIuXG4gICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCB0ZXh0SW5kZW50KSB7XG5cbiAgICAgIC8vIFBlcmZvcm0gdGhlIGNob21waW5nLlxuICAgICAgaWYgKGNob21waW5nID09PSBDSE9NUElOR19LRUVQKSB7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBkaWRSZWFkQ29udGVudCA/IDEgKyBlbXB0eUxpbmVzIDogZW1wdHlMaW5lcyk7XG4gICAgICB9IGVsc2UgaWYgKGNob21waW5nID09PSBDSE9NUElOR19DTElQKSB7XG4gICAgICAgIGlmIChkaWRSZWFkQ29udGVudCkgeyAvLyBpLmUuIG9ubHkgaWYgdGhlIHNjYWxhciBpcyBub3QgZW1wdHkuXG4gICAgICAgICAgc3RhdGUucmVzdWx0ICs9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJyZWFrIHRoaXMgYHdoaWxlYCBjeWNsZSBhbmQgZ28gdG8gdGhlIGZ1bmNpdG9uJ3MgZXBpbG9ndWUuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBGb2xkZWQgc3R5bGU6IHVzZSBmYW5jeSBydWxlcyB0byBoYW5kbGUgbGluZSBicmVha3MuXG4gICAgaWYgKGZvbGRpbmcpIHtcblxuICAgICAgLy8gTGluZXMgc3RhcnRpbmcgd2l0aCB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzIChtb3JlLWluZGVudGVkIGxpbmVzKSBhcmUgbm90IGZvbGRlZC5cbiAgICAgIGlmIChpc19XSElURV9TUEFDRShjaCkpIHtcbiAgICAgICAgYXRNb3JlSW5kZW50ZWQgPSB0cnVlO1xuICAgICAgICAvLyBleGNlcHQgZm9yIHRoZSBmaXJzdCBjb250ZW50IGxpbmUgKGNmLiBFeGFtcGxlIDguMSlcbiAgICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJ1xcbicsIGRpZFJlYWRDb250ZW50ID8gMSArIGVtcHR5TGluZXMgOiBlbXB0eUxpbmVzKTtcblxuICAgICAgLy8gRW5kIG9mIG1vcmUtaW5kZW50ZWQgYmxvY2suXG4gICAgICB9IGVsc2UgaWYgKGF0TW9yZUluZGVudGVkKSB7XG4gICAgICAgIGF0TW9yZUluZGVudGVkID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBlbXB0eUxpbmVzICsgMSk7XG5cbiAgICAgIC8vIEp1c3Qgb25lIGxpbmUgYnJlYWsgLSBwZXJjZWl2ZSBhcyB0aGUgc2FtZSBsaW5lLlxuICAgICAgfSBlbHNlIGlmIChlbXB0eUxpbmVzID09PSAwKSB7XG4gICAgICAgIGlmIChkaWRSZWFkQ29udGVudCkgeyAvLyBpLmUuIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlYWQgc29tZSBzY2FsYXIgY29udGVudC5cbiAgICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gJyAnO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFNldmVyYWwgbGluZSBicmVha3MgLSBwZXJjZWl2ZSBhcyBkaWZmZXJlbnQgbGluZXMuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnXFxuJywgZW1wdHlMaW5lcyk7XG4gICAgICB9XG5cbiAgICAvLyBMaXRlcmFsIHN0eWxlOiBqdXN0IGFkZCBleGFjdCBudW1iZXIgb2YgbGluZSBicmVha3MgYmV0d2VlbiBjb250ZW50IGxpbmVzLlxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIGFsbCBsaW5lIGJyZWFrcyBleGNlcHQgdGhlIGhlYWRlciBsaW5lIGJyZWFrLlxuICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJ1xcbicsIGRpZFJlYWRDb250ZW50ID8gMSArIGVtcHR5TGluZXMgOiBlbXB0eUxpbmVzKTtcbiAgICB9XG5cbiAgICBkaWRSZWFkQ29udGVudCA9IHRydWU7XG4gICAgZGV0ZWN0ZWRJbmRlbnQgPSB0cnVlO1xuICAgIGVtcHR5TGluZXMgPSAwO1xuICAgIGNhcHR1cmVTdGFydCA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gICAgd2hpbGUgKCFpc19FT0woY2gpICYmIChjaCAhPT0gMCkpIHtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBub2RlSW5kZW50KSB7XG4gIHZhciBfbGluZSxcbiAgICAgIF90YWcgICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIF9hbmNob3IgICA9IHN0YXRlLmFuY2hvcixcbiAgICAgIF9yZXN1bHQgICA9IFtdLFxuICAgICAgZm9sbG93aW5nLFxuICAgICAgZGV0ZWN0ZWQgID0gZmFsc2UsXG4gICAgICBjaDtcblxuICAvLyB0aGVyZSBpcyBhIGxlYWRpbmcgdGFiIGJlZm9yZSB0aGlzIHRva2VuLCBzbyBpdCBjYW4ndCBiZSBhIGJsb2NrIHNlcXVlbmNlL21hcHBpbmc7XG4gIC8vIGl0IGNhbiBzdGlsbCBiZSBmbG93IHNlcXVlbmNlL21hcHBpbmcgb3IgYSBzY2FsYXJcbiAgaWYgKHN0YXRlLmZpcnN0VGFiSW5MaW5lICE9PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IF9yZXN1bHQ7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGlmIChzdGF0ZS5maXJzdFRhYkluTGluZSAhPT0gLTEpIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uID0gc3RhdGUuZmlyc3RUYWJJbkxpbmU7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGFiIGNoYXJhY3RlcnMgbXVzdCBub3QgYmUgdXNlZCBpbiBpbmRlbnRhdGlvbicpO1xuICAgIH1cblxuICAgIGlmIChjaCAhPT0gMHgyRC8qIC0gKi8pIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgIGlmICghaXNfV1NfT1JfRU9MKGZvbGxvd2luZykpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGRldGVjdGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5wb3NpdGlvbisrO1xuXG4gICAgaWYgKHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKSkge1xuICAgICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPD0gbm9kZUluZGVudCkge1xuICAgICAgICBfcmVzdWx0LnB1c2gobnVsbCk7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9saW5lID0gc3RhdGUubGluZTtcbiAgICBjb21wb3NlTm9kZShzdGF0ZSwgbm9kZUluZGVudCwgQ09OVEVYVF9CTE9DS19JTiwgZmFsc2UsIHRydWUpO1xuICAgIF9yZXN1bHQucHVzaChzdGF0ZS5yZXN1bHQpO1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoKHN0YXRlLmxpbmUgPT09IF9saW5lIHx8IHN0YXRlLmxpbmVJbmRlbnQgPiBub2RlSW5kZW50KSAmJiAoY2ggIT09IDApKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnYmFkIGluZGVudGF0aW9uIG9mIGEgc2VxdWVuY2UgZW50cnknKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCBub2RlSW5kZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoZGV0ZWN0ZWQpIHtcbiAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgc3RhdGUua2luZCA9ICdzZXF1ZW5jZSc7XG4gICAgc3RhdGUucmVzdWx0ID0gX3Jlc3VsdDtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja01hcHBpbmcoc3RhdGUsIG5vZGVJbmRlbnQsIGZsb3dJbmRlbnQpIHtcbiAgdmFyIGZvbGxvd2luZyxcbiAgICAgIGFsbG93Q29tcGFjdCxcbiAgICAgIF9saW5lLFxuICAgICAgX2tleUxpbmUsXG4gICAgICBfa2V5TGluZVN0YXJ0LFxuICAgICAgX2tleVBvcyxcbiAgICAgIF90YWcgICAgICAgICAgPSBzdGF0ZS50YWcsXG4gICAgICBfYW5jaG9yICAgICAgID0gc3RhdGUuYW5jaG9yLFxuICAgICAgX3Jlc3VsdCAgICAgICA9IHt9LFxuICAgICAgb3ZlcnJpZGFibGVLZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIGtleVRhZyAgICAgICAgPSBudWxsLFxuICAgICAga2V5Tm9kZSAgICAgICA9IG51bGwsXG4gICAgICB2YWx1ZU5vZGUgICAgID0gbnVsbCxcbiAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZSxcbiAgICAgIGRldGVjdGVkICAgICAgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIC8vIHRoZXJlIGlzIGEgbGVhZGluZyB0YWIgYmVmb3JlIHRoaXMgdG9rZW4sIHNvIGl0IGNhbid0IGJlIGEgYmxvY2sgc2VxdWVuY2UvbWFwcGluZztcbiAgLy8gaXQgY2FuIHN0aWxsIGJlIGZsb3cgc2VxdWVuY2UvbWFwcGluZyBvciBhIHNjYWxhclxuICBpZiAoc3RhdGUuZmlyc3RUYWJJbkxpbmUgIT09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gX3Jlc3VsdDtcbiAgfVxuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgd2hpbGUgKGNoICE9PSAwKSB7XG4gICAgaWYgKCFhdEV4cGxpY2l0S2V5ICYmIHN0YXRlLmZpcnN0VGFiSW5MaW5lICE9PSAtMSkge1xuICAgICAgc3RhdGUucG9zaXRpb24gPSBzdGF0ZS5maXJzdFRhYkluTGluZTtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWIgY2hhcmFjdGVycyBtdXN0IG5vdCBiZSB1c2VkIGluIGluZGVudGF0aW9uJyk7XG4gICAgfVxuXG4gICAgZm9sbG93aW5nID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDEpO1xuICAgIF9saW5lID0gc3RhdGUubGluZTsgLy8gU2F2ZSB0aGUgY3VycmVudCBsaW5lLlxuXG4gICAgLy9cbiAgICAvLyBFeHBsaWNpdCBub3RhdGlvbiBjYXNlLiBUaGVyZSBhcmUgdHdvIHNlcGFyYXRlIGJsb2NrczpcbiAgICAvLyBmaXJzdCBmb3IgdGhlIGtleSAoZGVub3RlZCBieSBcIj9cIikgYW5kIHNlY29uZCBmb3IgdGhlIHZhbHVlIChkZW5vdGVkIGJ5IFwiOlwiKVxuICAgIC8vXG4gICAgaWYgKChjaCA9PT0gMHgzRi8qID8gKi8gfHwgY2ggPT09IDB4M0EvKiA6ICovKSAmJiBpc19XU19PUl9FT0woZm9sbG93aW5nKSkge1xuXG4gICAgICBpZiAoY2ggPT09IDB4M0YvKiA/ICovKSB7XG4gICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgc3RvcmVNYXBwaW5nUGFpcihzdGF0ZSwgX3Jlc3VsdCwgb3ZlcnJpZGFibGVLZXlzLCBrZXlUYWcsIGtleU5vZGUsIG51bGwsIF9rZXlMaW5lLCBfa2V5TGluZVN0YXJ0LCBfa2V5UG9zKTtcbiAgICAgICAgICBrZXlUYWcgPSBrZXlOb2RlID0gdmFsdWVOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRldGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgYXRFeHBsaWNpdEtleSA9IHRydWU7XG4gICAgICAgIGFsbG93Q29tcGFjdCA9IHRydWU7XG5cbiAgICAgIH0gZWxzZSBpZiAoYXRFeHBsaWNpdEtleSkge1xuICAgICAgICAvLyBpLmUuIDB4M0EvKiA6ICovID09PSBjaGFyYWN0ZXIgYWZ0ZXIgdGhlIGV4cGxpY2l0IGtleS5cbiAgICAgICAgYXRFeHBsaWNpdEtleSA9IGZhbHNlO1xuICAgICAgICBhbGxvd0NvbXBhY3QgPSB0cnVlO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnaW5jb21wbGV0ZSBleHBsaWNpdCBtYXBwaW5nIHBhaXI7IGEga2V5IG5vZGUgaXMgbWlzc2VkOyBvciBmb2xsb3dlZCBieSBhIG5vbi10YWJ1bGF0ZWQgZW1wdHkgbGluZScpO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZS5wb3NpdGlvbiArPSAxO1xuICAgICAgY2ggPSBmb2xsb3dpbmc7XG5cbiAgICAvL1xuICAgIC8vIEltcGxpY2l0IG5vdGF0aW9uIGNhc2UuIEZsb3ctc3R5bGUgbm9kZSBhcyB0aGUga2V5IGZpcnN0LCB0aGVuIFwiOlwiLCBhbmQgdGhlIHZhbHVlLlxuICAgIC8vXG4gICAgfSBlbHNlIHtcbiAgICAgIF9rZXlMaW5lID0gc3RhdGUubGluZTtcbiAgICAgIF9rZXlMaW5lU3RhcnQgPSBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBfa2V5UG9zID0gc3RhdGUucG9zaXRpb247XG5cbiAgICAgIGlmICghY29tcG9zZU5vZGUoc3RhdGUsIGZsb3dJbmRlbnQsIENPTlRFWFRfRkxPV19PVVQsIGZhbHNlLCB0cnVlKSkge1xuICAgICAgICAvLyBOZWl0aGVyIGltcGxpY2l0IG5vciBleHBsaWNpdCBub3RhdGlvbi5cbiAgICAgICAgLy8gUmVhZGluZyBpcyBkb25lLiBHbyB0byB0aGUgZXBpbG9ndWUuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUubGluZSA9PT0gX2xpbmUpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICB3aGlsZSAoaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoID09PSAweDNBLyogOiAqLykge1xuICAgICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICAgIGlmICghaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Egd2hpdGVzcGFjZSBjaGFyYWN0ZXIgaXMgZXhwZWN0ZWQgYWZ0ZXIgdGhlIGtleS12YWx1ZSBzZXBhcmF0b3Igd2l0aGluIGEgYmxvY2sgbWFwcGluZycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgICBzdG9yZU1hcHBpbmdQYWlyKHN0YXRlLCBfcmVzdWx0LCBvdmVycmlkYWJsZUtleXMsIGtleVRhZywga2V5Tm9kZSwgbnVsbCwgX2tleUxpbmUsIF9rZXlMaW5lU3RhcnQsIF9rZXlQb3MpO1xuICAgICAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZTtcbiAgICAgICAgICBhbGxvd0NvbXBhY3QgPSBmYWxzZTtcbiAgICAgICAgICBrZXlUYWcgPSBzdGF0ZS50YWc7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcblxuICAgICAgICB9IGVsc2UgaWYgKGRldGVjdGVkKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2NhbiBub3QgcmVhZCBhbiBpbXBsaWNpdCBtYXBwaW5nIHBhaXI7IGEgY29sb24gaXMgbWlzc2VkJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgICAgICAgcmV0dXJuIHRydWU7IC8vIEtlZXAgdGhlIHJlc3VsdCBvZiBgY29tcG9zZU5vZGVgLlxuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoZGV0ZWN0ZWQpIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2NhbiBub3QgcmVhZCBhIGJsb2NrIG1hcHBpbmcgZW50cnk7IGEgbXVsdGlsaW5lIGtleSBtYXkgbm90IGJlIGFuIGltcGxpY2l0IGtleScpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgICBzdGF0ZS5hbmNob3IgPSBfYW5jaG9yO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCB0aGUgcmVzdWx0IG9mIGBjb21wb3NlTm9kZWAuXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBDb21tb24gcmVhZGluZyBjb2RlIGZvciBib3RoIGV4cGxpY2l0IGFuZCBpbXBsaWNpdCBub3RhdGlvbnMuXG4gICAgLy9cbiAgICBpZiAoc3RhdGUubGluZSA9PT0gX2xpbmUgfHwgc3RhdGUubGluZUluZGVudCA+IG5vZGVJbmRlbnQpIHtcbiAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIF9rZXlMaW5lID0gc3RhdGUubGluZTtcbiAgICAgICAgX2tleUxpbmVTdGFydCA9IHN0YXRlLmxpbmVTdGFydDtcbiAgICAgICAgX2tleVBvcyA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfQkxPQ0tfT1VULCB0cnVlLCBhbGxvd0NvbXBhY3QpKSB7XG4gICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsIF9rZXlMaW5lLCBfa2V5TGluZVN0YXJ0LCBfa2V5UG9zKTtcbiAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKChzdGF0ZS5saW5lID09PSBfbGluZSB8fCBzdGF0ZS5saW5lSW5kZW50ID4gbm9kZUluZGVudCkgJiYgKGNoICE9PSAwKSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2JhZCBpbmRlbnRhdGlvbiBvZiBhIG1hcHBpbmcgZW50cnknKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCBub2RlSW5kZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBFcGlsb2d1ZS5cbiAgLy9cblxuICAvLyBTcGVjaWFsIGNhc2U6IGxhc3QgbWFwcGluZydzIG5vZGUgY29udGFpbnMgb25seSB0aGUga2V5IGluIGV4cGxpY2l0IG5vdGF0aW9uLlxuICBpZiAoYXRFeHBsaWNpdEtleSkge1xuICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCBudWxsLCBfa2V5TGluZSwgX2tleUxpbmVTdGFydCwgX2tleVBvcyk7XG4gIH1cblxuICAvLyBFeHBvc2UgdGhlIHJlc3VsdGluZyBtYXBwaW5nLlxuICBpZiAoZGV0ZWN0ZWQpIHtcbiAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgc3RhdGUua2luZCA9ICdtYXBwaW5nJztcbiAgICBzdGF0ZS5yZXN1bHQgPSBfcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIGRldGVjdGVkO1xufVxuXG5mdW5jdGlvbiByZWFkVGFnUHJvcGVydHkoc3RhdGUpIHtcbiAgdmFyIF9wb3NpdGlvbixcbiAgICAgIGlzVmVyYmF0aW0gPSBmYWxzZSxcbiAgICAgIGlzTmFtZWQgICAgPSBmYWxzZSxcbiAgICAgIHRhZ0hhbmRsZSxcbiAgICAgIHRhZ05hbWUsXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCAhPT0gMHgyMS8qICEgKi8pIHJldHVybiBmYWxzZTtcblxuICBpZiAoc3RhdGUudGFnICE9PSBudWxsKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2R1cGxpY2F0aW9uIG9mIGEgdGFnIHByb3BlcnR5Jyk7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoID09PSAweDNDLyogPCAqLykge1xuICAgIGlzVmVyYmF0aW0gPSB0cnVlO1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICB9IGVsc2UgaWYgKGNoID09PSAweDIxLyogISAqLykge1xuICAgIGlzTmFtZWQgPSB0cnVlO1xuICAgIHRhZ0hhbmRsZSA9ICchISc7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gIH0gZWxzZSB7XG4gICAgdGFnSGFuZGxlID0gJyEnO1xuICB9XG5cbiAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgaWYgKGlzVmVyYmF0aW0pIHtcbiAgICBkbyB7IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTsgfVxuICAgIHdoaWxlIChjaCAhPT0gMCAmJiBjaCAhPT0gMHgzRS8qID4gKi8pO1xuXG4gICAgaWYgKHN0YXRlLnBvc2l0aW9uIDwgc3RhdGUubGVuZ3RoKSB7XG4gICAgICB0YWdOYW1lID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmV4cGVjdGVkIGVuZCBvZiB0aGUgc3RyZWFtIHdpdGhpbiBhIHZlcmJhdGltIHRhZycpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzX1dTX09SX0VPTChjaCkpIHtcblxuICAgICAgaWYgKGNoID09PSAweDIxLyogISAqLykge1xuICAgICAgICBpZiAoIWlzTmFtZWQpIHtcbiAgICAgICAgICB0YWdIYW5kbGUgPSBzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24gLSAxLCBzdGF0ZS5wb3NpdGlvbiArIDEpO1xuXG4gICAgICAgICAgaWYgKCFQQVRURVJOX1RBR19IQU5ETEUudGVzdCh0YWdIYW5kbGUpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmFtZWQgdGFnIGhhbmRsZSBjYW5ub3QgY29udGFpbiBzdWNoIGNoYXJhY3RlcnMnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc05hbWVkID0gdHJ1ZTtcbiAgICAgICAgICBfcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbiArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RhZyBzdWZmaXggY2Fubm90IGNvbnRhaW4gZXhjbGFtYXRpb24gbWFya3MnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGFnTmFtZSA9IHN0YXRlLmlucHV0LnNsaWNlKF9wb3NpdGlvbiwgc3RhdGUucG9zaXRpb24pO1xuXG4gICAgaWYgKFBBVFRFUk5fRkxPV19JTkRJQ0FUT1JTLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWcgc3VmZml4IGNhbm5vdCBjb250YWluIGZsb3cgaW5kaWNhdG9yIGNoYXJhY3RlcnMnKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGFnTmFtZSAmJiAhUEFUVEVSTl9UQUdfVVJJLnRlc3QodGFnTmFtZSkpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGFnIG5hbWUgY2Fubm90IGNvbnRhaW4gc3VjaCBjaGFyYWN0ZXJzOiAnICsgdGFnTmFtZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHRhZ05hbWUgPSBkZWNvZGVVUklDb21wb25lbnQodGFnTmFtZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWcgbmFtZSBpcyBtYWxmb3JtZWQ6ICcgKyB0YWdOYW1lKTtcbiAgfVxuXG4gIGlmIChpc1ZlcmJhdGltKSB7XG4gICAgc3RhdGUudGFnID0gdGFnTmFtZTtcblxuICB9IGVsc2UgaWYgKF9oYXNPd25Qcm9wZXJ0eSQxLmNhbGwoc3RhdGUudGFnTWFwLCB0YWdIYW5kbGUpKSB7XG4gICAgc3RhdGUudGFnID0gc3RhdGUudGFnTWFwW3RhZ0hhbmRsZV0gKyB0YWdOYW1lO1xuXG4gIH0gZWxzZSBpZiAodGFnSGFuZGxlID09PSAnIScpIHtcbiAgICBzdGF0ZS50YWcgPSAnIScgKyB0YWdOYW1lO1xuXG4gIH0gZWxzZSBpZiAodGFnSGFuZGxlID09PSAnISEnKSB7XG4gICAgc3RhdGUudGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOicgKyB0YWdOYW1lO1xuXG4gIH0gZWxzZSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZGVjbGFyZWQgdGFnIGhhbmRsZSBcIicgKyB0YWdIYW5kbGUgKyAnXCInKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZWFkQW5jaG9yUHJvcGVydHkoc3RhdGUpIHtcbiAgdmFyIF9wb3NpdGlvbixcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoICE9PSAweDI2LyogJiAqLykgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZHVwbGljYXRpb24gb2YgYW4gYW5jaG9yIHByb3BlcnR5Jyk7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gIF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlIChjaCAhPT0gMCAmJiAhaXNfV1NfT1JfRU9MKGNoKSAmJiAhaXNfRkxPV19JTkRJQ0FUT1IoY2gpKSB7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBfcG9zaXRpb24pIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmFtZSBvZiBhbiBhbmNob3Igbm9kZSBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIGNoYXJhY3RlcicpO1xuICB9XG5cbiAgc3RhdGUuYW5jaG9yID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZWFkQWxpYXMoc3RhdGUpIHtcbiAgdmFyIF9wb3NpdGlvbiwgYWxpYXMsXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCAhPT0gMHgyQS8qICogKi8pIHJldHVybiBmYWxzZTtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gIF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlIChjaCAhPT0gMCAmJiAhaXNfV1NfT1JfRU9MKGNoKSAmJiAhaXNfRkxPV19JTkRJQ0FUT1IoY2gpKSB7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBfcG9zaXRpb24pIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmFtZSBvZiBhbiBhbGlhcyBub2RlIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgY2hhcmFjdGVyJyk7XG4gIH1cblxuICBhbGlhcyA9IHN0YXRlLmlucHV0LnNsaWNlKF9wb3NpdGlvbiwgc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmICghX2hhc093blByb3BlcnR5JDEuY2FsbChzdGF0ZS5hbmNob3JNYXAsIGFsaWFzKSkge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmlkZW50aWZpZWQgYWxpYXMgXCInICsgYWxpYXMgKyAnXCInKTtcbiAgfVxuXG4gIHN0YXRlLnJlc3VsdCA9IHN0YXRlLmFuY2hvck1hcFthbGlhc107XG4gIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VOb2RlKHN0YXRlLCBwYXJlbnRJbmRlbnQsIG5vZGVDb250ZXh0LCBhbGxvd1RvU2VlaywgYWxsb3dDb21wYWN0KSB7XG4gIHZhciBhbGxvd0Jsb2NrU3R5bGVzLFxuICAgICAgYWxsb3dCbG9ja1NjYWxhcnMsXG4gICAgICBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMsXG4gICAgICBpbmRlbnRTdGF0dXMgPSAxLCAvLyAxOiB0aGlzPnBhcmVudCwgMDogdGhpcz1wYXJlbnQsIC0xOiB0aGlzPHBhcmVudFxuICAgICAgYXROZXdMaW5lICA9IGZhbHNlLFxuICAgICAgaGFzQ29udGVudCA9IGZhbHNlLFxuICAgICAgdHlwZUluZGV4LFxuICAgICAgdHlwZVF1YW50aXR5LFxuICAgICAgdHlwZUxpc3QsXG4gICAgICB0eXBlLFxuICAgICAgZmxvd0luZGVudCxcbiAgICAgIGJsb2NrSW5kZW50O1xuXG4gIGlmIChzdGF0ZS5saXN0ZW5lciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmxpc3RlbmVyKCdvcGVuJywgc3RhdGUpO1xuICB9XG5cbiAgc3RhdGUudGFnICAgID0gbnVsbDtcbiAgc3RhdGUuYW5jaG9yID0gbnVsbDtcbiAgc3RhdGUua2luZCAgID0gbnVsbDtcbiAgc3RhdGUucmVzdWx0ID0gbnVsbDtcblxuICBhbGxvd0Jsb2NrU3R5bGVzID0gYWxsb3dCbG9ja1NjYWxhcnMgPSBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMgPVxuICAgIENPTlRFWFRfQkxPQ0tfT1VUID09PSBub2RlQ29udGV4dCB8fFxuICAgIENPTlRFWFRfQkxPQ0tfSU4gID09PSBub2RlQ29udGV4dDtcblxuICBpZiAoYWxsb3dUb1NlZWspIHtcbiAgICBpZiAoc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpKSB7XG4gICAgICBhdE5ld0xpbmUgPSB0cnVlO1xuXG4gICAgICBpZiAoc3RhdGUubGluZUluZGVudCA+IHBhcmVudEluZGVudCkge1xuICAgICAgICBpbmRlbnRTdGF0dXMgPSAxO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50ID09PSBwYXJlbnRJbmRlbnQpIHtcbiAgICAgICAgaW5kZW50U3RhdHVzID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUubGluZUluZGVudCA8IHBhcmVudEluZGVudCkge1xuICAgICAgICBpbmRlbnRTdGF0dXMgPSAtMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaW5kZW50U3RhdHVzID09PSAxKSB7XG4gICAgd2hpbGUgKHJlYWRUYWdQcm9wZXJ0eShzdGF0ZSkgfHwgcmVhZEFuY2hvclByb3BlcnR5KHN0YXRlKSkge1xuICAgICAgaWYgKHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKSkge1xuICAgICAgICBhdE5ld0xpbmUgPSB0cnVlO1xuICAgICAgICBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMgPSBhbGxvd0Jsb2NrU3R5bGVzO1xuXG4gICAgICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID4gcGFyZW50SW5kZW50KSB7XG4gICAgICAgICAgaW5kZW50U3RhdHVzID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50ID09PSBwYXJlbnRJbmRlbnQpIHtcbiAgICAgICAgICBpbmRlbnRTdGF0dXMgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCBwYXJlbnRJbmRlbnQpIHtcbiAgICAgICAgICBpbmRlbnRTdGF0dXMgPSAtMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsb3dCbG9ja0NvbGxlY3Rpb25zID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGFsbG93QmxvY2tDb2xsZWN0aW9ucykge1xuICAgIGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9IGF0TmV3TGluZSB8fCBhbGxvd0NvbXBhY3Q7XG4gIH1cblxuICBpZiAoaW5kZW50U3RhdHVzID09PSAxIHx8IENPTlRFWFRfQkxPQ0tfT1VUID09PSBub2RlQ29udGV4dCkge1xuICAgIGlmIChDT05URVhUX0ZMT1dfSU4gPT09IG5vZGVDb250ZXh0IHx8IENPTlRFWFRfRkxPV19PVVQgPT09IG5vZGVDb250ZXh0KSB7XG4gICAgICBmbG93SW5kZW50ID0gcGFyZW50SW5kZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBmbG93SW5kZW50ID0gcGFyZW50SW5kZW50ICsgMTtcbiAgICB9XG5cbiAgICBibG9ja0luZGVudCA9IHN0YXRlLnBvc2l0aW9uIC0gc3RhdGUubGluZVN0YXJ0O1xuXG4gICAgaWYgKGluZGVudFN0YXR1cyA9PT0gMSkge1xuICAgICAgaWYgKGFsbG93QmxvY2tDb2xsZWN0aW9ucyAmJlxuICAgICAgICAgIChyZWFkQmxvY2tTZXF1ZW5jZShzdGF0ZSwgYmxvY2tJbmRlbnQpIHx8XG4gICAgICAgICAgIHJlYWRCbG9ja01hcHBpbmcoc3RhdGUsIGJsb2NrSW5kZW50LCBmbG93SW5kZW50KSkgfHxcbiAgICAgICAgICByZWFkRmxvd0NvbGxlY3Rpb24oc3RhdGUsIGZsb3dJbmRlbnQpKSB7XG4gICAgICAgIGhhc0NvbnRlbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKChhbGxvd0Jsb2NrU2NhbGFycyAmJiByZWFkQmxvY2tTY2FsYXIoc3RhdGUsIGZsb3dJbmRlbnQpKSB8fFxuICAgICAgICAgICAgcmVhZFNpbmdsZVF1b3RlZFNjYWxhcihzdGF0ZSwgZmxvd0luZGVudCkgfHxcbiAgICAgICAgICAgIHJlYWREb3VibGVRdW90ZWRTY2FsYXIoc3RhdGUsIGZsb3dJbmRlbnQpKSB7XG4gICAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWFkQWxpYXMoc3RhdGUpKSB7XG4gICAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoc3RhdGUudGFnICE9PSBudWxsIHx8IHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2FsaWFzIG5vZGUgc2hvdWxkIG5vdCBoYXZlIGFueSBwcm9wZXJ0aWVzJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAocmVhZFBsYWluU2NhbGFyKHN0YXRlLCBmbG93SW5kZW50LCBDT05URVhUX0ZMT1dfSU4gPT09IG5vZGVDb250ZXh0KSkge1xuICAgICAgICAgIGhhc0NvbnRlbnQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHN0YXRlLnRhZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3RhdGUudGFnID0gJz8nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICAgICAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaW5kZW50U3RhdHVzID09PSAwKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2U6IGJsb2NrIHNlcXVlbmNlcyBhcmUgYWxsb3dlZCB0byBoYXZlIHNhbWUgaW5kZW50YXRpb24gbGV2ZWwgYXMgdGhlIHBhcmVudC5cbiAgICAgIC8vIGh0dHA6Ly93d3cueWFtbC5vcmcvc3BlYy8xLjIvc3BlYy5odG1sI2lkMjc5OTc4NFxuICAgICAgaGFzQ29udGVudCA9IGFsbG93QmxvY2tDb2xsZWN0aW9ucyAmJiByZWFkQmxvY2tTZXF1ZW5jZShzdGF0ZSwgYmxvY2tJbmRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS50YWcgPT09IG51bGwpIHtcbiAgICBpZiAoc3RhdGUuYW5jaG9yICE9PSBudWxsKSB7XG4gICAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IHN0YXRlLnJlc3VsdDtcbiAgICB9XG5cbiAgfSBlbHNlIGlmIChzdGF0ZS50YWcgPT09ICc/Jykge1xuICAgIC8vIEltcGxpY2l0IHJlc29sdmluZyBpcyBub3QgYWxsb3dlZCBmb3Igbm9uLXNjYWxhciB0eXBlcywgYW5kICc/J1xuICAgIC8vIG5vbi1zcGVjaWZpYyB0YWcgaXMgb25seSBhdXRvbWF0aWNhbGx5IGFzc2lnbmVkIHRvIHBsYWluIHNjYWxhcnMuXG4gICAgLy9cbiAgICAvLyBXZSBvbmx5IG5lZWQgdG8gY2hlY2sga2luZCBjb25mb3JtaXR5IGluIGNhc2UgdXNlciBleHBsaWNpdGx5IGFzc2lnbnMgJz8nXG4gICAgLy8gdGFnLCBmb3IgZXhhbXBsZSBsaWtlIHRoaXM6IFwiITw/PiBbMF1cIlxuICAgIC8vXG4gICAgaWYgKHN0YXRlLnJlc3VsdCAhPT0gbnVsbCAmJiBzdGF0ZS5raW5kICE9PSAnc2NhbGFyJykge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuYWNjZXB0YWJsZSBub2RlIGtpbmQgZm9yICE8Pz4gdGFnOyBpdCBzaG91bGQgYmUgXCJzY2FsYXJcIiwgbm90IFwiJyArIHN0YXRlLmtpbmQgKyAnXCInKTtcbiAgICB9XG5cbiAgICBmb3IgKHR5cGVJbmRleCA9IDAsIHR5cGVRdWFudGl0eSA9IHN0YXRlLmltcGxpY2l0VHlwZXMubGVuZ3RoOyB0eXBlSW5kZXggPCB0eXBlUXVhbnRpdHk7IHR5cGVJbmRleCArPSAxKSB7XG4gICAgICB0eXBlID0gc3RhdGUuaW1wbGljaXRUeXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgICBpZiAodHlwZS5yZXNvbHZlKHN0YXRlLnJlc3VsdCkpIHsgLy8gYHN0YXRlLnJlc3VsdGAgdXBkYXRlZCBpbiByZXNvbHZlciBpZiBtYXRjaGVkXG4gICAgICAgIHN0YXRlLnJlc3VsdCA9IHR5cGUuY29uc3RydWN0KHN0YXRlLnJlc3VsdCk7XG4gICAgICAgIHN0YXRlLnRhZyA9IHR5cGUudGFnO1xuICAgICAgICBpZiAoc3RhdGUuYW5jaG9yICE9PSBudWxsKSB7XG4gICAgICAgICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHN0YXRlLnRhZyAhPT0gJyEnKSB7XG4gICAgaWYgKF9oYXNPd25Qcm9wZXJ0eSQxLmNhbGwoc3RhdGUudHlwZU1hcFtzdGF0ZS5raW5kIHx8ICdmYWxsYmFjayddLCBzdGF0ZS50YWcpKSB7XG4gICAgICB0eXBlID0gc3RhdGUudHlwZU1hcFtzdGF0ZS5raW5kIHx8ICdmYWxsYmFjayddW3N0YXRlLnRhZ107XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxvb2tpbmcgZm9yIG11bHRpIHR5cGVcbiAgICAgIHR5cGUgPSBudWxsO1xuICAgICAgdHlwZUxpc3QgPSBzdGF0ZS50eXBlTWFwLm11bHRpW3N0YXRlLmtpbmQgfHwgJ2ZhbGxiYWNrJ107XG5cbiAgICAgIGZvciAodHlwZUluZGV4ID0gMCwgdHlwZVF1YW50aXR5ID0gdHlwZUxpc3QubGVuZ3RoOyB0eXBlSW5kZXggPCB0eXBlUXVhbnRpdHk7IHR5cGVJbmRleCArPSAxKSB7XG4gICAgICAgIGlmIChzdGF0ZS50YWcuc2xpY2UoMCwgdHlwZUxpc3RbdHlwZUluZGV4XS50YWcubGVuZ3RoKSA9PT0gdHlwZUxpc3RbdHlwZUluZGV4XS50YWcpIHtcbiAgICAgICAgICB0eXBlID0gdHlwZUxpc3RbdHlwZUluZGV4XTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdHlwZSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3Vua25vd24gdGFnICE8JyArIHN0YXRlLnRhZyArICc+Jyk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnJlc3VsdCAhPT0gbnVsbCAmJiB0eXBlLmtpbmQgIT09IHN0YXRlLmtpbmQpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmFjY2VwdGFibGUgbm9kZSBraW5kIGZvciAhPCcgKyBzdGF0ZS50YWcgKyAnPiB0YWc7IGl0IHNob3VsZCBiZSBcIicgKyB0eXBlLmtpbmQgKyAnXCIsIG5vdCBcIicgKyBzdGF0ZS5raW5kICsgJ1wiJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlLnJlc29sdmUoc3RhdGUucmVzdWx0LCBzdGF0ZS50YWcpKSB7IC8vIGBzdGF0ZS5yZXN1bHRgIHVwZGF0ZWQgaW4gcmVzb2x2ZXIgaWYgbWF0Y2hlZFxuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Nhbm5vdCByZXNvbHZlIGEgbm9kZSB3aXRoICE8JyArIHN0YXRlLnRhZyArICc+IGV4cGxpY2l0IHRhZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5yZXN1bHQgPSB0eXBlLmNvbnN0cnVjdChzdGF0ZS5yZXN1bHQsIHN0YXRlLnRhZyk7XG4gICAgICBpZiAoc3RhdGUuYW5jaG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gc3RhdGUucmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5saXN0ZW5lciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmxpc3RlbmVyKCdjbG9zZScsIHN0YXRlKTtcbiAgfVxuICByZXR1cm4gc3RhdGUudGFnICE9PSBudWxsIHx8ICBzdGF0ZS5hbmNob3IgIT09IG51bGwgfHwgaGFzQ29udGVudDtcbn1cblxuZnVuY3Rpb24gcmVhZERvY3VtZW50KHN0YXRlKSB7XG4gIHZhciBkb2N1bWVudFN0YXJ0ID0gc3RhdGUucG9zaXRpb24sXG4gICAgICBfcG9zaXRpb24sXG4gICAgICBkaXJlY3RpdmVOYW1lLFxuICAgICAgZGlyZWN0aXZlQXJncyxcbiAgICAgIGhhc0RpcmVjdGl2ZXMgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIHN0YXRlLnZlcnNpb24gPSBudWxsO1xuICBzdGF0ZS5jaGVja0xpbmVCcmVha3MgPSBzdGF0ZS5sZWdhY3k7XG4gIHN0YXRlLnRhZ01hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHN0YXRlLmFuY2hvck1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgd2hpbGUgKChjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pKSAhPT0gMCkge1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoc3RhdGUubGluZUluZGVudCA+IDAgfHwgY2ggIT09IDB4MjUvKiAlICovKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBoYXNEaXJlY3RpdmVzID0gdHJ1ZTtcbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzX1dTX09SX0VPTChjaCkpIHtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBkaXJlY3RpdmVOYW1lID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gICAgZGlyZWN0aXZlQXJncyA9IFtdO1xuXG4gICAgaWYgKGRpcmVjdGl2ZU5hbWUubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2RpcmVjdGl2ZSBuYW1lIG11c3Qgbm90IGJlIGxlc3MgdGhhbiBvbmUgY2hhcmFjdGVyIGluIGxlbmd0aCcpO1xuICAgIH1cblxuICAgIHdoaWxlIChjaCAhPT0gMCkge1xuICAgICAgd2hpbGUgKGlzX1dISVRFX1NQQUNFKGNoKSkge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaCA9PT0gMHgyMy8qICMgKi8pIHtcbiAgICAgICAgZG8geyBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7IH1cbiAgICAgICAgd2hpbGUgKGNoICE9PSAwICYmICFpc19FT0woY2gpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc19FT0woY2gpKSBicmVhaztcblxuICAgICAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgICAgIHdoaWxlIChjaCAhPT0gMCAmJiAhaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGRpcmVjdGl2ZUFyZ3MucHVzaChzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoICE9PSAwKSByZWFkTGluZUJyZWFrKHN0YXRlKTtcblxuICAgIGlmIChfaGFzT3duUHJvcGVydHkkMS5jYWxsKGRpcmVjdGl2ZUhhbmRsZXJzLCBkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgZGlyZWN0aXZlSGFuZGxlcnNbZGlyZWN0aXZlTmFtZV0oc3RhdGUsIGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvd1dhcm5pbmcoc3RhdGUsICd1bmtub3duIGRvY3VtZW50IGRpcmVjdGl2ZSBcIicgKyBkaXJlY3RpdmVOYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gIGlmIChzdGF0ZS5saW5lSW5kZW50ID09PSAwICYmXG4gICAgICBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSAgICAgPT09IDB4MkQvKiAtICovICYmXG4gICAgICBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMSkgPT09IDB4MkQvKiAtICovICYmXG4gICAgICBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMikgPT09IDB4MkQvKiAtICovKSB7XG4gICAgc3RhdGUucG9zaXRpb24gKz0gMztcbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG5cbiAgfSBlbHNlIGlmIChoYXNEaXJlY3RpdmVzKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2RpcmVjdGl2ZXMgZW5kIG1hcmsgaXMgZXhwZWN0ZWQnKTtcbiAgfVxuXG4gIGNvbXBvc2VOb2RlKHN0YXRlLCBzdGF0ZS5saW5lSW5kZW50IC0gMSwgQ09OVEVYVF9CTE9DS19PVVQsIGZhbHNlLCB0cnVlKTtcbiAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gIGlmIChzdGF0ZS5jaGVja0xpbmVCcmVha3MgJiZcbiAgICAgIFBBVFRFUk5fTk9OX0FTQ0lJX0xJTkVfQlJFQUtTLnRlc3Qoc3RhdGUuaW5wdXQuc2xpY2UoZG9jdW1lbnRTdGFydCwgc3RhdGUucG9zaXRpb24pKSkge1xuICAgIHRocm93V2FybmluZyhzdGF0ZSwgJ25vbi1BU0NJSSBsaW5lIGJyZWFrcyBhcmUgaW50ZXJwcmV0ZWQgYXMgY29udGVudCcpO1xuICB9XG5cbiAgc3RhdGUuZG9jdW1lbnRzLnB1c2goc3RhdGUucmVzdWx0KTtcblxuICBpZiAoc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCAmJiB0ZXN0RG9jdW1lbnRTZXBhcmF0b3Ioc3RhdGUpKSB7XG5cbiAgICBpZiAoc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgPT09IDB4MkUvKiAuICovKSB7XG4gICAgICBzdGF0ZS5wb3NpdGlvbiArPSAzO1xuICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoc3RhdGUucG9zaXRpb24gPCAoc3RhdGUubGVuZ3RoIC0gMSkpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZW5kIG9mIHRoZSBzdHJlYW0gb3IgYSBkb2N1bWVudCBzZXBhcmF0b3IgaXMgZXhwZWN0ZWQnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBsb2FkRG9jdW1lbnRzKGlucHV0LCBvcHRpb25zKSB7XG4gIGlucHV0ID0gU3RyaW5nKGlucHV0KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKGlucHV0Lmxlbmd0aCAhPT0gMCkge1xuXG4gICAgLy8gQWRkIHRhaWxpbmcgYFxcbmAgaWYgbm90IGV4aXN0c1xuICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KGlucHV0Lmxlbmd0aCAtIDEpICE9PSAweDBBLyogTEYgKi8gJiZcbiAgICAgICAgaW5wdXQuY2hhckNvZGVBdChpbnB1dC5sZW5ndGggLSAxKSAhPT0gMHgwRC8qIENSICovKSB7XG4gICAgICBpbnB1dCArPSAnXFxuJztcbiAgICB9XG5cbiAgICAvLyBTdHJpcCBCT01cbiAgICBpZiAoaW5wdXQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgICBpbnB1dCA9IGlucHV0LnNsaWNlKDEpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZSQxKGlucHV0LCBvcHRpb25zKTtcblxuICB2YXIgbnVsbHBvcyA9IGlucHV0LmluZGV4T2YoJ1xcMCcpO1xuXG4gIGlmIChudWxscG9zICE9PSAtMSkge1xuICAgIHN0YXRlLnBvc2l0aW9uID0gbnVsbHBvcztcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbnVsbCBieXRlIGlzIG5vdCBhbGxvd2VkIGluIGlucHV0Jyk7XG4gIH1cblxuICAvLyBVc2UgMCBhcyBzdHJpbmcgdGVybWluYXRvci4gVGhhdCBzaWduaWZpY2FudGx5IHNpbXBsaWZpZXMgYm91bmRzIGNoZWNrLlxuICBzdGF0ZS5pbnB1dCArPSAnXFwwJztcblxuICB3aGlsZSAoc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgPT09IDB4MjAvKiBTcGFjZSAqLykge1xuICAgIHN0YXRlLmxpbmVJbmRlbnQgKz0gMTtcbiAgICBzdGF0ZS5wb3NpdGlvbiArPSAxO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLnBvc2l0aW9uIDwgKHN0YXRlLmxlbmd0aCAtIDEpKSB7XG4gICAgcmVhZERvY3VtZW50KHN0YXRlKTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZS5kb2N1bWVudHM7XG59XG5cblxuZnVuY3Rpb24gbG9hZEFsbCQxKGlucHV0LCBpdGVyYXRvciwgb3B0aW9ucykge1xuICBpZiAoaXRlcmF0b3IgIT09IG51bGwgJiYgdHlwZW9mIGl0ZXJhdG9yID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0gaXRlcmF0b3I7XG4gICAgaXRlcmF0b3IgPSBudWxsO1xuICB9XG5cbiAgdmFyIGRvY3VtZW50cyA9IGxvYWREb2N1bWVudHMoaW5wdXQsIG9wdGlvbnMpO1xuXG4gIGlmICh0eXBlb2YgaXRlcmF0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZG9jdW1lbnRzO1xuICB9XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBkb2N1bWVudHMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGl0ZXJhdG9yKGRvY3VtZW50c1tpbmRleF0pO1xuICB9XG59XG5cblxuZnVuY3Rpb24gbG9hZCQxKGlucHV0LCBvcHRpb25zKSB7XG4gIHZhciBkb2N1bWVudHMgPSBsb2FkRG9jdW1lbnRzKGlucHV0LCBvcHRpb25zKTtcblxuICBpZiAoZG9jdW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkKi9cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnRzWzBdO1xuICB9XG4gIHRocm93IG5ldyBleGNlcHRpb24oJ2V4cGVjdGVkIGEgc2luZ2xlIGRvY3VtZW50IGluIHRoZSBzdHJlYW0sIGJ1dCBmb3VuZCBtb3JlJyk7XG59XG5cblxudmFyIGxvYWRBbGxfMSA9IGxvYWRBbGwkMTtcbnZhciBsb2FkXzEgICAgPSBsb2FkJDE7XG5cbnZhciBsb2FkZXIgPSB7XG5cdGxvYWRBbGw6IGxvYWRBbGxfMSxcblx0bG9hZDogbG9hZF8xXG59O1xuXG4vKmVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lKi9cblxuXG5cblxuXG52YXIgX3RvU3RyaW5nICAgICAgID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgQ0hBUl9CT00gICAgICAgICAgICAgICAgICA9IDB4RkVGRjtcbnZhciBDSEFSX1RBQiAgICAgICAgICAgICAgICAgID0gMHgwOTsgLyogVGFiICovXG52YXIgQ0hBUl9MSU5FX0ZFRUQgICAgICAgICAgICA9IDB4MEE7IC8qIExGICovXG52YXIgQ0hBUl9DQVJSSUFHRV9SRVRVUk4gICAgICA9IDB4MEQ7IC8qIENSICovXG52YXIgQ0hBUl9TUEFDRSAgICAgICAgICAgICAgICA9IDB4MjA7IC8qIFNwYWNlICovXG52YXIgQ0hBUl9FWENMQU1BVElPTiAgICAgICAgICA9IDB4MjE7IC8qICEgKi9cbnZhciBDSEFSX0RPVUJMRV9RVU9URSAgICAgICAgID0gMHgyMjsgLyogXCIgKi9cbnZhciBDSEFSX1NIQVJQICAgICAgICAgICAgICAgID0gMHgyMzsgLyogIyAqL1xudmFyIENIQVJfUEVSQ0VOVCAgICAgICAgICAgICAgPSAweDI1OyAvKiAlICovXG52YXIgQ0hBUl9BTVBFUlNBTkQgICAgICAgICAgICA9IDB4MjY7IC8qICYgKi9cbnZhciBDSEFSX1NJTkdMRV9RVU9URSAgICAgICAgID0gMHgyNzsgLyogJyAqL1xudmFyIENIQVJfQVNURVJJU0sgICAgICAgICAgICAgPSAweDJBOyAvKiAqICovXG52YXIgQ0hBUl9DT01NQSAgICAgICAgICAgICAgICA9IDB4MkM7IC8qICwgKi9cbnZhciBDSEFSX01JTlVTICAgICAgICAgICAgICAgID0gMHgyRDsgLyogLSAqL1xudmFyIENIQVJfQ09MT04gICAgICAgICAgICAgICAgPSAweDNBOyAvKiA6ICovXG52YXIgQ0hBUl9FUVVBTFMgICAgICAgICAgICAgICA9IDB4M0Q7IC8qID0gKi9cbnZhciBDSEFSX0dSRUFURVJfVEhBTiAgICAgICAgID0gMHgzRTsgLyogPiAqL1xudmFyIENIQVJfUVVFU1RJT04gICAgICAgICAgICAgPSAweDNGOyAvKiA/ICovXG52YXIgQ0hBUl9DT01NRVJDSUFMX0FUICAgICAgICA9IDB4NDA7IC8qIEAgKi9cbnZhciBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQgID0gMHg1QjsgLyogWyAqL1xudmFyIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQgPSAweDVEOyAvKiBdICovXG52YXIgQ0hBUl9HUkFWRV9BQ0NFTlQgICAgICAgICA9IDB4NjA7IC8qIGAgKi9cbnZhciBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0tFVCAgID0gMHg3QjsgLyogeyAqL1xudmFyIENIQVJfVkVSVElDQUxfTElORSAgICAgICAgPSAweDdDOyAvKiB8ICovXG52YXIgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDS0VUICA9IDB4N0Q7IC8qIH0gKi9cblxudmFyIEVTQ0FQRV9TRVFVRU5DRVMgPSB7fTtcblxuRVNDQVBFX1NFUVVFTkNFU1sweDAwXSAgID0gJ1xcXFwwJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwN10gICA9ICdcXFxcYSc7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MDhdICAgPSAnXFxcXGInO1xuRVNDQVBFX1NFUVVFTkNFU1sweDA5XSAgID0gJ1xcXFx0JztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwQV0gICA9ICdcXFxcbic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MEJdICAgPSAnXFxcXHYnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDBDXSAgID0gJ1xcXFxmJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwRF0gICA9ICdcXFxccic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MUJdICAgPSAnXFxcXGUnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDIyXSAgID0gJ1xcXFxcIic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4NUNdICAgPSAnXFxcXFxcXFwnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDg1XSAgID0gJ1xcXFxOJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHhBMF0gICA9ICdcXFxcXyc7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MjAyOF0gPSAnXFxcXEwnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDIwMjldID0gJ1xcXFxQJztcblxudmFyIERFUFJFQ0FURURfQk9PTEVBTlNfU1lOVEFYID0gW1xuICAneScsICdZJywgJ3llcycsICdZZXMnLCAnWUVTJywgJ29uJywgJ09uJywgJ09OJyxcbiAgJ24nLCAnTicsICdubycsICdObycsICdOTycsICdvZmYnLCAnT2ZmJywgJ09GRidcbl07XG5cbnZhciBERVBSRUNBVEVEX0JBU0U2MF9TWU5UQVggPSAvXlstK10/WzAtOV9dKyg/OjpbMC05X10rKSsoPzpcXC5bMC05X10qKT8kLztcblxuZnVuY3Rpb24gY29tcGlsZVN0eWxlTWFwKHNjaGVtYSwgbWFwKSB7XG4gIHZhciByZXN1bHQsIGtleXMsIGluZGV4LCBsZW5ndGgsIHRhZywgc3R5bGUsIHR5cGU7XG5cbiAgaWYgKG1hcCA9PT0gbnVsbCkgcmV0dXJuIHt9O1xuXG4gIHJlc3VsdCA9IHt9O1xuICBrZXlzID0gT2JqZWN0LmtleXMobWFwKTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdGFnID0ga2V5c1tpbmRleF07XG4gICAgc3R5bGUgPSBTdHJpbmcobWFwW3RhZ10pO1xuXG4gICAgaWYgKHRhZy5zbGljZSgwLCAyKSA9PT0gJyEhJykge1xuICAgICAgdGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOicgKyB0YWcuc2xpY2UoMik7XG4gICAgfVxuICAgIHR5cGUgPSBzY2hlbWEuY29tcGlsZWRUeXBlTWFwWydmYWxsYmFjayddW3RhZ107XG5cbiAgICBpZiAodHlwZSAmJiBfaGFzT3duUHJvcGVydHkuY2FsbCh0eXBlLnN0eWxlQWxpYXNlcywgc3R5bGUpKSB7XG4gICAgICBzdHlsZSA9IHR5cGUuc3R5bGVBbGlhc2VzW3N0eWxlXTtcbiAgICB9XG5cbiAgICByZXN1bHRbdGFnXSA9IHN0eWxlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZW5jb2RlSGV4KGNoYXJhY3Rlcikge1xuICB2YXIgc3RyaW5nLCBoYW5kbGUsIGxlbmd0aDtcblxuICBzdHJpbmcgPSBjaGFyYWN0ZXIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cbiAgaWYgKGNoYXJhY3RlciA8PSAweEZGKSB7XG4gICAgaGFuZGxlID0gJ3gnO1xuICAgIGxlbmd0aCA9IDI7XG4gIH0gZWxzZSBpZiAoY2hhcmFjdGVyIDw9IDB4RkZGRikge1xuICAgIGhhbmRsZSA9ICd1JztcbiAgICBsZW5ndGggPSA0O1xuICB9IGVsc2UgaWYgKGNoYXJhY3RlciA8PSAweEZGRkZGRkZGKSB7XG4gICAgaGFuZGxlID0gJ1UnO1xuICAgIGxlbmd0aCA9IDg7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IGV4Y2VwdGlvbignY29kZSBwb2ludCB3aXRoaW4gYSBzdHJpbmcgbWF5IG5vdCBiZSBncmVhdGVyIHRoYW4gMHhGRkZGRkZGRicpO1xuICB9XG5cbiAgcmV0dXJuICdcXFxcJyArIGhhbmRsZSArIGNvbW1vbi5yZXBlYXQoJzAnLCBsZW5ndGggLSBzdHJpbmcubGVuZ3RoKSArIHN0cmluZztcbn1cblxuXG52YXIgUVVPVElOR19UWVBFX1NJTkdMRSA9IDEsXG4gICAgUVVPVElOR19UWVBFX0RPVUJMRSA9IDI7XG5cbmZ1bmN0aW9uIFN0YXRlKG9wdGlvbnMpIHtcbiAgdGhpcy5zY2hlbWEgICAgICAgID0gb3B0aW9uc1snc2NoZW1hJ10gfHwgX2RlZmF1bHQ7XG4gIHRoaXMuaW5kZW50ICAgICAgICA9IE1hdGgubWF4KDEsIChvcHRpb25zWydpbmRlbnQnXSB8fCAyKSk7XG4gIHRoaXMubm9BcnJheUluZGVudCA9IG9wdGlvbnNbJ25vQXJyYXlJbmRlbnQnXSB8fCBmYWxzZTtcbiAgdGhpcy5za2lwSW52YWxpZCAgID0gb3B0aW9uc1snc2tpcEludmFsaWQnXSB8fCBmYWxzZTtcbiAgdGhpcy5mbG93TGV2ZWwgICAgID0gKGNvbW1vbi5pc05vdGhpbmcob3B0aW9uc1snZmxvd0xldmVsJ10pID8gLTEgOiBvcHRpb25zWydmbG93TGV2ZWwnXSk7XG4gIHRoaXMuc3R5bGVNYXAgICAgICA9IGNvbXBpbGVTdHlsZU1hcCh0aGlzLnNjaGVtYSwgb3B0aW9uc1snc3R5bGVzJ10gfHwgbnVsbCk7XG4gIHRoaXMuc29ydEtleXMgICAgICA9IG9wdGlvbnNbJ3NvcnRLZXlzJ10gfHwgZmFsc2U7XG4gIHRoaXMubGluZVdpZHRoICAgICA9IG9wdGlvbnNbJ2xpbmVXaWR0aCddIHx8IDgwO1xuICB0aGlzLm5vUmVmcyAgICAgICAgPSBvcHRpb25zWydub1JlZnMnXSB8fCBmYWxzZTtcbiAgdGhpcy5ub0NvbXBhdE1vZGUgID0gb3B0aW9uc1snbm9Db21wYXRNb2RlJ10gfHwgZmFsc2U7XG4gIHRoaXMuY29uZGVuc2VGbG93ICA9IG9wdGlvbnNbJ2NvbmRlbnNlRmxvdyddIHx8IGZhbHNlO1xuICB0aGlzLnF1b3RpbmdUeXBlICAgPSBvcHRpb25zWydxdW90aW5nVHlwZSddID09PSAnXCInID8gUVVPVElOR19UWVBFX0RPVUJMRSA6IFFVT1RJTkdfVFlQRV9TSU5HTEU7XG4gIHRoaXMuZm9yY2VRdW90ZXMgICA9IG9wdGlvbnNbJ2ZvcmNlUXVvdGVzJ10gfHwgZmFsc2U7XG4gIHRoaXMucmVwbGFjZXIgICAgICA9IHR5cGVvZiBvcHRpb25zWydyZXBsYWNlciddID09PSAnZnVuY3Rpb24nID8gb3B0aW9uc1sncmVwbGFjZXInXSA6IG51bGw7XG5cbiAgdGhpcy5pbXBsaWNpdFR5cGVzID0gdGhpcy5zY2hlbWEuY29tcGlsZWRJbXBsaWNpdDtcbiAgdGhpcy5leHBsaWNpdFR5cGVzID0gdGhpcy5zY2hlbWEuY29tcGlsZWRFeHBsaWNpdDtcblxuICB0aGlzLnRhZyA9IG51bGw7XG4gIHRoaXMucmVzdWx0ID0gJyc7XG5cbiAgdGhpcy5kdXBsaWNhdGVzID0gW107XG4gIHRoaXMudXNlZER1cGxpY2F0ZXMgPSBudWxsO1xufVxuXG4vLyBJbmRlbnRzIGV2ZXJ5IGxpbmUgaW4gYSBzdHJpbmcuIEVtcHR5IGxpbmVzIChcXG4gb25seSkgYXJlIG5vdCBpbmRlbnRlZC5cbmZ1bmN0aW9uIGluZGVudFN0cmluZyhzdHJpbmcsIHNwYWNlcykge1xuICB2YXIgaW5kID0gY29tbW9uLnJlcGVhdCgnICcsIHNwYWNlcyksXG4gICAgICBwb3NpdGlvbiA9IDAsXG4gICAgICBuZXh0ID0gLTEsXG4gICAgICByZXN1bHQgPSAnJyxcbiAgICAgIGxpbmUsXG4gICAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHdoaWxlIChwb3NpdGlvbiA8IGxlbmd0aCkge1xuICAgIG5leHQgPSBzdHJpbmcuaW5kZXhPZignXFxuJywgcG9zaXRpb24pO1xuICAgIGlmIChuZXh0ID09PSAtMSkge1xuICAgICAgbGluZSA9IHN0cmluZy5zbGljZShwb3NpdGlvbik7XG4gICAgICBwb3NpdGlvbiA9IGxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGluZSA9IHN0cmluZy5zbGljZShwb3NpdGlvbiwgbmV4dCArIDEpO1xuICAgICAgcG9zaXRpb24gPSBuZXh0ICsgMTtcbiAgICB9XG5cbiAgICBpZiAobGluZS5sZW5ndGggJiYgbGluZSAhPT0gJ1xcbicpIHJlc3VsdCArPSBpbmQ7XG5cbiAgICByZXN1bHQgKz0gbGluZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKSB7XG4gIHJldHVybiAnXFxuJyArIGNvbW1vbi5yZXBlYXQoJyAnLCBzdGF0ZS5pbmRlbnQgKiBsZXZlbCk7XG59XG5cbmZ1bmN0aW9uIHRlc3RJbXBsaWNpdFJlc29sdmluZyhzdGF0ZSwgc3RyKSB7XG4gIHZhciBpbmRleCwgbGVuZ3RoLCB0eXBlO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBzdGF0ZS5pbXBsaWNpdFR5cGVzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICB0eXBlID0gc3RhdGUuaW1wbGljaXRUeXBlc1tpbmRleF07XG5cbiAgICBpZiAodHlwZS5yZXNvbHZlKHN0cikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gWzMzXSBzLXdoaXRlIDo6PSBzLXNwYWNlIHwgcy10YWJcbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjKSB7XG4gIHJldHVybiBjID09PSBDSEFSX1NQQUNFIHx8IGMgPT09IENIQVJfVEFCO1xufVxuXG4vLyBSZXR1cm5zIHRydWUgaWYgdGhlIGNoYXJhY3RlciBjYW4gYmUgcHJpbnRlZCB3aXRob3V0IGVzY2FwaW5nLlxuLy8gRnJvbSBZQU1MIDEuMjogXCJhbnkgYWxsb3dlZCBjaGFyYWN0ZXJzIGtub3duIHRvIGJlIG5vbi1wcmludGFibGVcbi8vIHNob3VsZCBhbHNvIGJlIGVzY2FwZWQuIFtIb3dldmVyLF0gVGhpcyBpc25cdTIwMTl0IG1hbmRhdG9yeVwiXG4vLyBEZXJpdmVkIGZyb20gbmItY2hhciAtIFxcdCAtICN4ODUgLSAjeEEwIC0gI3gyMDI4IC0gI3gyMDI5LlxuZnVuY3Rpb24gaXNQcmludGFibGUoYykge1xuICByZXR1cm4gICgweDAwMDIwIDw9IGMgJiYgYyA8PSAweDAwMDA3RSlcbiAgICAgIHx8ICgoMHgwMDBBMSA8PSBjICYmIGMgPD0gMHgwMEQ3RkYpICYmIGMgIT09IDB4MjAyOCAmJiBjICE9PSAweDIwMjkpXG4gICAgICB8fCAoKDB4MEUwMDAgPD0gYyAmJiBjIDw9IDB4MDBGRkZEKSAmJiBjICE9PSBDSEFSX0JPTSlcbiAgICAgIHx8ICAoMHgxMDAwMCA8PSBjICYmIGMgPD0gMHgxMEZGRkYpO1xufVxuXG4vLyBbMzRdIG5zLWNoYXIgOjo9IG5iLWNoYXIgLSBzLXdoaXRlXG4vLyBbMjddIG5iLWNoYXIgOjo9IGMtcHJpbnRhYmxlIC0gYi1jaGFyIC0gYy1ieXRlLW9yZGVyLW1hcmtcbi8vIFsyNl0gYi1jaGFyICA6Oj0gYi1saW5lLWZlZWQgfCBiLWNhcnJpYWdlLXJldHVyblxuLy8gSW5jbHVkaW5nIHMtd2hpdGUgKGZvciBzb21lIHJlYXNvbiwgZXhhbXBsZXMgZG9lc24ndCBtYXRjaCBzcGVjcyBpbiB0aGlzIGFzcGVjdClcbi8vIG5zLWNoYXIgOjo9IGMtcHJpbnRhYmxlIC0gYi1saW5lLWZlZWQgLSBiLWNhcnJpYWdlLXJldHVybiAtIGMtYnl0ZS1vcmRlci1tYXJrXG5mdW5jdGlvbiBpc05zQ2hhck9yV2hpdGVzcGFjZShjKSB7XG4gIHJldHVybiBpc1ByaW50YWJsZShjKVxuICAgICYmIGMgIT09IENIQVJfQk9NXG4gICAgLy8gLSBiLWNoYXJcbiAgICAmJiBjICE9PSBDSEFSX0NBUlJJQUdFX1JFVFVSTlxuICAgICYmIGMgIT09IENIQVJfTElORV9GRUVEO1xufVxuXG4vLyBbMTI3XSAgbnMtcGxhaW4tc2FmZShjKSA6Oj0gYyA9IGZsb3ctb3V0ICBcdTIxRDIgbnMtcGxhaW4tc2FmZS1vdXRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gZmxvdy1pbiAgIFx1MjFEMiBucy1wbGFpbi1zYWZlLWluXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGJsb2NrLWtleSBcdTIxRDIgbnMtcGxhaW4tc2FmZS1vdXRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gZmxvdy1rZXkgIFx1MjFEMiBucy1wbGFpbi1zYWZlLWluXG4vLyBbMTI4XSBucy1wbGFpbi1zYWZlLW91dCA6Oj0gbnMtY2hhclxuLy8gWzEyOV0gIG5zLXBsYWluLXNhZmUtaW4gOjo9IG5zLWNoYXIgLSBjLWZsb3ctaW5kaWNhdG9yXG4vLyBbMTMwXSAgbnMtcGxhaW4tY2hhcihjKSA6Oj0gICggbnMtcGxhaW4tc2FmZShjKSAtIFx1MjAxQzpcdTIwMUQgLSBcdTIwMUMjXHUyMDFEIClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKCAvKiBBbiBucy1jaGFyIHByZWNlZGluZyAqLyBcdTIwMUMjXHUyMDFEIClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKCBcdTIwMUM6XHUyMDFEIC8qIEZvbGxvd2VkIGJ5IGFuIG5zLXBsYWluLXNhZmUoYykgKi8gKVxuZnVuY3Rpb24gaXNQbGFpblNhZmUoYywgcHJldiwgaW5ibG9jaykge1xuICB2YXIgY0lzTnNDaGFyT3JXaGl0ZXNwYWNlID0gaXNOc0NoYXJPcldoaXRlc3BhY2UoYyk7XG4gIHZhciBjSXNOc0NoYXIgPSBjSXNOc0NoYXJPcldoaXRlc3BhY2UgJiYgIWlzV2hpdGVzcGFjZShjKTtcbiAgcmV0dXJuIChcbiAgICAvLyBucy1wbGFpbi1zYWZlXG4gICAgaW5ibG9jayA/IC8vIGMgPSBmbG93LWluXG4gICAgICBjSXNOc0NoYXJPcldoaXRlc3BhY2VcbiAgICAgIDogY0lzTnNDaGFyT3JXaGl0ZXNwYWNlXG4gICAgICAgIC8vIC0gYy1mbG93LWluZGljYXRvclxuICAgICAgICAmJiBjICE9PSBDSEFSX0NPTU1BXG4gICAgICAgICYmIGMgIT09IENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVFxuICAgICAgICAmJiBjICE9PSBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUXG4gICAgICAgICYmIGMgIT09IENIQVJfTEVGVF9DVVJMWV9CUkFDS0VUXG4gICAgICAgICYmIGMgIT09IENIQVJfUklHSFRfQ1VSTFlfQlJBQ0tFVFxuICApXG4gICAgLy8gbnMtcGxhaW4tY2hhclxuICAgICYmIGMgIT09IENIQVJfU0hBUlAgLy8gZmFsc2Ugb24gJyMnXG4gICAgJiYgIShwcmV2ID09PSBDSEFSX0NPTE9OICYmICFjSXNOc0NoYXIpIC8vIGZhbHNlIG9uICc6ICdcbiAgICB8fCAoaXNOc0NoYXJPcldoaXRlc3BhY2UocHJldikgJiYgIWlzV2hpdGVzcGFjZShwcmV2KSAmJiBjID09PSBDSEFSX1NIQVJQKSAvLyBjaGFuZ2UgdG8gdHJ1ZSBvbiAnW14gXSMnXG4gICAgfHwgKHByZXYgPT09IENIQVJfQ09MT04gJiYgY0lzTnNDaGFyKTsgLy8gY2hhbmdlIHRvIHRydWUgb24gJzpbXiBdJ1xufVxuXG4vLyBTaW1wbGlmaWVkIHRlc3QgZm9yIHZhbHVlcyBhbGxvd2VkIGFzIHRoZSBmaXJzdCBjaGFyYWN0ZXIgaW4gcGxhaW4gc3R5bGUuXG5mdW5jdGlvbiBpc1BsYWluU2FmZUZpcnN0KGMpIHtcbiAgLy8gVXNlcyBhIHN1YnNldCBvZiBucy1jaGFyIC0gYy1pbmRpY2F0b3JcbiAgLy8gd2hlcmUgbnMtY2hhciA9IG5iLWNoYXIgLSBzLXdoaXRlLlxuICAvLyBObyBzdXBwb3J0IG9mICggKCBcdTIwMUM/XHUyMDFEIHwgXHUyMDFDOlx1MjAxRCB8IFx1MjAxQy1cdTIwMUQgKSAvKiBGb2xsb3dlZCBieSBhbiBucy1wbGFpbi1zYWZlKGMpKSAqLyApIHBhcnRcbiAgcmV0dXJuIGlzUHJpbnRhYmxlKGMpICYmIGMgIT09IENIQVJfQk9NXG4gICAgJiYgIWlzV2hpdGVzcGFjZShjKSAvLyAtIHMtd2hpdGVcbiAgICAvLyAtIChjLWluZGljYXRvciA6Oj1cbiAgICAvLyBcdTIwMUMtXHUyMDFEIHwgXHUyMDFDP1x1MjAxRCB8IFx1MjAxQzpcdTIwMUQgfCBcdTIwMUMsXHUyMDFEIHwgXHUyMDFDW1x1MjAxRCB8IFx1MjAxQ11cdTIwMUQgfCBcdTIwMUN7XHUyMDFEIHwgXHUyMDFDfVx1MjAxRFxuICAgICYmIGMgIT09IENIQVJfTUlOVVNcbiAgICAmJiBjICE9PSBDSEFSX1FVRVNUSU9OXG4gICAgJiYgYyAhPT0gQ0hBUl9DT0xPTlxuICAgICYmIGMgIT09IENIQVJfQ09NTUFcbiAgICAmJiBjICE9PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVRcbiAgICAmJiBjICE9PSBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUXG4gICAgJiYgYyAhPT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNLRVRcbiAgICAmJiBjICE9PSBDSEFSX1JJR0hUX0NVUkxZX0JSQUNLRVRcbiAgICAvLyB8IFx1MjAxQyNcdTIwMUQgfCBcdTIwMUMmXHUyMDFEIHwgXHUyMDFDKlx1MjAxRCB8IFx1MjAxQyFcdTIwMUQgfCBcdTIwMUN8XHUyMDFEIHwgXHUyMDFDPVx1MjAxRCB8IFx1MjAxQz5cdTIwMUQgfCBcdTIwMUMnXHUyMDFEIHwgXHUyMDFDXCJcdTIwMURcbiAgICAmJiBjICE9PSBDSEFSX1NIQVJQXG4gICAgJiYgYyAhPT0gQ0hBUl9BTVBFUlNBTkRcbiAgICAmJiBjICE9PSBDSEFSX0FTVEVSSVNLXG4gICAgJiYgYyAhPT0gQ0hBUl9FWENMQU1BVElPTlxuICAgICYmIGMgIT09IENIQVJfVkVSVElDQUxfTElORVxuICAgICYmIGMgIT09IENIQVJfRVFVQUxTXG4gICAgJiYgYyAhPT0gQ0hBUl9HUkVBVEVSX1RIQU5cbiAgICAmJiBjICE9PSBDSEFSX1NJTkdMRV9RVU9URVxuICAgICYmIGMgIT09IENIQVJfRE9VQkxFX1FVT1RFXG4gICAgLy8gfCBcdTIwMUMlXHUyMDFEIHwgXHUyMDFDQFx1MjAxRCB8IFx1MjAxQ2BcdTIwMUQpXG4gICAgJiYgYyAhPT0gQ0hBUl9QRVJDRU5UXG4gICAgJiYgYyAhPT0gQ0hBUl9DT01NRVJDSUFMX0FUXG4gICAgJiYgYyAhPT0gQ0hBUl9HUkFWRV9BQ0NFTlQ7XG59XG5cbi8vIFNpbXBsaWZpZWQgdGVzdCBmb3IgdmFsdWVzIGFsbG93ZWQgYXMgdGhlIGxhc3QgY2hhcmFjdGVyIGluIHBsYWluIHN0eWxlLlxuZnVuY3Rpb24gaXNQbGFpblNhZmVMYXN0KGMpIHtcbiAgLy8ganVzdCBub3Qgd2hpdGVzcGFjZSBvciBjb2xvbiwgaXQgd2lsbCBiZSBjaGVja2VkIHRvIGJlIHBsYWluIGNoYXJhY3RlciBsYXRlclxuICByZXR1cm4gIWlzV2hpdGVzcGFjZShjKSAmJiBjICE9PSBDSEFSX0NPTE9OO1xufVxuXG4vLyBTYW1lIGFzICdzdHJpbmcnLmNvZGVQb2ludEF0KHBvcyksIGJ1dCB3b3JrcyBpbiBvbGRlciBicm93c2Vycy5cbmZ1bmN0aW9uIGNvZGVQb2ludEF0KHN0cmluZywgcG9zKSB7XG4gIHZhciBmaXJzdCA9IHN0cmluZy5jaGFyQ29kZUF0KHBvcyksIHNlY29uZDtcbiAgaWYgKGZpcnN0ID49IDB4RDgwMCAmJiBmaXJzdCA8PSAweERCRkYgJiYgcG9zICsgMSA8IHN0cmluZy5sZW5ndGgpIHtcbiAgICBzZWNvbmQgPSBzdHJpbmcuY2hhckNvZGVBdChwb3MgKyAxKTtcbiAgICBpZiAoc2Vjb25kID49IDB4REMwMCAmJiBzZWNvbmQgPD0gMHhERkZGKSB7XG4gICAgICAvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcbiAgICAgIHJldHVybiAoZmlyc3QgLSAweEQ4MDApICogMHg0MDAgKyBzZWNvbmQgLSAweERDMDAgKyAweDEwMDAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmlyc3Q7XG59XG5cbi8vIERldGVybWluZXMgd2hldGhlciBibG9jayBpbmRlbnRhdGlvbiBpbmRpY2F0b3IgaXMgcmVxdWlyZWQuXG5mdW5jdGlvbiBuZWVkSW5kZW50SW5kaWNhdG9yKHN0cmluZykge1xuICB2YXIgbGVhZGluZ1NwYWNlUmUgPSAvXlxcbiogLztcbiAgcmV0dXJuIGxlYWRpbmdTcGFjZVJlLnRlc3Qoc3RyaW5nKTtcbn1cblxudmFyIFNUWUxFX1BMQUlOICAgPSAxLFxuICAgIFNUWUxFX1NJTkdMRSAgPSAyLFxuICAgIFNUWUxFX0xJVEVSQUwgPSAzLFxuICAgIFNUWUxFX0ZPTERFRCAgPSA0LFxuICAgIFNUWUxFX0RPVUJMRSAgPSA1O1xuXG4vLyBEZXRlcm1pbmVzIHdoaWNoIHNjYWxhciBzdHlsZXMgYXJlIHBvc3NpYmxlIGFuZCByZXR1cm5zIHRoZSBwcmVmZXJyZWQgc3R5bGUuXG4vLyBsaW5lV2lkdGggPSAtMSA9PiBubyBsaW1pdC5cbi8vIFByZS1jb25kaXRpb25zOiBzdHIubGVuZ3RoID4gMC5cbi8vIFBvc3QtY29uZGl0aW9uczpcbi8vICAgIFNUWUxFX1BMQUlOIG9yIFNUWUxFX1NJTkdMRSA9PiBubyBcXG4gYXJlIGluIHRoZSBzdHJpbmcuXG4vLyAgICBTVFlMRV9MSVRFUkFMID0+IG5vIGxpbmVzIGFyZSBzdWl0YWJsZSBmb3IgZm9sZGluZyAob3IgbGluZVdpZHRoIGlzIC0xKS5cbi8vICAgIFNUWUxFX0ZPTERFRCA9PiBhIGxpbmUgPiBsaW5lV2lkdGggYW5kIGNhbiBiZSBmb2xkZWQgKGFuZCBsaW5lV2lkdGggIT0gLTEpLlxuZnVuY3Rpb24gY2hvb3NlU2NhbGFyU3R5bGUoc3RyaW5nLCBzaW5nbGVMaW5lT25seSwgaW5kZW50UGVyTGV2ZWwsIGxpbmVXaWR0aCxcbiAgdGVzdEFtYmlndW91c1R5cGUsIHF1b3RpbmdUeXBlLCBmb3JjZVF1b3RlcywgaW5ibG9jaykge1xuXG4gIHZhciBpO1xuICB2YXIgY2hhciA9IDA7XG4gIHZhciBwcmV2Q2hhciA9IG51bGw7XG4gIHZhciBoYXNMaW5lQnJlYWsgPSBmYWxzZTtcbiAgdmFyIGhhc0ZvbGRhYmxlTGluZSA9IGZhbHNlOyAvLyBvbmx5IGNoZWNrZWQgaWYgc2hvdWxkVHJhY2tXaWR0aFxuICB2YXIgc2hvdWxkVHJhY2tXaWR0aCA9IGxpbmVXaWR0aCAhPT0gLTE7XG4gIHZhciBwcmV2aW91c0xpbmVCcmVhayA9IC0xOyAvLyBjb3VudCB0aGUgZmlyc3QgbGluZSBjb3JyZWN0bHlcbiAgdmFyIHBsYWluID0gaXNQbGFpblNhZmVGaXJzdChjb2RlUG9pbnRBdChzdHJpbmcsIDApKVxuICAgICAgICAgICYmIGlzUGxhaW5TYWZlTGFzdChjb2RlUG9pbnRBdChzdHJpbmcsIHN0cmluZy5sZW5ndGggLSAxKSk7XG5cbiAgaWYgKHNpbmdsZUxpbmVPbmx5IHx8IGZvcmNlUXVvdGVzKSB7XG4gICAgLy8gQ2FzZTogbm8gYmxvY2sgc3R5bGVzLlxuICAgIC8vIENoZWNrIGZvciBkaXNhbGxvd2VkIGNoYXJhY3RlcnMgdG8gcnVsZSBvdXQgcGxhaW4gYW5kIHNpbmdsZS5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgY2hhciA+PSAweDEwMDAwID8gaSArPSAyIDogaSsrKSB7XG4gICAgICBjaGFyID0gY29kZVBvaW50QXQoc3RyaW5nLCBpKTtcbiAgICAgIGlmICghaXNQcmludGFibGUoY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIFNUWUxFX0RPVUJMRTtcbiAgICAgIH1cbiAgICAgIHBsYWluID0gcGxhaW4gJiYgaXNQbGFpblNhZmUoY2hhciwgcHJldkNoYXIsIGluYmxvY2spO1xuICAgICAgcHJldkNoYXIgPSBjaGFyO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBDYXNlOiBibG9jayBzdHlsZXMgcGVybWl0dGVkLlxuICAgIGZvciAoaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBjaGFyID49IDB4MTAwMDAgPyBpICs9IDIgOiBpKyspIHtcbiAgICAgIGNoYXIgPSBjb2RlUG9pbnRBdChzdHJpbmcsIGkpO1xuICAgICAgaWYgKGNoYXIgPT09IENIQVJfTElORV9GRUVEKSB7XG4gICAgICAgIGhhc0xpbmVCcmVhayA9IHRydWU7XG4gICAgICAgIC8vIENoZWNrIGlmIGFueSBsaW5lIGNhbiBiZSBmb2xkZWQuXG4gICAgICAgIGlmIChzaG91bGRUcmFja1dpZHRoKSB7XG4gICAgICAgICAgaGFzRm9sZGFibGVMaW5lID0gaGFzRm9sZGFibGVMaW5lIHx8XG4gICAgICAgICAgICAvLyBGb2xkYWJsZSBsaW5lID0gdG9vIGxvbmcsIGFuZCBub3QgbW9yZS1pbmRlbnRlZC5cbiAgICAgICAgICAgIChpIC0gcHJldmlvdXNMaW5lQnJlYWsgLSAxID4gbGluZVdpZHRoICYmXG4gICAgICAgICAgICAgc3RyaW5nW3ByZXZpb3VzTGluZUJyZWFrICsgMV0gIT09ICcgJyk7XG4gICAgICAgICAgcHJldmlvdXNMaW5lQnJlYWsgPSBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFpc1ByaW50YWJsZShjaGFyKSkge1xuICAgICAgICByZXR1cm4gU1RZTEVfRE9VQkxFO1xuICAgICAgfVxuICAgICAgcGxhaW4gPSBwbGFpbiAmJiBpc1BsYWluU2FmZShjaGFyLCBwcmV2Q2hhciwgaW5ibG9jayk7XG4gICAgICBwcmV2Q2hhciA9IGNoYXI7XG4gICAgfVxuICAgIC8vIGluIGNhc2UgdGhlIGVuZCBpcyBtaXNzaW5nIGEgXFxuXG4gICAgaGFzRm9sZGFibGVMaW5lID0gaGFzRm9sZGFibGVMaW5lIHx8IChzaG91bGRUcmFja1dpZHRoICYmXG4gICAgICAoaSAtIHByZXZpb3VzTGluZUJyZWFrIC0gMSA+IGxpbmVXaWR0aCAmJlxuICAgICAgIHN0cmluZ1twcmV2aW91c0xpbmVCcmVhayArIDFdICE9PSAnICcpKTtcbiAgfVxuICAvLyBBbHRob3VnaCBldmVyeSBzdHlsZSBjYW4gcmVwcmVzZW50IFxcbiB3aXRob3V0IGVzY2FwaW5nLCBwcmVmZXIgYmxvY2sgc3R5bGVzXG4gIC8vIGZvciBtdWx0aWxpbmUsIHNpbmNlIHRoZXkncmUgbW9yZSByZWFkYWJsZSBhbmQgdGhleSBkb24ndCBhZGQgZW1wdHkgbGluZXMuXG4gIC8vIEFsc28gcHJlZmVyIGZvbGRpbmcgYSBzdXBlci1sb25nIGxpbmUuXG4gIGlmICghaGFzTGluZUJyZWFrICYmICFoYXNGb2xkYWJsZUxpbmUpIHtcbiAgICAvLyBTdHJpbmdzIGludGVycHJldGFibGUgYXMgYW5vdGhlciB0eXBlIGhhdmUgdG8gYmUgcXVvdGVkO1xuICAgIC8vIGUuZy4gdGhlIHN0cmluZyAndHJ1ZScgdnMuIHRoZSBib29sZWFuIHRydWUuXG4gICAgaWYgKHBsYWluICYmICFmb3JjZVF1b3RlcyAmJiAhdGVzdEFtYmlndW91c1R5cGUoc3RyaW5nKSkge1xuICAgICAgcmV0dXJuIFNUWUxFX1BMQUlOO1xuICAgIH1cbiAgICByZXR1cm4gcXVvdGluZ1R5cGUgPT09IFFVT1RJTkdfVFlQRV9ET1VCTEUgPyBTVFlMRV9ET1VCTEUgOiBTVFlMRV9TSU5HTEU7XG4gIH1cbiAgLy8gRWRnZSBjYXNlOiBibG9jayBpbmRlbnRhdGlvbiBpbmRpY2F0b3IgY2FuIG9ubHkgaGF2ZSBvbmUgZGlnaXQuXG4gIGlmIChpbmRlbnRQZXJMZXZlbCA+IDkgJiYgbmVlZEluZGVudEluZGljYXRvcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIFNUWUxFX0RPVUJMRTtcbiAgfVxuICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgYmxvY2sgc3R5bGVzIGFyZSB2YWxpZC5cbiAgLy8gUHJlZmVyIGxpdGVyYWwgc3R5bGUgdW5sZXNzIHdlIHdhbnQgdG8gZm9sZC5cbiAgaWYgKCFmb3JjZVF1b3Rlcykge1xuICAgIHJldHVybiBoYXNGb2xkYWJsZUxpbmUgPyBTVFlMRV9GT0xERUQgOiBTVFlMRV9MSVRFUkFMO1xuICB9XG4gIHJldHVybiBxdW90aW5nVHlwZSA9PT0gUVVPVElOR19UWVBFX0RPVUJMRSA/IFNUWUxFX0RPVUJMRSA6IFNUWUxFX1NJTkdMRTtcbn1cblxuLy8gTm90ZTogbGluZSBicmVha2luZy9mb2xkaW5nIGlzIGltcGxlbWVudGVkIGZvciBvbmx5IHRoZSBmb2xkZWQgc3R5bGUuXG4vLyBOQi4gV2UgZHJvcCB0aGUgbGFzdCB0cmFpbGluZyBuZXdsaW5lIChpZiBhbnkpIG9mIGEgcmV0dXJuZWQgYmxvY2sgc2NhbGFyXG4vLyAgc2luY2UgdGhlIGR1bXBlciBhZGRzIGl0cyBvd24gbmV3bGluZS4gVGhpcyBhbHdheXMgd29ya3M6XG4vLyAgICBcdTIwMjIgTm8gZW5kaW5nIG5ld2xpbmUgPT4gdW5hZmZlY3RlZDsgYWxyZWFkeSB1c2luZyBzdHJpcCBcIi1cIiBjaG9tcGluZy5cbi8vICAgIFx1MjAyMiBFbmRpbmcgbmV3bGluZSAgICA9PiByZW1vdmVkIHRoZW4gcmVzdG9yZWQuXG4vLyAgSW1wb3J0YW50bHksIHRoaXMga2VlcHMgdGhlIFwiK1wiIGNob21wIGluZGljYXRvciBmcm9tIGdhaW5pbmcgYW4gZXh0cmEgbGluZS5cbmZ1bmN0aW9uIHdyaXRlU2NhbGFyKHN0YXRlLCBzdHJpbmcsIGxldmVsLCBpc2tleSwgaW5ibG9jaykge1xuICBzdGF0ZS5kdW1wID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHN0YXRlLnF1b3RpbmdUeXBlID09PSBRVU9USU5HX1RZUEVfRE9VQkxFID8gJ1wiXCInIDogXCInJ1wiO1xuICAgIH1cbiAgICBpZiAoIXN0YXRlLm5vQ29tcGF0TW9kZSkge1xuICAgICAgaWYgKERFUFJFQ0FURURfQk9PTEVBTlNfU1lOVEFYLmluZGV4T2Yoc3RyaW5nKSAhPT0gLTEgfHwgREVQUkVDQVRFRF9CQVNFNjBfU1lOVEFYLnRlc3Qoc3RyaW5nKSkge1xuICAgICAgICByZXR1cm4gc3RhdGUucXVvdGluZ1R5cGUgPT09IFFVT1RJTkdfVFlQRV9ET1VCTEUgPyAoJ1wiJyArIHN0cmluZyArICdcIicpIDogKFwiJ1wiICsgc3RyaW5nICsgXCInXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpbmRlbnQgPSBzdGF0ZS5pbmRlbnQgKiBNYXRoLm1heCgxLCBsZXZlbCk7IC8vIG5vIDAtaW5kZW50IHNjYWxhcnNcbiAgICAvLyBBcyBpbmRlbnRhdGlvbiBnZXRzIGRlZXBlciwgbGV0IHRoZSB3aWR0aCBkZWNyZWFzZSBtb25vdG9uaWNhbGx5XG4gICAgLy8gdG8gdGhlIGxvd2VyIGJvdW5kIG1pbihzdGF0ZS5saW5lV2lkdGgsIDQwKS5cbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBpbXBsaWVzXG4gICAgLy8gIHN0YXRlLmxpbmVXaWR0aCBcdTIyNjQgNDAgKyBzdGF0ZS5pbmRlbnQ6IHdpZHRoIGlzIGZpeGVkIGF0IHRoZSBsb3dlciBib3VuZC5cbiAgICAvLyAgc3RhdGUubGluZVdpZHRoID4gNDAgKyBzdGF0ZS5pbmRlbnQ6IHdpZHRoIGRlY3JlYXNlcyB1bnRpbCB0aGUgbG93ZXIgYm91bmQuXG4gICAgLy8gVGhpcyBiZWhhdmVzIGJldHRlciB0aGFuIGEgY29uc3RhbnQgbWluaW11bSB3aWR0aCB3aGljaCBkaXNhbGxvd3MgbmFycm93ZXIgb3B0aW9ucyxcbiAgICAvLyBvciBhbiBpbmRlbnQgdGhyZXNob2xkIHdoaWNoIGNhdXNlcyB0aGUgd2lkdGggdG8gc3VkZGVubHkgaW5jcmVhc2UuXG4gICAgdmFyIGxpbmVXaWR0aCA9IHN0YXRlLmxpbmVXaWR0aCA9PT0gLTFcbiAgICAgID8gLTEgOiBNYXRoLm1heChNYXRoLm1pbihzdGF0ZS5saW5lV2lkdGgsIDQwKSwgc3RhdGUubGluZVdpZHRoIC0gaW5kZW50KTtcblxuICAgIC8vIFdpdGhvdXQga25vd2luZyBpZiBrZXlzIGFyZSBpbXBsaWNpdC9leHBsaWNpdCwgYXNzdW1lIGltcGxpY2l0IGZvciBzYWZldHkuXG4gICAgdmFyIHNpbmdsZUxpbmVPbmx5ID0gaXNrZXlcbiAgICAgIC8vIE5vIGJsb2NrIHN0eWxlcyBpbiBmbG93IG1vZGUuXG4gICAgICB8fCAoc3RhdGUuZmxvd0xldmVsID4gLTEgJiYgbGV2ZWwgPj0gc3RhdGUuZmxvd0xldmVsKTtcbiAgICBmdW5jdGlvbiB0ZXN0QW1iaWd1aXR5KHN0cmluZykge1xuICAgICAgcmV0dXJuIHRlc3RJbXBsaWNpdFJlc29sdmluZyhzdGF0ZSwgc3RyaW5nKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGNob29zZVNjYWxhclN0eWxlKHN0cmluZywgc2luZ2xlTGluZU9ubHksIHN0YXRlLmluZGVudCwgbGluZVdpZHRoLFxuICAgICAgdGVzdEFtYmlndWl0eSwgc3RhdGUucXVvdGluZ1R5cGUsIHN0YXRlLmZvcmNlUXVvdGVzICYmICFpc2tleSwgaW5ibG9jaykpIHtcblxuICAgICAgY2FzZSBTVFlMRV9QTEFJTjpcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgIGNhc2UgU1RZTEVfU0lOR0xFOlxuICAgICAgICByZXR1cm4gXCInXCIgKyBzdHJpbmcucmVwbGFjZSgvJy9nLCBcIicnXCIpICsgXCInXCI7XG4gICAgICBjYXNlIFNUWUxFX0xJVEVSQUw6XG4gICAgICAgIHJldHVybiAnfCcgKyBibG9ja0hlYWRlcihzdHJpbmcsIHN0YXRlLmluZGVudClcbiAgICAgICAgICArIGRyb3BFbmRpbmdOZXdsaW5lKGluZGVudFN0cmluZyhzdHJpbmcsIGluZGVudCkpO1xuICAgICAgY2FzZSBTVFlMRV9GT0xERUQ6XG4gICAgICAgIHJldHVybiAnPicgKyBibG9ja0hlYWRlcihzdHJpbmcsIHN0YXRlLmluZGVudClcbiAgICAgICAgICArIGRyb3BFbmRpbmdOZXdsaW5lKGluZGVudFN0cmluZyhmb2xkU3RyaW5nKHN0cmluZywgbGluZVdpZHRoKSwgaW5kZW50KSk7XG4gICAgICBjYXNlIFNUWUxFX0RPVUJMRTpcbiAgICAgICAgcmV0dXJuICdcIicgKyBlc2NhcGVTdHJpbmcoc3RyaW5nKSArICdcIic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uKCdpbXBvc3NpYmxlIGVycm9yOiBpbnZhbGlkIHNjYWxhciBzdHlsZScpO1xuICAgIH1cbiAgfSgpKTtcbn1cblxuLy8gUHJlLWNvbmRpdGlvbnM6IHN0cmluZyBpcyB2YWxpZCBmb3IgYSBibG9jayBzY2FsYXIsIDEgPD0gaW5kZW50UGVyTGV2ZWwgPD0gOS5cbmZ1bmN0aW9uIGJsb2NrSGVhZGVyKHN0cmluZywgaW5kZW50UGVyTGV2ZWwpIHtcbiAgdmFyIGluZGVudEluZGljYXRvciA9IG5lZWRJbmRlbnRJbmRpY2F0b3Ioc3RyaW5nKSA/IFN0cmluZyhpbmRlbnRQZXJMZXZlbCkgOiAnJztcblxuICAvLyBub3RlIHRoZSBzcGVjaWFsIGNhc2U6IHRoZSBzdHJpbmcgJ1xcbicgY291bnRzIGFzIGEgXCJ0cmFpbGluZ1wiIGVtcHR5IGxpbmUuXG4gIHZhciBjbGlwID0gICAgICAgICAgc3RyaW5nW3N0cmluZy5sZW5ndGggLSAxXSA9PT0gJ1xcbic7XG4gIHZhciBrZWVwID0gY2xpcCAmJiAoc3RyaW5nW3N0cmluZy5sZW5ndGggLSAyXSA9PT0gJ1xcbicgfHwgc3RyaW5nID09PSAnXFxuJyk7XG4gIHZhciBjaG9tcCA9IGtlZXAgPyAnKycgOiAoY2xpcCA/ICcnIDogJy0nKTtcblxuICByZXR1cm4gaW5kZW50SW5kaWNhdG9yICsgY2hvbXAgKyAnXFxuJztcbn1cblxuLy8gKFNlZSB0aGUgbm90ZSBmb3Igd3JpdGVTY2FsYXIuKVxuZnVuY3Rpb24gZHJvcEVuZGluZ05ld2xpbmUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmdbc3RyaW5nLmxlbmd0aCAtIDFdID09PSAnXFxuJyA/IHN0cmluZy5zbGljZSgwLCAtMSkgOiBzdHJpbmc7XG59XG5cbi8vIE5vdGU6IGEgbG9uZyBsaW5lIHdpdGhvdXQgYSBzdWl0YWJsZSBicmVhayBwb2ludCB3aWxsIGV4Y2VlZCB0aGUgd2lkdGggbGltaXQuXG4vLyBQcmUtY29uZGl0aW9uczogZXZlcnkgY2hhciBpbiBzdHIgaXNQcmludGFibGUsIHN0ci5sZW5ndGggPiAwLCB3aWR0aCA+IDAuXG5mdW5jdGlvbiBmb2xkU3RyaW5nKHN0cmluZywgd2lkdGgpIHtcbiAgLy8gSW4gZm9sZGVkIHN0eWxlLCAkayQgY29uc2VjdXRpdmUgbmV3bGluZXMgb3V0cHV0IGFzICRrKzEkIG5ld2xpbmVzXHUyMDE0XG4gIC8vIHVubGVzcyB0aGV5J3JlIGJlZm9yZSBvciBhZnRlciBhIG1vcmUtaW5kZW50ZWQgbGluZSwgb3IgYXQgdGhlIHZlcnlcbiAgLy8gYmVnaW5uaW5nIG9yIGVuZCwgaW4gd2hpY2ggY2FzZSAkayQgbWFwcyB0byAkayQuXG4gIC8vIFRoZXJlZm9yZSwgcGFyc2UgZWFjaCBjaHVuayBhcyBuZXdsaW5lKHMpIGZvbGxvd2VkIGJ5IGEgY29udGVudCBsaW5lLlxuICB2YXIgbGluZVJlID0gLyhcXG4rKShbXlxcbl0qKS9nO1xuXG4gIC8vIGZpcnN0IGxpbmUgKHBvc3NpYmx5IGFuIGVtcHR5IGxpbmUpXG4gIHZhciByZXN1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXh0TEYgPSBzdHJpbmcuaW5kZXhPZignXFxuJyk7XG4gICAgbmV4dExGID0gbmV4dExGICE9PSAtMSA/IG5leHRMRiA6IHN0cmluZy5sZW5ndGg7XG4gICAgbGluZVJlLmxhc3RJbmRleCA9IG5leHRMRjtcbiAgICByZXR1cm4gZm9sZExpbmUoc3RyaW5nLnNsaWNlKDAsIG5leHRMRiksIHdpZHRoKTtcbiAgfSgpKTtcbiAgLy8gSWYgd2UgaGF2ZW4ndCByZWFjaGVkIHRoZSBmaXJzdCBjb250ZW50IGxpbmUgeWV0LCBkb24ndCBhZGQgYW4gZXh0cmEgXFxuLlxuICB2YXIgcHJldk1vcmVJbmRlbnRlZCA9IHN0cmluZ1swXSA9PT0gJ1xcbicgfHwgc3RyaW5nWzBdID09PSAnICc7XG4gIHZhciBtb3JlSW5kZW50ZWQ7XG5cbiAgLy8gcmVzdCBvZiB0aGUgbGluZXNcbiAgdmFyIG1hdGNoO1xuICB3aGlsZSAoKG1hdGNoID0gbGluZVJlLmV4ZWMoc3RyaW5nKSkpIHtcbiAgICB2YXIgcHJlZml4ID0gbWF0Y2hbMV0sIGxpbmUgPSBtYXRjaFsyXTtcbiAgICBtb3JlSW5kZW50ZWQgPSAobGluZVswXSA9PT0gJyAnKTtcbiAgICByZXN1bHQgKz0gcHJlZml4XG4gICAgICArICghcHJldk1vcmVJbmRlbnRlZCAmJiAhbW9yZUluZGVudGVkICYmIGxpbmUgIT09ICcnXG4gICAgICAgID8gJ1xcbicgOiAnJylcbiAgICAgICsgZm9sZExpbmUobGluZSwgd2lkdGgpO1xuICAgIHByZXZNb3JlSW5kZW50ZWQgPSBtb3JlSW5kZW50ZWQ7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBHcmVlZHkgbGluZSBicmVha2luZy5cbi8vIFBpY2tzIHRoZSBsb25nZXN0IGxpbmUgdW5kZXIgdGhlIGxpbWl0IGVhY2ggdGltZSxcbi8vIG90aGVyd2lzZSBzZXR0bGVzIGZvciB0aGUgc2hvcnRlc3QgbGluZSBvdmVyIHRoZSBsaW1pdC5cbi8vIE5CLiBNb3JlLWluZGVudGVkIGxpbmVzICpjYW5ub3QqIGJlIGZvbGRlZCwgYXMgdGhhdCB3b3VsZCBhZGQgYW4gZXh0cmEgXFxuLlxuZnVuY3Rpb24gZm9sZExpbmUobGluZSwgd2lkdGgpIHtcbiAgaWYgKGxpbmUgPT09ICcnIHx8IGxpbmVbMF0gPT09ICcgJykgcmV0dXJuIGxpbmU7XG5cbiAgLy8gU2luY2UgYSBtb3JlLWluZGVudGVkIGxpbmUgYWRkcyBhIFxcbiwgYnJlYWtzIGNhbid0IGJlIGZvbGxvd2VkIGJ5IGEgc3BhY2UuXG4gIHZhciBicmVha1JlID0gLyBbXiBdL2c7IC8vIG5vdGU6IHRoZSBtYXRjaCBpbmRleCB3aWxsIGFsd2F5cyBiZSA8PSBsZW5ndGgtMi5cbiAgdmFyIG1hdGNoO1xuICAvLyBzdGFydCBpcyBhbiBpbmNsdXNpdmUgaW5kZXguIGVuZCwgY3VyciwgYW5kIG5leHQgYXJlIGV4Y2x1c2l2ZS5cbiAgdmFyIHN0YXJ0ID0gMCwgZW5kLCBjdXJyID0gMCwgbmV4dCA9IDA7XG4gIHZhciByZXN1bHQgPSAnJztcblxuICAvLyBJbnZhcmlhbnRzOiAwIDw9IHN0YXJ0IDw9IGxlbmd0aC0xLlxuICAvLyAgIDAgPD0gY3VyciA8PSBuZXh0IDw9IG1heCgwLCBsZW5ndGgtMikuIGN1cnIgLSBzdGFydCA8PSB3aWR0aC5cbiAgLy8gSW5zaWRlIHRoZSBsb29wOlxuICAvLyAgIEEgbWF0Y2ggaW1wbGllcyBsZW5ndGggPj0gMiwgc28gY3VyciBhbmQgbmV4dCBhcmUgPD0gbGVuZ3RoLTIuXG4gIHdoaWxlICgobWF0Y2ggPSBicmVha1JlLmV4ZWMobGluZSkpKSB7XG4gICAgbmV4dCA9IG1hdGNoLmluZGV4O1xuICAgIC8vIG1haW50YWluIGludmFyaWFudDogY3VyciAtIHN0YXJ0IDw9IHdpZHRoXG4gICAgaWYgKG5leHQgLSBzdGFydCA+IHdpZHRoKSB7XG4gICAgICBlbmQgPSAoY3VyciA+IHN0YXJ0KSA/IGN1cnIgOiBuZXh0OyAvLyBkZXJpdmUgZW5kIDw9IGxlbmd0aC0yXG4gICAgICByZXN1bHQgKz0gJ1xcbicgKyBsaW5lLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgLy8gc2tpcCB0aGUgc3BhY2UgdGhhdCB3YXMgb3V0cHV0IGFzIFxcblxuICAgICAgc3RhcnQgPSBlbmQgKyAxOyAgICAgICAgICAgICAgICAgICAgLy8gZGVyaXZlIHN0YXJ0IDw9IGxlbmd0aC0xXG4gICAgfVxuICAgIGN1cnIgPSBuZXh0O1xuICB9XG5cbiAgLy8gQnkgdGhlIGludmFyaWFudHMsIHN0YXJ0IDw9IGxlbmd0aC0xLCBzbyB0aGVyZSBpcyBzb21ldGhpbmcgbGVmdCBvdmVyLlxuICAvLyBJdCBpcyBlaXRoZXIgdGhlIHdob2xlIHN0cmluZyBvciBhIHBhcnQgc3RhcnRpbmcgZnJvbSBub24td2hpdGVzcGFjZS5cbiAgcmVzdWx0ICs9ICdcXG4nO1xuICAvLyBJbnNlcnQgYSBicmVhayBpZiB0aGUgcmVtYWluZGVyIGlzIHRvbyBsb25nIGFuZCB0aGVyZSBpcyBhIGJyZWFrIGF2YWlsYWJsZS5cbiAgaWYgKGxpbmUubGVuZ3RoIC0gc3RhcnQgPiB3aWR0aCAmJiBjdXJyID4gc3RhcnQpIHtcbiAgICByZXN1bHQgKz0gbGluZS5zbGljZShzdGFydCwgY3VycikgKyAnXFxuJyArIGxpbmUuc2xpY2UoY3VyciArIDEpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCArPSBsaW5lLnNsaWNlKHN0YXJ0KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQuc2xpY2UoMSk7IC8vIGRyb3AgZXh0cmEgXFxuIGpvaW5lclxufVxuXG4vLyBFc2NhcGVzIGEgZG91YmxlLXF1b3RlZCBzdHJpbmcuXG5mdW5jdGlvbiBlc2NhcGVTdHJpbmcoc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIGNoYXIgPSAwO1xuICB2YXIgZXNjYXBlU2VxO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgY2hhciA+PSAweDEwMDAwID8gaSArPSAyIDogaSsrKSB7XG4gICAgY2hhciA9IGNvZGVQb2ludEF0KHN0cmluZywgaSk7XG4gICAgZXNjYXBlU2VxID0gRVNDQVBFX1NFUVVFTkNFU1tjaGFyXTtcblxuICAgIGlmICghZXNjYXBlU2VxICYmIGlzUHJpbnRhYmxlKGNoYXIpKSB7XG4gICAgICByZXN1bHQgKz0gc3RyaW5nW2ldO1xuICAgICAgaWYgKGNoYXIgPj0gMHgxMDAwMCkgcmVzdWx0ICs9IHN0cmluZ1tpICsgMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCArPSBlc2NhcGVTZXEgfHwgZW5jb2RlSGV4KGNoYXIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvd1NlcXVlbmNlKHN0YXRlLCBsZXZlbCwgb2JqZWN0KSB7XG4gIHZhciBfcmVzdWx0ID0gJycsXG4gICAgICBfdGFnICAgID0gc3RhdGUudGFnLFxuICAgICAgaW5kZXgsXG4gICAgICBsZW5ndGgsXG4gICAgICB2YWx1ZTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICB2YWx1ZSA9IG9iamVjdFtpbmRleF07XG5cbiAgICBpZiAoc3RhdGUucmVwbGFjZXIpIHtcbiAgICAgIHZhbHVlID0gc3RhdGUucmVwbGFjZXIuY2FsbChvYmplY3QsIFN0cmluZyhpbmRleCksIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBXcml0ZSBvbmx5IHZhbGlkIGVsZW1lbnRzLCBwdXQgbnVsbCBpbnN0ZWFkIG9mIGludmFsaWQgZWxlbWVudHMuXG4gICAgaWYgKHdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwsIHZhbHVlLCBmYWxzZSwgZmFsc2UpIHx8XG4gICAgICAgICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICB3cml0ZU5vZGUoc3RhdGUsIGxldmVsLCBudWxsLCBmYWxzZSwgZmFsc2UpKSkge1xuXG4gICAgICBpZiAoX3Jlc3VsdCAhPT0gJycpIF9yZXN1bHQgKz0gJywnICsgKCFzdGF0ZS5jb25kZW5zZUZsb3cgPyAnICcgOiAnJyk7XG4gICAgICBfcmVzdWx0ICs9IHN0YXRlLmR1bXA7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUudGFnID0gX3RhZztcbiAgc3RhdGUuZHVtcCA9ICdbJyArIF9yZXN1bHQgKyAnXSc7XG59XG5cbmZ1bmN0aW9uIHdyaXRlQmxvY2tTZXF1ZW5jZShzdGF0ZSwgbGV2ZWwsIG9iamVjdCwgY29tcGFjdCkge1xuICB2YXIgX3Jlc3VsdCA9ICcnLFxuICAgICAgX3RhZyAgICA9IHN0YXRlLnRhZyxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoLFxuICAgICAgdmFsdWU7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdmFsdWUgPSBvYmplY3RbaW5kZXhdO1xuXG4gICAgaWYgKHN0YXRlLnJlcGxhY2VyKSB7XG4gICAgICB2YWx1ZSA9IHN0YXRlLnJlcGxhY2VyLmNhbGwob2JqZWN0LCBTdHJpbmcoaW5kZXgpLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gV3JpdGUgb25seSB2YWxpZCBlbGVtZW50cywgcHV0IG51bGwgaW5zdGVhZCBvZiBpbnZhbGlkIGVsZW1lbnRzLlxuICAgIGlmICh3cml0ZU5vZGUoc3RhdGUsIGxldmVsICsgMSwgdmFsdWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKSB8fFxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgd3JpdGVOb2RlKHN0YXRlLCBsZXZlbCArIDEsIG51bGwsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKSkpIHtcblxuICAgICAgaWYgKCFjb21wYWN0IHx8IF9yZXN1bHQgIT09ICcnKSB7XG4gICAgICAgIF9yZXN1bHQgKz0gZ2VuZXJhdGVOZXh0TGluZShzdGF0ZSwgbGV2ZWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUuZHVtcCAmJiBDSEFSX0xJTkVfRkVFRCA9PT0gc3RhdGUuZHVtcC5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgIF9yZXN1bHQgKz0gJy0nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3Jlc3VsdCArPSAnLSAnO1xuICAgICAgfVxuXG4gICAgICBfcmVzdWx0ICs9IHN0YXRlLmR1bXA7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUudGFnID0gX3RhZztcbiAgc3RhdGUuZHVtcCA9IF9yZXN1bHQgfHwgJ1tdJzsgLy8gRW1wdHkgc2VxdWVuY2UgaWYgbm8gdmFsaWQgdmFsdWVzLlxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb3dNYXBwaW5nKHN0YXRlLCBsZXZlbCwgb2JqZWN0KSB7XG4gIHZhciBfcmVzdWx0ICAgICAgID0gJycsXG4gICAgICBfdGFnICAgICAgICAgID0gc3RhdGUudGFnLFxuICAgICAgb2JqZWN0S2V5TGlzdCA9IE9iamVjdC5rZXlzKG9iamVjdCksXG4gICAgICBpbmRleCxcbiAgICAgIGxlbmd0aCxcbiAgICAgIG9iamVjdEtleSxcbiAgICAgIG9iamVjdFZhbHVlLFxuICAgICAgcGFpckJ1ZmZlcjtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0S2V5TGlzdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG5cbiAgICBwYWlyQnVmZmVyID0gJyc7XG4gICAgaWYgKF9yZXN1bHQgIT09ICcnKSBwYWlyQnVmZmVyICs9ICcsICc7XG5cbiAgICBpZiAoc3RhdGUuY29uZGVuc2VGbG93KSBwYWlyQnVmZmVyICs9ICdcIic7XG5cbiAgICBvYmplY3RLZXkgPSBvYmplY3RLZXlMaXN0W2luZGV4XTtcbiAgICBvYmplY3RWYWx1ZSA9IG9iamVjdFtvYmplY3RLZXldO1xuXG4gICAgaWYgKHN0YXRlLnJlcGxhY2VyKSB7XG4gICAgICBvYmplY3RWYWx1ZSA9IHN0YXRlLnJlcGxhY2VyLmNhbGwob2JqZWN0LCBvYmplY3RLZXksIG9iamVjdFZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwsIG9iamVjdEtleSwgZmFsc2UsIGZhbHNlKSkge1xuICAgICAgY29udGludWU7IC8vIFNraXAgdGhpcyBwYWlyIGJlY2F1c2Ugb2YgaW52YWxpZCBrZXk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmR1bXAubGVuZ3RoID4gMTAyNCkgcGFpckJ1ZmZlciArPSAnPyAnO1xuXG4gICAgcGFpckJ1ZmZlciArPSBzdGF0ZS5kdW1wICsgKHN0YXRlLmNvbmRlbnNlRmxvdyA/ICdcIicgOiAnJykgKyAnOicgKyAoc3RhdGUuY29uZGVuc2VGbG93ID8gJycgOiAnICcpO1xuXG4gICAgaWYgKCF3cml0ZU5vZGUoc3RhdGUsIGxldmVsLCBvYmplY3RWYWx1ZSwgZmFsc2UsIGZhbHNlKSkge1xuICAgICAgY29udGludWU7IC8vIFNraXAgdGhpcyBwYWlyIGJlY2F1c2Ugb2YgaW52YWxpZCB2YWx1ZS5cbiAgICB9XG5cbiAgICBwYWlyQnVmZmVyICs9IHN0YXRlLmR1bXA7XG5cbiAgICAvLyBCb3RoIGtleSBhbmQgdmFsdWUgYXJlIHZhbGlkLlxuICAgIF9yZXN1bHQgKz0gcGFpckJ1ZmZlcjtcbiAgfVxuXG4gIHN0YXRlLnRhZyA9IF90YWc7XG4gIHN0YXRlLmR1bXAgPSAneycgKyBfcmVzdWx0ICsgJ30nO1xufVxuXG5mdW5jdGlvbiB3cml0ZUJsb2NrTWFwcGluZyhzdGF0ZSwgbGV2ZWwsIG9iamVjdCwgY29tcGFjdCkge1xuICB2YXIgX3Jlc3VsdCAgICAgICA9ICcnLFxuICAgICAgX3RhZyAgICAgICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIG9iamVjdEtleUxpc3QgPSBPYmplY3Qua2V5cyhvYmplY3QpLFxuICAgICAgaW5kZXgsXG4gICAgICBsZW5ndGgsXG4gICAgICBvYmplY3RLZXksXG4gICAgICBvYmplY3RWYWx1ZSxcbiAgICAgIGV4cGxpY2l0UGFpcixcbiAgICAgIHBhaXJCdWZmZXI7XG5cbiAgLy8gQWxsb3cgc29ydGluZyBrZXlzIHNvIHRoYXQgdGhlIG91dHB1dCBmaWxlIGlzIGRldGVybWluaXN0aWNcbiAgaWYgKHN0YXRlLnNvcnRLZXlzID09PSB0cnVlKSB7XG4gICAgLy8gRGVmYXVsdCBzb3J0aW5nXG4gICAgb2JqZWN0S2V5TGlzdC5zb3J0KCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHN0YXRlLnNvcnRLZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gQ3VzdG9tIHNvcnQgZnVuY3Rpb25cbiAgICBvYmplY3RLZXlMaXN0LnNvcnQoc3RhdGUuc29ydEtleXMpO1xuICB9IGVsc2UgaWYgKHN0YXRlLnNvcnRLZXlzKSB7XG4gICAgLy8gU29tZXRoaW5nIGlzIHdyb25nXG4gICAgdGhyb3cgbmV3IGV4Y2VwdGlvbignc29ydEtleXMgbXVzdCBiZSBhIGJvb2xlYW4gb3IgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdEtleUxpc3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHBhaXJCdWZmZXIgPSAnJztcblxuICAgIGlmICghY29tcGFjdCB8fCBfcmVzdWx0ICE9PSAnJykge1xuICAgICAgcGFpckJ1ZmZlciArPSBnZW5lcmF0ZU5leHRMaW5lKHN0YXRlLCBsZXZlbCk7XG4gICAgfVxuXG4gICAgb2JqZWN0S2V5ID0gb2JqZWN0S2V5TGlzdFtpbmRleF07XG4gICAgb2JqZWN0VmFsdWUgPSBvYmplY3Rbb2JqZWN0S2V5XTtcblxuICAgIGlmIChzdGF0ZS5yZXBsYWNlcikge1xuICAgICAgb2JqZWN0VmFsdWUgPSBzdGF0ZS5yZXBsYWNlci5jYWxsKG9iamVjdCwgb2JqZWN0S2V5LCBvYmplY3RWYWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCF3cml0ZU5vZGUoc3RhdGUsIGxldmVsICsgMSwgb2JqZWN0S2V5LCB0cnVlLCB0cnVlLCB0cnVlKSkge1xuICAgICAgY29udGludWU7IC8vIFNraXAgdGhpcyBwYWlyIGJlY2F1c2Ugb2YgaW52YWxpZCBrZXkuXG4gICAgfVxuXG4gICAgZXhwbGljaXRQYWlyID0gKHN0YXRlLnRhZyAhPT0gbnVsbCAmJiBzdGF0ZS50YWcgIT09ICc/JykgfHxcbiAgICAgICAgICAgICAgICAgICAoc3RhdGUuZHVtcCAmJiBzdGF0ZS5kdW1wLmxlbmd0aCA+IDEwMjQpO1xuXG4gICAgaWYgKGV4cGxpY2l0UGFpcikge1xuICAgICAgaWYgKHN0YXRlLmR1bXAgJiYgQ0hBUl9MSU5FX0ZFRUQgPT09IHN0YXRlLmR1bXAuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICBwYWlyQnVmZmVyICs9ICc/JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhaXJCdWZmZXIgKz0gJz8gJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYWlyQnVmZmVyICs9IHN0YXRlLmR1bXA7XG5cbiAgICBpZiAoZXhwbGljaXRQYWlyKSB7XG4gICAgICBwYWlyQnVmZmVyICs9IGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKTtcbiAgICB9XG5cbiAgICBpZiAoIXdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwgKyAxLCBvYmplY3RWYWx1ZSwgdHJ1ZSwgZXhwbGljaXRQYWlyKSkge1xuICAgICAgY29udGludWU7IC8vIFNraXAgdGhpcyBwYWlyIGJlY2F1c2Ugb2YgaW52YWxpZCB2YWx1ZS5cbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuZHVtcCAmJiBDSEFSX0xJTkVfRkVFRCA9PT0gc3RhdGUuZHVtcC5jaGFyQ29kZUF0KDApKSB7XG4gICAgICBwYWlyQnVmZmVyICs9ICc6JztcbiAgICB9IGVsc2Uge1xuICAgICAgcGFpckJ1ZmZlciArPSAnOiAnO1xuICAgIH1cblxuICAgIHBhaXJCdWZmZXIgKz0gc3RhdGUuZHVtcDtcblxuICAgIC8vIEJvdGgga2V5IGFuZCB2YWx1ZSBhcmUgdmFsaWQuXG4gICAgX3Jlc3VsdCArPSBwYWlyQnVmZmVyO1xuICB9XG5cbiAgc3RhdGUudGFnID0gX3RhZztcbiAgc3RhdGUuZHVtcCA9IF9yZXN1bHQgfHwgJ3t9JzsgLy8gRW1wdHkgbWFwcGluZyBpZiBubyB2YWxpZCBwYWlycy5cbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHlwZShzdGF0ZSwgb2JqZWN0LCBleHBsaWNpdCkge1xuICB2YXIgX3Jlc3VsdCwgdHlwZUxpc3QsIGluZGV4LCBsZW5ndGgsIHR5cGUsIHN0eWxlO1xuXG4gIHR5cGVMaXN0ID0gZXhwbGljaXQgPyBzdGF0ZS5leHBsaWNpdFR5cGVzIDogc3RhdGUuaW1wbGljaXRUeXBlcztcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gdHlwZUxpc3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHR5cGUgPSB0eXBlTGlzdFtpbmRleF07XG5cbiAgICBpZiAoKHR5cGUuaW5zdGFuY2VPZiAgfHwgdHlwZS5wcmVkaWNhdGUpICYmXG4gICAgICAgICghdHlwZS5pbnN0YW5jZU9mIHx8ICgodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcpICYmIChvYmplY3QgaW5zdGFuY2VvZiB0eXBlLmluc3RhbmNlT2YpKSkgJiZcbiAgICAgICAgKCF0eXBlLnByZWRpY2F0ZSAgfHwgdHlwZS5wcmVkaWNhdGUob2JqZWN0KSkpIHtcblxuICAgICAgaWYgKGV4cGxpY2l0KSB7XG4gICAgICAgIGlmICh0eXBlLm11bHRpICYmIHR5cGUucmVwcmVzZW50TmFtZSkge1xuICAgICAgICAgIHN0YXRlLnRhZyA9IHR5cGUucmVwcmVzZW50TmFtZShvYmplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YXRlLnRhZyA9IHR5cGUudGFnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS50YWcgPSAnPyc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlLnJlcHJlc2VudCkge1xuICAgICAgICBzdHlsZSA9IHN0YXRlLnN0eWxlTWFwW3R5cGUudGFnXSB8fCB0eXBlLmRlZmF1bHRTdHlsZTtcblxuICAgICAgICBpZiAoX3RvU3RyaW5nLmNhbGwodHlwZS5yZXByZXNlbnQpID09PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICAgICAgX3Jlc3VsdCA9IHR5cGUucmVwcmVzZW50KG9iamVjdCwgc3R5bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHR5cGUucmVwcmVzZW50LCBzdHlsZSkpIHtcbiAgICAgICAgICBfcmVzdWx0ID0gdHlwZS5yZXByZXNlbnRbc3R5bGVdKG9iamVjdCwgc3R5bGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb24oJyE8JyArIHR5cGUudGFnICsgJz4gdGFnIHJlc29sdmVyIGFjY2VwdHMgbm90IFwiJyArIHN0eWxlICsgJ1wiIHN0eWxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5kdW1wID0gX3Jlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBTZXJpYWxpemVzIGBvYmplY3RgIGFuZCB3cml0ZXMgaXQgdG8gZ2xvYmFsIGByZXN1bHRgLlxuLy8gUmV0dXJucyB0cnVlIG9uIHN1Y2Nlc3MsIG9yIGZhbHNlIG9uIGludmFsaWQgb2JqZWN0LlxuLy9cbmZ1bmN0aW9uIHdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwsIG9iamVjdCwgYmxvY2ssIGNvbXBhY3QsIGlza2V5LCBpc2Jsb2Nrc2VxKSB7XG4gIHN0YXRlLnRhZyA9IG51bGw7XG4gIHN0YXRlLmR1bXAgPSBvYmplY3Q7XG5cbiAgaWYgKCFkZXRlY3RUeXBlKHN0YXRlLCBvYmplY3QsIGZhbHNlKSkge1xuICAgIGRldGVjdFR5cGUoc3RhdGUsIG9iamVjdCwgdHJ1ZSk7XG4gIH1cblxuICB2YXIgdHlwZSA9IF90b1N0cmluZy5jYWxsKHN0YXRlLmR1bXApO1xuICB2YXIgaW5ibG9jayA9IGJsb2NrO1xuICB2YXIgdGFnU3RyO1xuXG4gIGlmIChibG9jaykge1xuICAgIGJsb2NrID0gKHN0YXRlLmZsb3dMZXZlbCA8IDAgfHwgc3RhdGUuZmxvd0xldmVsID4gbGV2ZWwpO1xuICB9XG5cbiAgdmFyIG9iamVjdE9yQXJyYXkgPSB0eXBlID09PSAnW29iamVjdCBPYmplY3RdJyB8fCB0eXBlID09PSAnW29iamVjdCBBcnJheV0nLFxuICAgICAgZHVwbGljYXRlSW5kZXgsXG4gICAgICBkdXBsaWNhdGU7XG5cbiAgaWYgKG9iamVjdE9yQXJyYXkpIHtcbiAgICBkdXBsaWNhdGVJbmRleCA9IHN0YXRlLmR1cGxpY2F0ZXMuaW5kZXhPZihvYmplY3QpO1xuICAgIGR1cGxpY2F0ZSA9IGR1cGxpY2F0ZUluZGV4ICE9PSAtMTtcbiAgfVxuXG4gIGlmICgoc3RhdGUudGFnICE9PSBudWxsICYmIHN0YXRlLnRhZyAhPT0gJz8nKSB8fCBkdXBsaWNhdGUgfHwgKHN0YXRlLmluZGVudCAhPT0gMiAmJiBsZXZlbCA+IDApKSB7XG4gICAgY29tcGFjdCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKGR1cGxpY2F0ZSAmJiBzdGF0ZS51c2VkRHVwbGljYXRlc1tkdXBsaWNhdGVJbmRleF0pIHtcbiAgICBzdGF0ZS5kdW1wID0gJypyZWZfJyArIGR1cGxpY2F0ZUluZGV4O1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RPckFycmF5ICYmIGR1cGxpY2F0ZSAmJiAhc3RhdGUudXNlZER1cGxpY2F0ZXNbZHVwbGljYXRlSW5kZXhdKSB7XG4gICAgICBzdGF0ZS51c2VkRHVwbGljYXRlc1tkdXBsaWNhdGVJbmRleF0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIGlmIChibG9jayAmJiAoT2JqZWN0LmtleXMoc3RhdGUuZHVtcCkubGVuZ3RoICE9PSAwKSkge1xuICAgICAgICB3cml0ZUJsb2NrTWFwcGluZyhzdGF0ZSwgbGV2ZWwsIHN0YXRlLmR1bXAsIGNvbXBhY3QpO1xuICAgICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUuZHVtcCA9ICcmcmVmXycgKyBkdXBsaWNhdGVJbmRleCArIHN0YXRlLmR1bXA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyaXRlRmxvd01hcHBpbmcoc3RhdGUsIGxldmVsLCBzdGF0ZS5kdW1wKTtcbiAgICAgICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlLmR1bXAgPSAnJnJlZl8nICsgZHVwbGljYXRlSW5kZXggKyAnICcgKyBzdGF0ZS5kdW1wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICBpZiAoYmxvY2sgJiYgKHN0YXRlLmR1bXAubGVuZ3RoICE9PSAwKSkge1xuICAgICAgICBpZiAoc3RhdGUubm9BcnJheUluZGVudCAmJiAhaXNibG9ja3NlcSAmJiBsZXZlbCA+IDApIHtcbiAgICAgICAgICB3cml0ZUJsb2NrU2VxdWVuY2Uoc3RhdGUsIGxldmVsIC0gMSwgc3RhdGUuZHVtcCwgY29tcGFjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JpdGVCbG9ja1NlcXVlbmNlKHN0YXRlLCBsZXZlbCwgc3RhdGUuZHVtcCwgY29tcGFjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlLmR1bXAgPSAnJnJlZl8nICsgZHVwbGljYXRlSW5kZXggKyBzdGF0ZS5kdW1wO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cml0ZUZsb3dTZXF1ZW5jZShzdGF0ZSwgbGV2ZWwsIHN0YXRlLmR1bXApO1xuICAgICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUuZHVtcCA9ICcmcmVmXycgKyBkdXBsaWNhdGVJbmRleCArICcgJyArIHN0YXRlLmR1bXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IFN0cmluZ10nKSB7XG4gICAgICBpZiAoc3RhdGUudGFnICE9PSAnPycpIHtcbiAgICAgICAgd3JpdGVTY2FsYXIoc3RhdGUsIHN0YXRlLmR1bXAsIGxldmVsLCBpc2tleSwgaW5ibG9jayk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBVbmRlZmluZWRdJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhdGUuc2tpcEludmFsaWQpIHJldHVybiBmYWxzZTtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb24oJ3VuYWNjZXB0YWJsZSBraW5kIG9mIGFuIG9iamVjdCB0byBkdW1wICcgKyB0eXBlKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUudGFnICE9PSBudWxsICYmIHN0YXRlLnRhZyAhPT0gJz8nKSB7XG4gICAgICAvLyBOZWVkIHRvIGVuY29kZSBhbGwgY2hhcmFjdGVycyBleGNlcHQgdGhvc2UgYWxsb3dlZCBieSB0aGUgc3BlYzpcbiAgICAgIC8vXG4gICAgICAvLyBbMzVdIG5zLWRlYy1kaWdpdCAgICA6Oj0gIFsjeDMwLSN4MzldIC8qIDAtOSAqL1xuICAgICAgLy8gWzM2XSBucy1oZXgtZGlnaXQgICAgOjo9ICBucy1kZWMtZGlnaXRcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHwgWyN4NDEtI3g0Nl0gLyogQS1GICovIHwgWyN4NjEtI3g2Nl0gLyogYS1mICovXG4gICAgICAvLyBbMzddIG5zLWFzY2lpLWxldHRlciA6Oj0gIFsjeDQxLSN4NUFdIC8qIEEtWiAqLyB8IFsjeDYxLSN4N0FdIC8qIGEteiAqL1xuICAgICAgLy8gWzM4XSBucy13b3JkLWNoYXIgICAgOjo9ICBucy1kZWMtZGlnaXQgfCBucy1hc2NpaS1sZXR0ZXIgfCBcdTIwMUMtXHUyMDFEXG4gICAgICAvLyBbMzldIG5zLXVyaS1jaGFyICAgICA6Oj0gIFx1MjAxQyVcdTIwMUQgbnMtaGV4LWRpZ2l0IG5zLWhleC1kaWdpdCB8IG5zLXdvcmQtY2hhciB8IFx1MjAxQyNcdTIwMURcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHwgXHUyMDFDO1x1MjAxRCB8IFx1MjAxQy9cdTIwMUQgfCBcdTIwMUM/XHUyMDFEIHwgXHUyMDFDOlx1MjAxRCB8IFx1MjAxQ0BcdTIwMUQgfCBcdTIwMUMmXHUyMDFEIHwgXHUyMDFDPVx1MjAxRCB8IFx1MjAxQytcdTIwMUQgfCBcdTIwMUMkXHUyMDFEIHwgXHUyMDFDLFx1MjAxRFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfCBcdTIwMUNfXHUyMDFEIHwgXHUyMDFDLlx1MjAxRCB8IFx1MjAxQyFcdTIwMUQgfCBcdTIwMUN+XHUyMDFEIHwgXHUyMDFDKlx1MjAxRCB8IFx1MjAxQydcdTIwMUQgfCBcdTIwMUMoXHUyMDFEIHwgXHUyMDFDKVx1MjAxRCB8IFx1MjAxQ1tcdTIwMUQgfCBcdTIwMUNdXHUyMDFEXG4gICAgICAvL1xuICAgICAgLy8gQWxzbyBuZWVkIHRvIGVuY29kZSAnIScgYmVjYXVzZSBpdCBoYXMgc3BlY2lhbCBtZWFuaW5nIChlbmQgb2YgdGFnIHByZWZpeCkuXG4gICAgICAvL1xuICAgICAgdGFnU3RyID0gZW5jb2RlVVJJKFxuICAgICAgICBzdGF0ZS50YWdbMF0gPT09ICchJyA/IHN0YXRlLnRhZy5zbGljZSgxKSA6IHN0YXRlLnRhZ1xuICAgICAgKS5yZXBsYWNlKC8hL2csICclMjEnKTtcblxuICAgICAgaWYgKHN0YXRlLnRhZ1swXSA9PT0gJyEnKSB7XG4gICAgICAgIHRhZ1N0ciA9ICchJyArIHRhZ1N0cjtcbiAgICAgIH0gZWxzZSBpZiAodGFnU3RyLnNsaWNlKDAsIDE4KSA9PT0gJ3RhZzp5YW1sLm9yZywyMDAyOicpIHtcbiAgICAgICAgdGFnU3RyID0gJyEhJyArIHRhZ1N0ci5zbGljZSgxOCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWdTdHIgPSAnITwnICsgdGFnU3RyICsgJz4nO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZS5kdW1wID0gdGFnU3RyICsgJyAnICsgc3RhdGUuZHVtcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0RHVwbGljYXRlUmVmZXJlbmNlcyhvYmplY3QsIHN0YXRlKSB7XG4gIHZhciBvYmplY3RzID0gW10sXG4gICAgICBkdXBsaWNhdGVzSW5kZXhlcyA9IFtdLFxuICAgICAgaW5kZXgsXG4gICAgICBsZW5ndGg7XG5cbiAgaW5zcGVjdE5vZGUob2JqZWN0LCBvYmplY3RzLCBkdXBsaWNhdGVzSW5kZXhlcyk7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IGR1cGxpY2F0ZXNJbmRleGVzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBzdGF0ZS5kdXBsaWNhdGVzLnB1c2gob2JqZWN0c1tkdXBsaWNhdGVzSW5kZXhlc1tpbmRleF1dKTtcbiAgfVxuICBzdGF0ZS51c2VkRHVwbGljYXRlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBpbnNwZWN0Tm9kZShvYmplY3QsIG9iamVjdHMsIGR1cGxpY2F0ZXNJbmRleGVzKSB7XG4gIHZhciBvYmplY3RLZXlMaXN0LFxuICAgICAgaW5kZXgsXG4gICAgICBsZW5ndGg7XG5cbiAgaWYgKG9iamVjdCAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0Jykge1xuICAgIGluZGV4ID0gb2JqZWN0cy5pbmRleE9mKG9iamVjdCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgaWYgKGR1cGxpY2F0ZXNJbmRleGVzLmluZGV4T2YoaW5kZXgpID09PSAtMSkge1xuICAgICAgICBkdXBsaWNhdGVzSW5kZXhlcy5wdXNoKGluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0cy5wdXNoKG9iamVjdCk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgICAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICAgICAgaW5zcGVjdE5vZGUob2JqZWN0W2luZGV4XSwgb2JqZWN0cywgZHVwbGljYXRlc0luZGV4ZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RLZXlMaXN0ID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICAgICAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0S2V5TGlzdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICAgICAgaW5zcGVjdE5vZGUob2JqZWN0W29iamVjdEtleUxpc3RbaW5kZXhdXSwgb2JqZWN0cywgZHVwbGljYXRlc0luZGV4ZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGR1bXAkMShpbnB1dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUob3B0aW9ucyk7XG5cbiAgaWYgKCFzdGF0ZS5ub1JlZnMpIGdldER1cGxpY2F0ZVJlZmVyZW5jZXMoaW5wdXQsIHN0YXRlKTtcblxuICB2YXIgdmFsdWUgPSBpbnB1dDtcblxuICBpZiAoc3RhdGUucmVwbGFjZXIpIHtcbiAgICB2YWx1ZSA9IHN0YXRlLnJlcGxhY2VyLmNhbGwoeyAnJzogdmFsdWUgfSwgJycsIHZhbHVlKTtcbiAgfVxuXG4gIGlmICh3cml0ZU5vZGUoc3RhdGUsIDAsIHZhbHVlLCB0cnVlLCB0cnVlKSkgcmV0dXJuIHN0YXRlLmR1bXAgKyAnXFxuJztcblxuICByZXR1cm4gJyc7XG59XG5cbnZhciBkdW1wXzEgPSBkdW1wJDE7XG5cbnZhciBkdW1wZXIgPSB7XG5cdGR1bXA6IGR1bXBfMVxufTtcblxuZnVuY3Rpb24gcmVuYW1lZChmcm9tLCB0bykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24geWFtbC4nICsgZnJvbSArICcgaXMgcmVtb3ZlZCBpbiBqcy15YW1sIDQuICcgK1xuICAgICAgJ1VzZSB5YW1sLicgKyB0byArICcgaW5zdGVhZCwgd2hpY2ggaXMgbm93IHNhZmUgYnkgZGVmYXVsdC4nKTtcbiAgfTtcbn1cblxuXG52YXIgVHlwZSAgICAgICAgICAgICAgICA9IHR5cGU7XG52YXIgU2NoZW1hICAgICAgICAgICAgICA9IHNjaGVtYTtcbnZhciBGQUlMU0FGRV9TQ0hFTUEgICAgID0gZmFpbHNhZmU7XG52YXIgSlNPTl9TQ0hFTUEgICAgICAgICA9IGpzb247XG52YXIgQ09SRV9TQ0hFTUEgICAgICAgICA9IGNvcmU7XG52YXIgREVGQVVMVF9TQ0hFTUEgICAgICA9IF9kZWZhdWx0O1xudmFyIGxvYWQgICAgICAgICAgICAgICAgPSBsb2FkZXIubG9hZDtcbnZhciBsb2FkQWxsICAgICAgICAgICAgID0gbG9hZGVyLmxvYWRBbGw7XG52YXIgZHVtcCAgICAgICAgICAgICAgICA9IGR1bXBlci5kdW1wO1xudmFyIFlBTUxFeGNlcHRpb24gICAgICAgPSBleGNlcHRpb247XG5cbi8vIFJlLWV4cG9ydCBhbGwgdHlwZXMgaW4gY2FzZSB1c2VyIHdhbnRzIHRvIGNyZWF0ZSBjdXN0b20gc2NoZW1hXG52YXIgdHlwZXMgPSB7XG4gIGJpbmFyeTogICAgYmluYXJ5LFxuICBmbG9hdDogICAgIGZsb2F0LFxuICBtYXA6ICAgICAgIG1hcCxcbiAgbnVsbDogICAgICBfbnVsbCxcbiAgcGFpcnM6ICAgICBwYWlycyxcbiAgc2V0OiAgICAgICBzZXQsXG4gIHRpbWVzdGFtcDogdGltZXN0YW1wLFxuICBib29sOiAgICAgIGJvb2wsXG4gIGludDogICAgICAgaW50LFxuICBtZXJnZTogICAgIG1lcmdlLFxuICBvbWFwOiAgICAgIG9tYXAsXG4gIHNlcTogICAgICAgc2VxLFxuICBzdHI6ICAgICAgIHN0clxufTtcblxuLy8gUmVtb3ZlZCBmdW5jdGlvbnMgZnJvbSBKUy1ZQU1MIDMuMC54XG52YXIgc2FmZUxvYWQgICAgICAgICAgICA9IHJlbmFtZWQoJ3NhZmVMb2FkJywgJ2xvYWQnKTtcbnZhciBzYWZlTG9hZEFsbCAgICAgICAgID0gcmVuYW1lZCgnc2FmZUxvYWRBbGwnLCAnbG9hZEFsbCcpO1xudmFyIHNhZmVEdW1wICAgICAgICAgICAgPSByZW5hbWVkKCdzYWZlRHVtcCcsICdkdW1wJyk7XG5cbnZhciBqc1lhbWwgPSB7XG5cdFR5cGU6IFR5cGUsXG5cdFNjaGVtYTogU2NoZW1hLFxuXHRGQUlMU0FGRV9TQ0hFTUE6IEZBSUxTQUZFX1NDSEVNQSxcblx0SlNPTl9TQ0hFTUE6IEpTT05fU0NIRU1BLFxuXHRDT1JFX1NDSEVNQTogQ09SRV9TQ0hFTUEsXG5cdERFRkFVTFRfU0NIRU1BOiBERUZBVUxUX1NDSEVNQSxcblx0bG9hZDogbG9hZCxcblx0bG9hZEFsbDogbG9hZEFsbCxcblx0ZHVtcDogZHVtcCxcblx0WUFNTEV4Y2VwdGlvbjogWUFNTEV4Y2VwdGlvbixcblx0dHlwZXM6IHR5cGVzLFxuXHRzYWZlTG9hZDogc2FmZUxvYWQsXG5cdHNhZmVMb2FkQWxsOiBzYWZlTG9hZEFsbCxcblx0c2FmZUR1bXA6IHNhZmVEdW1wXG59O1xuXG5leHBvcnQgeyBDT1JFX1NDSEVNQSwgREVGQVVMVF9TQ0hFTUEsIEZBSUxTQUZFX1NDSEVNQSwgSlNPTl9TQ0hFTUEsIFNjaGVtYSwgVHlwZSwgWUFNTEV4Y2VwdGlvbiwganNZYW1sIGFzIGRlZmF1bHQsIGR1bXAsIGxvYWQsIGxvYWRBbGwsIHNhZmVEdW1wLCBzYWZlTG9hZCwgc2FmZUxvYWRBbGwsIHR5cGVzIH07XG4iLCAiaW1wb3J0IHR5cGUgeyBUYWcgfSBmcm9tIFwiLi90YXhvbm9teS5qc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRhZ1Jlc3VsdCB7XG4gIHRhZ3M6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRhZ2dlck9wdGlvbnMge1xuICBvbGxhbWFVcmw6IHN0cmluZztcbiAgbW9kZWw6IHN0cmluZztcbiAgbWF4Tm90ZUxlbmd0aD86IG51bWJlcjtcbn1cblxuY29uc3QgREVGQVVMVF9NQVhfTk9URV9MRU5HVEggPSA0MDAwO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRQcm9tcHQobm90ZUJvZHk6IHN0cmluZywgdGFnczogVGFnW10sIG5vdGVQYXRoOiBzdHJpbmcsIG1heExlbjogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgdGFnTGlzdCA9IHRhZ3MubWFwKCh0KSA9PiBgLSAke3QucGF0aH06ICR7dC5kZXNjfWApLmpvaW4oXCJcXG5cIik7XG5cbiAgY29uc3QgdHJpbW1lZEJvZHkgPVxuICAgIG5vdGVCb2R5Lmxlbmd0aCA+IG1heExlblxuICAgICAgPyBub3RlQm9keS5zbGljZSgwLCBtYXhMZW4pICsgXCJcXG5cXG5bdHJ1bmNhdGVkXVwiXG4gICAgICA6IG5vdGVCb2R5O1xuXG4gIHJldHVybiBgWW91IGFyZSBhIGNsYXNzaWZpY2F0aW9uIHN5c3RlbS4gWW91IGRvIE5PVCBhbnN3ZXIgcXVlc3Rpb25zLiBZb3UgZG8gTk9UIHN1bW1hcml6ZS4gWW91IGRvIE5PVCByZXNwb25kIHRvIHRoZSBjb250ZW50LiBZb3UgT05MWSBvdXRwdXQgYSBKU09OIG9iamVjdCB3aXRoIHRhZ3MuXG5cbllvdXIgdGFzazogcmVhZCB0aGUgbm90ZSBiZWxvdyBhbmQgY2xhc3NpZnkgaXQgYnkgYXNzaWduaW5nIHRhZ3MgZnJvbSB0aGUgcHJvdmlkZWQgdGF4b25vbXkuXG5cbiMjIFJ1bGVzXG4tIFBpY2sgQUxMIHRhZ3MgdGhhdCBhcHBseSwgYnV0IGRvIG5vdCBvdmVyLXRhZy4gVHlwaWNhbGx5IDItNSB0YWdzIHBlciBub3RlLlxuLSBPTkxZIHVzZSB0YWdzIGZyb20gdGhlIGxpc3QgYmVsb3cuIERvIG5vdCBpbnZlbnQgbmV3IHRhZ3MuXG4tIEEgcGFyZW50IHRhZyAoZS5nLiBwcm9kdWN0L2FlbS1hc3NldHMpIGNhbiBiZSB1c2VkIGFsb25nc2lkZSBpdHMgY2hpbGRyZW4gKGUuZy4gcHJvZHVjdC9hZW0tYXNzZXRzL2R5bmFtaWMtbWVkaWEpIGlmIGJvdGggZ2VudWluZWx5IGFwcGx5LlxuLSBJZiB0aGUgbm90ZSBpcyB0b28gc2hvcnQgb3IgZW1wdHkgdG8gbWVhbmluZ2Z1bGx5IHRhZywgcmV0dXJuIHtcInRhZ3NcIjogW119LlxuLSBSZXNwb25kIHdpdGggT05MWSB2YWxpZCBKU09OLiBObyBtYXJrZG93biwgbm8gZXhwbGFuYXRpb24sIG5vIGNvbW1lbnRhcnkuXG5cbiMjIEF2YWlsYWJsZSB0YWdzXG4ke3RhZ0xpc3R9XG5cbiMjIFJlcXVpcmVkIEpTT04gcmVzcG9uc2UgZm9ybWF0XG57XCJ0YWdzXCI6IFtcInRhZy9wYXRoXCIsIC4uLl19XG5cbiMjIEZpbGUgcGF0aCAodXNlIGFzIGFkZGl0aW9uYWwgY29udGV4dCBmb3IgY2xhc3NpZmljYXRpb24pXG4ke25vdGVQYXRofVxuXG4jIyBOb3RlIHRvIGNsYXNzaWZ5XG4ke3RyaW1tZWRCb2R5fWA7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0YWdOb3RlKFxuICBub3RlQm9keTogc3RyaW5nLFxuICB0YWdzOiBUYWdbXSxcbiAgbm90ZVBhdGg6IHN0cmluZyxcbiAgb3B0aW9uczogVGFnZ2VyT3B0aW9uc1xuKTogUHJvbWlzZTxUYWdSZXN1bHQ+IHtcbiAgY29uc3QgbWF4TGVuID0gb3B0aW9ucy5tYXhOb3RlTGVuZ3RoID8/IERFRkFVTFRfTUFYX05PVEVfTEVOR1RIO1xuICBjb25zdCBwcm9tcHQgPSBidWlsZFByb21wdChub3RlQm9keSwgdGFncywgbm90ZVBhdGgsIG1heExlbik7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtvcHRpb25zLm9sbGFtYVVybH0vYXBpL2dlbmVyYXRlYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIG1vZGVsOiBvcHRpb25zLm1vZGVsLFxuICAgICAgcHJvbXB0LFxuICAgICAgc3RyZWFtOiBmYWxzZSxcbiAgICAgIGZvcm1hdDogXCJqc29uXCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHRlbXBlcmF0dXJlOiAwLjEsXG4gICAgICAgIG51bV9wcmVkaWN0OiAyNTYsXG4gICAgICB9LFxuICAgIH0pLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBPbGxhbWEgcmV0dXJuZWQgJHtyZXNwb25zZS5zdGF0dXN9OiAke2F3YWl0IHJlc3BvbnNlLnRleHQoKX1gKTtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSAoYXdhaXQgcmVzcG9uc2UuanNvbigpKSBhcyB7IHJlc3BvbnNlOiBzdHJpbmcgfTtcbiAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhLnJlc3BvbnNlKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblxuICBpZiAoIXBhcnNlZC50YWdzKSB7XG4gICAgcmV0dXJuIHsgdGFnczogW10gfTtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShwYXJzZWQudGFncykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgcmVzcG9uc2Ugc2hhcGU6ICR7ZGF0YS5yZXNwb25zZX1gKTtcbiAgfVxuXG4gIHJldHVybiB7IHRhZ3M6IHBhcnNlZC50YWdzIH07XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBLVGFnUGx1Z2luIGZyb20gXCIuL21haW4uanNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBLVGFnU2V0dGluZ3Mge1xuICBvbGxhbWFVcmw6IHN0cmluZztcbiAgbW9kZWw6IHN0cmluZztcbiAgdGF4b25vbXlZYW1sOiBzdHJpbmc7XG4gIGF1dG9UYWc6IGJvb2xlYW47XG4gIGRlYm91bmNlU2Vjb25kczogbnVtYmVyO1xuICBjaGFuZ2VUaHJlc2hvbGQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEtUYWdTZXR0aW5ncyA9IHtcbiAgb2xsYW1hVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MTE0MzRcIixcbiAgbW9kZWw6IFwicXdlbjIuNS1jb2Rlcjo3YlwiLFxuICB0YXhvbm9teVlhbWw6IGBkb21haW46XG4gIHdvcms6IFwiQW55dGhpbmcgcmVsYXRlZCB0byB3b3JrIG9yIGVtcGxveW1lbnRcIlxuICBwZXJzb25hbDogXCJQZXJzb25hbCBsaWZlLCBob2JiaWVzLCBub24td29ya1wiXG5cbnR5cGU6XG4gIG1lZXRpbmctbm90ZXM6IFwiTWVldGluZyBub3RlcywgY2FsbCBzdW1tYXJpZXNcIlxuICBsZWFybmluZzogXCJUZWNobmljYWwgcmVmZXJlbmNlLCBzdHVkeSBub3RlcywgdHJhaW5pbmdcIlxuICBwbGFubmluZzogXCJSb2FkbWFwcywgc3RyYXRlZ3ksIGFyY2hpdGVjdHVyZSBkZWNpc2lvbnNcIlxuICByZWZsZWN0aW9uOiBcIlNlbGYtYXNzZXNzbWVudCwgcmV2aWV3cywgZmVlZGJhY2tcIlxuICBicmFpbnN0b3JtOiBcIklkZWFzLCBjb25jZXB0cywgZWFybHktc3RhZ2UgdGhpbmtpbmdcIlxuICB0YXNrLWxpc3Q6IFwiVE9ETyBvciBhY3Rpb24gaXRlbSBub3Rlc1wiXG4gIHJlZmVyZW5jZTogXCJMaW5rIGNvbGxlY3Rpb25zLCB0ZW1wbGF0ZXMsIGxvb2t1cCBtYXRlcmlhbFwiYCxcbiAgYXV0b1RhZzogdHJ1ZSxcbiAgZGVib3VuY2VTZWNvbmRzOiAzMCxcbiAgY2hhbmdlVGhyZXNob2xkOiAxMDAsXG59O1xuXG5leHBvcnQgY2xhc3MgS1RhZ1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBLVGFnUGx1Z2luO1xuICBwcml2YXRlIHByb2dyZXNzQ29udGFpbmVyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHByb2dyZXNzQmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHByb2dyZXNzTGFiZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3RvcEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBLVGFnUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJDb25uZWN0aW9uXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiT2xsYW1hIFVSTFwiKVxuICAgICAgLnNldERlc2MoXCJVUkwgb2YgeW91ciBsb2NhbCBPbGxhbWEgc2VydmVyXCIpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcImh0dHA6Ly9sb2NhbGhvc3Q6MTE0MzRcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mub2xsYW1hVXJsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm9sbGFtYVVybCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTW9kZWxcIilcbiAgICAgIC5zZXREZXNjKFwiT2xsYW1hIG1vZGVsIHRvIHVzZSBmb3IgdGFnZ2luZ1wiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJxd2VuMi41LWNvZGVyOjdiXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGVsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGVsID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkF1dG8tdGFnZ2luZ1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF1dG8tdGFnIG9uIGVkaXRcIilcbiAgICAgIC5zZXREZXNjKFwiQXV0b21hdGljYWxseSByZS10YWcgbm90ZXMgd2hlbiBjb250ZW50IGNoYW5nZXMgc2lnbmlmaWNhbnRseVwiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b1RhZylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvVGFnID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHVwQXV0b1RhZygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlYm91bmNlIChzZWNvbmRzKVwiKVxuICAgICAgLnNldERlc2MoXCJXYWl0IHRoaXMgbG9uZyBhZnRlciB0aGUgbGFzdCBlZGl0IGJlZm9yZSBhdXRvLXRhZ2dpbmdcIilcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiMzBcIilcbiAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlYm91bmNlU2Vjb25kcykpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4obnVtKSAmJiBudW0gPiAwKSB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlYm91bmNlU2Vjb25kcyA9IG51bTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ2hhbmdlIHRocmVzaG9sZCAoY2hhcmFjdGVycylcIilcbiAgICAgIC5zZXREZXNjKFwiTWluaW11bSBjaGFyYWN0ZXIgZGlmZmVyZW5jZSBmcm9tIGxhc3QgdGFnZ2luZyBiZWZvcmUgYXV0by10YWcgdHJpZ2dlcnNcIilcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiMTAwXCIpXG4gICAgICAgICAgLnNldFZhbHVlKFN0cmluZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jaGFuZ2VUaHJlc2hvbGQpKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG51bSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKG51bSkgJiYgbnVtID49IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2hhbmdlVGhyZXNob2xkID0gbnVtO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkJhdGNoIHRhZ2dpbmdcIiB9KTtcblxuICAgIC8vIFRhZyBhbGwgLyBSZS10YWcgYWxsIGJ1dHRvbnMgKyBwcm9ncmVzcyBiYXJcbiAgICBjb25zdCBiYXRjaFNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVGFnIGFsbCBub3Rlc1wiKVxuICAgICAgLnNldERlc2MoXCJSdW4gdGhlIHRhZ2dlciBhY3Jvc3MgeW91ciBlbnRpcmUgdmF1bHRcIik7XG5cbiAgICBiYXRjaFNldHRpbmcuYWRkQnV0dG9uKChidG4pID0+XG4gICAgICBidG5cbiAgICAgICAgLnNldEJ1dHRvblRleHQoXCJUYWcgdW50YWdnZWRcIilcbiAgICAgICAgLnNldEN0YSgpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMucnVuQmF0Y2goZmFsc2UpKVxuICAgICk7XG5cbiAgICBiYXRjaFNldHRpbmcuYWRkQnV0dG9uKChidG4pID0+XG4gICAgICBidG5cbiAgICAgICAgLnNldEJ1dHRvblRleHQoXCJSZS10YWcgYWxsXCIpXG4gICAgICAgIC5zZXRXYXJuaW5nKClcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdGhpcy5ydW5CYXRjaCh0cnVlKSlcbiAgICApO1xuXG4gICAgLy8gUHJvZ3Jlc3MgY29udGFpbmVyIChoaWRkZW4gYnkgZGVmYXVsdClcbiAgICB0aGlzLnByb2dyZXNzQ29udGFpbmVyID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcImt0YWctcHJvZ3Jlc3MtY29udGFpbmVyXCIgfSk7XG4gICAgdGhpcy5wcm9ncmVzc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdGhpcy5wcm9ncmVzc0NvbnRhaW5lci5zdHlsZS5tYXJnaW5Ub3AgPSBcIjEycHhcIjtcblxuICAgIHRoaXMucHJvZ3Jlc3NMYWJlbCA9IHRoaXMucHJvZ3Jlc3NDb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcImt0YWctcHJvZ3Jlc3MtbGFiZWxcIiB9KTtcbiAgICB0aGlzLnByb2dyZXNzTGFiZWwuc3R5bGUuZm9udFNpemUgPSBcIjEycHhcIjtcbiAgICB0aGlzLnByb2dyZXNzTGFiZWwuc3R5bGUubWFyZ2luQm90dG9tID0gXCI0cHhcIjtcbiAgICB0aGlzLnByb2dyZXNzTGFiZWwuc3R5bGUuY29sb3IgPSBcInZhcigtLXRleHQtbXV0ZWQpXCI7XG5cbiAgICBjb25zdCBiYXJPdXRlciA9IHRoaXMucHJvZ3Jlc3NDb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcImt0YWctcHJvZ3Jlc3MtYmFyLW91dGVyXCIgfSk7XG4gICAgYmFyT3V0ZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICBiYXJPdXRlci5zdHlsZS5oZWlnaHQgPSBcIjhweFwiO1xuICAgIGJhck91dGVyLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiNHB4XCI7XG4gICAgYmFyT3V0ZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcilcIjtcbiAgICBiYXJPdXRlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG5cbiAgICB0aGlzLnByb2dyZXNzQmFyID0gYmFyT3V0ZXIuY3JlYXRlRGl2KHsgY2xzOiBcImt0YWctcHJvZ3Jlc3MtYmFyLWlubmVyXCIgfSk7XG4gICAgdGhpcy5wcm9ncmVzc0Jhci5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICB0aGlzLnByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIwJVwiO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCI0cHhcIjtcbiAgICB0aGlzLnByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KVwiO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUudHJhbnNpdGlvbiA9IFwid2lkdGggMC4ycyBlYXNlXCI7XG5cbiAgICBjb25zdCBzdG9wQ29udGFpbmVyID0gdGhpcy5wcm9ncmVzc0NvbnRhaW5lci5jcmVhdGVEaXYoKTtcbiAgICBzdG9wQ29udGFpbmVyLnN0eWxlLm1hcmdpblRvcCA9IFwiOHB4XCI7XG4gICAgdGhpcy5zdG9wQnV0dG9uID0gc3RvcENvbnRhaW5lci5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiU3RvcFwiIH0pO1xuICAgIHRoaXMuc3RvcEJ1dHRvbi5zdHlsZS5mb250U2l6ZSA9IFwiMTJweFwiO1xuICAgIHRoaXMuc3RvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uY2FuY2VsQmF0Y2goKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIlRheG9ub215XCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVGFnIHRheG9ub215XCIpXG4gICAgICAuc2V0RGVzYyhcIllBTUwgZGVmaW5pdGlvbiBvZiB5b3VyIHRhZyBoaWVyYXJjaHlcIilcbiAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkVudGVyIHlvdXIgdGF4b25vbXkgWUFNTC4uLlwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50YXhvbm9teVlhbWwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGF4b25vbXlZYW1sID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIGNvbnN0IHRheG9ub215VGV4dGFyZWEgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCJ0ZXh0YXJlYVwiXG4gICAgKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0YXhvbm9teVRleHRhcmVhKSB7XG4gICAgICB0YXhvbm9teVRleHRhcmVhLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICB0YXhvbm9teVRleHRhcmVhLnN0eWxlLmhlaWdodCA9IFwiMzAwcHhcIjtcbiAgICAgIHRheG9ub215VGV4dGFyZWEuc3R5bGUuZm9udEZhbWlseSA9IFwibW9ub3NwYWNlXCI7XG4gICAgICB0YXhvbm9teVRleHRhcmVhLnN0eWxlLmZvbnRTaXplID0gXCIxMnB4XCI7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBydW5CYXRjaChmb3JjZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLnByb2dyZXNzQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnByb2dyZXNzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoMCwgMCwgXCJTdGFydGluZy4uLlwiKTtcblxuICAgIGF3YWl0IHRoaXMucGx1Z2luLnRhZ0FsbE5vdGVzV2l0aFByb2dyZXNzKGZvcmNlLCAoY3VycmVudCwgdG90YWwsIG5hbWUsIHN0YXRzKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKGN1cnJlbnQsIHRvdGFsLCBuYW1lLCBzdGF0cyk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVQcm9ncmVzcyhcbiAgICBjdXJyZW50OiBudW1iZXIsXG4gICAgdG90YWw6IG51bWJlcixcbiAgICBub3RlTmFtZTogc3RyaW5nLFxuICAgIHN0YXRzPzogeyB0YWdnZWQ6IG51bWJlcjsgc2tpcHBlZDogbnVtYmVyOyBmYWlsZWQ6IG51bWJlciB9XG4gICkge1xuICAgIGlmICghdGhpcy5wcm9ncmVzc0JhciB8fCAhdGhpcy5wcm9ncmVzc0xhYmVsKSByZXR1cm47XG5cbiAgICBjb25zdCBwY3QgPSB0b3RhbCA+IDAgPyBNYXRoLnJvdW5kKChjdXJyZW50IC8gdG90YWwpICogMTAwKSA6IDA7XG4gICAgdGhpcy5wcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblxuICAgIGlmIChzdGF0cyAmJiBjdXJyZW50ID09PSB0b3RhbCkge1xuICAgICAgdGhpcy5wcm9ncmVzc0xhYmVsLnRleHRDb250ZW50ID1cbiAgICAgICAgYERvbmUuIFRhZ2dlZDogJHtzdGF0cy50YWdnZWR9LCBTa2lwcGVkOiAke3N0YXRzLnNraXBwZWR9LCBGYWlsZWQ6ICR7c3RhdHMuZmFpbGVkfWA7XG4gICAgICBpZiAodGhpcy5zdG9wQnV0dG9uKSB0aGlzLnN0b3BCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb2dyZXNzTGFiZWwudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50fS8ke3RvdGFsfSBcdTIwMTQgJHtub3RlTmFtZX1gO1xuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBQTBEOzs7QUNFMUQsU0FBUyxVQUFVLFNBQVM7QUFDMUIsU0FBUSxPQUFPLFlBQVksZUFBaUIsWUFBWTtBQUMxRDtBQUdBLFNBQVMsU0FBUyxTQUFTO0FBQ3pCLFNBQVEsT0FBTyxZQUFZLFlBQWMsWUFBWTtBQUN2RDtBQUdBLFNBQVMsUUFBUSxVQUFVO0FBQ3pCLE1BQUksTUFBTSxRQUFRLFFBQVEsRUFBRyxRQUFPO0FBQUEs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LElBQUksVUFBVSxPQUFPLEdBQUc7QUFDM0QsVUFBSSx3QkFBTyxnQkFBZ0IsR0FBRyxFQUFFO0FBQUEsSUFDbEM7QUFBQSxFQUNGO0FBQUEsRUFFQSxjQUFjO0FBQ1osU0FBSyxpQkFBaUI7QUFBQSxFQUN4QjtBQUFBLEVBRUEsTUFBTSx3QkFDSixPQUNBLFlBTUE7QUFDQSxRQUFJO0FBQ0osUUFBSTtBQUNGLGFBQU8sS0FBSyxTQUFTO0FBQUEsSUFDdkIsUUFBUTtBQUNOLFVBQUksd0JBQU8sa0RBQTZDO0FBQ3hEO0FBQUEsSUFDRjtBQUVBLFVBQU0sUUFBUSxLQUFLLElBQUksTUFBTSxpQkFBaUI7QUFDOUMsUUFBSSxTQUFTO0FBQ2IsUUFBSSxVQUFVO0FBQ2QsUUFBSSxTQUFTO0FBQ2IsU0FBSyxpQkFBaUI7QUFFdEIsYUFBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUNyQyxVQUFJLEtBQUssZ0JBQWdCO0FBQ3ZCLFlBQUksd0JBQU8seUJBQXlCLE1BQU0sY0FBYyxPQUFPLGFBQWEsTUFBTSxFQUFFO0FBQ3BGLG1CQUFXLEdBQUcsTUFBTSxRQUFRLGFBQWEsRUFBRSxRQUFRLFNBQVMsT0FBTyxDQUFDO0FBQ3BFO0FBQUEsTUFDRjtBQUVBLFlBQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsaUJBQVcsR0FBRyxNQUFNLFFBQVEsS0FBSyxVQUFVLEVBQUUsUUFBUSxTQUFTLE9BQU8sQ0FBQztBQUV0RSxZQUFNLEtBQUssS0FBSyxJQUFJLGNBQWMsYUFBYSxJQUFJLEdBQUc7QUFDdEQsVUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxHQUFHLEtBQUssU0FBUyxHQUFHO0FBQ3RFO0FBQ0E7QUFBQSxNQUNGO0FBRUEsVUFBSTtBQUNGLGNBQU0sS0FBSyxRQUFRLE1BQU0sSUFBSTtBQUM3QjtBQUFBLE1BQ0YsUUFBUTtBQUNOO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQSxlQUFXLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxFQUFFLFFBQVEsU0FBUyxPQUFPLENBQUM7QUFDdEUsUUFBSSx3QkFBTyxzQkFBc0IsTUFBTSxjQUFjLE9BQU8sYUFBYSxNQUFNLEVBQUU7QUFBQSxFQUNuRjtBQUFBLEVBRUEsTUFBYyxZQUFZLE9BQWdCO0FBQ3hDLFVBQU0sS0FBSyx3QkFBd0IsT0FBTyxNQUFNO0FBQUEsSUFBQyxDQUFDO0FBQUEsRUFDcEQ7QUFDRjsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgImV4Y2VwdGlvbiIsICJtYXAiLCAic2NoZW1hIiwgInR5cGUiLCAiZXh0ZW5kIiwgInN0ciIsICJzdHJpbmciXQp9Cg==
