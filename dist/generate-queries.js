"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQueries = generateQueries;
var case_1 = __importDefault(require("case"));
var pluralize_1 = __importDefault(require("pluralize"));
var graphql_utils_1 = require("./graphql-utils");
function generateQueries(schema, config) {
    var queries = [];
    var queryType = schema.getQueryType();
    if (!queryType) {
        throw new Error("Query type not found");
    }
    var queryFields = queryType.getFields();
    Object.keys(queryFields).forEach(function (key) {
        var _a, _b, _c;
        var queryField = queryFields[key];
        if ((0, graphql_utils_1.endsWithOneOf)(queryField.name, (_a = config.excludeSuffixes) !== null && _a !== void 0 ? _a : [])) {
            return;
        }
        var fragmentName = (0, graphql_utils_1.getOutputTypeName)(queryField.type);
        var typeCamelCase = case_1.default.camel(fragmentName);
        var typeCamelCasePlural = (0, pluralize_1.default)(typeCamelCase);
        var queryName = queryField.name;
        if (queryName === typeCamelCase) {
            queryName = typeCamelCasePlural;
        }
        else if (queryName === "".concat(typeCamelCase, "ByPk")) {
            queryName = typeCamelCase;
        }
        var aliasName = queryName === queryField.name
            ? queryName
            : "".concat(queryName, ":").concat(queryField.name);
        var query = "query ".concat(queryName).concat((0, graphql_utils_1.generateVariables)(queryField), " {\n      ").concat(aliasName).concat((0, graphql_utils_1.generateArgs)(queryField), " {\n        ...").concat((_b = config.fragmentPrefix) !== null && _b !== void 0 ? _b : "").concat(fragmentName).concat((_c = config.fragmentSuffix) !== null && _c !== void 0 ? _c : "", "\n      }\n    }");
        queries.push(query);
    });
    return "# Queries\n\n".concat(queries.join("\n\n"), "\n\n");
}
