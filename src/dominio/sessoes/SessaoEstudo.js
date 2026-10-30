import { assinarContrato, IExportavelJson } from "../../contratos/interfaces.js";
import {
  erroMetodoAbstrato,
  exigirInstancia,
  exigirInteiro,
  impedirInstanciaDireta,
} from "../../util/validacao.js";
import { Disciplina } from "../Disciplina.js";

/**
 * Missão 4 — Classe abstrata da sessão de estudo. Cada modalidade sabe calcular o próprio XP e
 * montar o próprio feedback (polimorfismo dinâmico): quem usa a sessão não precisa de `if`.
 */
export class SessaoEstudo {
  #disciplina;
  #duracaoMinutos;

  constructor(disciplina, duracaoMinutos) {
    impedirInstanciaDireta(new.target, SessaoEstudo);
    this.#disciplina = exigirInstancia(disciplina, Disciplina, "Disciplina");
    this.#duracaoMinutos = exigirInteiro(duracaoMinutos, "Duração (min)", { minimo: 1 });
  }

  get disciplina() {
    return this.#disciplina;
  }

  get duracaoMinutos() {
    return this.#duracaoMinutos;
  }

  /** @abstract */
  obterModalidade() {
    throw erroMetodoAbstrato(this, "obterModalidade");
  }

  /** @abstract */
  calcularXp() {
    throw erroMetodoAbstrato(this, "calcularXp");
  }

  /** Comportamento padrão ("virtual"): as subclasses podem acrescentar detalhes. */
  gerarFeedback() {
    return (
      `${this.obterModalidade()} em ${this.#disciplina.nome} ` +
      `(${this.#duracaoMinutos} min) -> +${this.calcularXp()} XP`
    );
  }

  /** Dados próprios da modalidade, incluídos no JSON. As subclasses sobrescrevem. */
  detalhes() {
    return {};
  }

  paraJson() {
    return JSON.stringify({
      modalidade: this.obterModalidade(),
      disciplina: { codigo: this.#disciplina.codigo, nome: this.#disciplina.nome },
      duracaoMinutos: this.#duracaoMinutos,
      xp: this.calcularXp(),
      ...this.detalhes(),
    });
  }
}

assinarContrato(SessaoEstudo, IExportavelJson);
