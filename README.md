# Meandros

Todos os pares de sistemas de arcos até a ordem **10** varridos um a um —
**282.105.616** pares — para contar quantos deles desenham uma curva fechada só.
Node puro, sem dependência nenhuma.

Desenhe `2n` pontos numa reta. Ligue-os dois a dois por arcos **acima** da reta,
sem que dois se cruzem; ligue-os de novo, dois a dois, por arcos **abaixo**. O
que sai é sempre uma coleção de curvas fechadas. Quando é **uma curva só**, o
desenho se chama meandro.

Quantos meandros existem com `2n` cruzamentos? Não há fórmula conhecida. A
sequência `1, 2, 8, 42, 262, 1828, 13820, 110954, 933458, 8152860` sai de
varredura, e é isso que este repositório refaz.

O interessante, porém, é o **denominador**. Sistemas de arcos de um lado só
existem aos montes — são os números de Catalan — e todo par deles desenha alguma
coisa. O que a varredura mede é com que frequência essa coisa é uma curva só.

## Os quatro achados

1. **O pente fecha com exatamente um parceiro, em toda ordem.** O pente é o
   sistema mais regular que existe: todos os arcos lado a lado. Dos 4.862
   sistemas da ordem 9, **um** fecha com ele numa curva só — e esse um é o
   próprio pente andado de uma casa, abraçado por um arco que cobre tudo. No
   outro extremo, o arco-íris é sempre o máximo: **504 parceiros contra 1**.
2. **Os dois sistemas mais regulares que existem não se encaixam.** Arco-íris
   contra pente dá exatamente `⌈n/2⌉` curvas, e não uma — apesar de o arco-íris
   ser o campeão de parceiros de toda ordem. Regularidade de um lado não casa
   com regularidade do outro.
3. **O pico do histograma não está em 1 curva, e nem perto.** Na ordem 9 o pico
   está em **3 curvas** (27,67% dos pares); meandros de verdade são 3,95%. Na
   ordem 10 o pico já está em 4, e os meandros caem para **2,89%**.
4. **Os pares que desenham o máximo de `n` curvas são exatamente `C(n)`** — o
   próprio número de sistemas. Não é aproximação: `n` curvas só acontece quando
   o desenho de baixo repete o de cima arco por arco, e cada arco vira um
   círculo sozinho. A diagonal, e nada além dela.

## Três maneiras de ter certeza

- **Catalan.** O número de sistemas de arcos de um lado só tem fórmula, e ela
  não sabe nada sobre este código. Foi ela que pegou o primeiro gerador daqui,
  que achava 24 sistemas onde existem 14.
- **O conferidor de cruzamento** (`sistemaValido`): olha par a par se dois arcos
  se cruzam, sem saber como o sistema foi gerado. Todo sistema gerado passa.
- **Duas contagens de curva.** Uma **caminha** pelo desenho, alternando arco de
  cima e arco de baixo até voltar ao ponto de partida. A outra **junta
  conjuntos**, sem andar por lugar nenhum. As duas são comparadas par a par em
  203.455 pares, e não divergem em nenhum.

## As medidas

Tudo abaixo sai de `node ferramentas/medidor.js`. Nenhum número foi digitado à
mão.

### A varredura por ordem, contra os valores conhecidos

| n | cruzamentos | sistemas | Catalan | pares | meandros | conhecido | bate | fração |
|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 1 | 1 | 1 | 1 | 1 | sim | 100,0000% |
| 2 | 4 | 2 | 2 | 4 | 2 | 2 | sim | 50,0000% |
| 3 | 6 | 5 | 5 | 25 | 8 | 8 | sim | 32,0000% |
| 4 | 8 | 14 | 14 | 196 | 42 | 42 | sim | 21,4286% |
| 5 | 10 | 42 | 42 | 1.764 | 262 | 262 | sim | 14,8526% |
| 6 | 12 | 132 | 132 | 17.424 | 1.828 | 1.828 | sim | 10,4913% |
| 7 | 14 | 429 | 429 | 184.041 | 13.820 | 13.820 | sim | 7,5092% |
| 8 | 16 | 1.430 | 1.430 | 2.044.900 | 110.954 | 110.954 | sim | 5,4259% |
| 9 | 18 | 4.862 | 4.862 | 23.639.044 | 933.458 | 933.458 | sim | 3,9488% |
| 10 | 20 | 16.796 | 16.796 | 282.105.616 | 8.152.860 | 8.152.860 | sim | 2,8900% |

A ordem 10 está num teste pesado e leva meio minuto. A ordem 11 tem 58.786
sistemas e 3,45 bilhões de pares, e ficou de fora.

### Quantas curvas cada par desenha (ordem 9)

| curvas | pares | fração |
|---|---|---|
| 1 | 933.458 | 3,95% |
| 2 | 3.772.008 | 15,96% |
| **3** | **6.540.510** | **27,67%** |
| 4 | 6.413.784 | 27,13% |
| 5 | 3.935.238 | 16,65% |
| 6 | 1.569.984 | 6,64% |
| 7 | 405.552 | 1,72% |
| 8 | 63.648 | 0,27% |
| 9 | 4.862 | 0,02% |

Média de 3,6483 curvas por par. E a última linha — 4.862 — é o próprio número de
sistemas.

### A coluna do máximo, ordem a ordem

| n | sistemas | pares com n curvas | é o número de sistemas | média de curvas |
|---|---|---|---|---|
| 1 | 1 | 1 | sim | 1,0000 |
| 2 | 2 | 2 | sim | 1,5000 |
| 3 | 5 | 5 | sim | 1,8800 |
| 4 | 14 | 14 | sim | 2,2143 |
| 5 | 42 | 42 | sim | 2,5238 |
| 6 | 132 | 132 | sim | 2,8180 |
| 7 | 429 | 429 | sim | 3,1017 |
| 8 | 1.430 | 1.430 | sim | 3,3778 |
| 9 | 4.862 | 4.862 | sim | 3,6483 |

### Com quantos parceiros cada sistema de cima fecha numa curva só

| n | sistemas | menor | maior | média | razão | o arco-íris | o pente |
|---|---|---|---|---|---|---|---|
| 2 | 2 | 1 | 1 | 1,00 | 1,0x | 1 | 1 |
| 3 | 5 | 1 | 2 | 1,60 | 2,0x | 2 | 1 |
| 4 | 14 | 1 | 4 | 3,00 | 4,0x | 4 | 1 |
| 5 | 42 | 1 | 10 | 6,24 | 10,0x | 10 | 1 |
| 6 | 132 | 1 | 24 | 13,85 | 24,0x | 24 | 1 |
| 7 | 429 | 1 | 66 | 32,21 | 66,0x | 66 | 1 |
| 8 | 1.430 | 1 | 174 | 77,59 | 174,0x | 174 | 1 |
| 9 | 4.862 | 1 | 504 | 191,99 | 504,0x | 504 | 1 |

O arco-íris é o máximo em **todas** as ordens, e o pente é o mínimo em todas. O
mínimo é sempre 1: nenhum sistema de cima fica sem parceiro, e nenhum fica com
dois quando é o pente.

### O único parceiro do pente

| n | parceiros | único | é o pente deslocado | é o arco-íris |
|---|---|---|---|---|
| 2 | 1 | sim | sim | sim |
| 3 | 1 | sim | sim | não |
| 4 | 1 | sim | sim | não |
| 5 | 1 | sim | sim | não |
| 6 | 1 | sim | sim | não |
| 7 | 1 | sim | sim | não |
| 8 | 1 | sim | sim | não |
| 9 | 1 | sim | sim | não |

Na ordem 2 o pente deslocado e o arco-íris são o mesmo desenho, e é por isso que
aquela linha tem dois "sim".

### As duas contagens de curva, par a par

| n | pares conferidos | divergências |
|---|---|---|
| 5 | 1.764 | 0 |
| 6 | 17.424 | 0 |
| 7 | 184.041 | 0 |

## O que as medidas me corrigiram

- **O gerador achava 24 sistemas de arcos onde existem 14.** Eu juntei "o que
  ficou dentro do arco" e "o que ficou fora" numa lista só, e isso libera
  exatamente os arcos que cruzam aquele arco. Pior: eu tinha escrito, no código,
  um comentário *justificando* que juntar era seguro. Catalan pegou na primeira
  ordem em que os dois números divergem — 6 contra 5, na ordem 3 — e a correção
  foi manter as duas listas separadas até o fim.
- **Apostei que o arco-íris contra o pente daria uma curva só.** São os dois
  desenhos mais regulares que existem, e um parece feito para o outro. Dá
  `⌈n/2⌉` curvas, e a partir da ordem 3 nunca mais dá uma.
- **Escrevi 203.431 de cabeça** para a soma dos pares conferidos pelas duas
  contagens, somando as linhas no olho. O certo é **203.455**.
- **Montei a lista de valores conhecidos com um 1 a mais na frente** e passei a
  achar que a varredura divergia em todas as ordens de uma vez. Os números
  estavam certos desde o começo; o gabarito é que estava deslocado. Divergência
  em *todas* as linhas é sinal de gabarito torto, não de código torto.

## Rodar

```bash
node --test testes/*.test.js             # os 28 testes (o pesado leva ~30 s)
node ferramentas/medidor.js              # todas as tabelas
node ferramentas/medidor.js parceiros    # uma tabela só
```

São **28 testes**: 15 de comportamento, 10 prendendo os números das tabelas e 3
na varredura da ordem 10. Sem `npm install`: não há dependência nenhuma. Node 20
ou mais novo.

## Licença

MIT.
