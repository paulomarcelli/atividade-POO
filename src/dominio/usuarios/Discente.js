import { assinarContrato, IExportavelJson } from "../../contratos/interfaces.js";
import { exigirInteiro, exigirTexto } from "../../util/validacao.js";
import { Disciplina } from "../Disciplina.js";
import { SessaoEstudo } from "../sessoes/SessaoEstudo.js";
import { SessaoLeitura } from "../sessoes/SessaoLeitura.js";
import { SessaoPomodoro } from "../sessoes/SessaoPomodoro.js";
import { Usuario } from "./Usuario.js";

const MINUTOS_POR_CICLO_POMODORO = 25;

export class Discente extends Usuario {
  #ra;
  #xpTotal = 0;
  #historico = [];

  constructor(id, nome, email, senha, ra) {
    super(id, nome, email, senha);
    this.#ra = exigirTexto(ra, "RA");
  }

  get ra() {
    return this.#ra;
  }

  get xpTotal() {
    return this.#xpTotal;
  }

  /** Cópia somente leitura: ninguém de fora altera o histórico. */
  get historico() {
    return Object.freeze([...this.#historico]);
  }

  adicionarXp(pontos) {
    this.#xpTotal += exigirInteiro(pontos, "Pontos de XP", { minimo: 1 });
  }

  /**
   * Missão 5 — Sobrecarga. JavaScript não tem overload nativo; o método confere os argumentos e
   * escolhe uma das três formas:
   *   registrarEstudo(sessao)
   *   registrarEstudo(disciplina, minutos)                               → Pomodoro padrão
   *   registrarEstudo(disciplina, horaInicio, horaFim, paginasLidas)     → Leitura com resumo
   * Devolve a sessão registrada.
   */
  registrarEstudo(...argumentos) {
    const [primeiro, ...resto] = argumentos;
    if (argumentos.length === 1 && primeiro instanceof SessaoEstudo) return this.#registrarSessao(primeiro);
    if (argumentos.length === 2 && primeiro instanceof Disciplina) return this.#registrarRapido(primeiro, ...resto);
    if (argumentos.length === 4 && primeiro instanceof Disciplina) return this.#registrarPorHorario(primeiro, ...resto);
    throw new TypeError(
      "registrarEstudo aceita (sessao), (disciplina, minutos) ou (disciplina, horaInicio, horaFim, paginasLidas).",
    );
  }

  /** Forma 1 */
  #registrarSessao(sessao) {
    this.#historico.push(sessao);
    this.adicionarXp(sessao.calcularXp());
    return sessao;
  }

  /** Forma 2 — atalho rápido */
  #registrarRapido(disciplina, minutos) {
    const ciclos = Math.max(1, Math.floor(minutos / MINUTOS_POR_CICLO_POMODORO));
    return this.#registrarSessao(new SessaoPomodoro(disciplina, minutos, ciclos));
  }

  /** Forma 3 — por horário (horas cheias, de 0 a 24) */
  #registrarPorHorario(disciplina, horaInicio, horaFim, paginasLidas) {
    exigirInteiro(horaInicio, "Hora de início", { minimo: 0, maximo: 23 });
    exigirInteiro(horaFim, "Hora de fim", { minimo: horaInicio + 1, maximo: 24 });
    const minutos = (horaFim - horaInicio) * 60;
    return this.#registrarSessao(new SessaoLeitura(disciplina, minutos, paginasLidas, true));
  }

  obterTipoPerfil() {
    return "Discente";
  }

  gerarPainelResumo() {
    const sessoes = this.#historico.length === 1 ? "1 sessão" : `${this.#historico.length} sessões`;
    return `${this.obterTipoPerfil()} ${this.nome} · RA ${this.#ra} · ${this.#xpTotal} XP · ${sessoes}`;
  }

  paraJson() {
    return JSON.stringify({
      id: this.id,
      nome: this.nome,
      email: this.email,
      ra: this.#ra,
      xpTotal: this.#xpTotal,
      totalSessoes: this.#historico.length,
    });
  }
}

assinarContrato(Discente, IExportavelJson);
