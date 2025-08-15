export type GeneratorKind = "all_documents" | "fragments" | "queries" | "subscriptions" | "mutations";
export interface GraphqlDocumentsConfig {
    /**
     * @description Which documents to generate (see GeneratorKind enum).
     *
     * @exampleMarkdown
     * ```tsx {9} filename="codegen.ts"
     *  import type { CodegenConfig } from '@graphql-codegen/cli';
     *
     *  const config: CodegenConfig = {
     *    schema: './src/schema.graphql',
     *    generates: {
     *      'path/to/file.graphql': {
     *        plugins: ['graphql-hasura'],
     *        config: {
     *          kind: "fragments",
     *        },
     *      },
     *    },
     *  };
     *  export default config;
     * ```
     */
    kind: GeneratorKind | GeneratorKind[];
    fragmentPrefix?: string;
    fragmentSuffix?: string;
    excludeSuffixes?: string[];
    excludeArgKeys?: string[];
    overrides?: Record<string, string>;
}
