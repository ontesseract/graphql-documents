import type { GraphQLSchema } from "graphql";
import { type GraphqlDocumentsConfig } from "./generator-types";
export declare function generateQueries(schema: GraphQLSchema, config: GraphqlDocumentsConfig): string;
