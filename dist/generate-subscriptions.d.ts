import type { GraphQLSchema } from "graphql";
import { type GraphqlDocumentsConfig } from "./generator-types";
export declare function generateSubscriptions(schema: GraphQLSchema, config: GraphqlDocumentsConfig): string;
