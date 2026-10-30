import { assinarContrato, IExportavelJson } from "../contratos/interfaces.js";
import { exigirInteiro } from "../util/validacao.js";

const META_MINIMA = 30;
const META_MAXIMA = 3000;
const SESSAO_MAXIMA = 480; // 8 h seguidas: acima disso, é erro de digitação

/**
 * Missão 2 — Encapsulamento: a meta e os minutos cumpridos são privados. Os minutos só crescem
 * por `registrarAvanco`, que valida cada sessão; não existe setter para `minutosCumpridos`.
 */
export class MetaEstudo {
  #metaMinutosSemana = META_MINIMA;
  #minutosCumpridos = 0;

  constructor(metaMinutosSemana) {
    this.redefinirMeta(metaMinutosSemana);
  }

  get metaMinutosSemana() {
    return this.#metaMinutosSemana;
  }

  get minutosCumpridos() {
    return this.#minutosCumpridos;
  }

  /** Usado pelo Responsável. Valores fora da faixa são ajustados para o limite mais próximo. */
  redefinirMeta(novaMeta) {
    exigirInteiro(novaMeta, "Meta semanal (min)");
    this.#metaMinutosSemana = Math.min(META_MAXIMA, Math.max(META_MINIMA, novaMeta));
  }

  registrarAvanco(minutos) {
    const valido = Number.isInteger(minutos) && minutos > 0 && minutos <= SESSAO_MAXIMA;
    if (valido) this.#minutosCumpridos += minutos;
    return valido;
  }

  /** De 0 a 100. Estudar além da meta não passa de 100. */
  calcularPercentual() {
    return Math.min(100, (this.#minutosCumpridos / this.#metaMinutosSemana) * 100);
  }

  estaCumprida() {
    return this.#minutosCumpridos >= this.#metaMinutosSemana;
  }

  paraJson() {
    return JSON.stringify({
      metaMinutosSemana: this.#metaMinutosSemana,
      minutosCumpridos: this.#minutosCumpridos,
      percentual: Number(this.calcularPercentual().toFixed(1)),
      cumprida: this.estaCumprida(),
    });
  }
}

assinarContrato(MetaEstudo, IExportavelJson);
