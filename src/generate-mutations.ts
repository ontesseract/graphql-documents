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

function generateMutation<T, V>(
  mutationField: GraphQLField<T, V>,
  schema: GraphQLSchema,
  config: GraphqlDocumentsConfig
) {
  const fragmentName = getOutputTypeName(mutationField.type);

  const typePascalCase = Case.pascal(
    fragmentName.replace("MutationResponse", "")
  );
  const typePascalCasePlural = pluralize(typePascalCase);

  let mutationName = mutationField.name;
  if (mutationName === `insert${typePascalCase}`) {
    mutationName = `insert${typePascalCasePlural}`;
  } else if (mutationName === `insert${typePascalCase}One`) {
    mutationName = `insert${typePascalCase}`;
  } else if (mutationName === `update${typePascalCase}`) {
    mutationName = `update${typePascalCasePlural}`;
  } else if (mutationName === `update${typePascalCase}ByPk`) {
    mutationName = `update${typePascalCase}`;
  } else if (mutationName === `delete${typePascalCase}`) {
    mutationName = `delete${typePascalCasePlural}`;
  } else if (mutationName === `delete${typePascalCase}ByPk`) {
    mutationName = `delete${typePascalCase}`;
  }

  let aliasName =
    mutationName === mutationField.name
      ? mutationName
      : `${mutationName}:${mutationField.name}`;

  if (config.overrides?.[mutationName]) {
    return config.overrides?.[mutationName];
  }

  return `mutation ${mutationName}${generateVariables(mutationField, config.excludeArgKeys ?? [])} {
    ${aliasName}${generateArgs(mutationField, config.excludeArgKeys ?? [], schema)} {
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
    const mutation = generateMutation(mutationField, schema, config);
    mutations.push(mutation);
  });

  return `# Mutations\n\n${mutations.join("\n\n")}\n\n`;
}
