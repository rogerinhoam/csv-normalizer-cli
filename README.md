# csv-normalizer-cli

CLI e biblioteca JavaScript sem dependências para detectar CSV separado por vírgula, ponto e vírgula, tabulação ou barra vertical; remover BOM; padronizar quebras de linha; e converter o delimitador sem quebrar campos entre aspas.

## Uso

```bash
npx csv-normalizer-cli clientes.csv
npx csv-normalizer-cli entrada.csv saida.csv --delimiter ";"
npx csv-normalizer-cli entrada.csv saida.tsv --delimiter tab
```

Se o arquivo de saída for omitido, será criado `*.normalized.csv`. O delimitador de entrada é detectado automaticamente; use `--input-delimiter` para defini-lo.

## Biblioteca

```js
import { normalizeCsv } from "csv-normalizer-cli";

const csv = normalizeCsv("nome;idade\nAna;30\n");
```

O parser cobre CSV comum, inclusive aspas escapadas e quebras de linha dentro de campos. Ele não tenta validar tipos ou alterar valores.

## Desenvolvimento

```bash
npm test
```

## Licença

MIT
