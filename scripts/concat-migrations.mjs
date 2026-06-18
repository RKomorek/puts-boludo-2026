import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const outputFile = join(process.cwd(), "supabase", "apply_all_manual.sql");

const files = readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const combined = files
  .map((file) => {
    const content = readFileSync(join(migrationsDir, file), "utf8");
    return `-- >>> ${file}\n\n${content.trim()}\n`;
  })
  .join("\n");

writeFileSync(outputFile, combined, "utf8");
console.log(`Gerado: supabase/apply_all_manual.sql (${files.length} arquivos)`);
