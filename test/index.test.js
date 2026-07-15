import test from "node:test";
import assert from "node:assert/strict";
import { detectDelimiter, parseCsv, normalizeCsv } from "../src/index.js";

test("detecta ponto e vírgula", () => {
  assert.equal(detectDelimiter("nome;cidade\nAna;Recife\n"), ";");
});

test("preserva delimitador, aspas e quebra de linha dentro de campos", () => {
  assert.deepEqual(parseCsv('nome,nota\n"Ana, B.","linha 1\nlinha 2"\n'), [
    ["nome", "nota"],
    ["Ana, B.", "linha 1\nlinha 2"],
  ]);
});

test("remove BOM e converte delimitador", () => {
  assert.equal(normalizeCsv("\uFEFFnome;idade\r\nAna;30\r\n"), "nome,idade\nAna,30\n");
});
