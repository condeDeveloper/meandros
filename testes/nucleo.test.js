// O comportamento. Nada de tabela aqui: isto e o que um sistema de arcos e, o
// que uma curva e, e o que os juizes dizem sobre os dois.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  sistemasDeArcos,
  catalan,
  componentes,
  ehMeandro,
  arcoIris,
  pente,
  penteDeslocado,
  parceirosDe,
} from '../src/meandro.js';
import {
  CONHECIDOS,
  catalanAte,
  arcosSeCruzam,
  sistemaValido,
  componentesPorUniao,
} from '../src/juiz.js';

test('o numero de sistemas de arcos e o numero de Catalan, de n=1 a n=9', () => {
  for (let n = 1; n <= 9; n++) {
    assert.equal(BigInt(sistemasDeArcos(n).length), catalan(n), 'n=' + n);
  }
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => sistemasDeArcos(n).length),
    [1, 2, 5, 14, 42, 132, 429, 1430, 4862]
  );
});

test('os numeros de Catalan saem iguais pelos dois caminhos', () => {
  const lista = catalanAte(10);
  for (let n = 0; n <= 10; n++) assert.equal(lista[n], catalan(n), 'n=' + n);
  assert.equal(lista[0], 1n);
  assert.equal(lista[10], 16796n);
});

test('TODO sistema gerado passa pelo conferidor de cruzamento', () => {
  for (let n = 1; n <= 7; n++) {
    for (const par of sistemasDeArcos(n)) {
      assert.equal(sistemaValido(par), true, 'n=' + n + ' ' + par.join(','));
    }
  }
});

test('nenhum sistema sai repetido do gerador', () => {
  for (let n = 1; n <= 8; n++) {
    const chaves = sistemasDeArcos(n).map((p) => p.join(','));
    assert.equal(new Set(chaves).size, chaves.length, 'n=' + n);
  }
});

test('arcosSeCruzam acerta os casos de mao', () => {
  assert.equal(arcosSeCruzam(0, 2, 1, 3), true); // entrelacados
  assert.equal(arcosSeCruzam(0, 3, 1, 2), false); // aninhados
  assert.equal(arcosSeCruzam(0, 1, 2, 3), false); // lado a lado
  assert.equal(arcosSeCruzam(1, 3, 0, 2), true); // o mesmo par, ao contrario
});

test('o conferidor recusa emparelhamento que se cruza', () => {
  assert.equal(sistemaValido(Int32Array.from([2, 3, 0, 1])), false); // 0-2 cruza 1-3
  assert.equal(sistemaValido(Int32Array.from([3, 2, 1, 0])), true); // aninhados
  assert.equal(sistemaValido(Int32Array.from([1, 0, 3, 2])), true); // lado a lado
});

test('o conferidor recusa parceria quebrada e ponto sem par', () => {
  assert.equal(sistemaValido(Int32Array.from([1, 2, 3, 0])), false);
  assert.equal(sistemaValido(Int32Array.from([0, 1, 3, 2])), false); // 0 parceiro de si
});

test('o arco-iris e o pente sao sistemas validos em toda ordem', () => {
  for (let n = 1; n <= 8; n++) {
    assert.equal(sistemaValido(arcoIris(n)), true, 'iris n=' + n);
    assert.equal(sistemaValido(pente(n)), true, 'pente n=' + n);
    assert.equal(sistemaValido(penteDeslocado(n)), true, 'deslocado n=' + n);
  }
});

test('as duas contagens de curva concordam em TODO par ate a ordem 7', () => {
  for (let n = 1; n <= 7; n++) {
    const sistemas = sistemasDeArcos(n);
    for (const cima of sistemas) {
      for (const baixo of sistemas) {
        assert.equal(componentes(cima, baixo), componentesPorUniao(cima, baixo), 'n=' + n);
      }
    }
  }
});

test('o numero de curvas fica entre 1 e n', () => {
  for (let n = 1; n <= 7; n++) {
    const sistemas = sistemasDeArcos(n);
    for (const cima of sistemas) {
      for (const baixo of sistemas) {
        const c = componentes(cima, baixo);
        assert.ok(c >= 1 && c <= n, 'n=' + n + ' deu ' + c);
      }
    }
  }
});

test('um sistema contra ele mesmo desenha n circulos, um por arco', () => {
  for (let n = 1; n <= 7; n++) {
    for (const par of sistemasDeArcos(n)) {
      assert.equal(componentes(par, par), n, 'n=' + n);
    }
  }
});

test('o arco-iris contra o pente da teto(n/2) curvas, e nao uma so', () => {
  // Os dois sistemas mais regulares que existem, encaixados um no outro, NAO
  // fecham numa curva so. Dao exatamente teto(n/2), e isso apesar de o arco-iris
  // ser o sistema com MAIS parceiros de todos.
  for (let n = 1; n <= 10; n++) {
    assert.equal(componentes(arcoIris(n), pente(n)), Math.ceil(n / 2), 'n=' + n);
  }
  assert.equal(ehMeandro(arcoIris(1), pente(1)), true);
  assert.equal(ehMeandro(arcoIris(2), pente(2)), true);
  assert.equal(ehMeandro(arcoIris(3), pente(3)), false);
});

test('o pente fecha com o pente deslocado, e com mais ninguem', () => {
  for (let n = 2; n <= 8; n++) {
    const sistemas = sistemasDeArcos(n);
    assert.equal(parceirosDe(pente(n), sistemas), 1, 'n=' + n);
    assert.equal(ehMeandro(pente(n), penteDeslocado(n)), true, 'n=' + n);
  }
});

test('as contagens de meandro batem com os valores conhecidos ate a ordem 8', () => {
  for (let n = 1; n <= 8; n++) {
    const sistemas = sistemasDeArcos(n);
    let meandros = 0;
    for (const cima of sistemas) {
      for (const baixo of sistemas) if (ehMeandro(cima, baixo)) meandros++;
    }
    assert.equal(meandros, CONHECIDOS[n - 1], 'n=' + n);
  }
});

test('contar meandro pelo lado de cima da o mesmo que pelo lado de baixo', () => {
  for (let n = 2; n <= 7; n++) {
    const sistemas = sistemasDeArcos(n);
    let porCima = 0;
    let porBaixo = 0;
    for (const a of sistemas) {
      porCima += parceirosDe(a, sistemas);
      for (const b of sistemas) if (componentes(b, a) === 1) porBaixo++;
    }
    assert.equal(porCima, porBaixo, 'n=' + n);
  }
});
