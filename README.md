# GraphQL Documents

Plugin for GraphQL Codegen https://the-guild.dev/graphql/codegen

Example:

```Typescript
import { CodegenConfig } from '@graphql-codegen/cli'

const MediaItem = `#graphql
  fragment MediaItemAdmin on MediaItem {
    blurHash
    contentLength
    contentType
    createdAt
    defaultUrl
    filename
    height
    id
    kind
    tenantId
    thumbnailUrl
    updatedAt
    width
    tags {
      tag
    }
  }
`;

const overrides = {
  MediaItem,
};

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    './src/graphql/generated/documents.graphql': {
      documents: [], // no documents passed to this plugin
      plugins: ['@ontesseract/graphql-documents'],
      config: {
        kind: 'all_documents',
        fragmentSuffix: 'Admin',
        fragmentOverrides: overrides,
      },
    }
  }
}

export default config
```
