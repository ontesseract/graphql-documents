import { Types } from "@graphql-codegen/plugin-helpers";
import { buildSchema, parse } from "graphql";
import { validate as graphqlValidate } from "graphql/validation";
import { describe, expect, it } from "vitest";
import { plugin } from ".";

function getContent(output: Types.PluginOutput): string {
  if (typeof output === "string") {
    return output;
  }
  return output.content;
}

const typeDefs = /* GraphQL */ `
  scalar uuid
  scalar citext

  type ProfileAttribute {
    profileId: uuid!
    kind: String!
    order: Int
    value: String!
  }

  type Profile {
    id: uuid!
    displayName: String!
    photoUrl: String!
    username: citext
  }

  type UserRole {
    id: String!
    label: String!
  }

  type ValueKind {
    id: String!
    label: String!
  }

  input ProfileInput {
    displayName: String!
    photoUrl: String!
    username: citext
  }

  type Query {
    profileAttribute: [ProfileAttribute!]!
    profile: [Profile!]!
    profileByPk(id: uuid!): Profile
    userRole: [UserRole!]!
    userRoleByPk(id: String!): UserRole
    valueKind: [ValueKind!]!
    valueKindByPk(id: String!): ValueKind
  }

  type Mutation {
    createProfile(input: ProfileInput!): Profile!
  }

  type Subscription {
    profileByPk(id: uuid!): Profile
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const hasuraNamedTypeDefs = /* GraphQL */ `
  scalar uuid
  scalar citext

  type profile_attribute {
    profile_id: uuid!
    kind: String!
    order: Int
    value: String!
  }

  type profile {
    id: uuid!
    display_name: String!
    photo_url: String!
    username: citext
    relationshipCamelCase: [profile_attribute!]!
  }

  type user_role {
    id: String!
    label: String!
  }

  type value_kind {
    id: String!
    label: String!
  }

  input profile_input {
    display_name: String!
    photo_url: String!
    username: citext
  }

  type Query {
    profile_attribute: [profile_attribute!]!
    profile: [profile!]!
    profile_by_pk(id: uuid!): profile
    user_role: [user_role!]!
    user_role_by_pk(id: String!): user_role
    value_kind: [value_kind!]!
    value_kind_by_pk(id: String!): value_kind
  }

  type Mutation {
    create_profile(input: profile_input!): profile!
  }

  type Subscription {
    profile_by_pk(id: uuid!): profile
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

describe("GraphQL Documents", () => {
  describe("Output", () => {
    const schema = buildSchema(typeDefs);

    it("Should generate valid fragments", async () => {
      const fragmentOutput = await plugin(schema, [], {
        kind: "fragments",
      });
      const fragmentContent = getContent(fragmentOutput);

      expect(fragmentContent).toContain("fragment Profile on Profile {");

      const errors = graphqlValidate(schema, parse(fragmentContent)).filter(
        (error) => !error.message.includes("is never used")
      );
      expect(errors).toEqual([]);
    });

    it("Should generate valid queries", async () => {
      const fragmentOutput = await plugin(schema, [], {
        kind: "fragments",
      });
      const fragmentContent = getContent(fragmentOutput);

      const queryOutput = await plugin(schema, [], {
        kind: "queries",
      });
      const queryContent = getContent(queryOutput);
      expect(queryContent).toContain("query profile($id: uuid!) {");

      const errors = graphqlValidate(
        schema,
        parse(fragmentContent + queryContent)
      );
      expect(errors).toEqual([]);
    });

    it("Should generate valid mutations", async () => {
      const fragmentOutput = await plugin(schema, [], {
        kind: "fragments",
      });
      const fragmentContent = getContent(fragmentOutput);

      const mutationOutput = await plugin(schema, [], {
        kind: "mutations",
      });
      const mutationContent = getContent(mutationOutput);
      expect(mutationContent).toContain(
        "mutation createProfile($input: ProfileInput!) {"
      );

      const errors = graphqlValidate(
        schema,
        parse(fragmentContent + mutationContent)
      ).filter((error) => !error.message.includes("is never used"));
      expect(errors).toEqual([]);
    });

    it("Should generate valid subscriptions", async () => {
      const fragmentOutput = await plugin(schema, [], {
        kind: "fragments",
      });
      const fragmentContent = getContent(fragmentOutput);

      const subscriptionOutput = await plugin(schema, [], {
        kind: "subscriptions",
      });
      const subscriptionContent = getContent(subscriptionOutput);
      expect(subscriptionContent).toContain(
        "subscription profileSubscription($id: uuid!) {"
      );

      const errors = graphqlValidate(
        schema,
        parse(fragmentContent + subscriptionContent)
      ).filter((error) => !error.message.includes("is never used"));
      expect(errors).toEqual([]);
    });

    it("Should generate all documents", async () => {
      const output = await plugin(schema, [], {
        kind: "all_documents",
      });
      const content = getContent(output);

      expect(content).toContain("fragment Profile on Profile {");
      expect(content).toContain("query profile($id: uuid!) {");
      expect(content).toContain("createProfile($input: ProfileInput!) {");
      expect(content).toContain(
        "subscription profileSubscription($id: uuid!) {"
      );

      const errors = graphqlValidate(schema, parse(content));
      expect(errors).toEqual([]);
    });

    it("Should generate hasura named documents", async () => {
      const hasuraNamedSchema = buildSchema(hasuraNamedTypeDefs);
      const output = await plugin(hasuraNamedSchema, [], {
        kind: "all_documents",
      });
      const content = getContent(output);

      expect(content).toContain(
        "fragment profile_attribute on profile_attribute {"
      );
      expect(content).toContain("query profile_attribute {");
      expect(content).toContain(
        "mutation create_profile($input: profile_input!) {"
      );
      expect(content).toContain(
        "subscription profile_by_pkSubscription($id: uuid!) {"
      );

      const errors = graphqlValidate(hasuraNamedSchema, parse(content));
      expect(errors).toEqual([]);
    });
  });

  describe("Overrides", () => {
    const schema = buildSchema(typeDefs);

    describe("Fragment Overrides", () => {
      it("Should use fragment override when provided", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
          overrides: {
            Profile: `fragment Profile on Profile {
              id
              displayName
              # Custom override content
            }`,
          },
        });
        const fragmentContent = getContent(fragmentOutput);

        expect(fragmentContent).toContain("fragment Profile on Profile {");
        expect(fragmentContent).toContain("# Custom override content");
        expect(fragmentContent).toContain(
          "fragment ProfileNonOverride on Profile {"
        );

        // Should not contain the default generated Profile fragment
        expect(fragmentContent).not.toContain(
          "fragment Profile on Profile {\n    id\n    displayName\n    photoUrl\n    username\n  }"
        );

        const errors = graphqlValidate(schema, parse(fragmentContent)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });

      it("Should generate non-override fragment with suffix when override exists", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
          fragmentSuffix: "Custom",
          overrides: {
            Profile: `fragment Profile on Profile {
              id
              displayName
            }`,
          },
        });
        const fragmentContent = getContent(fragmentOutput);

        expect(fragmentContent).toContain("fragment Profile on Profile {");
        expect(fragmentContent).toContain(
          "fragment ProfileCustomNonOverride on Profile {"
        );

        const errors = graphqlValidate(schema, parse(fragmentContent)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });

      it("Should handle multiple fragment overrides", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
          overrides: {
            Profile: `fragment Profile on Profile {
              id
              displayName
            }`,
            UserRole: `fragment UserRole on UserRole {
              id
              label
              # Custom UserRole override
            }`,
          },
        });
        const fragmentContent = getContent(fragmentOutput);

        expect(fragmentContent).toContain("fragment Profile on Profile {");
        expect(fragmentContent).toContain("fragment UserRole on UserRole {");
        expect(fragmentContent).toContain("# Custom UserRole override");
        expect(fragmentContent).toContain(
          "fragment ProfileNonOverride on Profile {"
        );
        expect(fragmentContent).toContain(
          "fragment UserRoleNonOverride on UserRole {"
        );

        const errors = graphqlValidate(schema, parse(fragmentContent)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });
    });

    describe("Query Overrides", () => {
      it("Should use query override when provided", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
        });
        const fragmentContent = getContent(fragmentOutput);

        const queryOutput = await plugin(schema, [], {
          kind: "queries",
          overrides: {
            profile: `query profile($id: uuid!) {
              profileByPk(id: $id) {
                id
                displayName
                # Custom query override
              }
            }`,
          },
        });
        const queryContent = getContent(queryOutput);

        expect(queryContent).toContain("query profile($id: uuid!) {");
        expect(queryContent).toContain("# Custom query override");

        // Should not contain the default generated profile query
        expect(queryContent).not.toContain("profile:profileByPk(id: $id) {");

        const errors = graphqlValidate(
          schema,
          parse(fragmentContent + queryContent)
        );
        expect(errors).toEqual([]);
      });

      it("Should handle multiple query overrides", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
        });
        const fragmentContent = getContent(fragmentOutput);

        const queryOutput = await plugin(schema, [], {
          kind: "queries",
          overrides: {
            profile: `query profile($id: uuid!) {
              profileByPk(id: $id) {
                id
                displayName
              }
            }`,
            userRole: `query userRole($id: String!) {
              userRoleByPk(id: $id) {
                id
                label
                # Custom userRole override
              }
            }`,
          },
        });
        const queryContent = getContent(queryOutput);

        expect(queryContent).toContain("query profile($id: uuid!) {");
        expect(queryContent).toContain("query userRole($id: String!) {");
        expect(queryContent).toContain("# Custom userRole override");

        const errors = graphqlValidate(
          schema,
          parse(fragmentContent + queryContent)
        );
        expect(errors).toEqual([]);
      });
    });

    describe("Mutation Overrides", () => {
      it("Should use mutation override when provided", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
        });
        const fragmentContent = getContent(fragmentOutput);

        const mutationOutput = await plugin(schema, [], {
          kind: "mutations",
          overrides: {
            createProfile: `mutation createProfile($input: ProfileInput!) {
              createProfile(input: $input) {
                id
                displayName
                # Custom mutation override
              }
            }`,
          },
        });
        const mutationContent = getContent(mutationOutput);

        expect(mutationContent).toContain(
          "mutation createProfile($input: ProfileInput!) {"
        );
        expect(mutationContent).toContain("# Custom mutation override");

        // Should not contain the default generated createProfile mutation
        expect(mutationContent).not.toContain(
          "createProfile:createProfile(input: $input) {"
        );

        const errors = graphqlValidate(
          schema,
          parse(fragmentContent + mutationContent)
        ).filter((error) => !error.message.includes("is never used"));
        expect(errors).toEqual([]);
      });
    });

    describe("Subscription Overrides", () => {
      it("Should use subscription override when provided", async () => {
        const fragmentOutput = await plugin(schema, [], {
          kind: "fragments",
        });
        const fragmentContent = getContent(fragmentOutput);

        const subscriptionOutput = await plugin(schema, [], {
          kind: "subscriptions",
          overrides: {
            profileSubscription: `subscription profileSubscription($id: uuid!) {
              profileByPk(id: $id) {
                id
                displayName
                # Custom subscription override
              }
            }`,
          },
        });
        const subscriptionContent = getContent(subscriptionOutput);

        expect(subscriptionContent).toContain(
          "subscription profileSubscription($id: uuid!) {"
        );
        expect(subscriptionContent).toContain("# Custom subscription override");

        // Should not contain the default generated profileSubscription
        expect(subscriptionContent).not.toContain(
          "profileSubscription: profileByPk(id: $id) {"
        );

        const errors = graphqlValidate(
          schema,
          parse(fragmentContent + subscriptionContent)
        ).filter((error) => !error.message.includes("is never used"));
        expect(errors).toEqual([]);
      });
    });

    describe("Mixed Overrides", () => {
      it("Should handle overrides for all operation types simultaneously", async () => {
        const output = await plugin(schema, [], {
          kind: "all_documents",
          overrides: {
            Profile: `fragment Profile on Profile {
              id
              displayName
              # Custom Profile fragment
            }`,
            profile: `query profile($id: uuid!) {
              profileByPk(id: $id) {
                ...Profile
                # Custom profile query
              }
            }`,
            createProfile: `mutation createProfile($input: ProfileInput!) {
              createProfile(input: $input) {
                ...Profile
                # Custom createProfile mutation
              }
            }`,
            profileSubscription: `subscription profileSubscription($id: uuid!) {
              profileByPk(id: $id) {
                ...Profile
                # Custom profileSubscription
              }
            }`,
          },
        });
        const content = getContent(output);

        // Check that all overrides are present
        expect(content).toContain("# Custom Profile fragment");
        expect(content).toContain("# Custom profile query");
        expect(content).toContain("# Custom createProfile mutation");
        expect(content).toContain("# Custom profileSubscription");

        // Check that non-override fragments are generated
        expect(content).toContain("fragment ProfileNonOverride on Profile {");

        // Check that the generated content is valid GraphQL
        const errors = graphqlValidate(schema, parse(content)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });

      it("Should work with fragment prefixes and suffixes", async () => {
        const output = await plugin(schema, [], {
          kind: "all_documents",
          fragmentPrefix: "My",
          fragmentSuffix: "Fragment",
          overrides: {
            Profile: `fragment MyProfileFragment on Profile {
              id
              displayName
            }`,
            profile: `query profile($id: uuid!) {
              profileByPk(id: $id) {
                ...MyProfileFragment
              }
            }`,
          },
        });
        const content = getContent(output);

        expect(content).toContain("fragment MyProfileFragment on Profile {");
        expect(content).toContain(
          "fragment MyProfileFragmentNonOverride on Profile {"
        );
        expect(content).toContain("...MyProfileFragment");

        const errors = graphqlValidate(schema, parse(content)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });
    });

    describe("Override Validation", () => {
      it("Should handle invalid GraphQL in overrides gracefully", async () => {
        const output = await plugin(schema, [], {
          kind: "fragments",
          overrides: {
            Profile: `fragment Profile on Profile {
              invalidField
              # This field doesn't exist
            }`,
          },
        });
        const content = getContent(output);

        expect(content).toContain("fragment Profile on Profile {");
        expect(content).toContain("invalidField");

        // The GraphQL validation should catch the invalid field
        const errors = graphqlValidate(schema, parse(content));
        expect(errors.length).toBeGreaterThan(0);
        expect(
          errors.some((error) => error.message.includes("invalidField"))
        ).toBe(true);
      });

      it("Should handle empty overrides object", async () => {
        const output = await plugin(schema, [], {
          kind: "all_documents",
          overrides: {},
        });
        const content = getContent(output);

        // Should generate normal content without overrides
        expect(content).toContain("fragment Profile on Profile {");
        expect(content).toContain("query profile($id: uuid!) {");
        expect(content).toContain(
          "mutation createProfile($input: ProfileInput!) {"
        );
        expect(content).toContain(
          "subscription profileSubscription($id: uuid!) {"
        );

        const errors = graphqlValidate(schema, parse(content));
        expect(errors).toEqual([]);
      });

      it("Should handle undefined overrides", async () => {
        const output = await plugin(schema, [], {
          kind: "all_documents",
          // overrides is undefined
        });
        const content = getContent(output);

        // Should generate normal content without overrides
        expect(content).toContain("fragment Profile on Profile {");
        expect(content).toContain("query profile($id: uuid!) {");
        expect(content).toContain(
          "mutation createProfile($input: ProfileInput!) {"
        );
        expect(content).toContain(
          "subscription profileSubscription($id: uuid!) {"
        );

        const errors = graphqlValidate(schema, parse(content));
        expect(errors).toEqual([]);
      });

      it("Should handle partial overrides (some operations have overrides, others don't)", async () => {
        const output = await plugin(schema, [], {
          kind: "all_documents",
          overrides: {
            Profile: `fragment Profile on Profile {
              id
              displayName
              # Only fragment override
            }`,
            // No query override
            // No mutation override
            // No subscription override
          },
        });
        const content = getContent(output);

        // Should use fragment override
        expect(content).toContain("# Only fragment override");
        expect(content).toContain("fragment ProfileNonOverride on Profile {");

        // Should generate normal queries, mutations, and subscriptions
        expect(content).toContain("query profile($id: uuid!) {");
        expect(content).toContain(
          "mutation createProfile($input: ProfileInput!) {"
        );
        expect(content).toContain(
          "subscription profileSubscription($id: uuid!) {"
        );

        const errors = graphqlValidate(schema, parse(content)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });

      it("Should handle overrides with complex GraphQL syntax", async () => {
        const output = await plugin(schema, [], {
          kind: "all_documents",
          overrides: {
            Profile: `fragment Profile on Profile {
              id
              displayName
              photoUrl
              username
              # Complex fragment with all fields
            }`,
            profile: `query profile($id: uuid!, $includeUsername: Boolean = false) {
              profileByPk(id: $id) {
                ...Profile
                username @include(if: $includeUsername)
                # Complex query with directives
              }
            }`,
            createProfile: `mutation createProfile($input: ProfileInput!, $includePhoto: Boolean = true) {
              createProfile(input: $input) {
                ...Profile
                photoUrl @include(if: $includePhoto)
                # Complex mutation with directives
              }
            }`,
          },
        });
        const content = getContent(output);

        // Should contain complex GraphQL syntax
        expect(content).toContain("# Complex fragment with all fields");
        expect(content).toContain("@include(if: $includeUsername)");
        expect(content).toContain("$includeUsername: Boolean = false");
        expect(content).toContain("$includePhoto: Boolean = true");
        expect(content).toContain("@include(if: $includePhoto)");
        expect(content).toContain("# Complex query with directives");
        expect(content).toContain("# Complex mutation with directives");

        const errors = graphqlValidate(schema, parse(content)).filter(
          (error) => !error.message.includes("is never used")
        );
        expect(errors).toEqual([]);
      });

      it("Should work with Hasura named schema overrides", async () => {
        const hasuraNamedSchema = buildSchema(hasuraNamedTypeDefs);
        const output = await plugin(hasuraNamedSchema, [], {
          kind: "all_documents",
          overrides: {
            profile: `fragment profile on profile {
              id
              display_name
              photo_url
              # Custom Hasura profile fragment
            }`,
            create_profile: `mutation create_profile($input: profile_input!) {
              create_profile(input: $input) {
                ...profile
                # Custom Hasura create_profile mutation
              }
            }`,
            profile_by_pkSubscription: `subscription profile_by_pkSubscription($id: uuid!) {
              profile_by_pk(id: $id) {
                ...profile
                # Custom Hasura profile subscription
              }
            }`,
          },
        });
        const content = getContent(output);

        // Should contain Hasura-specific overrides
        expect(content).toContain("# Custom Hasura profile fragment");
        expect(content).toContain("# Custom Hasura create_profile mutation");
        expect(content).toContain("# Custom Hasura profile subscription");

        // Should use Hasura naming conventions
        expect(content).toContain("fragment profile on profile {");
        expect(content).toContain("create_profile(input: $input) {");
        expect(content).toContain("profile_by_pkSubscription($id: uuid!) {");

        const errors = graphqlValidate(
          hasuraNamedSchema,
          parse(content)
        ).filter((error) => !error.message.includes("is never used"));
        expect(errors).toEqual([]);
      });
    });
  });
});
