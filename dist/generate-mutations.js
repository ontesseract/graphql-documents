"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMutations = generateMutations;
var case_1 = __importDefault(require("case"));
var pluralize_1 = __importDefault(require("pluralize"));
var graphql_utils_1 = require("./graphql-utils");
function generateMutation(mutationField, schema, config) {
    var _a, _b, _c, _d, _e, _f;
    var fragmentName = (0, graphql_utils_1.getOutputTypeName)(mutationField.type);
    var typePascalCase = case_1.default.pascal(fragmentName.replace("MutationResponse", ""));
    var typePascalCasePlural = (0, pluralize_1.default)(typePascalCase);
    var mutationName = mutationField.name;
    if (mutationName === "insert".concat(typePascalCase)) {
        mutationName = "insert".concat(typePascalCasePlural);
    }
    else if (mutationName === "insert".concat(typePascalCase, "One")) {
        mutationName = "insert".concat(typePascalCase);
    }
    else if (mutationName === "update".concat(typePascalCase)) {
        mutationName = "update".concat(typePascalCasePlural);
    }
    else if (mutationName === "update".concat(typePascalCase, "ByPk")) {
        mutationName = "update".concat(typePascalCase);
    }
    else if (mutationName === "delete".concat(typePascalCase)) {
        mutationName = "delete".concat(typePascalCasePlural);
    }
    else if (mutationName === "delete".concat(typePascalCase, "ByPk")) {
        mutationName = "delete".concat(typePascalCase);
    }
    var aliasName = mutationName === mutationField.name
        ? mutationName
        : "".concat(mutationName, ":").concat(mutationField.name);
    if ((_a = config.overrides) === null || _a === void 0 ? void 0 : _a[mutationName]) {
        return (_b = config.overrides) === null || _b === void 0 ? void 0 : _b[mutationName];
    }
    return "mutation ".concat(mutationName).concat((0, graphql_utils_1.generateVariables)(mutationField, (_c = config.excludeArgKeys) !== null && _c !== void 0 ? _c : []), " {\n    ").concat(aliasName).concat((0, graphql_utils_1.generateArgs)(mutationField, (_d = config.excludeArgKeys) !== null && _d !== void 0 ? _d : [], schema), " {\n      ...").concat((_e = config.fragmentPrefix) !== null && _e !== void 0 ? _e : "").concat(fragmentName).concat((_f = config.fragmentSuffix) !== null && _f !== void 0 ? _f : "", "\n    }\n  }");
}
function generateMutations(schema, config, upserts) {
    if (upserts === void 0) { upserts = false; }
    var fragmentPrefix = config.fragmentPrefix, fragmentSuffix = config.fragmentSuffix;
    var mutations = [];
    var mutationType = schema.getMutationType();
    if (!mutationType) {
        throw new Error("Mutation type not found");
    }
    var mutationFields = mutationType.getFields();
    Object.keys(mutationFields).forEach(function (key) {
        var _a;
        var mutationField = mutationFields[key];
        if ((0, graphql_utils_1.endsWithOneOf)(mutationField.name, (_a = config.excludeSuffixes) !== null && _a !== void 0 ? _a : [])) {
            return;
        }
        var mutation = generateMutation(mutationField, schema, config);
        mutations.push(mutation);
    });
    return "# Mutations\n\n".concat(mutations.join("\n\n"), "\n\n");
}
