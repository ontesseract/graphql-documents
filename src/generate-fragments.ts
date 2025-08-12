import {
  type GraphQLField,
  type GraphQLObjectType,
  type GraphQLSchema,
  isEnumType,
  isObjectType,
  isScalarType,
} from "graphql";
import { endsWithOneOf, getBaseType, hasScalars } from "./graphql-utils";
import { type GraphqlDocumentsConfig } from "./generator-types.js";

export enum Mode {
  RECURSIVE_NOT_CIRCULAR,
  SCALARS_ONLY,
  TWO_LEVELS,
}

// const scalarsOnlySuffix = "Flat";
const withRelationshipsSuffix = "WithRelationships";

function printField(
  field: GraphQLField<any, any>,
  parentType: GraphQLObjectType,
  parentsAndSiblings: string[],
  mode: Mode,
  indent = 1
): string | null {
  const baseType = getBaseType(field.type);
  if (isScalarType(baseType) || isEnumType(baseType)) {
    return field.name;
  }

  if (isObjectType(baseType)) {
    if (mode === Mode.SCALARS_ONLY && hasScalars(parentType)) {
      return null;
    }
    if (parentsAndSiblings.includes(baseType.name)) {
      return null;
    }
    if (mode === Mode.TWO_LEVELS) {
      return `${field.name} {
        ...${baseType.name}
      }`;
    }

    // recurse without circular references
    const siblings: string[] = [];
    Object.values(parentType.getFields()).forEach((siblingField) => {
      const baseSiblingType = getBaseType(siblingField.type);
      if (
        isObjectType(baseSiblingType) &&
        baseSiblingType.name !== baseType.name
      ) {
        siblings.push(baseSiblingType.name);
      }
    });
    const fields = generateFields(
      baseType,
      [...parentsAndSiblings, ...siblings, baseType.name],
      mode,
      indent + 1
    );
    return `${field.name} {
      ${fields}
    }`;
  }
  return null;
}

function generateFields(
  type: GraphQLObjectType,
  parentsAndSiblings: string[],
  mode: Mode,
  indent = 1
): string {
  const printedFields: string[] = [];
  const fields = type.getFields();

  Object.keys(fields).forEach((key) => {
    const printedField = printField(
      fields[key],
      type,
      parentsAndSiblings,
      mode,
      indent
    );
    if (printedField) {
      printedFields.push(printedField);
    }
  });

  return printedFields.join("\n");
}

export function generateFragmentsForType(
  schema: GraphQLSchema,
  typeName: string,
  mode = Mode.SCALARS_ONLY,
  prefix?: string,
  suffix?: string
): string[] {
  const type = schema.getType(typeName);
  if (!isObjectType(type)) {
    throw new Error(`Type ${typeName} is not an object type`);
  }
  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  const subscriptionType = schema.getSubscriptionType();

  if (
    typeName.startsWith("__") ||
    typeName === queryType?.name ||
    typeName === mutationType?.name ||
    typeName === subscriptionType?.name
  ) {
    throw new Error(`Type ${typeName} is not a supported type`);
  }

  const fragments: string[] = [];
  const fields = generateFields(type, [type.name], mode);

  if (mode === Mode.TWO_LEVELS) {
    suffix = suffix
      ? `${suffix}${withRelationshipsSuffix}`
      : withRelationshipsSuffix;
  }

  const standardFragment = `fragment ${prefix ?? ""}${typeName}${suffix ?? ""} on ${typeName} {
    ${fields}
  }`;
  fragments.push(standardFragment);

  if (mode === Mode.TWO_LEVELS) {
    const scalarFields = generateFields(type, [type.name], Mode.SCALARS_ONLY);
    if (scalarFields.length) {
      const scalarsFragment = `fragment ${typeName} on ${typeName} {
        ${scalarFields}
      }`;
      fragments.push(scalarsFragment);
    }
  }

  return fragments;
}

export function generateFragments(
  schema: GraphQLSchema,
  config: GraphqlDocumentsConfig,
  mode = Mode.SCALARS_ONLY
): string {
  const { fragmentPrefix, fragmentSuffix, fragmentOverrides } = config;
  const typeNames = Object.keys(schema.getTypeMap());
  const fragments: string[] = [];

  typeNames.forEach((typeName) => {
    if (endsWithOneOf(typeName, config.excludeSuffixes ?? [])) {
      return;
    }
    try {
      if (fragmentOverrides?.[typeName]) {
        fragments.push(fragmentOverrides[typeName]);
      } else {
        fragments.push(
          ...generateFragmentsForType(
            schema,
            typeName,
            mode,
            fragmentPrefix,
            fragmentSuffix
          )
        );
      }
    } catch (e: any) {
      // fragments.push(
      //   `# Error generating fragments for type ${typeName}: ${e.message}`
      // );
      // Ignore
    }
  });

  return `# Fragments\n\n${fragments.join("\n\n")}\n\n`;
}
