"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endsWithOneOf = endsWithOneOf;
exports.getOutputTypeName = getOutputTypeName;
exports.getBaseType = getBaseType;
exports.getBaseInputType = getBaseInputType;
exports.hasScalars = hasScalars;
exports.generateVariables = generateVariables;
exports.generateArgs = generateArgs;
exports.returnFieldMatchesOperationName = returnFieldMatchesOperationName;
exports.hasLimitAndOffsetArgs = hasLimitAndOffsetArgs;
exports.documentToDocument = documentToDocument;
exports.getOperationName = getOperationName;
exports.documentToString = documentToString;
var case_1 = __importDefault(require("case"));
var graphql_1 = require("graphql");
function endsWithOneOf(value, suffixes) {
    for (var _i = 0, suffixes_1 = suffixes; _i < suffixes_1.length; _i++) {
        var suffix = suffixes_1[_i];
        if (value.endsWith(suffix)) {
            return true;
        }
    }
    return false;
}
function getOutputTypeName(type) {
    if ((0, graphql_1.isObjectType)(type) || (0, graphql_1.isScalarType)(type) || (0, graphql_1.isEnumType)(type)) {
        return type.name;
    }
    if ((0, graphql_1.isListType)(type) || (0, graphql_1.isNonNullType)(type)) {
        return getOutputTypeName(type.ofType);
    }
    throw new Error("Unknown type");
}
function getBaseType(type) {
    if ((0, graphql_1.isNonNullType)(type) || (0, graphql_1.isListType)(type)) {
        return getBaseType(type.ofType);
    }
    return type;
}
function getBaseInputType(type) {
    if ((0, graphql_1.isNonNullType)(type) || (0, graphql_1.isListType)(type)) {
        return getBaseInputType(type.ofType);
    }
    return type;
}
function hasScalars(type) {
    for (var _i = 0, _a = Object.values(type.getFields()); _i < _a.length; _i++) {
        var field = _a[_i];
        var baseFieldType = getBaseType(field.type);
        if ((0, graphql_1.isScalarType)(baseFieldType)) {
            return true;
        }
    }
    return false;
}
function defaultValueForVariableName(argName) {
    switch (argName) {
        case "_append":
        case "_deleteAtPath":
        case "_deleteElem":
        case "_deleteKey":
        case "_inc":
        case "_prepend":
        case "_set":
            return " = {}";
        default:
            return "";
    }
}
function generateVariables(field, excludeKeys) {
    if (excludeKeys === void 0) { excludeKeys = []; }
    if (field.args.length > 0) {
        var variables_1 = [];
        field.args.forEach(function (arg) {
            if (!excludeKeys.includes(arg.name)) {
                variables_1.push("$".concat(arg.name, ": ").concat(arg.type).concat(defaultValueForVariableName(arg.name)));
            }
        });
        return "(".concat(variables_1.join(", "), ")");
    }
    return "";
}
function generateOnConflict(field, upsert, schema) {
    if (schema === void 0) { schema = undefined; }
    if (!schema ||
        !upsert ||
        !field.args.find(function (arg) { return arg.name === "onConflict"; })) {
        return "";
    }
    var baseTypeName = field.name;
    if (baseTypeName.startsWith("insert")) {
        baseTypeName = baseTypeName.slice(6);
    }
    if (baseTypeName.endsWith("One")) {
        baseTypeName = baseTypeName.slice(0, baseTypeName.length - 3);
    }
    var type = schema.getType("".concat(baseTypeName, "InsertInput"));
    if (!(0, graphql_1.isInputObjectType)(type)) {
        return "";
    }
    var excludeColumns = ["id", "createdAt", "updatedAt", "deletedAt"];
    var typeFields = Object.values(type.getFields());
    var updateColumns = typeFields
        .filter(function (field) {
        return !excludeColumns.includes(field.name) &&
            (0, graphql_1.isScalarType)(getBaseInputType(field.type));
    })
        .map(function (field) { return field.name; });
    var constraint = "".concat(case_1.default.snake(baseTypeName), "_pkey");
    var onConflict = "onConflict:{ constraint:".concat(constraint, " updateColumns:[").concat(updateColumns.join(", "), "]}");
    return "\n".concat(onConflict);
}
function generateArgs(field, excludeKeys, upsert, schema) {
    if (excludeKeys === void 0) { excludeKeys = []; }
    if (upsert === void 0) { upsert = false; }
    if (schema === void 0) { schema = undefined; }
    if (field.args.length > 0) {
        var args_1 = [];
        field.args.forEach(function (arg) {
            if (!excludeKeys.includes(arg.name)) {
                args_1.push("".concat(arg.name, ": $").concat(arg.name));
            }
        });
        return "(".concat(args_1.join(", "), " ").concat(generateOnConflict(field, upsert, schema), ")");
    }
    return "";
}
function returnFieldMatchesOperationName(definition) {
    var _a, _b, _c, _d;
    for (var _i = 0, _e = definition.selectionSet.selections; _i < _e.length; _i++) {
        var node = _e[_i];
        if (node.kind === graphql_1.Kind.FIELD &&
            (((_a = node.alias) === null || _a === void 0 ? void 0 : _a.value) === ((_b = definition.name) === null || _b === void 0 ? void 0 : _b.value) ||
                (!node.alias && ((_c = node.name) === null || _c === void 0 ? void 0 : _c.value) === ((_d = definition.name) === null || _d === void 0 ? void 0 : _d.value)))) {
            return true;
        }
    }
    return false;
}
function hasLimitAndOffsetArgs(definition) {
    var _a;
    var hasLimit = false;
    var hasOffset = false;
    for (var _i = 0, _b = (_a = definition.variableDefinitions) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
        var node = _b[_i];
        if (node.variable.name.value === "limit") {
            hasLimit = true;
        }
        if (node.variable.name.value === "offset") {
            hasOffset = true;
        }
    }
    return hasLimit && hasOffset;
}
function documentToDocument(document) {
    return typeof document === "string" ? (0, graphql_1.parse)(document) : document;
}
function getOperationName(document) {
    var _a;
    var doc = documentToDocument(document);
    for (var _i = 0, _b = doc.definitions; _i < _b.length; _i++) {
        var definition = _b[_i];
        if (definition.kind === graphql_1.Kind.OPERATION_DEFINITION) {
            return (_a = definition.name) === null || _a === void 0 ? void 0 : _a.value;
        }
    }
    return undefined;
}
function documentToString(document) {
    return typeof document === "string" ? document : (0, graphql_1.print)(document);
}
