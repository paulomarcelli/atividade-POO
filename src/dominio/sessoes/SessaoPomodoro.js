import { exigirInteiro } from "../../util/validacao.js";
import { SessaoEstudo } from "./SessaoEstudo.js";

const XP_POR_MINUTO = 2;
const XP_POR_CICLO = 15;

export class SessaoPomodoro extends SessaoEstudo {
  #ciclosCompletos;

  constructor(disciplina, duracaoMinutos, ciclosCompletos) {
    super(disciplina, duracaoMinutos);
    this.#ciclosCompletos = exigirInteiro(ciclosCompletos, "Ciclos completos", { minimo: 0 });
  }

  get ciclosCompletos() {
    return this.#ciclosCompletos;
  }

  obterModalidade() {
    return "Pomodoro";
  }

  calcularXp() {
    return this.duracaoMinutos * XP_POR_MINUTO + this.#ciclosCompletos * XP_POR_CICLO;
  }

  gerarFeedback() {
    const ciclos = this.#ciclosCompletos === 1 ? "1 ciclo concluído" : `${this.#ciclosCompletos} ciclos concluídos`;
    return `${super.gerarFeedback()} · ${ciclos}`;
  }

  detalhes() {
    return { ciclosCompletos: this.#ciclosCompletos };
  }
}
