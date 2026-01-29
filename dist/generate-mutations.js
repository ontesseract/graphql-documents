"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMutations = generateMutations;
var case_1 = __importDefault(require("case"));
var pluralize_1 = __importDefault(require("pluralize"));
var graphql_utils_1 = require("./graphql-utils");
function generateMutation(_a) {
    var _b, _c, _d, _e, _f;
    var mutationField = _a.mutationField, schema = _a.schema, config = _a.config, _g = _a.isUpsert, isUpsert = _g === void 0 ? false : _g;
    var fragmentName = (0, graphql_utils_1.getOutputTypeName)(mutationField.type);
    // Extract type name from mutation response type name
    var typeName = fragmentName.replace(/MutationResponse$/, "");
    var typePascalCase = case_1.default.pascal(typeName);
    var typePascalCasePlural = (0, pluralize_1.default)(typePascalCase);
    var mutationName = mutationField.name;
    var upsertMutationName = "";
    if (mutationField.name === "insert".concat(typePascalCase)) {
        mutationName = "insert".concat(typePascalCasePlural);
        upsertMutationName = "upsert".concat(typePascalCasePlural);
    }
    else if (mutationField.name === "insert".concat(typePascalCase, "One")) {
        mutationName = "insert".concat(typePascalCase);
        upsertMutationName = "upsert".concat(typePascalCase);
    }
    else if (mutationField.name === "update".concat(typePascalCase)) {
        mutationName = "update".concat(typePascalCasePlural);
    }
    else if (mutationField.name === "update".concat(typePascalCase, "ByPk")) {
        mutationName = "update".concat(typePascalCase);
    }
    else if (mutationField.name === "delete".concat(typePascalCase)) {
        mutationName = "delete".concat(typePascalCasePlural);
    }
    else if (mutationField.name === "delete".concat(typePascalCase, "ByPk")) {
        mutationName = "delete".concat(typePascalCase);
    }
    var excludeArgKeys = (_b = config.excludeArgKeys) !== null && _b !== void 0 ? _b : [];
    var aliasName = mutationName === mutationField.name
        ? mutationName
        : "".concat(mutationName, ":").concat(mutationField.name);
    if (isUpsert) {
        if (!upsertMutationName) {
            throw new Error("upsert mutations are only supported for insert mutations. Invalid mutation name: ".concat(mutationField.name));
        }
        mutationName = upsertMutationName;
        aliasName = "".concat(mutationName, ":").concat(mutationField.name);
        excludeArgKeys = excludeArgKeys.filter(function (key) { return key !== "onConflict"; });
    }
    if ((_c = config.overrides) === null || _c === void 0 ? void 0 : _c[mutationName]) {
        return (_d = config.overrides) === null || _d === void 0 ? void 0 : _d[mutationName];
    }
    return "mutation ".concat(mutationName).concat((0, graphql_utils_1.generateVariables)(mutationField, excludeArgKeys, isUpsert), " {\n    ").concat(aliasName).concat((0, graphql_utils_1.generateArgs)(mutationField, excludeArgKeys, schema), " {\n      ...").concat((_e = config.fragmentPrefix) !== null && _e !== void 0 ? _e : "").concat(fragmentName).concat((_f = config.fragmentSuffix) !== null && _f !== void 0 ? _f : "", "\n    }\n  }");
}
function generateMutations(schema, config) {
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
        var mutation = generateMutation({
            mutationField: mutationField,
            schema: schema,
            config: config,
        });
        mutations.push(mutation);
        if (config.includeUpsertMutations &&
            mutationField.name.startsWith("insert")) {
            var upsertMutation = generateMutation({
                mutationField: mutationField,
                schema: schema,
                config: config,
                isUpsert: true,
            });
            mutations.push(upsertMutation);
        }
    });
    return "# Mutations\n\n".concat(mutations.join("\n\n"), "\n\n");
}
