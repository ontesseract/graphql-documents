"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMutations = generateMutations;
var case_1 = __importDefault(require("case"));
var pluralize_1 = __importDefault(require("pluralize"));
var graphql_utils_1 = require("./graphql-utils");
function generateMutation(mutationField, schema, upserts, config) {
    var _a, _b, _c, _d;
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
    if (upserts && mutationName.startsWith("insert")) {
        mutationName = mutationName.replace("insert", "upsert");
        aliasName = "".concat(mutationName, ":").concat(mutationField.name);
    }
    return "mutation ".concat(mutationName).concat((0, graphql_utils_1.generateVariables)(mutationField, (_a = config.excludeArgKeys) !== null && _a !== void 0 ? _a : []), " {\n    ").concat(aliasName).concat((0, graphql_utils_1.generateArgs)(mutationField, (_b = config.excludeArgKeys) !== null && _b !== void 0 ? _b : [], upserts, schema), " {\n      ...").concat((_c = config.fragmentPrefix) !== null && _c !== void 0 ? _c : "").concat(fragmentName).concat((_d = config.fragmentSuffix) !== null && _d !== void 0 ? _d : "", "\n    }\n  }");
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
        var mutation = generateMutation(mutationField, schema, false, config);
        mutations.push(mutation);
        if (upserts && mutationField.name.startsWith("insert")) {
            var upsertMutation = generateMutation(mutationField, schema, true, config);
            mutations.push(upsertMutation);
        }
    });
    return "# Mutations\n\n".concat(mutations.join("\n\n"), "\n\n");
}
