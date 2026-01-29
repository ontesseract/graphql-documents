import Case from "case";
import type { GraphQLField, GraphQLSchema } from "graphql";
import pluralize from "pluralize";
import { type GraphqlDocumentsConfig } from "./generator-types";
import {
  endsWithOneOf,
  generateArgs,
  generateVariables,
  getOutputTypeName,
} from "./graphql-utils";

function generateMutation<T, V>({
  mutationField,
  schema,
  config,
  isUpsert = false,
}: {
  mutationField: GraphQLField<T, V>;
  schema: GraphQLSchema;
  config: GraphqlDocumentsConfig;
  isUpsert?: boolean;
}) {
  const fragmentName = getOutputTypeName(mutationField.type);

  // Extract type name from mutation response type name
  const typeName = fragmentName.replace(/MutationResponse$/, "");
  const typePascalCase = Case.pascal(typeName);
  const typePascalCasePlural = pluralize(typePascalCase);

  let mutationName = mutationField.name;
  let upsertMutationName = "";
  if (mutationField.name === `insert${typePascalCase}`) {
    mutationName = `insert${typePascalCasePlural}`;
    upsertMutationName = `upsert${typePascalCasePlural}`;
  } else if (mutationField.name === `insert${typePascalCase}One`) {
    mutationName = `insert${typePascalCase}`;
    upsertMutationName = `upsert${typePascalCase}`;
  } else if (mutationField.name === `update${typePascalCase}`) {
    mutationName = `update${typePascalCasePlural}`;
  } else if (mutationField.name === `update${typePascalCase}ByPk`) {
    mutationName = `update${typePascalCase}`;
  } else if (mutationField.name === `delete${typePascalCase}`) {
    mutationName = `delete${typePascalCasePlural}`;
  } else if (mutationField.name === `delete${typePascalCase}ByPk`) {
    mutationName = `delete${typePascalCase}`;
  }

  let excludeArgKeys = config.excludeArgKeys ?? [];
  let aliasName =
    mutationName === mutationField.name
      ? mutationName
      : `${mutationName}:${mutationField.name}`;

  if (isUpsert) {
    if (!upsertMutationName) {
      throw new Error(
        `upsert mutations are only supported for insert mutations. Invalid mutation name: ${mutationField.name}`
      );
    }
    mutationName = upsertMutationName;
    aliasName = `${mutationName}:${mutationField.name}`;
    excludeArgKeys = excludeArgKeys.filter((key) => key !== "onConflict");
  }

  if (config.overrides?.[mutationName]) {
    return config.overrides?.[mutationName];
  }

  return `mutation ${mutationName}${generateVariables(mutationField, excludeArgKeys, isUpsert)} {
    ${aliasName}${generateArgs(mutationField, excludeArgKeys, schema)} {
      ...${config.fragmentPrefix ?? ""}${fragmentName}${config.fragmentSuffix ?? ""}
    }
  }`;
}

export function generateMutations(
  schema: GraphQLSchema,
  config: GraphqlDocumentsConfig
): string {
  const { fragmentPrefix, fragmentSuffix } = config;
  const mutations: string[] = [];
  const mutationType = schema.getMutationType();
  if (!mutationType) {
    throw new Error("Mutation type not found");
  }

  const mutationFields = mutationType.getFields();
  Object.keys(mutationFields).forEach((key) => {
    const mutationField = mutationFields[key];
    if (endsWithOneOf(mutationField.name, config.excludeSuffixes ?? [])) {
      return;
    }
    const mutation = generateMutation({
      mutationField,
      schema,
      config,
    });
    mutations.push(mutation);
    if (
      config.includeUpsertMutations &&
      mutationField.name.startsWith("insert")
    ) {
      const upsertMutation = generateMutation({
        mutationField,
        schema,
        config,
        isUpsert: true,
      });
      mutations.push(upsertMutation);
    }
  });

  return `# Mutations\n\n${mutations.join("\n\n")}\n\n`;
}
