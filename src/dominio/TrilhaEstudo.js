import { exigirInstancia, exigirTexto } from "../util/validacao.js";
import { Disciplina } from "./Disciplina.js";
import { Administrador } from "./usuarios/Administrador.js";

/**
 * Missão 7 — Agregação (TrilhaEstudo ◇── Disciplina): a trilha reúne disciplinas que já existem
 * no catálogo. Se a trilha for apagada, as disciplinas continuam existindo.
 * O administrador responsável é uma associação simples.
 */
export class TrilhaEstudo {
  #titulo;
  #administrador;
  #disciplinas = [];

  constructor(titulo, administrador) {
    this.#titulo = exigirTexto(titulo, "Título");
    this.#administrador = exigirInstancia(administrador, Administrador, "Administrador");
  }

  get titulo() {
    return this.#titulo;
  }

  get administrador() {
    return this.#administrador;
  }

  get disciplinas() {
    return Object.freeze([...this.#disciplinas]);
  }

  /** Recebe a disciplina pronta, de fora. Devolve false se ela já estava na trilha. */
  adicionarDisciplina(disciplina) {
    exigirInstancia(disciplina, Disciplina, "Disciplina");
    if (this.#disciplinas.includes(disciplina)) return false;
    this.#disciplinas.push(disciplina);
    return true;
  }

  calcularCargaHorariaTotal() {
    return this.#disciplinas.reduce((total, disciplina) => total + disciplina.cargaHorariaSemanalHoras, 0);
  }
}
