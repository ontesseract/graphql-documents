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

export function generateSubscriptions(
  schema: GraphQLSchema,
  config: GraphqlDocumentsConfig
): string {
  const { fragmentPrefix, fragmentSuffix } = config;
  const subscriptions: string[] = [];
  const subscriptionType = schema.getSubscriptionType();
  if (!subscriptionType) {
    throw new Error("Subscription type not found");
  }

  const subscriptionFields = subscriptionType.getFields();
  Object.keys(subscriptionFields).forEach((key) => {
    const subscriptionField = subscriptionFields[key];
    if (endsWithOneOf(subscriptionField.name, config.excludeSuffixes ?? [])) {
      return;
    }
    const fragmentName = getOutputTypeName(subscriptionField.type);

    const typeCamelCase = Case.camel(fragmentName);
    const typeCamelCasePlural = pluralize(typeCamelCase);

    let subscriptionName = subscriptionField.name;
    if (subscriptionName === typeCamelCase) {
      subscriptionName = typeCamelCasePlural;
    } else if (subscriptionName === `${typeCamelCase}ByPk`) {
      subscriptionName = typeCamelCase;
    }
    subscriptionName = subscriptionName.endsWith("Stream")
      ? subscriptionName
      : `${subscriptionName}Subscription`;

    const aliasName =
      subscriptionName === subscriptionField.name
        ? subscriptionName
        : `${subscriptionName}: ${subscriptionField.name}`;

    if (config.overrides?.[subscriptionName]) {
      subscriptions.push(config.overrides?.[subscriptionName]);
    } else {
      const subscription = `subscription ${subscriptionName}${generateVariables(subscriptionField)} {
        ${aliasName}${generateArgs(subscriptionField)} {
          ...${fragmentPrefix ?? ""}${fragmentName}${fragmentSuffix ?? ""}
        }
      }`;
      subscriptions.push(subscription);
    }
  });

  return `# Subscriptions\n\n${subscriptions.join("\n\n")}\n\n`;
}
