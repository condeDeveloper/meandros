// O juiz. Tres conferencias que nao compartilham codigo com a varredura:
//
//   1. os numeros de Catalan, que dizem quantos sistemas de arcos existem de um
//      lado so — e foram eles que pegaram o primeiro gerador deste repositorio,
//      que achava 24 sistemas onde existem 14;
//   2. um conferidor de cruzamento, que olha par a par se dois arcos se cruzam,
//      sem saber como o sistema foi gerado;
//   3. uma segunda contagem de curvas, por uniao de conjuntos em vez de
//      caminhada — ela nao anda pelo desenho, so junta o que esta ligado.

/** Os valores conhecidos de meandros fechados, de n = 1 a 10 (OEIS A005315). */
export const CONHECIDOS = [1, 2, 8, 42, 262, 1828, 13820, 110954, 933458, 8152860];

/** Os numeros de Catalan, de C(0) a C(ate), pela recorrencia. */
export function catalanAte(ate) {
  const c = [1n];
  for (let i = 1; i <= ate; i++) {
    let s = 0n;
    for (let j = 0; j < i; j++) s += c[j] * c[i - 1 - j];
    c.push(s);
  }
  return c;
}

/** Dois arcos se cruzam quando uma ponta de um fica entre as duas do outro. */
export function arcosSeCruzam(a1, a2, b1, b2) {
  const [a, b] = a1 < a2 ? [a1, a2] : [a2, a1];
  const [c, d] = b1 < b2 ? [b1, b2] : [b2, b1];
  return (a < c && c < b && b < d) || (c < a && a < d && d < b);
}

/**
 * O sistema e um emparelhamento sem cruzamento?
 *
 * Confere tudo do zero: que todo ponto tem parceiro, que a relacao e simetrica,
 * que ninguem e parceiro de si mesmo, e que nenhum par de arcos se cruza.
 */
export function sistemaValido(par) {
  const total = par.length;
  if (total % 2 !== 0) return false;
  for (let i = 0; i < total; i++) {
    const j = par[i];
    if (!Number.isInteger(j) || j < 0 || j >= total) return false;
    if (j === i) return false;
    if (par[j] !== i) return false;
  }
  const arcos = [];
  for (let i = 0; i < total; i++) if (par[i] > i) arcos.push([i, par[i]]);
  if (arcos.length !== total / 2) return false;
  for (let i = 0; i < arcos.length; i++) {
    for (let j = i + 1; j < arcos.length; j++) {
      if (arcosSeCruzam(arcos[i][0], arcos[i][1], arcos[j][0], arcos[j][1])) return false;
    }
  }
  return true;
}

/**
 * A segunda contagem de curvas: uniao de conjuntos.
 *
 * Nao caminha pelo desenho. Junta i com o parceiro de cima e com o parceiro de
 * baixo, e no fim conta quantos grupos sobraram. Se discordar da caminhada, uma
 * das duas esta errada — e e por isso que existem as duas.
 */
export function componentesPorUniao(cima, baixo) {
  const total = cima.length;
  const pai = new Int32Array(total);
  for (let i = 0; i < total; i++) pai[i] = i;

  const raiz = (x) => {
    while (pai[x] !== x) {
      pai[x] = pai[pai[x]];
      x = pai[x];
    }
    return x;
  };
  const juntar = (a, b) => {
    const ra = raiz(a);
    const rb = raiz(b);
    if (ra !== rb) pai[ra] = rb;
  };

  for (let i = 0; i < total; i++) {
    juntar(i, cima[i]);
    juntar(i, baixo[i]);
  }

  const grupos = new Set();
  for (let i = 0; i < total; i++) grupos.add(raiz(i));
  return grupos.size;
}
