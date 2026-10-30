import { exigirInteiro, exigirTexto } from "../util/validacao.js";

const CARGA_PADRAO_HORAS = 2;

/** Missão 1 — Abstração: uma matéria do catálogo, com código, área e carga horária semanal. */
export class Disciplina {
  #codigo;
  #nome;
  #categoria;
  #cargaHorariaSemanalHoras;

  constructor(codigo, nome, categoria, cargaHorariaSemanalHoras) {
    this.#codigo = exigirTexto(codigo, "Código");
    this.#nome = exigirTexto(nome, "Nome");
    this.#categoria = exigirTexto(categoria, "Categoria");
    const carga = exigirInteiro(cargaHorariaSemanalHoras, "Carga horária semanal");
    this.#cargaHorariaSemanalHoras = carga > 0 ? carga : CARGA_PADRAO_HORAS;
  }

  get codigo() {
    return this.#codigo;
  }

  get nome() {
    return this.#nome;
  }

  get categoria() {
    return this.#categoria;
  }

  get cargaHorariaSemanalHoras() {
    return this.#cargaHorariaSemanalHoras;
  }

  calcularCargaEmMinutos() {
    return this.#cargaHorariaSemanalHoras * 60;
  }

  exibirResumo() {
    return (
      `[${this.#codigo}] ${this.#nome} (${this.#categoria}) — ` +
      `${this.#cargaHorariaSemanalHoras}h/semana (${this.calcularCargaEmMinutos()} min)`
    );
  }
}
