#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { normalizeCsv } from "./index.js";

const args = process.argv.slice(2);
if (args.includes("--help") || args.length === 0) {
  console.log("Uso: csv-normalizer entrada.csv [saida.csv] [--delimiter ,|;|tab] [--input-delimiter auto|,|;|tab]");
  process.exit(0);
}

const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const decodeDelimiter = (value) => value === "tab" ? "\t" : value;
const positional = args.filter((arg, index) => !arg.startsWith("--") && !args[index - 1]?.startsWith("--"));
const inputPath = positional[0];
const outputPath = positional[1] ?? inputPath.replace(/(\.csv)?$/i, ".normalized.csv");

try {
  const input = await readFile(inputPath, "utf8");
  const inputOption = option("--input-delimiter", "auto");
  const output = normalizeCsv(input, {
    delimiter: decodeDelimiter(option("--delimiter", ",")),
    inputDelimiter: inputOption === "auto" ? undefined : decodeDelimiter(inputOption),
  });
  await writeFile(outputPath, output, "utf8");
  console.log(`✓ Arquivo normalizado: ${outputPath}`);
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
}
