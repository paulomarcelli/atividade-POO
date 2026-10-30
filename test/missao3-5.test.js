import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { Disciplina } from "../src/dominio/Disciplina.js";
import { SessaoEstudo } from "../src/dominio/sessoes/SessaoEstudo.js";
import { SessaoExercicios } from "../src/dominio/sessoes/SessaoExercicios.js";
import { SessaoLeitura } from "../src/dominio/sessoes/SessaoLeitura.js";
import { SessaoPomodoro } from "../src/dominio/sessoes/SessaoPomodoro.js";
import { Administrador } from "../src/dominio/usuarios/Administrador.js";
import { Discente } from "../src/dominio/usuarios/Discente.js";
import { Responsavel } from "../src/dominio/usuarios/Responsavel.js";
import { Usuario } from "../src/dominio/usuarios/Usuario.js";

const poo = new Disciplina("ADS201", "POO", "Computação", 4);
const novoDiscente = () => new Discente(3, "Ana", "ana@aluno.edu.br", "segredo", "2026101234");

describe("Missão 3 · Usuario abstrato e perfis", () => {
  it("não deixa instanciar Usuario", () => {
    assert.throws(() => new Usuario(1, "X", "x@y.com", "s"), /abstrata/);
  });

  it("autentica sem expor a senha", () => {
    const ana = novoDiscente();
    assert.equal(ana.autenticar("segredo"), true);
    assert.equal(ana.autenticar("errada"), false);
    assert.equal(ana.senha, undefined);
    assert.equal(JSON.stringify(ana).includes("segredo"), false);
    assert.equal(ana.paraJson().includes("segredo"), false);
  });

  it("cada perfil sobrescreve os métodos abstratos", () => {
    const admin = new Administrador(1, "Carla", "carla@fac.edu", "s", "Coordenação PI");
    const resp = new Responsavel(2, "Marcos", "marcos@email.com", "s", "Pai");
    const ana = novoDiscente();
    assert.deepEqual(
      [admin, resp, ana].map((u) => u.obterTipoPerfil()),
      ["Administrador", "Responsável", "Discente"],
    );
    assert.match(admin.gerarPainelResumo(), /Coordenação PI/);
    assert.match(resp.gerarPainelResumo(), /Pai/);
    assert.match(ana.gerarPainelResumo(), /RA 2026101234 · 0 XP/);
  });

  it("adicionarXp recusa pontos não positivos", () => {
    const ana = novoDiscente();
    ana.adicionarXp(10);
    assert.equal(ana.xpTotal, 10);
    assert.throws(() => ana.adicionarXp(0), RangeError);
  });
});

describe("Missão 4 · Sessões polimórficas", () => {
  it("não deixa instanciar SessaoEstudo", () => {
    assert.throws(() => new SessaoEstudo(poo, 30), /abstrata/);
  });

  it("calcula o XP de cada modalidade pela sua fórmula", () => {
    assert.equal(new SessaoPomodoro(poo, 50, 2).calcularXp(), 50 * 2 + 2 * 15);
    assert.equal(new SessaoExercicios(poo, 40, 10, 8).calcularXp(), 40 + 8 * 10);
    assert.equal(new SessaoLeitura(poo, 30, 12, true).calcularXp(), 30 + 12 * 3 + 25);
    assert.equal(new SessaoLeitura(poo, 30, 12, false).calcularXp(), 30 + 12 * 3);
  });

  it("gera feedback com o detalhe de cada modalidade", () => {
    assert.equal(new SessaoPomodoro(poo, 50, 2).gerarFeedback(), "Pomodoro em POO (50 min) -> +130 XP · 2 ciclos concluídos");
    assert.match(new SessaoExercicios(poo, 40, 10, 8).gerarFeedback(), /80% de acerto \(8\/10\)$/);
    assert.equal(new SessaoLeitura(poo, 30, 12, true).gerarFeedback(), "Leitura e Resumo em POO (30 min) -> +91 XP");
  });

  it("um único laço percorre a lista polimórfica", () => {
    const sessoes = [new SessaoPomodoro(poo, 50, 2), new SessaoExercicios(poo, 40, 10, 8), new SessaoLeitura(poo, 30, 12, true)];
    let total = 0;
    for (const sessao of sessoes) total += sessao.calcularXp();
    assert.equal(total, 130 + 120 + 91);
  });

  it("recusa acertos acima do total de questões", () => {
    assert.throws(() => new SessaoExercicios(poo, 40, 10, 11), RangeError);
  });
});

describe("Missão 5 · registrarEstudo sobrecarregado", () => {
  let ana;
  beforeEach(() => {
    ana = novoDiscente();
  });

  it("forma 1: recebe a sessão pronta", () => {
    const sessao = new SessaoExercicios(poo, 40, 10, 8);
    ana.registrarEstudo(sessao);
    assert.deepEqual(ana.historico, [sessao]);
    assert.equal(ana.xpTotal, 120);
  });

  it("forma 2: cria um Pomodoro com ciclos = minutos / 25 (mínimo 1)", () => {
    const longa = ana.registrarEstudo(poo, 60);
    const curta = ana.registrarEstudo(poo, 10);
    assert.ok(longa instanceof SessaoPomodoro);
    assert.equal(longa.ciclosCompletos, 2);
    assert.equal(curta.ciclosCompletos, 1);
  });

  it("forma 3: cria uma Leitura com resumo pelo intervalo de horas", () => {
    const sessao = ana.registrarEstudo(poo, 19, 21, 20);
    assert.ok(sessao instanceof SessaoLeitura);
    assert.equal(sessao.duracaoMinutos, 120);
    assert.equal(sessao.fezResumo, true);
    assert.equal(ana.xpTotal, 120 + 20 * 3 + 25);
  });

  it("recusa chamadas que não batem com nenhuma forma", () => {
    assert.throws(() => ana.registrarEstudo("POO", 30), TypeError);
    assert.throws(() => ana.registrarEstudo(poo, 21, 19, 5), RangeError);
  });

  it("o histórico devolvido não altera o interno", () => {
    ana.registrarEstudo(poo, 30);
    assert.throws(() => ana.historico.push(null), TypeError);
    assert.equal(ana.historico.length, 1);
  });
});
