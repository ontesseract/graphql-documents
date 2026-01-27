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
        (0, vitest_1.it)("Should include onConflict argument in Hasura insert mutations", function () { return __awaiter(void 0, void 0, void 0, function () {
            var hasuraInsertSchema, fragmentOutput, fragmentContent, mutationOutput, mutationContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraInsertSchema = (0, graphql_1.buildSchema)(/* GraphQL */ "\n        scalar uuid\n        scalar timestamp\n\n        enum article_constraint {\n          article_pkey\n          article_title_key\n        }\n\n        enum article_update_column {\n          title\n          content\n          published_on\n        }\n\n        input article_bool_exp {\n          _and: [article_bool_exp!]\n          _or: [article_bool_exp!]\n          _not: article_bool_exp\n        }\n\n        input article_on_conflict {\n          constraint: article_constraint!\n          update_columns: [article_update_column!]!\n          where: article_bool_exp\n        }\n\n        input article_insert_input {\n          id: uuid\n          title: String!\n          content: String!\n          published_on: timestamp\n        }\n\n        type article {\n          id: uuid!\n          title: String!\n          content: String!\n          published_on: timestamp\n        }\n\n        type article_mutation_response {\n          affected_rows: Int!\n          returning: [article!]!\n        }\n\n        type Query {\n          article: [article!]!\n        }\n\n        type Mutation {\n          insert_article(\n            objects: [article_insert_input!]!\n            on_conflict: article_on_conflict\n          ): article_mutation_response!\n        }\n\n        schema {\n          query: Query\n          mutation: Mutation\n        }\n      ");
                        return [4 /*yield*/, (0, _1.plugin)(hasuraInsertSchema, [], {
                                kind: "fragments",
                            })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        return [4 /*yield*/, (0, _1.plugin)(hasuraInsertSchema, [], {
                                kind: "mutations",
                            })];
                    case 2:
                        mutationOutput = _a.sent();
                        mutationContent = getContent(mutationOutput);
                        // Should include onConflict in variables
                        (0, vitest_1.expect)(mutationContent).toContain("$on_conflict: article_on_conflict");
                        // Should include onConflict in arguments
                        (0, vitest_1.expect)(mutationContent).toContain("on_conflict: $on_conflict");
                        errors = (0, validation_1.validate)(hasuraInsertSchema, (0, graphql_1.parse)(fragmentContent + mutationContent)).filter(function (error) { return !error.message.includes("is never used"); });
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should include onConflict argument (camelCase) in insert mutations", function () { return __awaiter(void 0, void 0, void 0, function () {
            var camelCaseSchema, fragmentOutput, fragmentContent, mutationOutput, mutationContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        camelCaseSchema = (0, graphql_1.buildSchema)(/* GraphQL */ "\n        scalar uuid\n        scalar timestamp\n\n        enum ArticleConstraint {\n          ARTICLE_PKEY\n          ARTICLE_TITLE_KEY\n        }\n\n        enum ArticleUpdateColumn {\n          TITLE\n          CONTENT\n          PUBLISHED_ON\n        }\n\n        input ArticleOnConflict {\n          constraint: ArticleConstraint!\n          updateColumns: [ArticleUpdateColumn!]!\n        }\n\n        input ArticleInsertInput {\n          id: uuid\n          title: String!\n          content: String!\n          publishedOn: timestamp\n        }\n\n        type Article {\n          id: uuid!\n          title: String!\n          content: String!\n          publishedOn: timestamp\n        }\n\n        type ArticleMutationResponse {\n          affectedRows: Int!\n          returning: [Article!]!\n        }\n\n        type Query {\n          article: [Article!]!\n        }\n\n        type Mutation {\n          insertArticle(\n            objects: [ArticleInsertInput!]!\n            onConflict: ArticleOnConflict\n          ): ArticleMutationResponse!\n        }\n\n        schema {\n          query: Query\n          mutation: Mutation\n        }\n      ");
                        return [4 /*yield*/, (0, _1.plugin)(camelCaseSchema, [], {
                                kind: "fragments",
                            })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        return [4 /*yield*/, (0, _1.plugin)(camelCaseSchema, [], {
                                kind: "mutations",
                            })];
                    case 2:
                        mutationOutput = _a.sent();
                        mutationContent = getContent(mutationOutput);
                        // Should include onConflict in variables (camelCase)
                        (0, vitest_1.expect)(mutationContent).toContain("$onConflict: ArticleOnConflict");
                        // Should include onConflict in arguments (camelCase)
                        (0, vitest_1.expect)(mutationContent).toContain("onConflict: $onConflict");
                        errors = (0, validation_1.validate)(camelCaseSchema, (0, graphql_1.parse)(fragmentContent + mutationContent)).filter(function (error) { return !error.message.includes("is never used"); });
                        (0, vitest_1.expect)(errors).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("Should exclude onConflict when in excludeArgKeys", function () { return __awaiter(void 0, void 0, void 0, function () {
            var hasuraInsertSchema, fragmentOutput, fragmentContent, mutationOutput, mutationContent, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraInsertSchema = (0, graphql_1.buildSchema)(/* GraphQL */ "\n        scalar uuid\n        scalar timestamp\n\n        enum article_constraint {\n          article_pkey\n        }\n\n        enum article_update_column {\n          title\n          content\n        }\n\n        input article_on_conflict {\n          constraint: article_constraint!\n          update_columns: [article_update_column!]!\n        }\n\n        input article_insert_input {\n          id: uuid\n          title: String!\n          content: String!\n        }\n\n        type article {\n          id: uuid!\n          title: String!\n          content: String!\n        }\n\n        type article_mutation_response {\n          affected_rows: Int!\n          returning: [article!]!\n        }\n\n        type Query {\n          article: [article!]!\n        }\n\n        type Mutation {\n          insert_article(\n            objects: [article_insert_input!]!\n            on_conflict: article_on_conflict\n          ): article_mutation_response!\n        }\n\n        schema {\n          query: Query\n          mutation: Mutation\n        }\n      ");
                        return [4 /*yield*/, (0, _1.plugin)(hasuraInsertSchema, [], {
                                kind: "fragments",
                            })];
                    case 1:
                        fragmentOutput = _a.sent();
                        fragmentContent = getContent(fragmentOutput);
                        return [4 /*yield*/, (0, _1.plugin)(hasuraInsertSchema, [], {
                                kind: "mutations",
                                excludeArgKeys: ["on_conflict"],
                            })];
                    case 2:
                        mutationOutput = _a.sent();
                        mutationContent = getContent(mutationOutput);
                        // Should NOT include onConflict in variables when excluded
                        (0, vitest_1.expect)(mutationContent).not.toContain("$on_conflict: article_on_conflict");
                        // Should NOT include onConflict in arguments when excluded
                        (0, vitest_1.expect)(mutationContent).not.toContain("on_conflict: $on_conflict");
                        // Should still include objects argument
                        (0, vitest_1.expect)(mutationContent).toContain("objects: $objects");
                        errors = (0, validation_1.validate)(hasuraInsertSchema, (0, graphql_1.parse)(fragmentContent + mutationContent)).filter(function (error) { return !error.message.includes("is never used"); });
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
    (0, vitest_1.describe)("Overrides", function () {
        var schema = (0, graphql_1.buildSchema)(typeDefs);
        (0, vitest_1.describe)("Fragment Overrides", function () {
            (0, vitest_1.it)("Should use fragment override when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                var fragmentOutput, fragmentContent, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "fragments",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              id\n              displayName\n              # Custom override content\n            }",
                                },
                            })];
                        case 1:
                            fragmentOutput = _a.sent();
                            fragmentContent = getContent(fragmentOutput);
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment Profile on Profile {");
                            (0, vitest_1.expect)(fragmentContent).toContain("# Custom override content");
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment ProfileNonOverride on Profile {");
                            // Should not contain the default generated Profile fragment
                            (0, vitest_1.expect)(fragmentContent).not.toContain("fragment Profile on Profile {\n    id\n    displayName\n    photoUrl\n    username\n  }");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should generate non-override fragment with suffix when override exists", function () { return __awaiter(void 0, void 0, void 0, function () {
                var fragmentOutput, fragmentContent, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "fragments",
                                fragmentSuffix: "Custom",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              id\n              displayName\n            }",
                                },
                            })];
                        case 1:
                            fragmentOutput = _a.sent();
                            fragmentContent = getContent(fragmentOutput);
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment Profile on Profile {");
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment ProfileCustomNonOverride on Profile {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should handle multiple fragment overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
                var fragmentOutput, fragmentContent, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "fragments",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              id\n              displayName\n            }",
                                    UserRole: "fragment UserRole on UserRole {\n              id\n              label\n              # Custom UserRole override\n            }",
                                },
                            })];
                        case 1:
                            fragmentOutput = _a.sent();
                            fragmentContent = getContent(fragmentOutput);
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment Profile on Profile {");
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment UserRole on UserRole {");
                            (0, vitest_1.expect)(fragmentContent).toContain("# Custom UserRole override");
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment ProfileNonOverride on Profile {");
                            (0, vitest_1.expect)(fragmentContent).toContain("fragment UserRoleNonOverride on UserRole {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        (0, vitest_1.describe)("Query Overrides", function () {
            (0, vitest_1.it)("Should use query override when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                    overrides: {
                                        profile: "query profile($id: uuid!) {\n              profileByPk(id: $id) {\n                id\n                displayName\n                # Custom query override\n              }\n            }",
                                    },
                                })];
                        case 2:
                            queryOutput = _a.sent();
                            queryContent = getContent(queryOutput);
                            (0, vitest_1.expect)(queryContent).toContain("query profile($id: uuid!) {");
                            (0, vitest_1.expect)(queryContent).toContain("# Custom query override");
                            // Should not contain the default generated profile query
                            (0, vitest_1.expect)(queryContent).not.toContain("profile:profileByPk(id: $id) {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + queryContent));
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should handle multiple query overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                    overrides: {
                                        profile: "query profile($id: uuid!) {\n              profileByPk(id: $id) {\n                id\n                displayName\n              }\n            }",
                                        userRole: "query userRole($id: String!) {\n              userRoleByPk(id: $id) {\n                id\n                label\n                # Custom userRole override\n              }\n            }",
                                    },
                                })];
                        case 2:
                            queryOutput = _a.sent();
                            queryContent = getContent(queryOutput);
                            (0, vitest_1.expect)(queryContent).toContain("query profile($id: uuid!) {");
                            (0, vitest_1.expect)(queryContent).toContain("query userRole($id: String!) {");
                            (0, vitest_1.expect)(queryContent).toContain("# Custom userRole override");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + queryContent));
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        (0, vitest_1.describe)("Mutation Overrides", function () {
            (0, vitest_1.it)("Should use mutation override when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                    overrides: {
                                        createProfile: "mutation createProfile($input: ProfileInput!) {\n              createProfile(input: $input) {\n                id\n                displayName\n                # Custom mutation override\n              }\n            }",
                                    },
                                })];
                        case 2:
                            mutationOutput = _a.sent();
                            mutationContent = getContent(mutationOutput);
                            (0, vitest_1.expect)(mutationContent).toContain("mutation createProfile($input: ProfileInput!) {");
                            (0, vitest_1.expect)(mutationContent).toContain("# Custom mutation override");
                            // Should not contain the default generated createProfile mutation
                            (0, vitest_1.expect)(mutationContent).not.toContain("createProfile:createProfile(input: $input) {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + mutationContent)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        (0, vitest_1.describe)("Subscription Overrides", function () {
            (0, vitest_1.it)("Should use subscription override when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                    overrides: {
                                        profileSubscription: "subscription profileSubscription($id: uuid!) {\n              profileByPk(id: $id) {\n                id\n                displayName\n                # Custom subscription override\n              }\n            }",
                                    },
                                })];
                        case 2:
                            subscriptionOutput = _a.sent();
                            subscriptionContent = getContent(subscriptionOutput);
                            (0, vitest_1.expect)(subscriptionContent).toContain("subscription profileSubscription($id: uuid!) {");
                            (0, vitest_1.expect)(subscriptionContent).toContain("# Custom subscription override");
                            // Should not contain the default generated profileSubscription
                            (0, vitest_1.expect)(subscriptionContent).not.toContain("profileSubscription: profileByPk(id: $id) {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(fragmentContent + subscriptionContent)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        (0, vitest_1.describe)("Mixed Overrides", function () {
            (0, vitest_1.it)("Should handle overrides for all operation types simultaneously", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "all_documents",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              id\n              displayName\n              # Custom Profile fragment\n            }",
                                    profile: "query profile($id: uuid!) {\n              profileByPk(id: $id) {\n                ...Profile\n                # Custom profile query\n              }\n            }",
                                    createProfile: "mutation createProfile($input: ProfileInput!) {\n              createProfile(input: $input) {\n                ...Profile\n                # Custom createProfile mutation\n              }\n            }",
                                    profileSubscription: "subscription profileSubscription($id: uuid!) {\n              profileByPk(id: $id) {\n                ...Profile\n                # Custom profileSubscription\n              }\n            }",
                                },
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            // Check that all overrides are present
                            (0, vitest_1.expect)(content).toContain("# Custom Profile fragment");
                            (0, vitest_1.expect)(content).toContain("# Custom profile query");
                            (0, vitest_1.expect)(content).toContain("# Custom createProfile mutation");
                            (0, vitest_1.expect)(content).toContain("# Custom profileSubscription");
                            // Check that non-override fragments are generated
                            (0, vitest_1.expect)(content).toContain("fragment ProfileNonOverride on Profile {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should work with fragment prefixes and suffixes", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "all_documents",
                                fragmentPrefix: "My",
                                fragmentSuffix: "Fragment",
                                overrides: {
                                    Profile: "fragment MyProfileFragment on Profile {\n              id\n              displayName\n            }",
                                    profile: "query profile($id: uuid!) {\n              profileByPk(id: $id) {\n                ...MyProfileFragment\n              }\n            }",
                                },
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            (0, vitest_1.expect)(content).toContain("fragment MyProfileFragment on Profile {");
                            (0, vitest_1.expect)(content).toContain("fragment MyProfileFragmentNonOverride on Profile {");
                            (0, vitest_1.expect)(content).toContain("...MyProfileFragment");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        (0, vitest_1.describe)("Override Validation", function () {
            (0, vitest_1.it)("Should handle invalid GraphQL in overrides gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "fragments",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              invalidField\n              # This field doesn't exist\n            }",
                                },
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            (0, vitest_1.expect)(content).toContain("fragment Profile on Profile {");
                            (0, vitest_1.expect)(content).toContain("invalidField");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content));
                            (0, vitest_1.expect)(errors.length).toBeGreaterThan(0);
                            (0, vitest_1.expect)(errors.some(function (error) { return error.message.includes("invalidField"); })).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should handle empty overrides object", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "all_documents",
                                overrides: {},
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            // Should generate normal content without overrides
                            (0, vitest_1.expect)(content).toContain("fragment Profile on Profile {");
                            (0, vitest_1.expect)(content).toContain("query profile($id: uuid!) {");
                            (0, vitest_1.expect)(content).toContain("mutation createProfile($input: ProfileInput!) {");
                            (0, vitest_1.expect)(content).toContain("subscription profileSubscription($id: uuid!) {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content));
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should handle undefined overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "all_documents",
                                // overrides is undefined
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            // Should generate normal content without overrides
                            (0, vitest_1.expect)(content).toContain("fragment Profile on Profile {");
                            (0, vitest_1.expect)(content).toContain("query profile($id: uuid!) {");
                            (0, vitest_1.expect)(content).toContain("mutation createProfile($input: ProfileInput!) {");
                            (0, vitest_1.expect)(content).toContain("subscription profileSubscription($id: uuid!) {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content));
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should handle partial overrides (some operations have overrides, others don't)", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "all_documents",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              id\n              displayName\n              # Only fragment override\n            }",
                                    // No query override
                                    // No mutation override
                                    // No subscription override
                                },
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            // Should use fragment override
                            (0, vitest_1.expect)(content).toContain("# Only fragment override");
                            (0, vitest_1.expect)(content).toContain("fragment ProfileNonOverride on Profile {");
                            // Should generate normal queries, mutations, and subscriptions
                            (0, vitest_1.expect)(content).toContain("query profile($id: uuid!) {");
                            (0, vitest_1.expect)(content).toContain("mutation createProfile($input: ProfileInput!) {");
                            (0, vitest_1.expect)(content).toContain("subscription profileSubscription($id: uuid!) {");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should handle overrides with complex GraphQL syntax", function () { return __awaiter(void 0, void 0, void 0, function () {
                var output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, _1.plugin)(schema, [], {
                                kind: "all_documents",
                                overrides: {
                                    Profile: "fragment Profile on Profile {\n              id\n              displayName\n              photoUrl\n              username\n              # Complex fragment with all fields\n            }",
                                    profile: "query profile($id: uuid!, $includeUsername: Boolean = false) {\n              profileByPk(id: $id) {\n                ...Profile\n                username @include(if: $includeUsername)\n                # Complex query with directives\n              }\n            }",
                                    createProfile: "mutation createProfile($input: ProfileInput!, $includePhoto: Boolean = true) {\n              createProfile(input: $input) {\n                ...Profile\n                photoUrl @include(if: $includePhoto)\n                # Complex mutation with directives\n              }\n            }",
                                },
                            })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            // Should contain complex GraphQL syntax
                            (0, vitest_1.expect)(content).toContain("# Complex fragment with all fields");
                            (0, vitest_1.expect)(content).toContain("@include(if: $includeUsername)");
                            (0, vitest_1.expect)(content).toContain("$includeUsername: Boolean = false");
                            (0, vitest_1.expect)(content).toContain("$includePhoto: Boolean = true");
                            (0, vitest_1.expect)(content).toContain("@include(if: $includePhoto)");
                            (0, vitest_1.expect)(content).toContain("# Complex query with directives");
                            (0, vitest_1.expect)(content).toContain("# Complex mutation with directives");
                            errors = (0, validation_1.validate)(schema, (0, graphql_1.parse)(content)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            (0, vitest_1.it)("Should work with Hasura named schema overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
                var hasuraNamedSchema, output, content, errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hasuraNamedSchema = (0, graphql_1.buildSchema)(hasuraNamedTypeDefs);
                            return [4 /*yield*/, (0, _1.plugin)(hasuraNamedSchema, [], {
                                    kind: "all_documents",
                                    overrides: {
                                        profile: "fragment profile on profile {\n              id\n              display_name\n              photo_url\n              # Custom Hasura profile fragment\n            }",
                                        create_profile: "mutation create_profile($input: profile_input!) {\n              create_profile(input: $input) {\n                ...profile\n                # Custom Hasura create_profile mutation\n              }\n            }",
                                        profile_by_pkSubscription: "subscription profile_by_pkSubscription($id: uuid!) {\n              profile_by_pk(id: $id) {\n                ...profile\n                # Custom Hasura profile subscription\n              }\n            }",
                                    },
                                })];
                        case 1:
                            output = _a.sent();
                            content = getContent(output);
                            // Should contain Hasura-specific overrides
                            (0, vitest_1.expect)(content).toContain("# Custom Hasura profile fragment");
                            (0, vitest_1.expect)(content).toContain("# Custom Hasura create_profile mutation");
                            (0, vitest_1.expect)(content).toContain("# Custom Hasura profile subscription");
                            // Should use Hasura naming conventions
                            (0, vitest_1.expect)(content).toContain("fragment profile on profile {");
                            (0, vitest_1.expect)(content).toContain("create_profile(input: $input) {");
                            (0, vitest_1.expect)(content).toContain("profile_by_pkSubscription($id: uuid!) {");
                            errors = (0, validation_1.validate)(hasuraNamedSchema, (0, graphql_1.parse)(content)).filter(function (error) { return !error.message.includes("is never used"); });
                            (0, vitest_1.expect)(errors).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
