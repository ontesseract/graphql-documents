"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubscriptions = generateSubscriptions;
var case_1 = __importDefault(require("case"));
var pluralize_1 = __importDefault(require("pluralize"));
var graphql_utils_1 = require("./graphql-utils");
function generateSubscriptions(schema, config) {
    var fragmentPrefix = config.fragmentPrefix, fragmentSuffix = config.fragmentSuffix;
    var subscriptions = [];
    var subscriptionType = schema.getSubscriptionType();
    if (!subscriptionType) {
        throw new Error("Subscription type not found");
    }
    var subscriptionFields = subscriptionType.getFields();
    Object.keys(subscriptionFields).forEach(function (key) {
        var _a, _b, _c;
        var subscriptionField = subscriptionFields[key];
        if ((0, graphql_utils_1.endsWithOneOf)(subscriptionField.name, (_a = config.excludeSuffixes) !== null && _a !== void 0 ? _a : [])) {
            return;
        }
        var fragmentName = (0, graphql_utils_1.getOutputTypeName)(subscriptionField.type);
        var typeCamelCase = case_1.default.camel(fragmentName);
        var typeCamelCasePlural = (0, pluralize_1.default)(typeCamelCase);
        var subscriptionName = subscriptionField.name;
        if (subscriptionName === typeCamelCase) {
            subscriptionName = typeCamelCasePlural;
        }
        else if (subscriptionName === "".concat(typeCamelCase, "ByPk")) {
            subscriptionName = typeCamelCase;
        }
        subscriptionName = subscriptionName.endsWith("Stream")
            ? subscriptionName
            : "".concat(subscriptionName, "Subscription");
        var aliasName = subscriptionName === subscriptionField.name
            ? subscriptionName
            : "".concat(subscriptionName, ": ").concat(subscriptionField.name);
        if ((_b = config.overrides) === null || _b === void 0 ? void 0 : _b[subscriptionName]) {
            subscriptions.push((_c = config.overrides) === null || _c === void 0 ? void 0 : _c[subscriptionName]);
        }
        else {
            var subscription = "subscription ".concat(subscriptionName).concat((0, graphql_utils_1.generateVariables)(subscriptionField), " {\n        ").concat(aliasName).concat((0, graphql_utils_1.generateArgs)(subscriptionField), " {\n          ...").concat(fragmentPrefix !== null && fragmentPrefix !== void 0 ? fragmentPrefix : "").concat(fragmentName).concat(fragmentSuffix !== null && fragmentSuffix !== void 0 ? fragmentSuffix : "", "\n        }\n      }");
            subscriptions.push(subscription);
        }
    });
    return "# Subscriptions\n\n".concat(subscriptions.join("\n\n"), "\n\n");
}
