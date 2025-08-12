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
});
