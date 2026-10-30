import { exigirInstancia, exigirTexto } from "../../util/validacao.js";
import { MetaEstudo } from "../MetaEstudo.js";
import { Discente } from "./Discente.js";
import { Usuario } from "./Usuario.js";

/**
 * Missão 7 — Associação (Responsavel ——> Discente): o responsável acompanha discentes que já
 * existem no sistema e guarda a meta definida para cada um. Ele não cria nem apaga discentes.
 */
export class Responsavel extends Usuario {
  #parentesco;
  #discentes = [];
  #metas = new Map(); // Discente → MetaEstudo

  constructor(id, nome, email, senha, parentesco) {
    super(id, nome, email, senha);
    this.#parentesco = exigirTexto(parentesco, "Parentesco");
  }

  get parentesco() {
    return this.#parentesco;
  }

  get discentes() {
    return Object.freeze([...this.#discentes]);
  }

  /** Devolve false se o discente já estava vinculado. */
  vincularDiscente(discente) {
    exigirInstancia(discente, Discente, "Discente");
    if (this.#discentes.includes(discente)) return false;
    this.#discentes.push(discente);
    return true;
  }

  definirMeta(discente, meta) {
    exigirInstancia(meta, MetaEstudo, "Meta");
    if (!this.#discentes.includes(discente)) {
      throw new Error("Vincule o discente antes de definir a meta dele.");
    }
    this.#metas.set(discente, meta);
  }

  obterMeta(discente) {
    return this.#metas.get(discente) ?? null;
  }

  obterTipoPerfil() {
    return "Responsável";
  }

  gerarPainelResumo() {
    const nomes = this.#discentes.map((discente) => discente.nome).join(", ") || "nenhum discente";
    return `${this.obterTipoPerfil()} ${this.nome} (${this.#parentesco}) · acompanha: ${nomes}`;
  }
}
