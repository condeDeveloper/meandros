// O medidor: roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js             todas
//   node ferramentas/medidor.js parceiros   so uma
//
// Nenhum numero do README e digitado a mao: sai daqui.

import {
  tabelaVarredura,
  tabelaHistograma,
  tabelaMaximo,
  tabelaParceiros,
  tabelaParceiroDoPente,
  tabelaDoisMetodos,
} from '../src/medidas.js';

const num = (x) => (typeof x === 'bigint' || typeof x === 'number' ? x.toLocaleString('pt-BR') : String(x));
const dec = (x, c = 4) => x.toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
const pct = (x, c = 4) => dec(x * 100, c) + '%';

function imprimir(titulo, colunas, linhas) {
  console.log('\n### ' + titulo);
  const larguras = colunas.map((c, i) => Math.max(c.length, ...linhas.map((l) => String(l[i]).length)));
  const linha = (cs) => '| ' + cs.map((c, i) => String(c).padStart(larguras[i])).join(' | ') + ' |';
  console.log(linha(colunas));
  console.log('|' + larguras.map((w) => '-'.repeat(w + 2)).join('|') + '|');
  for (const l of linhas) console.log(linha(l));
}

const tabelas = {
  varredura() {
    imprimir(
      'A varredura por ordem, contra os valores conhecidos',
      ['n', 'cruzamentos', 'sistemas', 'Catalan', 'pares', 'meandros', 'conhecido', 'bate', 'fracao'],
      tabelaVarredura(9).map((l) => [
        l.n, l.cruzamentos, num(l.sistemas), num(l.catalan), num(l.pares),
        num(l.meandros), l.conhecido === null ? '-' : num(l.conhecido),
        l.bate === null ? '-' : l.bate ? 'sim' : 'NAO', pct(l.fracao),
      ])
    );
  },

  histograma() {
    const h = tabelaHistograma(9);
    imprimir(
      'Quantas curvas cada par desenha (n = 9, ' + num(h.pares) + ' pares)',
      ['curvas', 'pares', 'fracao'],
      h.linhas.map((l) => [l.curvas, num(l.quantos), pct(l.fracao, 2)])
    );
    console.log();
    console.log('media de curvas por par: ' + dec(h.media));
    console.log('pares com o maximo de ' + h.n + ' curvas: ' + num(h.noMaximo) +
      (h.maximoEhCatalan ? ' — exatamente o numero de sistemas' : ''));
  },

  maximo() {
    imprimir(
      'A coluna do maximo de curvas, ordem a ordem',
      ['n', 'sistemas', 'pares com n curvas', 'e o numero de sistemas', 'media de curvas'],
      tabelaMaximo(9).map((l) => [
        l.n, num(l.sistemas), num(l.noMaximo), l.bate ? 'sim' : 'NAO', dec(l.media),
      ])
    );
  },

  parceiros() {
    imprimir(
      'Com quantos parceiros cada sistema de cima fecha numa curva so',
      ['n', 'sistemas', 'menor', 'maior', 'media', 'razao', 'o arco-iris', 'o pente', 'iris e o maximo', 'pente e o minimo'],
      tabelaParceiros(9).map((l) => [
        l.n, num(l.sistemas), num(l.menor), num(l.maior), dec(l.media, 2),
        dec(l.razao, 1) + 'x', num(l.doArcoIris), num(l.doPente),
        l.irisEhMaximo ? 'sim' : 'NAO', l.penteEhMinimo ? 'sim' : 'NAO',
      ])
    );
  },

  pente() {
    imprimir(
      'O unico parceiro do pente',
      ['n', 'parceiros', 'unico', 'e o pente deslocado', 'e o arco-iris'],
      tabelaParceiroDoPente(9).map((l) => [
        l.n, l.quantos, l.unico ? 'sim' : 'NAO',
        l.ehOPenteDeslocado ? 'sim' : 'nao', l.ehOArcoIris ? 'sim' : 'nao',
      ])
    );
  },

  metodos() {
    imprimir(
      'As duas contagens de curva, par a par',
      ['n', 'pares conferidos', 'divergencias'],
      tabelaDoisMetodos(7).map((l) => [l.n, num(l.pares), num(l.divergencias)])
    );
  },
};

const pedido = process.argv[2];
if (pedido && !tabelas[pedido]) {
  console.error('tabela desconhecida: ' + pedido);
  console.error('disponiveis: ' + Object.keys(tabelas).join(', '));
  process.exit(1);
}
for (const [nome, fn] of Object.entries(tabelas)) {
  if (!pedido || pedido === nome) fn();
}
console.log();
