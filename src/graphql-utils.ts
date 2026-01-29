import Case from "case";
import {
  type DocumentNode,
  type GraphQLField,
  type GraphQLInputType,
  type GraphQLObjectType,
  type GraphQLOutputType,
  type GraphQLSchema,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  Kind,
  type OperationDefinitionNode,
  parse,
  print,
} from "graphql";

export function endsWithOneOf(value: string, suffixes: string[]) {
  for (const suffix of suffixes) {
    if (value.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

export function getOutputTypeName(type: GraphQLOutputType): string {
  if (isObjectType(type) || isScalarType(type) || isEnumType(type)) {
    return type.name;
  }
  if (isListType(type) || isNonNullType(type)) {
    return getOutputTypeName(type.ofType);
  }
  throw new Error("Unknown type");
}

export function getBaseType(type: GraphQLOutputType): GraphQLOutputType {
  if (isNonNullType(type) || isListType(type)) {
    return getBaseType(type.ofType);
  }
  return type;
}

export function getBaseInputType(type: GraphQLInputType): GraphQLInputType {
  if (isNonNullType(type) || isListType(type)) {
    return getBaseInputType(type.ofType);
  }
  return type;
}

export function hasScalars(type: GraphQLObjectType): boolean {
  for (const field of Object.values(type.getFields())) {
    const baseFieldType = getBaseType(field.type);
    if (isScalarType(baseFieldType)) {
      return true;
    }
  }
  return false;
}

function defaultValueForVariableName(argName: string): string {
  switch (argName) {
    case "_append":
    case "_deleteAtPath":
    case "_deleteElem":
    case "_deleteKey":
    case "_inc":
    case "_prepend":
    case "_set":
    case "onConflict":
      return " = {}";
    default:
      return "";
  }
}

export function generateVariables(
  field: GraphQLField<any, any>,
  excludeKeys: string[] = []
): string {
  if (field.args.length > 0) {
    const variables: string[] = [];
    field.args.forEach((arg) => {
      if (!excludeKeys.includes(arg.name)) {
        variables.push(
          `$${arg.name}: ${arg.type}${defaultValueForVariableName(arg.name)}`
        );
      }
    });
    return `(${variables.join(`, `)})`;
  }
  return "";
}

export function generateArgs(
  field: GraphQLField<any, any>,
  excludeKeys: string[] = [],
  schema: GraphQLSchema | undefined = undefined
): string {
  if (field.args.length > 0) {
    const args: string[] = [];
    field.args.forEach((arg) => {
      if (!excludeKeys.includes(arg.name)) {
        args.push(`${arg.name}: $${arg.name}`);
      }
    });
    return `(${args.join(", ")})`;
  }
  return "";
}

export function returnFieldMatchesOperationName(
  definition: OperationDefinitionNode
): boolean {
  for (const node of definition.selectionSet.selections) {
    if (
      node.kind === Kind.FIELD &&
      (node.alias?.value === definition.name?.value ||
        (!node.alias && node.name?.value === definition.name?.value))
    ) {
      return true;
    }
  }
  return false;
}

export function hasLimitAndOffsetArgs(
  definition: OperationDefinitionNode
): boolean {
  let hasLimit = false;
  let hasOffset = false;
  for (const node of definition.variableDefinitions ?? []) {
    if (node.variable.name.value === "limit") {
      hasLimit = true;
    }
    if (node.variable.name.value === "offset") {
      hasOffset = true;
    }
  }
  return hasLimit && hasOffset;
}

export function documentToDocument(
  document: DocumentNode | string
): DocumentNode {
  return typeof document === "string" ? parse(document) : document;
}

export function getOperationName(
  document: DocumentNode | string
): string | undefined {
  const doc = documentToDocument(document);
  for (const definition of doc.definitions) {
    if (definition.kind === Kind.OPERATION_DEFINITION) {
      return definition.name?.value;
    }
  }
  return undefined;
}

export function documentToString(document: DocumentNode | string): string {
  return typeof document === "string" ? document : print(document);
}
