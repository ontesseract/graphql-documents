"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mode = void 0;
exports.generateFragmentsForType = generateFragmentsForType;
exports.generateFragments = generateFragments;
var graphql_1 = require("graphql");
var graphql_utils_1 = require("./graphql-utils");
var Mode;
(function (Mode) {
    Mode[Mode["RECURSIVE_NOT_CIRCULAR"] = 0] = "RECURSIVE_NOT_CIRCULAR";
    Mode[Mode["SCALARS_ONLY"] = 1] = "SCALARS_ONLY";
    Mode[Mode["TWO_LEVELS"] = 2] = "TWO_LEVELS";
})(Mode || (exports.Mode = Mode = {}));
// const scalarsOnlySuffix = "Flat";
var withRelationshipsSuffix = "WithRelationships";
function printField(field, parentType, parentsAndSiblings, mode, indent) {
    if (indent === void 0) { indent = 1; }
    var baseType = (0, graphql_utils_1.getBaseType)(field.type);
    if ((0, graphql_1.isScalarType)(baseType) || (0, graphql_1.isEnumType)(baseType)) {
        return field.name;
    }
    if ((0, graphql_1.isObjectType)(baseType)) {
        if (mode === Mode.SCALARS_ONLY && (0, graphql_utils_1.hasScalars)(parentType)) {
            return null;
        }
        if (parentsAndSiblings.includes(baseType.name)) {
            return null;
        }
        if (mode === Mode.TWO_LEVELS) {
            return "".concat(field.name, " {\n        ...").concat(baseType.name, "\n      }");
        }
        // recurse without circular references
        var siblings_1 = [];
        Object.values(parentType.getFields()).forEach(function (siblingField) {
            var baseSiblingType = (0, graphql_utils_1.getBaseType)(siblingField.type);
            if ((0, graphql_1.isObjectType)(baseSiblingType) &&
                baseSiblingType.name !== baseType.name) {
                siblings_1.push(baseSiblingType.name);
            }
        });
        var fields = generateFields(baseType, __spreadArray(__spreadArray(__spreadArray([], parentsAndSiblings, true), siblings_1, true), [baseType.name], false), mode, indent + 1);
        return "".concat(field.name, " {\n      ").concat(fields, "\n    }");
    }
    return null;
}
function generateFields(type, parentsAndSiblings, mode, indent) {
    if (indent === void 0) { indent = 1; }
    var printedFields = [];
    var fields = type.getFields();
    Object.keys(fields).forEach(function (key) {
        var printedField = printField(fields[key], type, parentsAndSiblings, mode, indent);
        if (printedField) {
            printedFields.push(printedField);
        }
    });
    return printedFields.join("\n");
}
function generateFragmentsForType(schema, typeName, mode, prefix, suffix) {
    if (mode === void 0) { mode = Mode.SCALARS_ONLY; }
    var type = schema.getType(typeName);
    if (!(0, graphql_1.isObjectType)(type)) {
        throw new Error("Type ".concat(typeName, " is not an object type"));
    }
    var queryType = schema.getQueryType();
    var mutationType = schema.getMutationType();
    var subscriptionType = schema.getSubscriptionType();
    if (typeName.startsWith("__") ||
        typeName === (queryType === null || queryType === void 0 ? void 0 : queryType.name) ||
        typeName === (mutationType === null || mutationType === void 0 ? void 0 : mutationType.name) ||
        typeName === (subscriptionType === null || subscriptionType === void 0 ? void 0 : subscriptionType.name)) {
        throw new Error("Type ".concat(typeName, " is not a supported type"));
    }
    var fragments = [];
    var fields = generateFields(type, [type.name], mode);
    if (mode === Mode.TWO_LEVELS) {
        suffix = suffix
            ? "".concat(suffix).concat(withRelationshipsSuffix)
            : withRelationshipsSuffix;
    }
    var standardFragment = "fragment ".concat(prefix !== null && prefix !== void 0 ? prefix : "").concat(typeName).concat(suffix !== null && suffix !== void 0 ? suffix : "", " on ").concat(typeName, " {\n    ").concat(fields, "\n  }");
    fragments.push(standardFragment);
    if (mode === Mode.TWO_LEVELS) {
        var scalarFields = generateFields(type, [type.name], Mode.SCALARS_ONLY);
        if (scalarFields.length) {
            var scalarsFragment = "fragment ".concat(typeName, " on ").concat(typeName, " {\n        ").concat(scalarFields, "\n      }");
            fragments.push(scalarsFragment);
        }
    }
    return fragments;
}
function generateFragments(schema, config, mode) {
    if (mode === void 0) { mode = Mode.SCALARS_ONLY; }
    var fragmentPrefix = config.fragmentPrefix, fragmentSuffix = config.fragmentSuffix, fragmentOverrides = config.fragmentOverrides;
    var typeNames = Object.keys(schema.getTypeMap());
    var fragments = [];
    typeNames.forEach(function (typeName) {
        var _a;
        if ((0, graphql_utils_1.endsWithOneOf)(typeName, (_a = config.excludeSuffixes) !== null && _a !== void 0 ? _a : [])) {
            return;
        }
        try {
            if (fragmentOverrides === null || fragmentOverrides === void 0 ? void 0 : fragmentOverrides[typeName]) {
                fragments.push(fragmentOverrides[typeName]);
            }
            else {
                fragments.push.apply(fragments, generateFragmentsForType(schema, typeName, mode, fragmentPrefix, fragmentSuffix));
            }
        }
        catch (e) {
            // fragments.push(
            //   `# Error generating fragments for type ${typeName}: ${e.message}`
            // );
            // Ignore
        }
    });
    return "# Fragments\n\n".concat(fragments.join("\n\n"), "\n\n");
}
