import { exigirInteiro } from "../../util/validacao.js";
import { SessaoEstudo } from "./SessaoEstudo.js";

const XP_POR_ACERTO = 10;

export class SessaoExercicios extends SessaoEstudo {
  #totalQuestoes;
  #acertos;

  constructor(disciplina, duracaoMinutos, totalQuestoes, acertos) {
    super(disciplina, duracaoMinutos);
    this.#totalQuestoes = exigirInteiro(totalQuestoes, "Total de questões", { minimo: 1 });
    this.#acertos = exigirInteiro(acertos, "Acertos", { minimo: 0, maximo: this.#totalQuestoes });
  }

  get totalQuestoes() {
    return this.#totalQuestoes;
  }

  get acertos() {
    return this.#acertos;
  }

  calcularPercentualDeAcerto() {
    return (this.#acertos / this.#totalQuestoes) * 100;
  }

  obterModalidade() {
    return "Lista de Exercícios";
  }

  calcularXp() {
    return this.duracaoMinutos + this.#acertos * XP_POR_ACERTO;
  }

  gerarFeedback() {
    const percentual = Math.round(this.calcularPercentualDeAcerto());
    return `${super.gerarFeedback()} · ${percentual}% de acerto (${this.#acertos}/${this.#totalQuestoes})`;
  }

  detalhes() {
    return { totalQuestoes: this.#totalQuestoes, acertos: this.#acertos };
  }
}
