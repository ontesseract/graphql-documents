import { type GraphQLSchema } from "graphql";
import { type GraphqlDocumentsConfig } from "./generator-types.js";
export declare enum Mode {
    RECURSIVE_NOT_CIRCULAR = 0,
    SCALARS_ONLY = 1,
    TWO_LEVELS = 2
}
export declare function generateFragmentsForType(schema: GraphQLSchema, typeName: string, mode?: Mode, prefix?: string, suffix?: string): string[];
export declare function generateFragments(schema: GraphQLSchema, config: GraphqlDocumentsConfig, mode?: Mode): string;
