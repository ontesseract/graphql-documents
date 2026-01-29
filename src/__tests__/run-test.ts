import { buildSchema } from "graphql";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { plugin } from "../index";

async function main() {
  // Path to schema in graphql-api package
  const schemaPath = join(
    __dirname,
    "../../../graphql-api/src/__tests__/test-data/schema.graphql"
  );

  // Output path
  const outputPath = join(__dirname, "test-output.graphql");

  console.log("Loading schema from:", schemaPath);

  try {
    // Load schema
    const schemaSource = readFileSync(schemaPath, "utf-8");
    console.log(`Loaded schema (${schemaSource.length} chars)`);

    const schema = buildSchema(schemaSource);
    console.log("Schema built successfully");

    // Run the plugin with all documents
    console.log("\nRunning plugin...");
    const output = await plugin(schema, [], {
      kind: "all_documents",
      includeUpsertMutations: true,
    });

    // Write output
    const outputContent = typeof output === "string" ? output : output.content;
    writeFileSync(outputPath, outputContent);
    console.log(`\nOutput written to: ${outputPath}`);
    console.log(`Output size: ${outputContent.length} chars`);
  } catch (error) {
    console.error("\n❌ Error:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

main();
