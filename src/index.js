const candidates = [",", ";", "\t", "|"];

export function detectDelimiter(text) {
  const sample = logicalRecords(text.replace(/^\uFEFF/, "")).filter(Boolean).slice(0, 5);
  let best = { delimiter: ",", score: -1 };
  for (const delimiter of candidates) {
    const counts = sample.map((line) => countOutsideQuotes(line, delimiter));
    const score = counts.length && counts.every((count) => count === counts[0]) ? counts[0] : -1;
    if (score > best.score) best = { delimiter, score };
  }
  return best.delimiter;
}

function logicalRecords(text) {
  const records = [];
  let record = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      record += char;
      if (quoted && text[index + 1] === '"') record += text[++index];
      else quoted = !quoted;
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      records.push(record);
      record = "";
    } else record += char;
  }
  if (record) records.push(record);
  return records;
}

function countOutsideQuotes(line, delimiter) {
  let count = 0;
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '"') {
      if (quoted && line[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && line[index] === delimiter) count += 1;
  }
  return count;
}

export function parseCsv(text, delimiter = detectDelimiter(text)) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (!quoted && char === delimiter) {
      row.push(field);
      field = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const escapeField = (value, delimiter) => {
  const text = String(value);
  return text.includes(delimiter) || /["\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export function stringifyCsv(rows, { delimiter = ",", newline = "\n" } = {}) {
  return rows.map((row) => row.map((field) => escapeField(field, delimiter)).join(delimiter)).join(newline) + newline;
}

export function normalizeCsv(text, options = {}) {
  return stringifyCsv(parseCsv(text, options.inputDelimiter), options);
}
