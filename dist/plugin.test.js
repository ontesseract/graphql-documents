"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var validation_1 = require("graphql/validation");
var vitest_1 = require("vitest");
var _1 = require(".");
function getContent(output) {
    if (typeof output === "string") {
        return output;
    }
    return output.content;
}
var typeDefs = /* GraphQL */ "\n  scalar uuid\n  scalar citext\n\n  type ProfileAttribute {\n    profileId: uuid!\n    kind: String!\n    order: Int\n    value: String!\n  }\n\n  type Profile {\n    id: uuid!\n    displayName: String!\n    photoUrl: String!\n    username: citext\n  }\n\n  type UserRole {\n    id: String!\n    label: String!\n  }\n\n  type ValueKind {\n    id: String!\n    label: String!\n  }\n\n  input ProfileInput {\n    displayName: String!\n    photoUrl: String!\n    username: citext\n  }\n\n  type Query {\n    profileAttribute: [ProfileAttribute!]!\n    profile: [Profile!]!\n    profileByPk(id: uuid!): Profile\n    userRole: [UserRole!]!\n    userRoleByPk(id: String!): UserRole\n    valueKind: [ValueKind!]!\n    valueKindByPk(id: String!): ValueKind\n  }\n\n  type Mutation {\n    createProfile(input: ProfileInput!): Profile!\n  }\n\n  type Subscription {\n    profileByPk(id: uuid!): Profile\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n    subscription: Subscription\n  }\n";
var hasuraNamedTypeDefs = /* GraphQL */ "\n  scalar uuid\n  scalar citext\n\n  type profile_attribute {\n    profile_id: uuid!\n    kind: String!\n    order: Int\n    value: String!\n  }\n\n  type profile {\n    id: uuid!\n    display_name: String!\n    photo_url: String!\n    username: citext\n    relationshipCamelCase: [profile_attribute!]!\n  }\n\n  type user_role {\n    id: String!\n    label: String!\n  }\n\n  type value_kind {\n    id: String!\n    label: String!\n  }\n\n  input profile_input {\n    display_name: String!\n    photo_url: String!\n    username: citext\n  }\n\n  type Query {\n    profile_attribute: [profile_attribute!]!\n    profile: [profile!]!\n    profile_by_pk(id: uuid!): profile\n    user_role: [user_role!]!\n    user_role_by_pk(id: String!): user_role\n    value_kind: [value_kind!]!\n    value_kind_by_pk(id: String!): value_kind\n  }\n\n  type Mutation {\n    create_profile(input: profile_input!): profile!\n  }\n\n  type Subscription {\n    profile_by_pk(id: uuid!): profile\n  }\n\n  schema {\n    query: Query\n    mutation: Mutation\n    subscription: Subscription\n  }\n";
(0, vitest_1.describe)("GraphQL Documents", function () {
    (0, vitest_1.describe)("Output", function () {
        var schema = (0, graphql_1.buildSchema)(typeDefs);
        (0, vitest_1.it)("Should generate valid fragments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fragmentOutput, fragmentContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                            kind: "fragments",
                        })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        (0, vitest_1.expect)(fragmentContent).toContain("fragment Profile on Profile {");
                        errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent)).filter(function (error) { return !error.message.includes("is never used"); });
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should generate valid queries", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fragmentOutput, fragmentContent, queryOutput, queryContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                            kind: "fragments",
                        })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "queries",
                            })];
                    case 2:
                        queryOutput = _a.sent();
                        queryContent = getContent(queryOutput);
                        (0, vitest_1.expect)(queryContent).toContain("query profile($id: uuid!) {");
                        errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + queryContent));
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should generate valid mutations", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fragmentOutput, fragmentContent, mutationOutput, mutationContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                            kind: "fragments",
                        })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "mutations",
                            })];
                    case 2:
                        mutationOutput = _a.sent();
                        mutationContent = getContent(mutationOutput);
                        (0, vitest_1.expect)(mutationContent).toContain("mutation createProfile($input: ProfileInput!) {");
                        errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + mutationContent)).filter(function (error) { return !error.message.includes("is never used"); });
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should generate valid subscriptions", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fragmentOutput, fragmentContent, subscriptionOutput, subscriptionContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                            kind: "fragments",
                        })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "subscriptions",
                            })];
                    case 2:
                        subscriptionOutput = _a.sent();
                        subscriptionContent = getContent(subscriptionOutput);
                        (0, vitest_1.expect)(subscriptionContent).toContain("subscription profileSubscription($id: uuid!) {");
                        errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + subscriptionContent)).filter(function (error) { return !error.message.includes("is never used"); });
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should generate all documents", function () { return __awaiter(void 0, void 0, void 0, function () {
            var output, content, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                            kind: "all_documents",
                        })];
                    case 1:
                        output = _a.sent();
                        content = getContent(output);
                        (0, vitest_1.expect)(content).toContain("fragment Profile on Profile {");
                        (0, vitest_1.expect)(content).toContain("query profile($id: uuid!) {");
                        (0, vitest_1.expect)(content).toContain("createProfile($input: ProfileInput!) {");
                        (0, vitest_1.expect)(content).toContain("subscription profileSubscription($id: uuid!) {");
                        errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content));
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should generate hasura named documents", function () { return __awaiter(void 0, void 0, void 0, function () {
            var hasuraNamedSchema, output, content, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraNamedSchema = (0, graphql_1.buildSchema)(hasuraNamedTypeDefs);
                        return [4 /*yield*/, (0, _1.plugin)(hasuraNamedSchema, [], {
                                kind: "all_documents",
                            })];
                    case 1:
                        output = _a.sent();
                        content = getContent(output);
                        (0, vitest_1.expect)(content).toContain("fragment profile_attribute on profile_attribute {");
                        (0, vitest_1.expect)(content).toContain("query profile_attribute {");
                        (0, vitest_1.expect)(content).toContain("mutation create_profile($input: profile_input!) {");
                        (0, vitest_1.expect)(content).toContain("subscription profile_by_pkSubscription($id: uuid!) {");
                        errors = (0, validation_1.validate)(hasuraNamedSchema, (0, graphql_1.parse)(content));
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
