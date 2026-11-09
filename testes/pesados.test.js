// A varredura grande, separada porque passa de meio minuto: a ordem 10, com
// 16.796 sistemas de cada lado e 282.105.616 pares conferidos um a um.
//
// A ordem 11 tem 58.786 sistemas e 3,45 bilhoes de pares, e ficou de fora: a
// tabela diz o que foi medido.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { varrer, catalan } from '../src/meandro.js';
import { CONHECIDOS } from '../src/juiz.js';

const DEZ_MINUTOS = 600_000;

let dez = null;
function ordem10() {
  if (dez === null) dez = varrer(10);
  return dez;
}

test('ordem 10: 8.152.860 meandros em 282.105.616 pares', { timeout: DEZ_MINUTOS }, () => {
  const r = ordem10();
  assert.equal(r.sistemas, 16_796);
  assert.equal(BigInt(r.sistemas), catalan(10));
  assert.equal(r.pares, 282_105_616);
  assert.equal(r.meandros, 8_152_860);
  assert.equal(r.meandros, CONHECIDOS[9]);
});

test('na ordem 10 so 2,89% dos pares fecham numa curva so', { timeout: DEZ_MINUTOS }, () => {
  const r = ordem10();
  assert.equal((r.fracao * 100).toFixed(4), '2.8900');
});

test('o histograma da ordem 10 tem pico em 4 curvas, e 16.796 no maximo', { timeout: DEZ_MINUTOS }, () => {
  const r = ordem10();
  assert.equal(r.histograma[1], 8_152_860);
  assert.equal(r.histograma[4], 76_980_880);
  assert.equal(r.histograma[10], 16_796);
  assert.equal(r.histograma[10], r.sistemas);
  const maior = r.histograma.indexOf(Math.max(...r.histograma));
  assert.equal(maior, 4);
});
