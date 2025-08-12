import type { GraphQLSchema } from "graphql";
import { type GraphqlDocumentsConfig } from "./generator-types";
export declare function generateMutations(schema: GraphQLSchema, config: GraphqlDocumentsConfig, upserts?: boolean): string;
