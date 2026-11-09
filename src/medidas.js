// As tabelas do README. Todo numero daqui sai de um metodo; nenhum e digitado.

import {
  sistemasDeArcos,
  catalan,
  varrer,
  componentes,
  arcoIris,
  pente,
  parceirosDe,
  penteDeslocado,
} from './meandro.js';
import { CONHECIDOS, componentesPorUniao } from './juiz.js';

/** Tabela 1 — a varredura por ordem, contra os valores conhecidos. */
export function tabelaVarredura(ate = 9) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    linhas.push({
      n,
      cruzamentos: 2 * n,
      sistemas: r.sistemas,
      catalan: catalan(n),
      pares: r.pares,
      meandros: r.meandros,
      conhecido: CONHECIDOS[n - 1] ?? null,
      bate: CONHECIDOS[n - 1] === undefined ? null : r.meandros === CONHECIDOS[n - 1],
      fracao: r.fracao,
    });
  }
  return linhas;
}

/**
 * Tabela 2 — o histograma do numero de curvas.
 *
 * A coluna do maximo (n curvas) vale sempre o proprio numero de sistemas: n
 * curvas so acontece quando o desenho de baixo repete o de cima arco por arco,
 * e cada arco vira um circulo sozinho.
 */
export function tabelaHistograma(n = 9) {
  const r = varrer(n);
  return {
    n,
    sistemas: r.sistemas,
    pares: r.pares,
    linhas: r.histograma
      .map((quantos, curvas) => ({ curvas, quantos, fracao: quantos / r.pares }))
      .filter((l) => l.curvas > 0),
    noMaximo: r.histograma[n],
    maximoEhCatalan: r.histograma[n] === r.sistemas,
    media: r.histograma.reduce((s, q, c) => s + q * c, 0) / r.pares,
  };
}

/** Tabela 3 — a mesma coluna do maximo, ordem a ordem. */
export function tabelaMaximo(ate = 9) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    linhas.push({
      n,
      sistemas: r.sistemas,
      noMaximo: r.histograma[n],
      bate: r.histograma[n] === r.sistemas,
      media: r.histograma.reduce((s, q, c) => s + q * c, 0) / r.pares,
    });
  }
  return linhas;
}

/**
 * Tabela 4 — com quantos parceiros cada sistema de cima fecha numa curva so.
 *
 * A pergunta que o total nao responde: os meandros estao espalhados por todos
 * os sistemas de cima ou concentrados em alguns? E onde ficam os dois sistemas
 * com nome — o arco-iris, todo aninhado, e o pente, todo lado a lado?
 */
export function tabelaParceiros(ate = 9) {
  const linhas = [];
  for (let n = 2; n <= ate; n++) {
    const sistemas = sistemasDeArcos(n);
    const iris = arcoIris(n);
    const dente = pente(n);
    const chaveIris = iris.join(',');
    const chavePente = dente.join(',');

    let menor = Infinity;
    let maior = 0;
    let soma = 0;
    let doArcoIris = 0;
    let doPente = 0;
    for (const cima of sistemas) {
      const q = parceirosDe(cima, sistemas);
      soma += q;
      if (q < menor) menor = q;
      if (q > maior) maior = q;
      if (cima.join(',') === chaveIris) doArcoIris = q;
      if (cima.join(',') === chavePente) doPente = q;
    }

    linhas.push({
      n,
      sistemas: sistemas.length,
      menor,
      maior,
      media: soma / sistemas.length,
      razao: maior / menor,
      doArcoIris,
      doPente,
      irisEhMaximo: doArcoIris === maior,
      penteEhMinimo: doPente === menor,
    });
  }
  return linhas;
}

/**
 * Tabela 5 — o unico parceiro do pente.
 *
 * O pente fecha numa curva so com exatamente UM sistema de baixo, em toda
 * ordem. Qual e esse sistema?
 */
export function tabelaParceiroDoPente(ate = 9) {
  const linhas = [];
  for (let n = 2; n <= ate; n++) {
    const sistemas = sistemasDeArcos(n);
    const dente = pente(n);
    const parceiros = sistemas.filter((baixo) => componentes(dente, baixo) === 1);
    const chaveIris = arcoIris(n).join(',');
    const chaveDeslocado = penteDeslocado(n).join(',');
    linhas.push({
      n,
      quantos: parceiros.length,
      unico: parceiros.length === 1,
      ehOArcoIris: parceiros.length === 1 && parceiros[0].join(',') === chaveIris,
      ehOPenteDeslocado: parceiros.length === 1 && parceiros[0].join(',') === chaveDeslocado,
      parceiro: parceiros.length === 1 ? Array.from(parceiros[0]) : null,
    });
  }
  return linhas;
}

/** Tabela 6 — as duas contagens de curva concordam em todo par? */
export function tabelaDoisMetodos(ate = 7) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const sistemas = sistemasDeArcos(n);
    let pares = 0;
    let divergencias = 0;
    for (const cima of sistemas) {
      for (const baixo of sistemas) {
        pares++;
        if (componentes(cima, baixo) !== componentesPorUniao(cima, baixo)) divergencias++;
      }
    }
    linhas.push({ n, pares, divergencias });
  }
  return linhas;
}
