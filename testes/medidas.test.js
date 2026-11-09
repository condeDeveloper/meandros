// Os numeros do README, presos. Se o codigo mudar e um numero mudar, isto
// quebra antes de o README virar mentira.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  tabelaVarredura,
  tabelaHistograma,
  tabelaMaximo,
  tabelaParceiros,
  tabelaParceiroDoPente,
  tabelaDoisMetodos,
} from '../src/medidas.js';

const MINUTO = 120_000;

test('as nove primeiras ordens batem com os valores conhecidos', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(9);
  assert.deepEqual(
    linhas.map((l) => l.meandros),
    [1, 2, 8, 42, 262, 1828, 13820, 110954, 933458]
  );
  for (const l of linhas) assert.equal(l.bate, true, 'n=' + l.n);
});

test('os sistemas de arcos sao Catalan em toda ordem varrida', { timeout: MINUTO }, () => {
  for (const l of tabelaVarredura(9)) {
    assert.equal(BigInt(l.sistemas), l.catalan, 'n=' + l.n);
    assert.equal(l.pares, l.sistemas * l.sistemas);
  }
  assert.equal(tabelaVarredura(9)[8].sistemas, 4862);
  assert.equal(tabelaVarredura(9)[8].pares, 23_639_044);
});

test('a fracao de pares que fecha numa curva so cai de 100% a 3,95%', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(9);
  assert.equal((linhas[0].fracao * 100).toFixed(4), '100.0000');
  assert.equal((linhas[8].fracao * 100).toFixed(4), '3.9488');
  for (let i = 1; i < linhas.length; i++) {
    assert.ok(linhas[i].fracao < linhas[i - 1].fracao, 'n=' + linhas[i].n);
  }
});

test('o histograma da ordem 9 tem pico em 3 curvas, nao em 1', { timeout: MINUTO }, () => {
  const h = tabelaHistograma(9);
  assert.equal(h.pares, 23_639_044);
  const maior = h.linhas.reduce((a, b) => (b.quantos > a.quantos ? b : a));
  assert.equal(maior.curvas, 3);
  assert.equal(maior.quantos, 6_540_510);
  assert.equal(h.linhas[0].curvas, 1);
  assert.equal(h.linhas[0].quantos, 933_458);
  assert.equal(h.media.toFixed(4), '3.6483');
});

test('os pares com o maximo de curvas sao exatamente os sistemas, ordem a ordem', { timeout: MINUTO }, () => {
  for (const l of tabelaMaximo(9)) {
    assert.equal(l.bate, true, 'n=' + l.n);
    assert.equal(l.noMaximo, l.sistemas, 'n=' + l.n);
  }
  assert.equal(tabelaMaximo(9)[8].noMaximo, 4862);
});

test('a media de curvas por par sobe devagar: 3,65 na ordem 9', { timeout: MINUTO }, () => {
  const linhas = tabelaMaximo(9);
  for (let i = 1; i < linhas.length; i++) {
    assert.ok(linhas[i].media > linhas[i - 1].media, 'n=' + linhas[i].n);
  }
  assert.equal(linhas[8].media.toFixed(4), '3.6483');
});

test('o arco-iris e o maximo e o pente e o minimo, em toda ordem', { timeout: MINUTO }, () => {
  for (const l of tabelaParceiros(9)) {
    assert.equal(l.irisEhMaximo, true, 'n=' + l.n);
    assert.equal(l.penteEhMinimo, true, 'n=' + l.n);
    assert.equal(l.doPente, 1, 'n=' + l.n);
    assert.equal(l.menor, 1, 'n=' + l.n);
  }
});

test('os parceiros do arco-iris vao de 1 a 504, e a razao abre junto', { timeout: MINUTO }, () => {
  const linhas = tabelaParceiros(9);
  assert.deepEqual(linhas.map((l) => l.doArcoIris), [1, 2, 4, 10, 24, 66, 174, 504]);
  const nove = linhas[linhas.length - 1];
  assert.equal(nove.n, 9);
  assert.equal(nove.maior, 504);
  assert.equal(nove.menor, 1);
  assert.equal(nove.razao, 504);
  assert.equal(nove.media.toFixed(2), '191.99');
});

test('o pente so fecha com um sistema, e esse sistema e o pente deslocado', { timeout: MINUTO }, () => {
  for (const l of tabelaParceiroDoPente(9)) {
    assert.equal(l.quantos, 1, 'n=' + l.n);
    assert.equal(l.unico, true, 'n=' + l.n);
    assert.equal(l.ehOPenteDeslocado, true, 'n=' + l.n);
  }
  // e o arco-iris so e esse parceiro na ordem 2, onde os dois coincidem
  const comoIris = tabelaParceiroDoPente(9).filter((l) => l.ehOArcoIris);
  assert.equal(comoIris.length, 1);
  assert.equal(comoIris[0].n, 2);
});

test('as duas contagens de curva nao divergem em 184.041 pares', { timeout: MINUTO }, () => {
  const linhas = tabelaDoisMetodos(7);
  for (const l of linhas) assert.equal(l.divergencias, 0, 'n=' + l.n);
  assert.equal(linhas[6].pares, 184_041);
  assert.equal(linhas.reduce((s, l) => s + l.pares, 0), 203_455);
});
