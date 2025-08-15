import Case from "case";
import type { GraphQLSchema } from "graphql";
import pluralize from "pluralize";
import { type GraphqlDocumentsConfig } from "./generator-types";
import {
  endsWithOneOf,
  generateArgs,
  generateVariables,
  getOutputTypeName,
} from "./graphql-utils";

export function generateQueries(
  schema: GraphQLSchema,
  config: GraphqlDocumentsConfig
): string {
  const { fragmentPrefix, fragmentSuffix, excludeSuffixes, overrides } = config;
  const queries: string[] = [];
  const queryType = schema.getQueryType();
  if (!queryType) {
    throw new Error("Query type not found");
  }

  const queryFields = queryType.getFields();
  Object.keys(queryFields).forEach((key) => {
    const queryField = queryFields[key];
    if (endsWithOneOf(queryField.name, excludeSuffixes ?? [])) {
      return;
    }
    const fragmentName = getOutputTypeName(queryField.type);

    const typeCamelCase = Case.camel(fragmentName);
    const typeCamelCasePlural = pluralize(typeCamelCase);

    let queryName = queryField.name;
    if (queryName === typeCamelCase) {
      queryName = typeCamelCasePlural;
    } else if (queryName === `${typeCamelCase}ByPk`) {
      queryName = typeCamelCase;
    }

    const aliasName =
      queryName === queryField.name
        ? queryName
        : `${queryName}:${queryField.name}`;

    if (overrides?.[queryName]) {
      queries.push(overrides?.[queryName]);
    } else {
      const query = `query ${queryName}${generateVariables(queryField)} {
        ${aliasName}${generateArgs(queryField)} {
          ...${fragmentPrefix ?? ""}${fragmentName}${fragmentSuffix ?? ""}
        }
      }`;
      queries.push(query);
    }
  });

  return `# Queries\n\n${queries.join("\n\n")}\n\n`;
}
