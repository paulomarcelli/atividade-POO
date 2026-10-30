import { exigirInstancia, exigirInteiro, exigirTexto } from "../util/validacao.js";
import { Discente } from "./usuarios/Discente.js";

const DIAS_DA_SEMANA = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

/**
 * Missão 8 — Composição (PlanoEstudo ◆── ItemCronograma).
 * ItemCronograma não é exportado: só o PlanoEstudo consegue criá-lo, e ele não existe fora do plano.
 */
class ItemCronograma {
  #diaSemana;
  #minutosPlanejados;

  constructor(diaSemana, minutosPlanejados) {
    const dia = exigirTexto(diaSemana, "Dia da semana").toLowerCase();
    if (!DIAS_DA_SEMANA.includes(dia)) {
      throw new RangeError(`Dia da semana inválido: ${diaSemana}. Use: ${DIAS_DA_SEMANA.join(", ")}.`);
    }
    this.#diaSemana = dia;
    this.#minutosPlanejados = exigirInteiro(minutosPlanejados, "Minutos planejados", { minimo: 1 });
  }

  get diaSemana() {
    return this.#diaSemana;
  }

  get minutosPlanejados() {
    return this.#minutosPlanejados;
  }
}

export class PlanoEstudo {
  #discente;
  #itens = [];

  constructor(discente) {
    this.#discente = exigirInstancia(discente, Discente, "Discente");
  }

  get discente() {
    return this.#discente;
  }

  /** Recebe só dados primitivos; o item é criado aqui dentro. */
  adicionarItem(diaSemana, minutos) {
    this.#itens.push(new ItemCronograma(diaSemana, minutos));
  }

  calcularTotalMinutos() {
    return this.#itens.reduce((total, item) => total + item.minutosPlanejados, 0);
  }

  /** Devolve cópias em texto puro, nunca a lista nem os itens internos. */
  listarItens() {
    return this.#itens.map(({ diaSemana, minutosPlanejados }) => Object.freeze({ diaSemana, minutosPlanejados }));
  }
}
