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
    var fragmentPrefix = config.fragmentPrefix, fragmentSuffix = config.fragmentSuffix, excludeSuffixes = config.excludeSuffixes, overrides = config.overrides;
    var queries = [];
    var queryType = schema.getQueryType();
    if (!queryType) {
        throw new Error("Query type not found");
    }
    var queryFields = queryType.getFields();
    Object.keys(queryFields).forEach(function (key) {
        var queryField = queryFields[key];
        if ((0, graphql_utils_1.endsWithOneOf)(queryField.name, excludeSuffixes !== null && excludeSuffixes !== void 0 ? excludeSuffixes : [])) {
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
        if (overrides === null || overrides === void 0 ? void 0 : overrides[queryName]) {
            queries.push(overrides === null || overrides === void 0 ? void 0 : overrides[queryName]);
        }
        else {
            var query = "query ".concat(queryName).concat((0, graphql_utils_1.generateVariables)(queryField), " {\n        ").concat(aliasName).concat((0, graphql_utils_1.generateArgs)(queryField), " {\n          ...").concat(fragmentPrefix !== null && fragmentPrefix !== void 0 ? fragmentPrefix : "").concat(fragmentName).concat(fragmentSuffix !== null && fragmentSuffix !== void 0 ? fragmentSuffix : "", "\n        }\n      }");
            queries.push(query);
        }
    });
    return "# Queries\n\n".concat(queries.join("\n\n"), "\n\n");
}
