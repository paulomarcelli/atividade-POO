import { exigirInteiro } from "../../util/validacao.js";
import { SessaoEstudo } from "./SessaoEstudo.js";

const XP_POR_PAGINA = 3;
const XP_DO_RESUMO = 25;

/** Não sobrescreve `gerarFeedback`: usa o comportamento padrão da classe mãe. */
export class SessaoLeitura extends SessaoEstudo {
  #paginasLidas;
  #fezResumo;

  constructor(disciplina, duracaoMinutos, paginasLidas, fezResumo) {
    super(disciplina, duracaoMinutos);
    this.#paginasLidas = exigirInteiro(paginasLidas, "Páginas lidas", { minimo: 0 });
    if (typeof fezResumo !== "boolean") throw new TypeError("fezResumo deve ser true ou false.");
    this.#fezResumo = fezResumo;
  }

  get paginasLidas() {
    return this.#paginasLidas;
  }

  get fezResumo() {
    return this.#fezResumo;
  }

  obterModalidade() {
    return "Leitura e Resumo";
  }

  calcularXp() {
    return this.duracaoMinutos + this.#paginasLidas * XP_POR_PAGINA + (this.#fezResumo ? XP_DO_RESUMO : 0);
  }

  detalhes() {
    return { paginasLidas: this.#paginasLidas, fezResumo: this.#fezResumo };
  }
}
