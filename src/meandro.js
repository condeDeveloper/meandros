// Meandros.
//
// Desenhe 2n pontos numa reta. Ligue-os dois a dois por arcos ACIMA da reta,
// sem que dois arcos se cruzem; ligue-os de novo, dois a dois, por arcos ABAIXO
// da reta, tambem sem cruzamento. O desenho que sai e sempre uma colecao de
// curvas fechadas. Quando e UMA curva so, o desenho se chama meandro.
//
// A pergunta e quantos meandros existem com 2n cruzamentos. Nao ha formula
// conhecida — a sequencia 1, 1, 2, 8, 42, 262, 1828, 13820, 110954 sai de
// varredura, e e isso que este repositorio refaz.
//
// O interessante e o DENOMINADOR. Sistemas de arcos de um lado so existem aos
// montes (sao os numeros de Catalan), e todo par deles desenha alguma coisa. O
// que a varredura mede e com que frequencia essa coisa e uma curva so.

/**
 * Todos os sistemas de arcos de n arcos sobre 2n pontos, sem cruzamento.
 *
 * Cada sistema vem como um Int32Array de parceiros: `par[i]` e o ponto do outro
 * lado do arco que sai de i.
 *
 * A recursao e a propria razao de os numeros de Catalan aparecerem: o arco que
 * sai do primeiro ponto livre fecha em algum ponto de posicao impar dentro da
 * lista, e separa o que sobrou em DENTRO dele e FORA dele, dois problemas
 * independentes do mesmo tipo.
 */
export function sistemasDeArcos(n) {
  const saida = [];
  const par = new Int32Array(2 * n);

  // As listas pendentes sao mantidas SEPARADAS de proposito. Juntar o que ficou
  // dentro do arco a-b com o que ficou fora numa lista so parece inofensivo e
  // libera exatamente os arcos que cruzam a-b: a primeira versao disto contou
  // 24 sistemas onde existem 14, porque contou TODOS os emparelhamentos.
  function monta(listas) {
    if (listas.length === 0) {
      saida.push(par.slice());
      return;
    }
    const pontos = listas[0];
    const resto = listas.slice(1);
    if (pontos.length === 0) {
      monta(resto);
      return;
    }
    const a = pontos[0];
    for (let k = 1; k < pontos.length; k += 2) {
      const b = pontos[k];
      par[a] = b;
      par[b] = a;
      monta([pontos.slice(1, k), pontos.slice(k + 1), ...resto]);
    }
  }

  const pontos = [];
  for (let i = 0; i < 2 * n; i++) pontos.push(i);
  monta([pontos]);
  return saida;
}

/** O n-esimo numero de Catalan, pela recorrencia. E o juiz da contagem acima. */
export function catalan(n) {
  const c = [1n];
  for (let i = 1; i <= n; i++) {
    let s = 0n;
    for (let j = 0; j < i; j++) s += c[j] * c[i - 1 - j];
    c.push(s);
  }
  return c[n];
}

/**
 * Quantas curvas fechadas o par de sistemas desenha.
 *
 * Caminha: de um ponto, segue o arco de cima ate o parceiro; de la, segue o de
 * baixo; e assim por diante, alternando, ate voltar ao ponto de partida pronto
 * para subir de novo. Cada volta dessas e uma curva.
 */
export function componentes(cima, baixo) {
  const total = cima.length;
  const visto = new Uint8Array(total);
  let curvas = 0;

  for (let inicio = 0; inicio < total; inicio++) {
    if (visto[inicio]) continue;
    curvas++;
    let atual = inicio;
    let subindo = true;
    for (;;) {
      visto[atual] = 1;
      atual = subindo ? cima[atual] : baixo[atual];
      subindo = !subindo;
      if (atual === inicio && subindo) break;
    }
  }
  return curvas;
}

/** O par desenha uma curva so? E a definicao de meandro. */
export function ehMeandro(cima, baixo) {
  return componentes(cima, baixo) === 1;
}

/**
 * A varredura: todos os pares de sistemas de arcos de ordem n.
 *
 * Devolve o total de pares, quantos deles sao meandro, e o histograma do numero
 * de curvas.
 */
export function varrer(n) {
  const sistemas = sistemasDeArcos(n);
  const histograma = new Float64Array(n + 1);
  let meandros = 0;
  let pares = 0;

  for (const cima of sistemas) {
    for (const baixo of sistemas) {
      const curvas = componentes(cima, baixo);
      histograma[curvas]++;
      pares++;
      if (curvas === 1) meandros++;
    }
  }

  return {
    n,
    sistemas: sistemas.length,
    pares,
    meandros,
    fracao: meandros / pares,
    histograma: Array.from(histograma),
  };
}

/**
 * O arco-iris: todos os arcos aninhados, um dentro do outro.
 * 0 fecha com 2n-1, 1 com 2n-2, e assim por diante.
 */
export function arcoIris(n) {
  const par = new Int32Array(2 * n);
  for (let i = 0; i < n; i++) {
    par[i] = 2 * n - 1 - i;
    par[2 * n - 1 - i] = i;
  }
  return par;
}

/** O pente: todos os arcos lado a lado, 0 com 1, 2 com 3, e assim por diante. */
export function pente(n) {
  const par = new Int32Array(2 * n);
  for (let i = 0; i < n; i++) {
    par[2 * i] = 2 * i + 1;
    par[2 * i + 1] = 2 * i;
  }
  return par;
}

/**
 * Para um sistema de cima FIXO, com quantos sistemas de baixo ele fecha numa
 * curva so.
 *
 * E a pergunta que o total nao responde: os meandros estao espalhados por todos
 * os sistemas de cima, ou concentrados em alguns?
 */
export function parceirosDe(cima, sistemas) {
  let quantos = 0;
  for (const baixo of sistemas) if (componentes(cima, baixo) === 1) quantos++;
  return quantos;
}

/**
 * O pente deslocado: um arco cobrindo tudo, de 0 a 2n-1, e dentro dele o pente
 * andado de uma casa (1 com 2, 3 com 4, e assim por diante).
 *
 * Ele nao foi escolhido: apareceu. E o UNICO sistema de baixo que fecha o pente
 * numa curva so, em toda ordem varrida.
 */
export function penteDeslocado(n) {
  const par = new Int32Array(2 * n);
  par[0] = 2 * n - 1;
  par[2 * n - 1] = 0;
  for (let i = 1; i < 2 * n - 2; i += 2) {
    par[i] = i + 1;
    par[i + 1] = i;
  }
  return par;
}
